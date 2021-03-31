import fs from "fs";

const languageConfig = JSON.parse(
  fs.readFileSync("./config/customConfig.json", "utf8")
);

const Custom = `
Custom {
    Program       =  Statement*
    Block         =  "{" Statement+ "}"
    Statement     =  (Loop | FunctionDeclaration | Return | FunctionCall | Declaration | Assignment | IfStatement | Break) (";")?
    IfStatement   =  "${languageConfig.if}" "(" Exp ")" Block ("${languageConfig.else}" (IfStatement | Block))?

    Loop 			    =  "${languageConfig.while}" "(" Exp ")" Block -- while
                  |  "${languageConfig.for}" "(" Declaration ";" Exp ";" Assignment ")" Block  -- for
    FunctionDeclaration =  (type | void) id "(" Params ")" Block
    FunctionCall  =  id "(" Args ")"
    Declaration   =  type Assignment
    Assignment    =  id "=" Exp						                       -- assign
                  |  id "++"							                       -- increment
                  |  id "--"								                     -- decrement
    Break         =  "break" ~alnum

    Args          =  ListOf<BinExp, ",">
    Params        =  ListOf<Param, ",">
    Param         =  type id

    Exp           =  Exp relop BinExp                            -- binary
                  |  BinExp "?" BinExp ":" BinExp                -- ternary
                  |  BinExp
    BinExp        =  BinExp binop AddExp                         -- binary
                  |  AddExp
    AddExp        =  AddExp addop MullExp                        -- binary
                  |  MullExp
    MullExp       =  MullExp mullop PrefixExp                    -- binary
                  |  PrefixExp
    PrefixExp     =  prefixop ExpoExp                            -- binary
                  |  ExpoExp
    ExpoExp       =  ParenExp expop ExpoExp                      -- binary
                  |  ParenExp
    ParenExp      =  "(" Exp ")"                                 -- parens
                  |  ListComp | Array | Set | Dict | Index | FunctionCall | bool | floatlit | intlit | stringlit | id

    Return        =  "${languageConfig.return}" ParenExp?
    Array         =  "[" ListOf<BinExp, ","> "]"
    Set           =  "{" ListOf<BinExp, ","> "}"
    Dict          =  "{" ListOf<KeyValue, ","> "}"
    Index         =  id "[" (id | intlit | stringlit) "]"
    KeyValue      =  BinExp ":" BinExp
    ListComp      =  ("[" | "{") Exp (":" Exp)? ("${languageConfig.for}" id ("," id)? "${languageConfig.in}" id)+ ("${languageConfig.if}" Exp)* ("]" | "}")

    type          =  "<" space? type space? "," space? type space? ">"  -- dict
                  |  type "[]"                                   -- array
                  |  type "{}"                                   -- set
                  |  typeid
    typeid        =  "${languageConfig.string}" | "${languageConfig.bool}" | "${languageConfig.int}" | "${languageConfig.float}"
    void          =  "${languageConfig.void}"
    keyword       =  (type | bool | "${languageConfig.if}" | "${languageConfig.else}" | "${languageConfig.return}" | "${languageConfig.for}" | "${languageConfig.while}" | "${languageConfig.in}" | "${languageConfig.void}") ~alnum
    id            =  ~keyword letter (alnum)*
    prefixop      =  "!" | "-"
    relop         =  ">" | ">=" | "==" | "!=" | "<" | "<="
    addop         =  "+" | "-"
    mullop        =  "*" | "/" | "%"
    expop         =  "^"
    binop         =  "||" | "&&"
    bool          =  true | false
    true          =  "${languageConfig.true}" ~alnum
    false         =  "${languageConfig.false}" ~alnum
    intlit        =  digit+
    floatlit      =  digit+ "." digit+
    stringlit     =  "\\"" (char | "\\'")* "\\""
                  |  "\\'" (char | "\\"")* "\\'"
    char          =  escape
                  |  ~"\\\\" ~"\\"" ~"\\'" ~"\\\\n" any
    escape        =  "\\\\\\\\" | "\\\\\\"" | "\\\\'" | "\\\\n" | "\\\\t"
                  |  "\\\\u{" hexDigit+ "}"                      -- codepoint
    space         := " " | "\\t" | "\\n" | comment
    comment       =  "//" (~"\\n" any)*                          -- singleline
                  |  "/*" (~("*/") any )* "*/"                   -- multiline
}`;

export default Custom;
