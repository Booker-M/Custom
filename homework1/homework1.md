Andrew Seaman, Booker Martin, Ian Green, Veronica Backer-Peral

2.
a. The grammar rule for `"and"` and `"or"` makes it impossible to check for `"or"`. OHM will see an `Exp1` and start checking for the left-most term that begins with `Exp1`. Thus, it will always check for the `("and" Exp1)*` following the first `Exp1` and never check for an `"or"`. If the intention is for them to have equal precedence then it should be:
```Exp = Exp1 (("or" | "and") Exp1)*```

b. This is not possible. The tree would parse into `Exp1 ("and" Exp1)*`. So, the initial `Exp1` could continue having infinitely more `"and" Exp1` but it will never be able to include an `"or"` because it no longer looks for an `Exp`.

c. Can't tell?