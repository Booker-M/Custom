![](https://github.com/Booker-M/Custom/blob/main/logo/Custom.png?raw=true)  
# <div align="center">{Custom}</div>  
### <div align="center">Andrew Seaman, Booker Martin, Ian Green, Veronica Backer-Peral</div>

## Introduction
After the tragic loss of the Custom Hotel, we wanted to dedicate our customizable language to the fallen Westchester landmark. Much like the Custom Hotel, we want our language to appeal to everyone in the community and foster an environment where people can come together to share their unique version of the language. To make this possible, Custom features keywards that you define in a customizable JSON. Each person's version of Custom is truly their own. When you see "CUSTOM," you know you are home.

## Features
-Statically-typed, object-oriented programming language  
-Every keyword comes from a JSON file that the user can customize  
-Data structures such as arrays  
-Setting a keyword to "Juno" causes a compile error ("Hotel Juno" is the inferior successor to "Custom Hotel")  

### Default Types and Keywords
**Types:** ` "string", "char", "bool", "int", "float"`  
**Keywords:** `"if", "else", "return", "print"`  
Change them to whatever you desire!  

### Variable Declaration and Assignment

| Default | Custom |
| --- | --- |
| `int x = 1` | `decimalBegone x = 1` |

### Operators
In order of lowest to highest precedence:  
| Operator | Example |
| --- | --- |
| ">" \| ">=" \| "==" \| "!=" \| "<" \| "<=" | `return x < y` |
| "\|\|" \| "&&" | `return(true && false)` |
| "+" \| "-" | `int x = 4 + 20` |
|  "\*" \| "/" \| "%" | `float x = 6 % 9` |
| "!" | `return(!true)`|
| "-" | `int x = -1` |
| "^" | `float y = 1^100`|

### Comments
```
`//this can say whatever you want!`
```
```
/* this can
also say
whatever
you want! */
```


## Example Programs
### Program customized for English speakers:
```
pets = {"Leslie":"cat", "Ben":"armadillo","Andy":"dog","April":"snake"}

for pet,breed in pets {
	print (pet + " is a " + breed + "!");
}
```
### Program customized for Spanish speakers:
```
mascotas = {"Leslie":"gata", "Ben":"armadillo","Andy":"perro","April":"serpiente"}

por cada mascota,raza en mascotas {
	imprime (mascota + " es un/una " + raza + "!");
}
```
### Program customized for French speakers:
```
animaux = {"Leslie":"chat", "Ben":"tatou","Andy":"chien","April":"serpent"}

pour animal,race dans animaux {
	imprimez (animal + " cette un/une " + race + "!");
}
```
