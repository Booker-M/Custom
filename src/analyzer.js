import {
  Variable,
  Type,
  FunctionType,
  Function,
  ArrayType,
  DictType,
  SetType,
  IdentifierExpression,
} from "./ast.js";
import * as stdlib from "./stdlib.js";

function must(condition, errorMessage) {
  if (!condition) {
    throw new Error(errorMessage);
  }
}

const check = self => ({
  isNumeric() {
    must(
      [Type.INT, Type.FLOAT].includes(self.type),
      `Expected a number, found ${self.type.name}`
    );
  },
  isNumericOrString() {
    must(
      [Type.INT, Type.FLOAT, Type.STRING].includes(self.type),
      `Expected a number or string, found ${self.type.name}`
    );
  },
  isBoolean() {
    must(
      self.type === Type.BOOLEAN,
      `Expected a boolean, found ${self.type.name}`
    );
  },
  isInteger() {
    must(
      self.type === Type.INT,
      `Expected an integer, found ${self.type.name}`
    );
  },
  isAType() {
    must([Type].includes(self.constructor), "Type expected");
  },
  hasSameTypeAs(other) {
    must(
      self.type.isEquivalentTo(other.type),
      "Operands do not have the same type"
    );
  },
  allHaveSameType() {
    must(
      self.slice(1).every(e => e.type.name === self[0].type.name),
      "Not all elements have the same type"
    );
  },
  isAssignableTo(type) {
    must(
      type === Type.ANY || self.type.isAssignableTo(type),
      `Cannot assign a ${self.type.name} to a ${type.name}`
    );
  },
  areAllDistinct() {
    must(
      new Set(self.map(f => (f.value ? f.value : f))).size === self.length,
      "Fields must be distinct"
    );
  },
  isInsideALoop() {
    must(self.inLoop, "Break can only appear in a loop");
  },
  isInsideAFunction(context) {
    must(self.function, "Return can only appear in a function");
  },
  isCallable() {
    must(
      self.type.constructor == FunctionType,
      "Call of non-function or non-constructor"
    );
  },
  returnsNothing() {
    must(
      self.type.returnType === Type.VOID,
      "Something should be returned here"
    );
  },
  returnsSomething() {
    must(self.type.returnType !== Type.VOID, "Cannot return a value here");
  },
  isReturnableFrom(f) {
    check(self).isAssignableTo(f.type.returnType);
  },
  match(targetTypes) {
    // self is the array of arguments
    must(
      targetTypes.length === self.length,
      `${targetTypes.length} argument(s) required but ${self.length} passed`
    );
    targetTypes.forEach((type, i) => check(self[i]).isAssignableTo(type));
  },
  matchParametersOf(calleeType) {
    check(self).match(calleeType.parameterTypes);
  },
  isUndefined() {
    must(self === undefined, "Should not be defined");
  },
});

