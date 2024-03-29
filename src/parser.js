// Parser
//
// Exports a single function called parse which accepts the source code
// as a string and returns the AST.

import ohm from "ohm-js";
import * as ast from "../src/ast.js";
import Custom from "../grammar/customGrammar.js";

const customGrammar = ohm.grammar(Custom);

const astBuilder = customGrammar.createSemantics().addOperation("ast", {
  Program(block) {
    return new ast.Program(block.ast());
  },
  Block(_1, statements, _2) {
    return new ast.Block(statements.ast());
  },
  Statement(statement, _1) {
    return statement.ast();
  },
  IfStatement(_1, _2, test, _3, consequence, _4, alternate) {
    return new ast.StatementIfElse(
      test.ast(),
      consequence.ast(),
      alternate.ast()
    );
  },
  Loop_while(_1, _2, exp, _3, block) {
    return new ast.WhileLoop(exp.ast(), block.ast());
  },
  Loop_for(_1, _2, declaration, _3, expression, _4, assignment, _5, block) {
    return new ast.ForLoop(
      declaration.ast(),
      expression.ast(),
      assignment.ast(),
      block.ast()
    );
  },
  Break(_1) {
    return new ast.BreakStatement();
  },
  FunctionCall(id, _1, args, _2) {
    return new ast.FunctionCall(id.ast(), args.ast());
  },
  Declaration(type, assignment) {
    return new ast.Declaration(type.ast(), assignment.ast());
  },
  Assignment_assign(id, _1, exp) {
    return new ast.Assignment(id.ast(), exp.ast());
  },
  Assignment_increment(id, _op) {
    return new ast.Increment(id.ast());
  },
  Assignment_decrement(id, _op) {
    return new ast.Decrement(id.ast());
  },
  FunctionDeclaration(type, id, _1, params, _2, block) {
    return new ast.FunctionDeclaration(
      type.ast(),
      id.sourceString,
      params.ast(),
      block.ast()
    );
  },
  Param(type, id) {
    return new ast.Parameter(type.ast(), id.sourceString);
  },
  Exp_binary(Exp, relop, BinExp) {
    return new ast.BinaryExpression(
      relop.sourceString,
      Exp.ast(),
      BinExp.ast()
    );
  },
  Exp_ternary(BinExp, _1, BinExp2, _2, BinExp3) {
    return new ast.Conditional(BinExp.ast(), BinExp2.ast(), BinExp3.ast());
  },
  BinExp_binary(BinExp, binop, AddExp) {
    return new ast.BinaryExpression(
      binop.sourceString,
      BinExp.ast(),
      AddExp.ast()
    );
  },
  AddExp_binary(AddExp, addop, MullExp) {
    return new ast.BinaryExpression(
      addop.sourceString,
      AddExp.ast(),
      MullExp.ast()
    );
  },
  MullExp_binary(MullExp, mullop, PrefixExp) {
    return new ast.BinaryExpression(
      mullop.sourceString,
      MullExp.ast(),
      PrefixExp.ast()
    );
  },
  PrefixExp_binary(unaryOp, ExpoExp) {
    return new ast.UnaryExpression(unaryOp.sourceString, ExpoExp.ast());
  },
  ExpoExp_binary(parenexp, op, expoexp) {
    return new ast.BinaryExpression(
      op.sourceString,
      parenexp.ast(),
      expoexp.ast()
    );
  },
  ParenExp_parens(_1, expression, _2) {
    return expression.ast();
  },
  Return(_1, ParenExp) {
    return new ast.ReturnStatement(ParenExp.ast());
  },
  Array(_1, elements, _2) {
    return new ast.CustomArray(elements.ast());
  },
  Set(_1, elements, _2) {
    return new ast.CustomSet(elements.ast());
  },
  Dict(_1, keyValues, _2) {
    return new ast.CustomDict(keyValues.ast());
  },
  Index(id1, _1, id2, _2) {
    return new ast.Index(id1.ast(), id2.ast());
  },
  KeyValue(key, _1, value) {
    return new ast.KeyValue(key.ast(), value.ast());
  },
  type_dict(_1, _2, type1, _3, _4, _5, type2, _6, _7) {
    return new ast.DictType(type1.ast(), type2.ast());
  },
  type_array(type, _1) {
    return new ast.ArrayType(type.ast());
  },
  type_set(type, _1) {
    return new ast.SetType(type.ast());
  },
  typeid(type) {
    return new ast.TypeId(type.ast());
  },
  void(type) {
    return new ast.TypeId(type.ast());
  },
  id(_first, _rest) {
    return new ast.IdentifierExpression(this.sourceString);
    // return this.sourceString;
  },
  intlit(_whole) {
    return BigInt(this.sourceString);
  },
  floatlit(_whole, _point, _fraction) {
    return Number(this.sourceString);
  },
  stringlit(_1, _chars, _2) {
    return new ast.Literal(this.sourceString.slice(1, -1));
  },
  NonemptyListOf(first, _, rest) {
    return [first.ast(), ...rest.ast()];
  },
  EmptyListOf() {
    return [];
  },
  true(_) {
    return true;
  },
  false(_) {
    return false;
  },
  _terminal() {
    return this.sourceString;
  },
});

export default function parse(sourceCode) {
  const match = customGrammar.match(sourceCode);
  if (!match.succeeded()) {
    throw new Error(match.message);
  }
  return astBuilder(match).ast();
}
