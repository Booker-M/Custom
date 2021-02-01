// Parser
//
// Exports a single function called parse which accepts the source code
// as a string and returns the AST.

import ohm from "ohm-js"
import * as ast from "./ast.js"

const customGrammar = ohm.grammar(String.raw`Custom {
  Program       =  Block
  Block         =  Statement+
  Statement          =  (FuncCall | Decl | Assignment | FuncDec | Exp | Print  | Return) (";")? --declarative
                |  "if" "(" Exp ")" "{" Block "}"
                   ("else if" Exp Block)*
                   ("else" Block)?                             -- if

  Decl          =  Type Assignment                -- decl
  Assignment = id "=" Exp

  FuncDec       =  Type id Params "{" Block* "}"

  Type          =  "string" | "int" | "bool" | "char" | "float" 
  						| "<" Type "," Type ">" 					--tuple

  FuncCall      =  id "(" Args ")"
  Args          =  (BinExp ("," BinExp)*)?

  Params        =  "(" (Param ("," Param)*)* ")"
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
                |  charlit
                | id

  keyword       =  ("if" | "else"  | "bool" | "int" | "string"
                |  "double" | "float" | "long" | "array" | "return" | "print")

  prefixop      =  ~"--" "not" | "!" | "-"                    -- prefix
  
  id            =  ~keyword letter (alnum)*
  Tuple        =  "(" BinExp "," BinExp ")"
  Array          =  "[" (BinExp ("," BinExp)*)? "]"               -- array
  Print         =  "print" "(" Exp ")"                      -- print
  Return        =  "return" ParenExp
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
  						| "\'" (char | "\"")* "\'"

  space        := " " | "\t" | "\n" | comment
  comment       =  "//" (~"\n" any)* --singleline
  						| "/*" (~("*/") any )* "*/"		--multiline
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
