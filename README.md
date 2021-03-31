![](https://github.com/Booker-M/Custom/blob/main/logo/Custom.png?raw=true)  
# <div align="center">[{Custom}](https://booker-m.github.io/Custom/)</div>  
### <div align="center">Andrew Seaman, Booker Martin, Ian Green, Veronica Backer-Peral</div>

## Introduction
After the tragic loss of the Custom Hotel, we wanted to dedicate our customizable language to the fallen Westchester landmark. Much like the Custom Hotel, we want our language to appeal to everyone in the community and foster an environment where people can come together to share their unique version of the language. To make this possible, Custom features keywards that you define in a customizable JSON. Each person's version of Custom is truly their own. When you see "CUSTOM," you know you are home.

## Features
-Statically-typed, object-oriented programming language  
-Every keyword can be *customized* in the `./custom/customConfig.json` file  
-Data structures such as arrays, sets, and dictionaries  
-Setting a keyword to "Juno" causes a compile error ("Hotel Juno" is the inferior successor to "Custom Hotel")  

### Default Types and Keywords
**Types:**  
`"string", "bool", "int", "float"`  
**Keywords:**  
`"if", "else", "return", "print", "for", "while", "in", "true", "false"`  
Change them to whatever you desire!  

### Variable Declaration and Assignment
| JavaScript | Default | Custom |
| --- | --- | --- |
| `let x = 1` | `int x = 1` | `decimalBegone x = 1` |

### Function Declaration
<table>
<tr><td>JavaScript</td><td>Custom</td></tr>
<tr><td>

```
function getFirstValue(keyValues) {
    return keyValues["first"]
}
```
</td><td>

```
int getFirstValue(string keyValues) {
    return(keyValues["first"])
}
```
</td></tr>
</table>

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

### Data Structures
**Array:**  
`float[] probabilities = [0.1, 0.4, 0.5]`  
`int[][] nestedArrays = [[1,2], [3,4], [5,6]]`  
Arrays are fixed-length.  
  
**Set:**  
`string{} cheese = {"brie", "cheddar", "mozzarella", "gouda"}`  
`bool{}{} nestedSets = {{true,false}, {false,true}, {true}}`  

**Dictionary:**  
`<string, int> playersAndScores = {"Anthony" : 1, "Steve" : -1, "Gerry" : 3}`  
`<string, <string, string>> nestedDicts = {"outer key" : {"inner key" : "inner value"}}`  
`<string[]{}, <string[], string>> dicts = {{["this"], ["can"]} : {["get", "pretty"] : "confusing"}}`  
Sets and dictionaries are dynamic-length.  

### Loops
**For Loop:**  
<table>
<tr><td>JavaScript</td><td>Custom</td></tr>
<tr><td>

```
for (let i = 0; i < 10; i++) {
    console.log(i)
}
```
</td><td>

```
for (int i = 0; i < 10; i++) {
    print(i);
}
```
</td></tr>
</table>

**While Loop:**  
<table>
<tr><td>JavaScript</td><td>Custom</td></tr>
<tr><td>

```
let i = 0;
while (i < 10) {
    console.log(i)
    i++
}
```
</td><td>

```
int i = 0;
while (i < 10) {
    print(i);
    i++;
}
```
</td></tr>
</table>

### Comments
```
//this can say whatever you want!
```
```
/* this can
also say
whatever
you want! */
```

## Example Keyword Configuration
```
{
    "if": "maybe",
    "else": "yolo",
    "for": "fosho",
    "while": "whileWhileWhile",
    "in": "within",
    "print": "gimme",
    "return": "sendIt",
    "length": "whatsDaSize",
    "true": "facts",
    "false": "nawMan",
    "string": "letterz",
    "int": "decimalBegone",
    "float": "floatYoBoat",
    "bool": "boolin",
    "void": "darkness"
}
```

## Example Program
### Original JavaScript program:
```
let breeds = ["cat", "armadillo", "dog", "snake"]
let names = ["Leslie", "Ben","Andy","April"]

for (let i=0; i < breeds.length; i++) {
    console.log (names[i] + " is a " + breeds[i] + "!")
}
```
### Custom program customized for English speakers:
```
string[] breeds = ["cat", "armadillo", "dog", "snake"]
string[] names = ["Leslie", "Ben","Andy","April"]

for (int i=0; i < breeds.size; i++) {
    print (names[i] + " is a " + breeds[i] + "!");
}
```
### Custom program customized for Spanish speakers:
```
cuerda[] razas = ["gata", "armadillo", "perro", "serpiente"]
cuerda[] nombres = ["Leslie", "Ben","Andy,"April"]

por (ent i=0; i < razas.tamaño; i++) {
    imprime (nombres[i] + " es un/una " + razas[i] + "!");
}
```
### Custom program customized for French speakers:
```
chaine[] races = ["chat", "tatou", "chien", "serpent"]
chaine[] noms = ["Leslie", "Ben","Andy,"April"]

pour (ent i=0; i < races.dimension; i++) {
    imprimez (noms[i] + " cette un/une " + races[i] + "!");
}
```
