# Assignment 1
Andrew Seaman, Booker Martin, Ian Green, Veronica Backer-Peral

## 1.
https://github.com/Booker-M/ael-ohm

## 2.
### a.
The grammar rule for `"and"` and `"or"` makes it impossible to check for `"or"` in Ohm. Ohm will first encounter `Exp1` in the code and then start checking for the left-most rule that begins with `Exp1`. Ohm will always check for `("and" Exp1)*` following `Exp1` and never check for an `("or" Exp1)*`. Due to this issue, `"and"` takes absolute precedence (because `"or"` does not function).

If the intention is for them to have equal precedence then it should be:
```Exp = Exp1 (("or" | "and") Exp1)*```

### b.
The expression `X and Y or Z` is not possible. The tree would parse into `Exp1 ("and" Exp1)*`. So, an expression start with `Exp1 "and" Exp1` could continue being followed by infinitely more `"and" Exp1`, but it will never be able to include an `"or"`. Ignoring the issue discussed in part a. and supposing `Exp1 ("and" Exp1)*` and `Exp1 ("or" Exp1)*` had equal precedence, an expression that began with `X or Y` would then only be able to be followed by more `"or" Exp1`. Again, changing the rule to `Exp = Exp1 (("or" | "and") Exp1)*` would allow `and` and `or` to be combined in the same expression.

### c.
IS IT NON-ASSOCIATIVE SINCE Exp1 only parses into Exp2 and Exp2 only parses into Exp??????
The additive and relational operators are both **non-associative**. Exp2 does not have Exp2 on the right side of the equation nor does Exp3 have Exp3 on the right side of the equation.

OR IS IT "I CAN'T TELL" since it uses (relop Exp2)? and (addop Exp3)*??????
The associativity of the additive operator "cannot be told" because it uses the syntax `Exp3 (addop Exp3)*`.

### d.
The `not` operator is not right associative because it is located in rule `Exp4` but forms the expression `"not" Exp5`. Ohm parses into `Exp5` which must lead into something else, such as identifiers and numbers, instead of allowing more `"not" Exp5` to recurse on the right. Thus, the `not` operator is non-associative.

### e.
The negation operator, `-`, was given lower precedence than the multiplication operator so that the entire product is negated. The language designer made a choice for the multiplication to take place first. If the language includes parenthesis, placing the negation operator and a number within parenthesis, such as `(-X) * Y`, could be used to prioritize negating one of the factors. 

### f.

### g.

## 3.
NOT WORKING AND NOT FINISHED
```
Problem3 {
  Program   = Function Exp
  Function = "func" name "(" (param ("," param)*)? ")" Body //SHOULD THE LAST PARAM REQUIRE A "," AFTER?
  Body = Exp (";" Exp)* "end" //SHOULD THE LAST EXP REQUIRE A ";" AFTER?
  
  Exp = Exp1
  Exp1 = Exp2 "if" Exp2 "else" Exp2 --conditional
  			| Exp2
  Exp2 = Exp2 ("+" | "-") Exp3            --additive
            | Exp3
  Exp3 = Exp3 ("*"| "/") Exp4          --multiplicative
            | Exp4
  Exp4 = "-"? Exp5
  Exp5 = Exp6 "!"?
  Exp6 = Factor
  			| "(" Exp ")" --parens
  Factor = id
            | num
            | str
            | Call
            
  Call = id "[" (Exp ("," Exp)*)? "]" //SHOULD THE LAST EXP REQUIRE A "," AFTER? HOW MANY EXP MINIMUM?

  name = id
  param = id
  num       = digit+ ("." digit+)? //Numeric literals are non-empty sequences of decimal digits with an optional fractional part and an optional exponent part.
  str       = //String literals delimited with double quotes with the escape sequences \', \", \n, \\, and \u{hhhhhh} where xxxxxx is a sequence of one-to-six hexadecimal digits.
  let       = "let" ~alnum
  print     = "print" ~alnum
  abs       = "abs" ~alnum
  sqrt      = "sqrt" ~alnum
  keyword   = let | print | abs | sqrt
  id        = ~keyword letter alnum* //Identifiers are non-empty sequences of letters, decimal digits, underscores, at-signs, and dollar signs, beginning with a letter or at-sign, that are not also reserved words.
  space    += "--" (any)* end  --comment
}
```

## 4.