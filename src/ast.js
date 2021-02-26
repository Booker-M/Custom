import util from "util";

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
  constructor(ifExpression, ifBlock, elseIfExpression, elseIfBlock, elseBlock) {
    Object.assign(this, {
      ifExpression,
      ifBlock,
      elseIfExpression,
      elseIfBlock,
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
  constructor(declaration, expression, assignment, block) {
    Object.assign(this, { declaration, expression, assignment, block });
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

export class TernaryExpression {
  constructor(first, second, third) {
    Object.assign(this, { first, second, third });
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
  constructor(id1, id2) {
    Object.assign(this, { id1, id2 });
  }
}
export class Property {
  constructor(id1, id2) {
    Object.assign(this, { id1, id2 });
  }
}

export class KeyValue {
  constructor(key, value) {
    Object.assign(this, { key, value });
  }
}

export class TypeDict {
  constructor(type1, type2) {
    Object.assign(this, { type1, type2 });
  }
}

export class Literal {
  constructor(value) {
    Object.assign(this, { value });
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
      /* if (seen.has(child)) {
        simpleProps += ` ${prop}=$${seen.get(child)}`;
      } else */ if (
        Array.isArray(child) ||
        (child && typeof child == "object")
      ) {
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
