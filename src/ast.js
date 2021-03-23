import util from "util";
import fs from "fs";

const languageConfig = JSON.parse(
  fs.readFileSync("./config/customConfig.json", "utf8")
);

//PARSER

export class Program {
  constructor(block) {
    this.block = block;
  }
  [util.inspect.custom]() {
    return prettied(this);
  }
}

export class Block {
  constructor(statements) {
    this.statements = statements;
  }
}

export class StatementIfElse {
  constructor(
    ifExpression,
    ifBlock,
    elseIfExpressions,
    elseIfBlocks,
    elseBlock
  ) {
    Object.assign(this, {
      ifExpression,
      ifBlock,
      elseIfExpressions,
      elseIfBlocks,
      elseBlock,
    });
  }
}

export class WhileLoop {
  constructor(exp, block) {
    Object.assign(this, { exp, block });
  }
}

export class ForLoop {
  constructor(declaration, test, assignment, body) {
    Object.assign(this, { declaration, test, assignment, body });
  }
}

export class FunctionDeclaration {
  constructor(type, id, params, block) {
    Object.assign(this, { type, id, params, block });
  }
}
export class FunctionCall {
  constructor(id, args) {
    Object.assign(this, { id, args });
  }
}

export class Declaration {
  constructor(type, assignment) {
    type = Type.get(type);
    Object.assign(this, { type, assignment });
  }
}

export class Assignment {
  constructor(target, source) {
    Object.assign(this, { target, source });
  }
}

export class Parameter {
  constructor(type, id) {
    Object.assign(this, { type, id });
  }
}

export class BinaryExpression {
  constructor(op, left, right) {
    Object.assign(this, { op, left, right });
  }
}

export class UnaryExpression {
  constructor(op, operand) {
    Object.assign(this, { op, operand });
  }
}

export class IdentifierExpression {
  constructor(name) {
    this.name = name;
  }
}

export class Conditional {
  constructor(test, consequence, third) {
    Object.assign(this, { test, consequence, third });
  }
}

export class ParenExpression {
  constructor(exp) {
    this.exp = exp;
  }
}

export class CustomArray {
  constructor(elements) {
    this.elements = elements;
  }
}

export class CustomSet {
  constructor(elements) {
    this.elements = elements;
  }
}

export class CustomDict {
  constructor(keyValues) {
    this.keyValues = keyValues;
  }
}

export class Index {
  constructor(collection, element) {
    Object.assign(this, { collection, element });
  }
}
export class Property {
  constructor(object, field) {
    Object.assign(this, { object, field });
  }
}

export class KeyValue {
  constructor(key, value) {
    Object.assign(this, { key, value });
  }
}

export class ListComp {
  constructor(newKeyExp, newValueExp, key, value, list, condExp) {
    Object.assign(this, {
      newKeyExp,
      newValueExp,
      key,
      value,
      list,
      condExp,
    });
  }
}
// export class TypeDict {
//   constructor(type1, type2) {
//     Object.assign(this, { type1, type2 });
//   }
// }

// export class TypeArray {
//   constructor(type) {
//     this.type = type;
//   }
// }

// export class TypeSet {
//   constructor(type) {
//     this.type = type;
//   }
// }

export class Literal {
  constructor(value) {
    this.value = value;
  }
}

//ANALYZER

export class Type {
  constructor(name) {
    this.name = name;
  }
  static BOOLEAN = new Type(`${languageConfig.bool}`);
  static INT = new Type(`${languageConfig.int}`);
  static FLOAT = new Type(`${languageConfig.float}`);
  static STRING = new Type(`${languageConfig.string}`);
  static VOID = new Type(`${languageConfig.void}`);
  static TYPE = new Type("type");
  static ANY = new Type("any");

  // Equivalence: when are two types the same
  isEquivalentTo(target) {
    return target == Type.ANY || this == target;
  }
  // T1 assignable to T2 is when x:T1 can be assigned to y:T2. By default
  // this is only when two types are equivalent; however, for other kinds
  // of types there may be special rules.
  isAssignableTo(target) {
    return this.isEquivalentTo(target);
  }