class Context {
  constructor(parent = null, configuration = {}) {
    // Parent (enclosing scope) for static scope analysis
    this.parent = parent;
    // All local declarations. Names map to variable declarations, types, and
    // function declarations
    this.locals = new Map();
    // Whether we are in a loop, so that we know whether breaks and continues
    // are legal here
    this.inLoop = configuration.inLoop ?? parent?.inLoop ?? false;
    // Whether we are in a function, so that we know whether a return
    // statement can appear here, and if so, how we typecheck it
    this.function = configuration.forFunction ?? parent?.function ?? null;
  }
  sees(name) {
    // Search "outward" through enclosing scopes
    return this.locals.has(name) || this.parent?.sees(name);
  }
  add(name, entity) {
    // No shadowing! Prevent addition if id anywhere in scope chain!
    if (this.sees(name)) {
      throw new Error(`Identifier ${name} already declared`);
    }
    this.locals.set(name, entity);
  }
  lookup(name) {
    const entity = this.locals.get(name);
    if (entity) {
      return entity;
    } else if (this.parent) {
      return this.parent.lookup(name);
    }
    throw new Error(`Identifier ${name} not declared`);
  }
  newChild(configuration = {}) {
    // Create new (nested) context, which is just like the current context
    // except that certain fields can be overridden
    return new Context(this, configuration);
  }
  analyze(node) {
    return this[node.constructor.name](node);
  }
  Program(p) {
    p.statements = this.analyze(p.statements);
    return p;
  }
  Block(p) {
    p.statements = this.analyze(p.statements);
    return p;
  }
  ArrayType(t) {
    t.baseType = this.analyze(t.baseType);
    return t;
  }
  SetType(t) {
    t.baseType = this.analyze(t.baseType);
    return t;
  }
  DictType(t) {
    t.baseKey = this.analyze(t.baseKey);
    t.baseValue = this.analyze(t.baseValue);
    return t;
  }
  Declaration(d) {
    d.variable = new Variable(this.analyze(d.assignment.target.name));
    d.variable.type = this.analyze(d.type);
    this.add(d.variable.name, d.variable);
    d.assignment.target = new IdentifierExpression(d.variable.name);
    d.assignment = this.analyze(d.assignment);
    return d;
  }
  FunctionDeclaration(d) {
    d.type = this.analyze(d.type);
    // Declarations generate brand new function objects
    const f = (d.function = new Function(d.id));
    // When entering a function body, we must reset the inLoop setting,
    // because it is possible to declare a function inside a loop!
    const childContext = this.newChild({ inLoop: false, forFunction: f });
    d.params = childContext.analyze(d.params);
    f.type = new FunctionType(
      d.params.map(p => p.type),
      d.type
    );
    // Add before analyzing the body to allow recursion
    this.add(f.name, f);
    d.block = childContext.analyze(d.block);
    return d;
  }
  Parameter(p) {
    p.type = this.analyze(p.type);
    this.add(p.id, p);
    return p;
  }
  Increment(s) {
    s.variable = this.analyze(s.variable);
    check(s.variable).isInteger();
    return s;
  }
  Decrement(s) {
    s.variable = this.analyze(s.variable);
    check(s.variable).isInteger();
    return s;
  }
  Assignment(s) {
    s.source = this.analyze(s.source);
    s.target = this.analyze(s.target);
    check(s.source).isAssignableTo(s.target.type);
    return s;
  }
  BreakStatement(s) {
    check(this).isInsideALoop();
    return s;
  }
  ReturnStatement(s) {
    check(this).isInsideAFunction();
    if (this.function.type.returnType === Type.VOID) {
      check(this.function).returnsNothing();
      check(s.expression[0]).isUndefined();
    } else {
      s.expression = this.analyze(s.expression[0]);
      check(this.function).returnsSomething();
      check(s.expression).isReturnableFrom(this.function);
    }
    return s;
  }
  StatementIfElse(s) {
    s.test = this.analyze(s.test);
    check(s.test).isBoolean();
    s.consequence = this.newChild().analyze(s.consequence);
    if (s.alternate.constructor === Array) {
      // It's a block of statements, make a new context
      s.alternate = this.newChild().analyze(s.alternate);
    }
    return s;
  }
  WhileLoop(s) {
    s.test = this.analyze(s.test);
    check(s.test).isBoolean();
    s.body = this.newChild({ inLoop: true }).analyze(s.body);
    return s;
  }
  ForLoop(s) {
    s.declaration = this.analyze(s.declaration);
    s.test = this.analyze(s.test);
    check(s.test).isBoolean();
    s.assignment = this.analyze(s.assignment);
    s.body = this.newChild({ inLoop: true }).analyze(s.body);
    return s;
  }
  Conditional(e) {
    e.test = this.analyze(e.test);
    check(e.test).isBoolean();
    e.consequence = this.analyze(e.consequence);
    e.alternate = this.analyze(e.alternate);
    check(e.consequence).hasSameTypeAs(e.alternate);
    e.type = e.consequence.type;
    return e;
  }
  BinaryExpression(e) {
    e.left = this.analyze(e.left);
    e.right = this.analyze(e.right);
    if (["&&", "||"].includes(e.op)) {
      check(e.left).isBoolean();
      check(e.right).isBoolean();
      e.type = Type.BOOLEAN;
    } else if (["+"].includes(e.op)) {
      check(e.left).isNumericOrString();
      check(e.left).hasSameTypeAs(e.right);
      e.type = e.left.type;
    } else if (["-", "*", "/", "%", "^"].includes(e.op)) {
      check(e.left).isNumeric();
      check(e.left).hasSameTypeAs(e.right);
      e.type = e.left.type;
    } else if (["<", "<=", ">", ">="].includes(e.op)) {
      check(e.left).isNumericOrString();
      check(e.left).hasSameTypeAs(e.right);
      e.type = Type.BOOLEAN;
    } else if (["==", "!="].includes(e.op)) {
      check(e.left).hasSameTypeAs(e.right);
      e.type = Type.BOOLEAN;
    }
    return e;
  }
  UnaryExpression(e) {
    e.operand = this.analyze(e.operand);
    if (e.op === "-") {
      check(e.operand).isNumeric();
      e.type = e.operand.type;
    } else if (e.op === "!") {
      check(e.operand).isBoolean();
      e.type = Type.BOOLEAN;
    }
    return e;
  }
  Index(e) {
    e.collection = this.analyze(e.collection);
    e.index = this.analyze(e.index);
    if (e.collection.type.baseType) {
      e.type = e.collection.type.baseType;
      check(e.index).isInteger();
    } else {
      e.type = e.collection.type.baseValue;
      check(e.index.type).hasSameTypeAs(e.collection.type.baseKey);
    }
    return e;
  }
  CustomArray(a) {
    a.elements = this.analyze(a.elements);
    check(a.elements).allHaveSameType();
    a.type = new ArrayType(
      a.elements.length > 0 ? a.elements[0].type : Type.ANY
    );
    return a;
  }
  CustomSet(a) {
    a.elements = this.analyze(a.elements);
    check(a.elements).allHaveSameType();
    check(a.elements).areAllDistinct();
    a.type = new SetType(a.elements.length > 0 ? a.elements[0].type : Type.ANY);
    return a;
  }
  CustomDict(a) {
    a.keys = a.keyValues.map(item => this.analyze(item.key));
    a.values = a.keyValues.map(item => this.analyze(item.value));
    check(a.keys).allHaveSameType();
    check(a.keys).areAllDistinct();
    check(a.values).allHaveSameType();
    a.type = new DictType(a.keys[0].type, a.values[0].type);
    return a;
  }
  FunctionCall(c) {
    c.id = this.analyze(c.id);
    check(c.id).isCallable();
    c.args = this.analyze(c.args);
    check(c.args).matchParametersOf(c.id.type);
    c.type = c.id.type.returnType;

    return c;
  }
  IdentifierExpression(e) {
    // Id expressions get "replaced" with the variables they refer to
    return this.lookup(e.name);
  }
  TypeId(t) {
    t = this.lookup(t.name);
    check(t).isAType();
    return t;
  }
  Number(e) {
    return e;
  }
  BigInt(e) {
    return e;
  }
  Boolean(e) {
    return e;
  }
  String(e) {
    return e;
  }
  Array(a) {
    return a.map(item => this.analyze(item));
  }
  Literal(l) {
    l.type = l.value.type;
    return l;
  }
}

export default function analyze(node) {
  // Allow primitives to be automatically typed
  Number.prototype.type = Type.FLOAT;
  BigInt.prototype.type = Type.INT;
  Boolean.prototype.type = Type.BOOLEAN;
  String.prototype.type = Type.STRING;
  Type.prototype.type = Type.TYPE;
  const initialContext = new Context();

  // Add in all the predefined identifiers from the stdlib module
  const library = { ...stdlib.types, ...stdlib.constants, ...stdlib.functions };
  for (const [name, type] of Object.entries(library)) {
    initialContext.add(name, type);
  }
  return initialContext.analyze(node);
}
