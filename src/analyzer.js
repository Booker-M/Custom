import {
  Variable,
  Type,
  FunctionType,
  Function,
  ArrayType,
} from "./ast.js";
import fs from "fs";
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
    must(Type === self.constructor, "Type expected");
  },
  isAnOptional() {
    must(self.type.constructor === OptionalType, "Optional expected");
  },
  isAnArray() {
    must(self.type.constructor === ArrayType, "Array expected");
  },
  hasSameTypeAs(other) {
    must(
      self.type.isEquivalentTo(other.type),
      "Operands do not have the same type"
    );
  },
  allHaveSameType() {
    must(
      self.slice(1).every(e => e.type === self[0].type),
      "Not all elements have the same type"
    );
  },
  isAssignableTo(type) {
    must(
      type === Type.ANY || self.type.isAssignableTo(type),
      `Cannot assign a ${self.type.name} to a ${type.name}`
    )
  },
  isNotReadOnly() {
    must(!self.readOnly, `Cannot assign to constant ${self.name}`);
  },
  areAllDistinct() {
    must(
      new Set(self.map(f => f.name)).size === self.length,
      "Fields must be distinct"
    );
  },
  isInTheObject(object) {
    must(object.type.fields.map(f => f.name).includes(self), "No such field");
  },
  isInsideALoop() {
    must(self.inLoop, "Break can only appear in a loop");
  },
  isInsideAFunction(context) {
    must(self.function, "Return can only appear in a function");
  },
  isCallable() {
    must(
      self.callable = true,
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
  matchFieldsOf(structType) {
    check(self).match(structType.fields.map(f => f.type));
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
    console.log(node)
    console.log("--------HELLO")
    return this[node.constructor.name](node);
  }
  Program(p) {
    p.statements = this.analyze(p.block[0].statements);
    return p;
  }
  ArrayType(t) {
    t.baseType = this.analyze(t.baseType);
    return t;
  }
  OptionalType(t) {
    t.baseType = this.analyze(t.baseType);
    return t;
  }
  Declaration(d) {
    // Declarations generate brand new variable objects
    d.assignment.source = this.analyze(d.assignment.source)
    d.variable = new Variable(d.assignment.target)
    d.variable.type = this.analyze(d.type)
    d.assignment.target = d.variable


    /*

    Notes from our attempt
    1. the d.assignment.source is CORRECT 
    2. d.assignment.target is INCORRECT
    3. d.assignment.target must use d.type to figure out its type
        -> aka, it must be made to point to the context type (Type.Int for example)

    4. this might be possible with TypeId? not quite sure
    5. might have to import our customConfig.json again
    6. d.type COULD BE an object, for example TypeArray, which denote a collection
    7. or d.type could be a straight up string, for example `string` which denotes a basic type
    8. :(
    
    */

    // // TODO
    // this is an attempt to infer type from d.type
    // if(typeof(d.assignment.target.type) === 'object'){
    //   const createType = (type) =>{
    //     if(typeof(type) === 'object'){
    //       return new ArrayType(createType(type.type))
    //     } else {
    //       return new Type(type)
    //     }
    //   }
    //   d.assignment.target.type = createType(d.assignment.target.type)
    // }else{
    //   d.assignment.target.type = new Type(d.assignment.target.type)
    // }

    console.log("aosdjfasjfdaj")
    console.log(d)
    console.log(d.assignment.source.type)
    console.log(d.assignment.target.type)
    d.assignment.source.type == d.assignment.target.type --> false
    // d.assignment.source.type.isEquivalentTo(d.assignment.target.type)
    check(d.assignment.source).isAssignableTo(d.assignment.target.type)
    return d
  }
  Field(f) {
    f.type = this.analyze(f.type);
    return f;
  }
  FunctionDeclaration(d) {
    d.type = d.type ? this.analyze(d.returnType) : Type.VOID;
    // Declarations generate brand new function objects
    const f = (d.function = new Function(d.name));
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
    d.body = childContext.analyze(d.body);
    return d;
  }
  Parameter(p) {
    p.type = this.analyze(p.type);
    this.add(p.name, p);
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
    s.source = this.analyze(s.source)
    s.target = this.analyze(s.target)
    check(s.source).isAssignableTo(s.target.type)
    check(s.target).isNotReadOnly()
    return s
  }
  BreakStatement(s) {
    check(this).isInsideALoop();
    return s;
  }
  ReturnStatement(s) {
    check(this).isInsideAFunction();
    check(this.function).returnsSomething();
    s.expression = this.analyze(s.expression);
    check(s.expression).isReturnableFrom(this.function);
    return s;
  }
  ShortReturnStatement(s) {
    check(this).isInsideAFunction();
    check(this.function).returnsNothing();
    return s;
  }
  IfStatement(s) {
    s.test = this.analyze(s.test);
    check(s.test).isBoolean();
    s.consequent = this.newChild().analyze(s.consequent);
    if (s.alternate.constructor === Array) {
      // It's a block of statements, make a new context
      s.alternate = this.newChild().analyze(s.alternate);
    } else if (s.alternate) {
      // It's a trailing if-statement, so same context
      s.alternate = this.analyze(s.alternate);
    }
    return s;
  }
  ShortIfStatement(s) {
    s.test = this.analyze(s.test);
    check(s.test).isBoolean();
    s.consequent = this.newChild().analyze(s.consequent);
    return s;
  }
  WhileStatement(s) {
    s.test = this.analyze(s.test);
    check(s.test).isBoolean();
    s.body = this.newChild({ inLoop: true }).analyze(s.body);
    return s;
  }
  RepeatStatement(s) {
    s.count = this.analyze(s.count);
    check(s.count).isInteger();
    s.body = this.newChild({ inLoop: true }).analyze(s.body);
    return s;
  }
  ForRangeStatement(s) {
    s.low = this.analyze(s.low);
    check(s.low).isInteger();
    s.high = this.analyze(s.high);
    check(s.high).isInteger();
    s.iterator = new Variable(s.iterator, true);
    s.iterator.type = Type.INT;
    s.body = this.newChild({ inLoop: true }).analyze(s.body);
    return s;
  }
  ForStatement(s) {
    s.collection = this.analyze(s.collection);
    check(s.collection).isAnArray();
    s.iterator = new Variable(s.iterator, true);
    s.iterator.type = s.collection.type.baseType;
    s.body = this.newChild({ inLoop: true }).analyze(s.body);
    return s;
  }
  Conditional(e) {
    e.test = this.analyze(e.test);
    check(e.test).isBoolean();
    e.consequent = this.analyze(e.consequent);
    e.alternate = this.analyze(e.alternate);
    check(e.consequent).hasSameTypeAs(e.alternate);
    e.type = e.consequent.type;
    return e;
  }
  UnwrapElse(e) {
    e.optional = this.analyze(e.optional);
    e.alternate = this.analyze(e.alternate);
    check(e.optional).isAnOptional();
    check(e.alternate).isAssignableTo(e.optional.type.baseType);
    e.type = e.optional.type;
    return e;
  }
  OrExpression(e) {
    e.disjuncts = this.analyze(e.disjuncts);
    e.disjuncts.forEach(disjunct => check(disjunct).isBoolean());
    e.type = Type.BOOLEAN;
    return e;
  }
  AndExpression(e) {
    e.conjuncts = this.analyze(e.conjuncts);
    e.conjuncts.forEach(conjunct => check(conjunct).isBoolean());
    e.type = Type.BOOLEAN;
    return e;
  }
  BinaryExpression(e) {
    e.left = this.analyze(e.left);
    e.right = this.analyze(e.right);
    if (["&", "|", "^", "<<", ">>"].includes(e.op)) {
      check(e.left).isInteger();
      check(e.right).isInteger();
      e.type = Type.INT;
    } else if (["+"].includes(e.op)) {
      check(e.left).isNumericOrString();
      check(e.left).hasSameTypeAs(e.right);
      e.type = e.left.type;
    } else if (["-", "*", "/", "%", "**"].includes(e.op)) {
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
    if (e.op === "#") {
      check(e.operand).isAnArray();
      e.type = Type.INT;
    } else if (e.op === "-") {
      check(e.operand).isNumeric();
      e.type = e.operand.type;
    } else if (e.op === "!") {
      check(e.operand).isBoolean();
      e.type = Type.BOOLEAN;
    } else {
      // Operator is "some"
      e.type = new OptionalType(e.operand.type);
    }
    return e;
  }
  EmptyOptional(e) {
    e.baseType = this.analyze(e.baseType);
    e.type = new OptionalType(e.baseType);
    return e;
  }
  SubscriptExpression(e) {
    e.array = this.analyze(e.array);
    e.type = e.array.type.baseType;
    e.index = this.analyze(e.index);
    check(e.index).isInteger();
    return e;
  }
  CustomArray(a) {
    a.elements = this.analyze(a.elements);
    check(a.elements).allHaveSameType();
    a.type = new ArrayType(a.elements[0].type);
    return a;
  }
  EmptyArray(e) {
    e.baseType = this.analyze(e.baseType);
    e.type = new ArrayType(e.baseType);
    return e;
  }
  MemberExpression(e) {
    e.object = this.analyze(e.object);
    check(e.field).isInTheObject(e.object);
    e.type = e.object.type.fields.find(f => f.name === e.field).type;
    return e;
  }
  Call(c) {
    c.callee = this.analyze(c.callee);
    check(c.callee).isCallable();
    c.args = this.analyze(c.args);
    check(c.args).matchParametersOf(c.callee.type);
    c.type = c.callee.type.returnType;
    
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
  // CustomArray(a){
  //   return this.ArrayExpression(a)
  //   // a.size === a.elements.length TODO
  //   //check if elements all of same type TODO
  //   a.elements = a.elements.map(item => this.analyze(item));
  //   console.log('LKJlja;ldkfja;lskdjf;alsdkjf')
  //   console.log(a)

  //   return a
  //   // return this.ArrayType(a.elements)
  // }
  CustomSet(s) {
    return s.elements.map(item => this.analyze(item));
  }
  Array(a) {
    return a.map(item => this.analyze(item));
  }
  Literal(l){
    return l.value
  }
  elements(e){
    return e.map(item => this.analyze(item));
  }
}

export default function analyze(node) {
  console.log(`AYYOOO ${node}`)
  // Allow primitives to be automatically typed
  Number.prototype.type = Type.FLOAT;
  BigInt.prototype.type = Type.INT;
  Boolean.prototype.type = Type.BOOLEAN;
  String.prototype.type = Type.STRING;
  Type.prototype.type = Type.TYPE;
  const initialContext = new Context();
  console.log(`FUCK  ${node}`)
  // Add in all the predefined identifiers from the stdlib module
  const library = { ...stdlib.types, ...stdlib.constants, ...stdlib.functions };
  for (const [name, type] of Object.entries(library)) {
    initialContext.add(name, type);
  }
  console.log(`I HATE THIS ${node}`)
  return initialContext.analyze(node);
}
