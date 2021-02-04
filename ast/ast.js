import util from "util"

/*
Gracias a Dr. Toal for the following from the Ael Compiler
We are using it as both an example and as code for portions of our parser
*/
export class Program {
  constructor(statements) {
    this.statements = statements
  }
  [util.inspect.custom]() {
    return prettied(this)
  }
}

export class Assignment {
  constructor(target, source) {
    Object.assign(this, { target, source })
  }
}

export class PrintStatement {
  constructor(argument) {
    this.argument = argument
  }
}

export class BinaryExpression {
  constructor(op, left, right) {
    Object.assign(this, { op, left, right })
  }
}

export class UnaryExpression {
  constructor(op, operand) {
    Object.assign(this, { op, operand })
  }
}

export class IdentifierExpression {
  constructor(name) {
    this.name = name
  }
}

/*The following is original code */

export class Block {
  constructor(statements) {
    this.statements = statements
  }
}

export class FunctionDeclaration {
  constructor(type, id, params, block) {
    Object.assign(this, { type, id, params, block })
  }
}
export class FunctionCall {
  constructor(id, args) {
    Object.assign(this, { id, args })
  }
}

export class WhileLoop {
  constructor(exp, block) {
    Object.assign(this, { exp, block })
  }
}

export class ForLoop {
  constructor(declaration, expression, assignment, block) {
    Object.assign(this, { declaration, expression, assignment, block })
  }
}

export class StatementIfElse {
  constructor(exp, block, elseIfExpressions, elseIfBlocks, elseBlocks) {
    Object.assign(this, { exp, block, elseIfExpressions, elseIfBlocks, elseBlocks })
  }
}

export class Declaration {
  constructor(type, assignment) {
    Object.assign(this, { type, assignment })
  }
}

export class Literal {
  constructor(value) {
    Object.assign(this, { value })
  }
}

// export class Parameters{
//   constructor(params){
//     Object.assign(this, {params})
//   }
// }

// export class Parameter{
//   constructor(type, id){
//     Object.assign(this, {type, id})
//   }
// }

// export class NonemptyListOf{
//   constructor(first, ...rest){
//     Object.assign(this, {first, ...rest})
//   }
// }

// export class EmptyListOf{
//   constructor(list){
//     Object.assign(this, {list} )
//   }
// }

/*
Gracias a Profesor Toal for the following :)
*/
function prettied(node) {
  // Return a compact and pretty string representation of the node graph,
  // taking care of cycles. Written here from scratch because the built-in
  // inspect function, while nice, isn't nice enough.
  const seen = new Map()

  function setIds(node) {
    seen.set(node, seen.size + 1)
    for (const child of Object.values(node)) {
      if (seen.has(child)) continue
      else if (Array.isArray(child)) child.forEach(setIds)
      else if (child && typeof child == "object") setIds(child)
    }
  }

  function* lines() {
    for (let [node, id] of [...seen.entries()].sort((a, b) => a[1] - b[1])) {
      let [type, props] = [node.constructor.name, ""]
      for (const [prop, child] of Object.entries(node)) {
        const value = seen.has(child)
          ? `#${seen.get(child)}`
          : Array.isArray(child)
            ? `[${child.map(c => `#${seen.get(c)}`)}]`
            : util.inspect(child)
        props += ` ${prop}=${value}`
      }
      yield `${String(id).padStart(4, " ")} | ${type}${props}`
    }
  }

  setIds(node)
  return [...lines()].join("\n")
}