import assert from "assert";
import util from "util";
import parse from "../src/parser.js";
import fs from "fs";

const languageConfig = JSON.parse(
  fs.readFileSync("./config/customConfig.json", "utf8")
);

const correctExamples = {
  "English Breeds": `${languageConfig.string}[] breeds = ["cat", "armadillo", "dog", "snake"]
  ${languageConfig.string}[] names = ["Leslie", "Ben","Andy","April"]
  ${languageConfig.for} (${languageConfig.int} i=0; i < ${languageConfig.length}(breeds); i++) {
    ${languageConfig.print} (names[i] + " is a " + breeds[i] + "!");
  }`,

  "${languageConfig.if} ${languageConfig.else}": `${languageConfig.int} main (${languageConfig.int} argc, ${languageConfig.string}[]  argv) {
  ${languageConfig.print}("hello");
  ${languageConfig.if}(x < y) {
      ${languageConfig.print}('please work')
  }
  ${languageConfig.else} {
      ${languageConfig.print}('cry')
  }
  ${languageConfig.return} 1;
}`,

  "id can start with a keyword as long as more characters follow": `${languageConfig.bool} x = ${languageConfig.if}fy`,

  Operators: `x = -1 - 3 * 2 % 3 ^ 10;`,

  "Ternary Operator": `${languageConfig.float} x = (x == y) ? 0 : 1;`,

  "Binary Operators": `return(${languageConfig.true} || ${languageConfig.false} && (x == 1))`,

  "${languageConfig.for} Loop": `${languageConfig.for} (${languageConfig.int} i = 0; i < 10; i++) { ${languageConfig.print}(i); }`,

  "${languageConfig.while} Loop": `${languageConfig.int} i = 0; ${languageConfig.while} (i < 10) { i++; ${languageConfig.print}(i); }`,

  "Array Declaration": `${languageConfig.float}[] probabilities = []; probabilities = [0.1, 0.4, 0.5]`,

  "Nested Arrays": `${languageConfig.int}[][] arrays = [[1,2], [3,4], [5,6]]`,

  "Set Declaration": `${languageConfig.string}{} cheese = {"brie", "cheddar", "mozzarella", "gouda"}`,

  "Nested Sets": `${languageConfig.int}{}{} sets = {{1,2}, {3,4}, {5,6}}`,

  "Dict Declaration": `<${languageConfig.string}, ${languageConfig.int}> playersAndScores = {"Anthony" : 1, "Steve" : -1, "Gerry" : 3}`,

  "Nested Dicts": `<${languageConfig.string}, <${languageConfig.string}, ${languageConfig.string}>> dicts = {"outer key" : {"inner key" : "inner value"}}`,

  "Nested Data Structures": `<${languageConfig.string}[]{}, <${languageConfig.string}[], ${languageConfig.string}>> dicts = {{["outer"], ["key"]} : {["inner", "key"] : "inner value"}}`,

  "Array indexing": `${languageConfig.string} x = Dogs[i]`,

  "List Comprehension": `<${languageConfig.bool}, ${languageConfig.int}> newDict = { a:b*b ${languageConfig.for} a,b ${languageConfig.in} oldDict ${languageConfig.if} a == ${languageConfig.true}}`,

  "Function Call": `test(a, b, c, (x == 1), "done")`,

  "Nested Function Call": `f(g(x))`,

  "Assignment Increment/Decrement": `x++; x--;`,

  Comments: `//this can say whatever you want!
  /* this can
  also say
  whatever
  you want! */`,

  "Function Declaration": `${languageConfig.int} getFirstValue(<${languageConfig.string}, ${languageConfig.int}> keyValues) {
    return(keyValues["first"])
  }`,

  ListComprehension: `${languageConfig.int} y = [x%y ${languageConfig.for} x ${languageConfig.in} z ${languageConfig.for} y ${languageConfig.in} z ${languageConfig.if} x*y == 7];`,
};

const incorrectExamples = {
  "id CANNOT be a keyword": `let x = ${languageConfig.if}`,
};

const ASTtest = `${languageConfig.int} main (${languageConfig.int} argc, ${languageConfig.string}  argv) {
  ${languageConfig.print}("hello");
  ${languageConfig.if}(x < y) {
      ${languageConfig.print}('please work')
  }
  ${languageConfig.else} {
      ${languageConfig.print}('cry')
  }
  ${languageConfig.return} 1;
}`;

const ASTexpected = `   1 | program: Program
   2 |   statements[0]: FunctionDeclaration id='main'
   3 |     type: TypeId name='decimalBegone'
   4 |     params[0]: Parameter id='argc'
   5 |       type: TypeId name='decimalBegone'
   6 |     params[1]: Parameter id='argv'
   7 |       type: TypeId name='letterz'
   8 |     block: Block
   9 |       statements[0]: FunctionCall
  10 |         id: IdentifierExpression name='gimme'
  11 |         args[0]: Literal value='hello'
  12 |       statements[1]: StatementIfElse
  13 |         test: BinaryExpression op='<'
  14 |           left: IdentifierExpression name='x'
  15 |           right: IdentifierExpression name='y'
  16 |         consequence: Block
  17 |           statements[0]: FunctionCall
  18 |             id: IdentifierExpression name='gimme'
  19 |             args[0]: Literal value='please work'
  20 |         alternate[0]: Block
  21 |           statements[0]: FunctionCall
  22 |             id: IdentifierExpression name='gimme'
  23 |             args[0]: Literal value='cry'
  24 |       statements[2]: ReturnStatement
  25 |         expression[0]: BigInt`

describe("Checking parsing on correct code\n", () => {
  for (const [example, code] of Object.entries(correctExamples)) {
    it(example, done => {
      assert.ok(util.format(parse(code)));
      done();
    });
  }
  assert.deepStrictEqual(util.format(parse(ASTtest)), ASTexpected);
});

describe("Checking parsing on incorrect code\n", () => {
  for (const [example, code] of Object.entries(incorrectExamples)) {
    it(example, done => {
      assert.throws(() => parse(code), Error);
      done();
    });
  }
});
