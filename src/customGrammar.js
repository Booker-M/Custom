
import fs from 'fs'

const languageConfig = JSON.parse(fs.readFileSync('./src/customLangConfig.json', 'utf8'))


const Custom = `
Custom {
    Program       =  Block*
    Block         =  Statement+
    Statement     =  (Loop | FunctionCall | Declaration | Assignment | FunctionDeclaration | Print  | Return) (";")?  --declarative
                  | "${languageConfig.se}" "(" Exp ")" "{" Block "}"
                    ("${languageConfig.alia}" "${languageConfig.se}" "(" Exp ")" "{" Block "}" )*
                    ("${languageConfig.alia}" "{" Block "}")?                     -- if
    
    Loop 			    = "${languageConfig.dum}" "(" Exp ")" "{" Block* "}" --while
                  | "${languageConfig.por}" "(" Declaration ";" Exp ";" Assignment  ")" "{" Block* "}"  --for
    FunctionCall  =  id "(" Args ")"
    Declaration   =  type Assignment
    Assignment    = id "=" Exp						                      -- assign
                  | id "++"							                        -- increment
                  | id "--"								                      -- decrement
    FunctionDeclaration =  type id "(" ListOf<Param, ","> ")" "{" Block* "}"
  
    Args          =  ListOf<BinExp, ",">
    Param         =  type id 
  
    Exp           =  Exp relop BinExp                           -- binary
                  |  BinExp "?" BinExp ":" BinExp               -- ternary
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
    ParenExp      =  "(" Exp ")"                                -- parens
                  |  Array
                  |  bool
                  |  numlit
                  |  stringlit
                  | id
    
    Print         =  "${languageConfig.pres}" "(" Exp ")"
    Return        =  "${languageConfig.reveno}" ParenExp
    Array          =  "[" (BinExp ("," BinExp)*)? "]"
  
    type          =  "${languageConfig.snuro}" | "${languageConfig.karaktero}" | "${languageConfig.boolea}" | "${languageConfig.integralo}" | "${languageConfig.flos}"
    keyword       =  (type | bool | "${languageConfig.se}" | "${languageConfig.alia}" | "${languageConfig.reveno}" | "${languageConfig.pres}") ~alnum
    id            =  ~keyword letter (alnum)*
    prefixop      =  "!" | "-"
    relop         =  ">" | ">=" | "==" | "!=" | "<" | "<="
    addop         =  "+" | "-" 
    mullop        =  "*" | "/" | "%"
    expop         =  "^"
    binop         =  "||" | "&&"
    bool          = "${languageConfig.vera}" | "${languageConfig.falsa}"
    numlit        =  digit+ ("." digit+)?
    stringlit     =  "\"" (char | "\'")* "\""
                  | "\'" (char | "\"")* "\'"
    char          =  escape
                  |  ~"\\" ~"\"" ~"\'" ~"\\n" any
    escape        = "\\\\" | "\\\"" | "\\'" | "\\n" | "\\t"
                  |  "\\u{" hexDigit+ "}"                       -- codepoint
    space         := " " | "\t" | "\n" | comment
    comment       =  "//" (~"\n" any)*                          --singleline
                  | "/*" (~("*/") any )* "*/"                   --multiline
}`

export default Custom