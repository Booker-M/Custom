// Parser
//
// Exports a single function called parse which accepts the source code
// as a string and returns the AST.

import ohm from "ohm-js"
import * as ast from "./ast.js"
import { Literal } from "./ast.js";

const customGrammar = ohm.grammar(String.raw`Custom {
  Program       =  Block
  Block         =  Statement+
  Statement          =  (Loop | FunctionCall | Declaration | Assignment | FunctionDeclaration | Exp | Print  | Return) (";")? --declarative
                |  "if" "(" Exp ")" "{" Block "}"
                   ("else" "if" "(" Exp ")" "{" Block "}" )*
                   ("else" "{" Block "}")?                             -- if

  Declaration          =  Type Assignment                -- declaration
  Assignment = id "=" Exp						-- assign
  						| id "++"							-- increment
                        | id "--"								-- decrement
  Loop 			= "while" "(" Exp ")" "{" Block* "}" --while
						| "for" "(" Declaration ";" Exp ";" Assignment  ")" "{" Block* "}" --for

  FunctionDeclaration       =  Type id "(" ListOf<Param, ","> ")" "{" Block* "}"

  Type          =  "string" | "int" | "bool" | "char" | "float" 

  FunctionCall      =  id "(" Args ")"
  Args          =  ListOf<BinExp, ",">

  Param         =  Type id 


  Exp           =  Exp relop BinExp                         -- binary
                |  BinExp "?" BinExp ":" BinExp         -- ternary
                |  BinExp
  BinExp        =  BinExp binop AddExp                        -- binary
                |  AddExp
  AddExp        =  AddExp addop MullExp                       -- binary
                |  MullExp
  MullExp       =  MullExp mullop PrefixExp                   -- binary
                |  PrefixExp
  PrefixExp     =  prefixop ExpoExp                           -- binary
                |  ExpoExp
  ExpoExp       =  ParenExp expop ExpoExp                     -- binary
                |  ParenExp
  ParenExp      =  "(" Exp ")"                             -- parens
                |  numlit
                |  Tuple
                |  Array
                |  stringlit
                | id

  keyword       =  ("if" | "else"  | "bool" | "int" | "string"
                |  "double" | "float" | "long" | "array" | "return" | "print")

  prefixop      =  "!" | "-"                    -- unary
  
  id            =  ~keyword letter (alnum)*
  Tuple        =  "(" BinExp "," BinExp ")"
  Array          =  "[" (BinExp ("," BinExp)*)? "]"               -- array
  Print         =  "print" "(" Exp ")"                      -- print
  Return        =  "return" ParenExp
  relop         =  ">" | ">=" | "==" | "!=" | "<" | "<="
  addop         =  "+" | "-" 
  mullop        =  "*" | "/" | "%"
  expop         =  "^"
  binop         =  "||" | "or" | "&&" | "and"
  numlit        =  digit+ ("." digit+)?
  char          =  escape
                |  ~"\\" ~"\"" ~"\'" ~"\\n" any

  escape        = "\\\\" | "\\\"" | "\\'" | "\\n" | "\\t"
                |  "\\u{" hexDigit+ "}"                       -- codepoint
  stringlit     =  "\"" (char | "\'")* "\""
  						| "\'" (char | "\"")* "\'"

  space        := " " | "\t" | "\n" | comment
  comment       =  "//" (~"\n" any)* --singleline
  						| "/*" (~("*/") any )* "*/"		--multiline
}`)

const astBuilder = customGrammar.createSemantics().addOperation("ast", {
  Program(block) { return new ast.Program(block.ast()); },
  Block(statements) { return new ast.Block(statements.ast()); },
  Statement_if(_1, _2, ifExpression, _3, _4, _ifBlock, _5, _6, _7, _8, elseIfExpression, _9, _10, elseIfBlocks, _11, _12, _13, elseBlock, _14 ) {
    return new ast.StatementIfElse(ifExpression.ast(), _ifBlock.ast(), elseIfExpression.ast(),
      elseIfBlocks.ast(), elseBlock.ast());
  },
  Statement_declarative(statement, _1){
    return statement.ast()
  },
  Declaration_declaration(type, assignment) {
    return new ast.Declaration(type.ast(), assignment.ast())
  },
  Assignment_assign(id, _1, exp) {
    return new ast.Assignment(id.sourceString, exp.ast())
  },
  // Array(?){
  // ?????
  // }
  // Assignment_increment(id, _1){
  //   return new ast.Assignment(id, )
  //     id = id + 1
  // },
  // Assignment_decrement(id, _1){

  // },
  Loop_while(_1, _2, exp, _3, _4, block, _5) {
    return new ast.WhileLoop(exp.ast(), block.ast())
  },
  Loop_for(_1, _2, declaration, _3, expression, _4, _assignment, _5, _6, block, _7) {
    return new ast.ForLoop(declaration.ast(), expression.ast(), block.ast())
  },
  FunctionDeclaration(type, id, _1, params, _2, _3, block, _4) {
    return new ast.FunctionDeclaration(type.sourceString, id.ast(), params.ast(), block.ast())
  },
  FunctionCall(id, _1, args, _2){
    return new ast.FunctionCall(id.ast(), args.ast())
  },
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
    return new ast.BinaryExpression(op.sourceString, parenexp.tree(), expoexp.tree());
  },
  ParenExp_parens(_1, expression, _2){
    return new expression.ast()
  },
  numlit(_whole, _point, _fraction) {
    return Number(this.sourceString)
  },
  id(_first, _rest) {
    return new ast.IdentifierExpression(this.sourceString)
  },
  Return(_1, ParenExp){
    return ParenExp.ast()
  },
  stringlit(_1, chars ,_2){
    return new Literal(this.sourceString.slice(1,-1))
  },
  Print_print(_1, _2, exp, _3){
    return new ast.PrintStatement(exp.ast())
  },
  Param(type, id){
    return new ast.Parameter(type, id)
  },
  NonemptyListOf(first, _, rest) {
    return [first.ast(), ...rest.ast()];
  },
  EmptyListOf() {
    return [];
  },

})


export default function parse(sourceCode) {
  const match = customGrammar.match(sourceCode)
  if (!match.succeeded()) {
    throw new Error(match.message)
  }
  return astBuilder(match).ast()
}