  static get(type) {
    return type === `${languageConfig.bool}`
      ? Type.BOOLEAN
      : type === `${languageConfig.int}`
      ? Type.INT
      : type === `${languageConfig.float}`
      ? Type.FLOAT
      : type === `${languageConfig.string}`
      ? Type.STRING
      : type === `${languageConfig.void}`
      ? Type.VOID
      : type;
  }
}

export class ArrayType extends Type {
  // Example: [int]
  constructor(baseType) {
    super(`[${baseType.name ? baseType.name : baseType}]`);
    this.baseType = Type.get(baseType);
  }
  // [T] equivalent to [U] only when T is equivalent to U. Same for
  // assignability: we do NOT want arrays to be covariant!
  isEquivalentTo(target) {
    return (
      target.constructor === ArrayType &&
      this.baseType.isEquivalentTo(target.baseType)
    );
  }
}

export class SetType extends Type {
  constructor(baseType) {
    super(`{${baseType.name ? baseType.name : baseType}}`);
    this.baseType = Type.get(baseType);
  }

  isEquivalentTo(target) {
    return (
      target.constructor === SetType &&
      this.baseType.isEquivalentTo(target.baseType)
    );
  }
}

export class DictType extends Type {
  constructor(baseKey, baseValue) {
    super(
      `<${baseKey.name ? baseKey.name : baseKey}, ${
        baseValue.name ? baseValue.name : baseValue
      }>`
    );
    this.baseKey = Type.get(baseKey);
    this.baseValue = Type.get(baseValue);
  }

  isEquivalentTo(target) {
    return (
      target.constructor === DictType &&
      this.baseKey.isEquivalentTo(target.baseKey) &&
      this.baseValue.isEquivalentTo(target.baseValue)
    );
  }
}

export class FunctionType extends Type {
  constructor(parameterTypes, returnType) {
    super(`(${parameterTypes.map(t => t.name).join(",")})->${returnType.name}`);
    Object.assign(this, { parameterTypes, returnType });
  }
  isAssignableTo(target) {
    return (
      target.constructor === FunctionType &&
      this.returnType.isAssignableTo(target.returnType) &&
      this.parameterTypes.length === target.parameterTypes.length &&
      this.parameterTypes.every((t, i) =>
        target.parameterTypes[i].isAssignableTo(t)
      )
    );
  }
}

// Appears in the syntax tree only and disappears after semantic analysis
// since references to the Id node will be replaced with references to the
// actual type node the the id refers to.
export class TypeId {
  constructor(name) {
    this.name = name;
  }
}

// These nodes are created during semantic analysis only
export class Function {
  constructor(name) {
    this.name = name;
    // Other properties set after construction
  }
}

// These nodes are created during semantic analysis only
export class Variable {
  constructor(name) {
    Object.assign(this, { name });
  }
}

/*
Gracias a Profesor Toal for the following :)
*/
function prettied(node) {
  // Return a compact and pretty string representation of the node graph,
  // taking care of cycles. Written here from scratch because the built-in
  // inspect function, while nice, isn't nice enough.
  const seen = new Map();
  let nodeId = 0;

  function* prettiedSubtree(node, prefix, indent = 0) {
    seen.set(node, ++nodeId);
    let descriptor = `${" ".repeat(indent)}${prefix}: ${node.constructor.name}`;
    let [simpleProps, complexProps] = ["", []];
    for (const [prop, child] of Object.entries(node)) {
      if (seen.has(child)) {
        simpleProps += ` ${prop}=$${seen.get(child)}`;
      } else if (Array.isArray(child) || (child && typeof child == "object")) {
        complexProps.push([prop, child]);
      } else {
        simpleProps += ` ${prop}=${util.inspect(child)}`;
      }
    }
    yield `${String(nodeId).padStart(4, " ")} | ${descriptor}${simpleProps}`;
    for (let [prop, child] of complexProps) {
      if (Array.isArray(child)) {
        for (let [index, node] of child.entries()) {
          yield* prettiedSubtree(node, `${prop}[${index}]`, indent + 2);
        }
      } else {
        yield* prettiedSubtree(child, prop, indent + 2);
      }
    }
  }

  return [...prettiedSubtree(node, "program")].join("\n");
}
