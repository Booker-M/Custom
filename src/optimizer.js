// Optimizer
//
// This module exports a single function to perform machine-independent
// optimizations on the analyzed semantic graph.
//
// The only optimizations supported here are:
//
//   - assignments to self (x = x) turn into no-ops
//   - constant folding
//   - some strength reductions (+0, -0, *0, *1, etc.)
//   - turn references to built-ins true and false to be literals
//   - remove all disjuncts in || list after literal true
//   - remove all conjuncts in && list after literal false
//   - while-false becomes a no-op
//   - repeat-0 is a no-op
//   - for-loop over empty array is a no-op
//   - for-loop with low > high is a no-op
//   - if-true and if-false reduce to only the taken arm

import * as ast from "./ast.js";

export default function optimize(node) {
  console.log(node);
  return optimizers[node.constructor.name](node);
}

const optimizers = {
  Program(p) {
    p.statements = optimize(p.statements);
    return p;
  },
  Block(b) {
    b.statements = optimize(b.statements);
    return b;
  },
  Declaration(d) {
    d.assignment.source = optimize(d.assignment.source);
    return d;
  },
  ArrayType(t) {
    return t;
  },
  SetType(t) {
    return t;
  },
  DictType(t) {
    return t;
  },
  FunctionDeclaration(d) {
    d.body = optimize(d.body);
    return d;
  },
  Variable(v) {
    return v;
  },
  Function(f) {
    return f;
  },
  Parameter(p) {
    return p;
  },
  Increment(s) {
    return s;
  },
  Decrement(s) {
    return s;
  },
  Assignment(s) {
    s.source = optimize(s.source);
    s.target = optimize(s.target);
    if (s.source === s.target) {
      return [];
    } else if (
      s.source.op === "+" &&
      ((optimize(s.source.left) === s.target &&
        optimize(s.source.right) === 1) ||
        (optimize(s.source.left) === 1 &&
          optimize(s.source.right) === s.target))
    ) {
      return new ast.Increment(s.target);
    } else if (
      s.source.op === "-" &&
      ((optimize(s.source.left) === s.target &&
        optimize(s.source.right) === 1) ||
        (optimize(s.source.left) === 1 &&
          optimize(s.source.right) === s.target))
    ) {
      return new ast.Decrement(s.target);
    }
    return s;
  },
  BreakStatement(s) {
    return s;
  },
  ReturnStatement(s) {
    s.expression = optimize(s.expression);
    return s;
  },
  StatementIfElse(s) {
    s.test = optimize(s.test);
    s.consequence = optimize(s.consequence);
    s.alternate = optimize(s.alternate);
    if (s.test.constructor === Boolean) {
      return s.test ? s.consequence : s.alternate;
    }
    return s;
  },
  WhileLoop(s) {
    s.test = optimize(s.test);
    if (s.test === false) {
      // while false is a no-op
      return [];
    }
    s.body = optimize(s.body);
    return s;
  },
  ForLoop(s) {
    s.declaration = optimize(s.declaration);
    s.test = optimize(s.test);
    s.body = optimize(s.body);
    if (s.test == false) {
      return [];
    }
    return s;
  },
  Conditional(e) {
    e.test = optimize(e.test);
    e.consequence = optimize(e.consequence);
    e.alternate = optimize(e.alternate);
    if (e.test.constructor === Boolean) {
      return e.test ? e.consequence : e.alternate;
    }
    return e;
  },
  BinaryExpression(e) {
    e.left = optimize(e.left);
    e.right = optimize(e.right);
    if (e.op === "&&") {
      // Optimize boolean constants in && and ||
      if (e.left === true) return e.right;
      else if (e.right === true) return e.left;
    } else if (e.op === "||") {
      if (e.left === false) return e.right;
      else if (e.right === false) return e.left;
    } else if ([Number, BigInt].includes(e.left.constructor)) {
      // Numeric constant folding when left operand is constant
      if ([Number, BigInt].includes(e.right.constructor)) {
        if (e.op === "+") return e.left + e.right;
        else if (e.op === "-") return e.left - e.right;
        else if (e.op === "*") return e.left * e.right;
        else if (e.op === "/") return e.left / e.right;
        else if (e.op === "^") return e.left ** e.right;
        else if (e.op === "<") return e.left < e.right;
        else if (e.op === "<=") return e.left <= e.right;
        else if (e.op === "==") return e.left === e.right;
        else if (e.op === "!=") return e.left !== e.right;
        else if (e.op === ">=") return e.left >= e.right;
        else if (e.op === ">") return e.left > e.right;
      } else if (e.left === 0 && e.op === "+") return e.right;
      else if (e.left === 1 && e.op === "*") return e.right;
      else if (e.left === 0 && e.op === "-")
        return new ast.UnaryExpression("-", e.right);
      else if (e.left === 1 && e.op === "^") return 1;
      else if (e.left === 0 && ["*", "/"].includes(e.op)) return 0;
    } else if (e.right.constructor === Number) {
      // Numeric constant folding when right operand is constant
      if (["+", "-"].includes(e.op) && e.right === 0) return e.left;
      else if (["*", "/"].includes(e.op) && e.right === 1) return e.left;
      else if (e.op === "*" && e.right === 0) return 0;
      else if (e.op === "^" && e.right === 0) return 1;
    }
    return e;
  },
  UnaryExpression(e) {
    e.operand = optimize(e.operand);
    if (e.operand.constructor === Number) {
      if (e.op === "-") {
        return -e.operand;
      }
    }
    return e;
  },
  Index(e) {
    e.collection = optimize(e.collection);
    e.index = optimize(e.index);
    return e;
  },
  CustomArray(e) {
    e.elements = optimize(e.elements);
    return e;
  },
  CustomSet(e) {
    e.elements = optimize(e.elements);
    return e;
  },
  CustomDict(e) {
    e.keyValues = optimize(e.keyValues);
    return e;
  },
  KeyValue(e) {
    e.key = optimize(e.key);
    e.value = optimize(e.value);
    return e;
  },
  FunctionCall(c) {
    c.id = optimize(c.id);
    c.args = optimize(c.args);
    return c;
  },
  BigInt(e) {
    return e;
  },
  Number(e) {
    return e;
  },
  Boolean(e) {
    return e;
  },
  String(e) {
    return e;
  },
  Array(a) {
    const x = [];
    for (const e of a) {
      x.push(e);
      if (
        e.constructor === ast.ReturnStatement ||
        e.constructor === ast.BreakStatement
      ) {
        break;
      }
    }
    // Flatmap since each element can be an array
    return x.flatMap(optimize);
  },
  Literal(l) {
    return l;
  },
};
