import util from "util";

/*
Gracias a Dr. Toal for the following from the Ael Compiler
We are using it as both an example and as code for portions of our parser
*/
export class Program {
  constructor(statements) {
    this.statements = statements;
  }
  [util.inspect.custom]() {
    return prettied(this);
  }
}

export class Assignment {
  constructor(target, source) {
    Object.assign(this, { target, source });
  }
}

export class PrintStatement {
  constructor(argument) {
    this.argument = argument;
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

/*The following is original code */

export class Block {
  constructor(statements) {
    this.statements = statements;
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

export class StatementIfElse {
  constructor(exp, block, elseIfExpressions, elseIfBlocks, elseBlocks) {
    Object.assign(this, {
      exp,
      block,
      elseIfExpressions,
      elseIfBlocks,
      elseBlocks,
    });
  }
}

export class Declaration {
  constructor(type, assignment) {
    Object.assign(this, { type, assignment });
  }
}

export class DictDeclaration {
  constructor(type1, type2, assignment) {
    Object.assign(this, { type1, type2, assignment });
  }
}

export class TernaryExpression {
  constructor(first, second, third) {
    Object.assign(this, { first, second, third });
  }
}

export class ParenExpression {
  constructor(parens) {
    this.parents = parens;
  }
}

export class Literal {
  constructor(value) {
    Object.assign(this, { value });
  }
}

export class Parameter {
  constructor(type, id) {
    Object.assign(this, { type, id });
  }
}

export class ParameterDict {
  constructor(type1, type2, id) {
    Object.assign(this, { type1, type2, id });
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

export class ListComp {
  constructor(newExp, args, array, condExp) {
    Object.assign(this, {
      newExp,
      args,
      array,
      condExp
    });
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
