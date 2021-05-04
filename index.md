---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

layout: home
---
![](https://github.com/Booker-M/Custom/blob/main/logo/Custom.png?raw=true)  
### Andrew Seaman, Booker Martin, Ian Green, Veronica Backer-Peral

## Introduction
After the tragic loss of the Custom Hotel, we wanted to dedicate our customizable language to the fallen Westchester landmark. Much like the Custom Hotel, we want our language to appeal to everyone in the community and foster an environment where people can come together to share their unique version of the language. To make this possible, Custom features keywords that you define in a customizable JSON. Each person's version of Custom is truly their own. When you see "CUSTOM," you know you are home.

## Features
-Statically-typed, object-oriented programming language  
-Every keyword can be *customized* in the `./custom/customConfig.json` file  
-Data structures such as arrays, sets, and dictionaries  
-Setting a keyword to "Juno" causes a compile error ("Hotel Juno" is the inferior successor to "Custom Hotel")  

## Grammar
[https://github.com/Booker-M/Custom/blob/main/grammar/customGrammar.js](https://github.com/Booker-M/Custom/blob/main/grammar/customGrammar.js)  

### Default Types and Keywords
**Types:**  
`"string", "int", "float", "bool", "void"`  
**Keywords:**  
`"if", "else", "for", "while", "in", "print", "return", "length", true", "false"`  
Change them to whatever you desire!  

### Variable Declaration and Assignment
<table>
<tr><td>JavaScript</td><td>Default</td><td>Custom</td></tr>
<tr><td><div markdown="1">
`let x = 1`
</div></td><td><div markdown="1">
`int x = 1`
</div></td><td><div markdown="1">
`decimalBegone x = 1`
</div></td></tr>
</table>

### Function Declaration
<table>
<tr><td>JavaScript</td><td>Custom</td></tr>
<tr><td>
<div markdown="1">
```
function getFirstValue(keyValues) {
    return keyValues["first"]
}
```
</div>
</td><td>
<div markdown="1">
```
int getFirstValue(<string, int> keyValues) {
    return(keyValues["first"])
}
```
</div>
</td></tr>
</table>

### Operators
In order of lowest to highest precedence:  
<table>
<tr><td>Operator</td><td>Example</td></tr>
<tr><td><div markdown="1">
`>` `>=` `==` `!=` `<` `<=`
</div></td><td><div markdown="1">
`return x < y`
</div></td></tr>
<tr><td><div markdown="1">
`||` `&&`
</div></td><td><div markdown="1">
`return(true && false)`
</div></td></tr>
<tr><td><div markdown="1">
`+` `-`
</div></td><td><div markdown="1">
`int x = 4 + 20`
</div></td></tr>
<tr><td><div markdown="1">
`*` `/` `%`
</div></td><td><div markdown="1">
`float x = 6 % 9`
</div></td></tr>
<tr><td><div markdown="1">
`!`
</div></td><td><div markdown="1">
`return(!true)`
</div></td></tr>
<tr><td><div markdown="1">
`-`
</div></td><td><div markdown="1">
`int x = -1`
</div></td></tr>
<tr><td><div markdown="1">
`^`
</div></td><td><div markdown="1">
`float y = 1^100`
</div></td></tr>
</table>

### Data Structures
**Array:**  
`float[] probabilities = [0.1, 0.4, 0.5]`  
`int[][] nestedArrays = [[1,2], [3,4], [5,6]]`  
Arrays allow multiples of the same value.  
  
**Set:**  
{% raw %}

`string{} cheese = {"brie", "cheddar", "mozzarella", "gouda"}`  
`bool{}{} nestedSets = {{true,false}, {false,true}, {true}}`  

{% endraw %}

**Dictionary:**  
{% raw %}

`<string, int> playersAndScores = {"Anthony" : 1, "Steve" : -1, "Gerry" : 3}`  
`<string, <string, string>> nestedDicts = {"outer key" : {"inner key" : "inner value"}}`  
`<string[]{}, <string[], string>> dicts = {{["this"], ["can"]} : {["get", "pretty"] : "confusing"}}`  

{% endraw %}
Each value in a set or key in a dictionary must be unique.  

### Loops
**For Loop:**  
<table>
<tr><td>JavaScript</td><td>Custom</td></tr>
<tr><td>
<div markdown="1">
```
for (let i = 0; i < 10; i++) {
    console.log(i)
}
```
</div>
</td><td>
<div markdown="1">
```
for (int i = 0; i < 10; i++) {
    print(i);
}
```
</div>
</td></tr>
</table>

**While Loop:**  
<table>
<tr><td>JavaScript</td><td>Custom</td></tr>
<tr><td>
<div markdown="1">
```
let i = 0;
while (i < 10) {
    console.log(i)
    i++
}
```
</div>
</td><td>
<div markdown="1">
```
int i = 0;
while (i < 10) {
    print(i);
    i++;
}
```
</div>
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
### Our Keywords of Choice
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

### Real Hot Girl Script
```
{
    "if": "iHaveSomethingToSay",
    "else": "BECAUSEIMONFUCKINGVACATION",
    "for": "openHerUp",
    "while": "wylin",
    "in": "thatsSOinRn",
    "break": "GTFO",
    "print": "supLilBitch",
    "return": "andThemsTheFacts",
    "length": "howMuchLonger",
    "true": "trueShit",
    "false": "fraudulentAssBitch",
    "string": "wordz",
    "int": "digitz",
    "float": "longz",
    "bool": "boolz",
    "void": "leftOnRead"
}
```

## Example Programs
### JavaScript "dog breeds" program:
```
let breeds = ["cat", "armadillo", "dog", "snake"]
let names = ["Leslie", "Ben","Andy","April"]

for (let i=0; i < breeds.length; i++) {
    console.log (names[i] + " is a " + breeds[i] + "!")
}
```
### Custom "dog breeds" program for English speakers:
```
string[] breeds = ["cat", "armadillo", "dog", "snake"]
string[] names = ["Leslie", "Ben","Andy","April"]

for (int i=0; i < length(breeds); i++) {
    print (names[i] + " is a " + breeds[i] + "!");
}
```
### Custom "dog breeds" program for Spanish speakers:
```
cuerda[] razas = ["gata", "armadillo", "perro", "serpiente"]
cuerda[] nombres = ["Leslie", "Ben","Andy,"April"]

por (ent i=0; i < tamaño(razas); i++) {
    imprime (nombres[i] + " es un/una " + razas[i] + "!");
}
```
### Custom "dog breeds" program for French speakers:
```
chaine[] races = ["chat", "tatou", "chien", "serpent"]
chaine[] noms = ["Leslie", "Ben","Andy,"April"]

pour (ent i=0; i < dimension(races); i++) {
    imprimez (noms[i] + " cette un/une " + races[i] + "!");
}
```

### JavaScript "fibonacci" program:
```
function fibonacci(n) {
    if ((n < 0)) {
        console.log("Number cannot be negative.");
    } else if ((n === 0)) {
        return 1;
    } else if ((n === 1)) {
        return 1;
    } else {
        return (fibonacci((n - 1)) + fibonacci((n - 2)));
    }
}

fibonacci(3);
```

### Custom "fibonacci" program:
```
${languageConfig.int} fibonacci (${languageConfig.int} n) {
  ${languageConfig.if}(n<0) {
      ${languageConfig.print}('Number cannot be negative.')
  }
  ${languageConfig.else} ${languageConfig.if} (n == 0) {
      ${languageConfig.return}(1)
  }
  ${languageConfig.else} ${languageConfig.if} (n == 1) {
      ${languageConfig.return}(1)
  }
  ${languageConfig.else} {
      ${languageConfig.return}(fibonacci(n-1) + fibonacci(n-2))
  }
}

fibonacci(3)
```

### JavaScript "if, else if, else" program:
```
function main(x, y) {
    if ((x < y)) {
        console.log("please work");
    } else if ((x > y)) {
        console.log("cry");
    } else {
        console.log("cry more");
    }
    return 1;
}
```

### Custom "if, else if, else" program:
```
${languageConfig.int} main (${languageConfig.int} x, ${languageConfig.int}  y) {
  ${languageConfig.if}(x < y) {
    ${languageConfig.print}('please work')
  }
  ${languageConfig.else} ${languageConfig.if}(x > y) {
    ${languageConfig.print}('cry')
  }
  ${languageConfig.else} {
    ${languageConfig.print}('cry more')
  }
    ${languageConfig.return} 1;
}
```