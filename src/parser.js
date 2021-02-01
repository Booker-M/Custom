// Parser
//
// Exports a single function called parse which accepts the source code
// as a string and returns the AST.

import ohm from "ohm-js"
import * as ast from "./ast.js"

const customGrammar = ohm.grammar(String.raw`Custom {
  Program       =  Block
  Block         =  "{" Statement+ "}"
  Statement          =  Decl | FuncDec | Exp | Print | FuncCall | Return
                |  "if" Exp Block
                   ("else if" Exp Block)*
                   ("else" Block)?                             -- if

  Decl          =  Type id "=" BinExp                    -- decl

  FuncDec       =  Type id Params "{" Body "}"

  Type          =  "string" | "int" | "bool" | "char" | "float"

  FuncCall      =  id "(" Args ")"
  Arg           =  (id)?
  Args          =  ListOf<Arg, ",">

  Params        =  "(" (Param ("," Param)*)* ")"
  Param         =  id

  Body          =  ":" Block ";;"

  Exp           =  Exp relop MatchExp                         -- binary
                |  MatchExp "?" MatchExp ":" MatchExp         -- ternary
                |  MatchExp
  MatchExp      =  "match" id "with" Matches                  -- matchexp
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
  ParenExp      =  "(" AddExp ")"                             -- parens
                |  numlit
                |  Tuplit
                |  List
                |  stringlit
                |  charlit

  Matches       =  ("|" Exp "->" Exp)+

  keyword       =  ("if" | "else" | "with" | "in" | "bool" | "int" | "string"
                |  "double" | "float" | "long" | "list" | "hump" | "tuplit" | "spit") ~idrest

  prefixop      =  ~"--" "not" | "!" | "-"                    -- prefix

  id            =  ~keyword letter idrest*
  Tuplit        =  "(" BinExp "," BinExp ")"
  List          =  "[" BinExp ("," BinExp)* "]"               -- list
                | "[]"
  Print         =  "spit" "(" BinExp ")"                      -- print
  Return        =  "hump" ParenExp
  idrest        =  "_" | alnum | "@" | "$"
  relop         =  ">" | ">=" | "==" | "!=" | "<" | "<="
  addop         =  "+" | "-" | "::"
  mullop        =  "*" | "/" | "%"
  expop         =  "^"
  binop         =  "||" | "or" | "&&" | "and"
  numlit        =  digit+
  char          =  escape
                |  ~"\\" ~"\"" ~"\'" ~"\\n" any

  escape        = "\\\\" | "\\\"" | "\\'" | "\\n" | "\\t"
                |  "\\u{" hexDigit+ "}"                       -- codepoint
  charlit       =  "'" (char | "\"") "'"
  stringlit     =  "\"" (char | "\'")* "\""

  space        := " " | "\t" | "\n" | "\r" | comment
  comment       =  "##" (~"\n" any)*
}`)

const astBuilder = customGrammar.createSemantics().addOperation("ast", {
  Program(body) {
    return new ast.Program(body.ast())
  },
  Statement_variable(_let, id, _eq, expression) {
    return new ast.Variable(id.sourceString, expression.ast())
  },
  Statement_assign(id, _eq, expression) {
    return new ast.Assignment(
      new ast.IdentifierExpression(id.sourceString),
      expression.ast()
    )
  },
  Statement_print(_print, expression) {
    return new ast.PrintStatement(expression.ast())
  },
  Exp_binary(left, op, right) {
    return new ast.BinaryExpression(op.sourceString, left.ast(), right.ast())
  },
  Term_binary(left, op, right) {
    return new ast.BinaryExpression(op.sourceString, left.ast(), right.ast())
  },
  Factor_unary(op, operand) {
    return new ast.UnaryExpression(op.sourceString, operand.ast())
  },
  Factor_parens(_open, expression, _close) {
    return expression.ast()
  },
  num(_whole, _point, _fraction) {
    return new ast.Literal(Number(this.sourceString))
  },
  id(_first, _rest) {
    return new ast.IdentifierExpression(this.sourceString)
  },
})

export default function parse(sourceCode) {
  const match = customGrammar.match(sourceCode)
  if (!match.succeeded()) {
    throw new Error(match.message)
  }
  return astBuilder(match).ast()
}
