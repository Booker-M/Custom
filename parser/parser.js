// Parser
//
// Exports a single function called parse which accepts the source code
// as a string and returns the AST.

import ohm from "ohm-js"
import * as ast from "../ast/ast.js"
import { Literal } from "../ast/ast.js"
import Custom from "../grammar/customGrammar.js"

const customGrammar = ohm.grammar(Custom)

const astBuilder = customGrammar.createSemantics().addOperation("ast", {
  Program(block) { return new ast.Program(block.ast()); },
  Block(statements) { return new ast.Block(statements.ast()); },
  Statement_declarative(statement, _1){
    return statement.ast()
  },
  Statement_if(_1, _2, ifExpression, _3, _4, _ifBlock, _5, _6, _7, _8, elseIfExpression, _9, _10, elseIfBlocks, _11, _12, _13, elseBlock, _14 ) {
    return new ast.StatementIfElse(ifExpression.ast(), _ifBlock.ast(), elseIfExpression.ast(),
      elseIfBlocks.ast(), elseBlock.ast());
  },
  // Array(){
  // 
  // }
  Loop_while(_1, _2, exp, _3, _4, block, _5) {
    return new ast.WhileLoop(exp.ast(), block.ast())
  },
  Loop_for(_1, _2, declaration, _3, expression, _4, _assignment, _5, _6, block, _7) {
    return new ast.ForLoop(declaration.ast(), expression.ast(), block.ast())
  },
  FunctionCall(id, _1, args, _2){
    return new ast.FunctionCall(id.ast(), args.ast())
  },
  Declaration_arrayAndSet(type, assignment) {
    return new ast.Declaration(type.ast(), assignment.ast())
  },
  Declaration_dictionary(_1, type1, _2, type2, _3, assignment) {
    return new ast.Declaration(type1.ast(), type2.ast(), assignment.ast())
  },
  Assignment_assign(id, _1, exp) {
    return new ast.Assignment(id.sourceString, exp.ast())
  },
  // Assignment_increment(id, _1){
  //   return new ast.Assignment(id, )
  //     id = id + 1
  // },
  // Assignment_decrement(id, _1){

  // },
  FunctionDeclaration(type, id, _1, params, _2, _3, block, _4) {
    return new ast.FunctionDeclaration(type.sourceString, id.ast(), params.ast(), block.ast())
  },
  // Param(type, id){
  //   return new ast.Parameter(type, id)
  // },
  Exp_binary(Exp, relop, BinExp){
    return new ast.BinaryExpression(relop.sourceString, Exp.ast(), BinExp.ast())
  },
  Exp_ternary(BinExp, _1, BinExp2, _2, BinExp3){
    return new ast.ExpressionTernary(BinExp.ast(), BinExp2.ast(), BinExp3.ast())
  },
  BinExp_binary(BinExp, binop, AddExp){
    return new ast.BinaryExpression(binop.sourceString, BinExp.ast(), AddExp.ast())
  },
  AddExp_binary(AddExp, addop, MullExp){
    return new ast.BinaryExpression(addop.sourceString, AddExp.ast(), MullExp.ast())
  },
  MullExp_binary(MullExp, mullop, PrefixExp){
    return new ast.BinaryExpression(mullop.sourceString, MullExp.ast(), PrefixExp.ast())
  },
  PrefixExp_binary(unaryOp, ExpoExp){
    return new ast.UnaryExpression(unaryOp.sourceString, ExpoExp.ast())
  },
  ExpoExp_binary(parenexp, op, expoexp) {
    return new ast.BinaryExpression(op.sourceString, parenexp.ast(), expoexp.ast());
  },
  ParenExp_parens(_1, expression, _2){
    return new expression.ast()
  },
  Print(_1, _2, exp, _3){
    return new ast.PrintStatement(exp.ast())
  },
  Return(_1, ParenExp){
    return ParenExp.ast()
  },
  id(_first, _rest) {
    return new ast.IdentifierExpression(this.sourceString)
  },

  numlit(_whole, _point, _fraction) {
    return Number(this.sourceString)
  },
  stringlit(_1, chars ,_2){
    return new Literal(this.sourceString.slice(1,-1))
  },
  NonemptyListOf(first, _, rest) {
    return [first.ast(), ...rest.ast()];
  },
  EmptyListOf() {
    return [];
  },
})

export default function isLegal(sourceCode) {
  const match = customGrammar.match(sourceCode)
  return match.succeeded()
}

// export default function parse(sourceCode) {
//   const match = customGrammar.match(sourceCode)
//   if (!match.succeeded()) {
//     throw new Error(match.message)
//   }
//   return astBuilder(match).ast()
// }
