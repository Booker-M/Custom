
import fs from 'fs'

const languageConfig = JSON.parse(fs.readFileSync('./config/customConfig.json', 'utf8'))


const Custom = `
Custom {
    Program       =  Block*
    Block         =  Statement+
    Statement     =  (Loop | FunctionCall | Declaration | Assignment | FunctionDeclaration | Print  | Return) (";")?  --declarative
                  | "${languageConfig.if}" "(" Exp ")" "{" Block "}"
                    ("${languageConfig.else}" "${languageConfig.if}" "(" Exp ")" "{" Block "}" )*
                    ("${languageConfig.else}" "{" Block "}")?   -- if
    
    Loop 			    = "${languageConfig.while}" "(" Exp ")" "{" Block* "}" --while
                  | "${languageConfig.for}" "(" Declaration ";" Exp ";" Assignment  ")" "{" Block* "}"  --for
    FunctionCall  =  id "(" Args ")"
    Declaration   =  type Assignment                            --arrayAndSet
                  | "<" type "," type ">" Assignment            --dictionary
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
                  |  Set
                  |  Dict
                  |  Index
                  |  Property
                  |  bool
                  |  numlit
                  |  stringlit
                  |  id
    
    Print         =  "${languageConfig.print}" "(" Exp ")"
    Return        =  "${languageConfig.return}" ParenExp
    Array         =  "[" (BinExp ("," BinExp)*)? "]"
    Set           =  "{" (BinExp ("," BinExp)*)? "}"
    Dict          =  "{" (BinExp ":" BinExp ("," BinExp ":" BinExp)*)? "}"
    Index         =  id "[" (id | numlit) "]"
    Property      =  id ~space "." ~space id
  
    type          =  "${languageConfig.string}" | "${languageConfig.char}" | "${languageConfig.bool}" | "${languageConfig.int}" | "${languageConfig.float}"
    keyword       =  (type | bool | "${languageConfig.if}" | "${languageConfig.else}" | "${languageConfig.return}" | "${languageConfig.print} | ${languageConfig.for} | ${languageConfig.while}") ~alnum
    id            =  ~keyword letter (alnum)*
    prefixop      =  "!" | "-"
    relop         =  ">" | ">=" | "==" | "!=" | "<" | "<="
    addop         =  "+" | "-" 
    mullop        =  "*" | "/" | "%"
    expop         =  "^"
    binop         =  "||" | "&&"
    bool          = "${languageConfig.true}" | "${languageConfig.false}"
    numlit        =  digit+ ("." digit+)?
    stringlit     =  "\\"" (char | "\\'")* "\\""
                  | "\\'" (char | "\\"")* "\\'"
    char          =  escape
                  |  ~"\\\\" ~"\\"" ~"\\'" ~"\\\\n" any
    escape        = "\\\\\\\\" | "\\\\\\"" | "\\\\'" | "\\\\n" | "\\\\t"
                  |  "\\\\u{" hexDigit+ "}"                     -- codepoint
    space         := " " | "\\t" | "\\n" | comment
    comment       =  "//" (~"\\n" any)*                         --singleline
                  | "/*" (~("*/") any )* "*/"                   --multiline
}`

export default Custom