import fs from "fs";

const languageConfig = JSON.parse(
  fs.readFileSync("./config/customConfig.json", "utf8")
);

const Custom = `
Custom {
    Program       =  Block*
    Block         =  Statement+
    Statement     =  (Loop | FunctionDeclaration | FunctionCall | Declaration | Assignment | Print | Return) (";")?  --declarative
                  | "${languageConfig.if}" "(" Exp ")" "{" Block "}"
                    ("${languageConfig.else}" "${languageConfig.if}" "(" Exp ")" "{" Block "}" )*
                    ("${languageConfig.else}" "{" Block "}")?   -- if
    
    Loop 			    = "${languageConfig.while}" "(" Exp ")" "{" Block "}" -- while
                  | "${languageConfig.for}" "(" Declaration ";" Exp ";" Assignment  ")" "{" Block "}"  -- for
    FunctionDeclaration =  Type Id "(" Params ")" "{" Block "}"
    FunctionCall  =  Id "(" Args ")"
    Declaration   =  Type Assignment
    Assignment    = Id "=" Exp						                      -- assign
                  | Id "++"							                        -- increment
                  | Id "--"								                      -- decrement
  
    Args          =  ListOf<BinExp, ",">
    Params        =  ListOf<Param, ",">
    Param         =  Type Id
  
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
                  |  Array | Set | Dict | Index | Property | bool | numlit | stringlit | Id
    
    Print         =  "${languageConfig.print}" ParenExp
    Return        =  "${languageConfig.return}" ParenExp
    Array         =  "[" ListOf<BinExp, ","> "]"
    Set           =  "{" ListOf<BinExp, ","> "}"
    Dict          =  "{" ListOf<KeyValue, ","> "}"
    Index         =  Id "[" (Id | numlit | stringlit) "]"
    Property      =  Id ~space "." ~space Id
    KeyValue      =  BinExp ":" BinExp
    Type          =  "<" Type "," Type ">"  -- dict
                  |  "${languageConfig.string}" | "${languageConfig.char}" | "${languageConfig.bool}" | "${languageConfig.int}" | "${languageConfig.float}"
    Keyword       =  (Type | bool | "${languageConfig.if}" | "${languageConfig.else}" | "${languageConfig.return}" | "${languageConfig.print}" | "${languageConfig.for}" | "${languageConfig.while}") ~alnum
    Id            =  ~Keyword letter (alnum)*

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
    comment       =  "//" (~"\\n" any)*                         -- singleline
                  | "/*" (~("*/") any )* "*/"                   -- multiline
}`;

export default Custom;
