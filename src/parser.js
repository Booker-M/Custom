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
  Block(statements) {
    return new ast.Block(statements.ast());
  },
  Statement_declarative(statement, _1) {
    return statement.ast();
  },
  Statement_if(
    _1,
    _2,
    ifExpression,
    _3,
    _4,
    ifBlock,
    _5,
    _6,
    _7,
    _8,
    elseIfExpression,
    _9,
    _10,
    elseIfBlock,
    _11,
    _12,
    _13,
    elseBlock,
    _14
  ) {
    return new ast.StatementIfElse(
      ifExpression.ast(),
      ifBlock.ast(),
      elseIfExpression.ast(),
      elseIfBlock.ast(),
      elseBlock.ast()
    );
  },
  Loop_while(_1, _2, exp, _3, _4, block, _5) {
    return new ast.WhileLoop(exp.ast(), block.ast());
  },
  Loop_for(
    _1,
    _2,
    declaration,
    _3,
    expression,
    _4,
    assignment,
    _5,
    _6,
    block,
    _7
  ) {
    return new ast.ForLoop(
      declaration.ast(),
      expression.ast(),
      assignment.ast(),
      block.ast()
    );
  },
  FunctionCall(id, _1, args, _2) {
    return new ast.FunctionCall(id.sourceString, args.ast());
  },
  Declaration(type, assignment) {
    return new ast.Declaration(type.ast(), assignment.ast());
  },
  Assignment_assign(id, _1, exp) {
    return new ast.Assignment(id.sourceString, exp.ast());
  },
  Assignment_increment(id, op) {
    return new ast.Assignment(id.sourceString, op.sourceString);
  },
  Assignment_decrement(id, op) {
    return new ast.Assignment(id.sourceString, op.sourceString);
  },
  FunctionDeclaration(type, id, _1, params, _2, _3, block, _4) {
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
    return new ast.TernaryExpression(
      BinExp.ast(),
      BinExp2.ast(),
      BinExp3.ast()
    );
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
    return new ast.ParenExpression(expression.ast());
  },
  Print(_1, ParenExp) {
    return ParenExp.ast();
  },
  Return(_1, ParenExp) {
    return ParenExp.ast();
  },
  Array_declarative(_1, elements, _2) {
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
  Property(id1, _1, id2) {
    return new ast.Property(id1.ast(), id2.ast());
  },
  KeyValue(key, _1, value) {
    return new ast.KeyValue(key.ast(), value.ast());
  },
  ListComp(_1, newExp, _2, args, _3, list, _4, condExp, _5) {
    return new ast.ListComp(newExp.ast(), args.ast(), list.ast(), condExp.ast());
  },
  Type_dict(_1, type1, _2, type2, _3) {
    return new ast.TypeDict(type1.sourceString, type2.sourceString);
  },
  Id(_first, _rest) {
    return new ast.IdentifierExpression(this.sourceString);
  },
  numlit(_whole, _point, _fraction) {
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
