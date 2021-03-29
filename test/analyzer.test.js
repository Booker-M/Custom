import assert from "assert";
import parse from "../src/parser.js";
import analyze from "../src/analyzer.js";
import * as ast from "../src/ast.js";
import fs from "fs";

const languageConfig = JSON.parse(
  fs.readFileSync("./config/customConfig.json", "utf8")
);
const semanticChecks = [
  ["String Declaration", `${languageConfig.string} x = "Hello World!"`],
  ["Boolean Declaration", `${languageConfig.bool} y = ${languageConfig.true};`],
  ["Int Declaration", `${languageConfig.int} i = 0;`],
  ["Float Declaration", `${languageConfig.float} z = 1.234`],
  [
    "Array Declaration of Floats",
    `${languageConfig.float}[] probabilities=[0.1,0.4,0.5];`,
  ],
  [
    "Nested Arrays Declaration",
    `${languageConfig.string}[][] nestedArray = [["hey","there"],["this","is"],["super","hard"]];`,
  ],
  [
    "Nested Nested Arrays Declaration",
    // `${languageConfig.float}[][][] nestedArray = [[[1],[2]],[[3],[4]],[[5],[6]]];`,
    `${languageConfig.float}[][][] nestedArray = [[[1.0],[2.0]],[[3.0],[4.0]],[[5.0],[6.0]]];`,
  ],
  [
    "Set Declaration",
    `${languageConfig.string}{} cheese = {"brie", "cheddar", "gouda"}`,
  ],
  [
    "Nested Sets Declaration",
    `${languageConfig.bool}{}{} nestedSet = {{${languageConfig.true}, ${languageConfig.false}}, {${languageConfig.false}, ${languageConfig.false}}}`,
  ],
  [
    "Dict Declaration",
    `<${languageConfig.int}, ${languageConfig.string}> cheeses = {1: "brie", 2: "cheddar", 3: "gouda"}`,
  ],
  [
    "Nested Dicts Declaration",
    `<${languageConfig.int}, <${languageConfig.int}, ${languageConfig.string}>> cheeses = {1: {1: "brie"}, 2: {1: "cheddar"}, 3: {3: "gouda"}}`,
  ],
  [
    "Nested Data Structures Declaration",
    `<${languageConfig.int}[]{}, <${languageConfig.float}[]{}, ${languageConfig.string}{}[]>> cheeses = {{[1]}: {{[1.0]}: [{"One"}]}, {[2]}: {{[2.0]}: [{"Two"}]}, {[3]}: {{[3.0]}: [{"Three"}]}}`,
  ],
  [
    "${languageConfig.if} ${languageConfig.else}",
    `${languageConfig.int} main (${languageConfig.int} argc, ${languageConfig.string}[]  argv) {
    ${languageConfig.print}("hello");
    ${languageConfig.int} x = 0;
    ${languageConfig.int} y = 1;
    ${languageConfig.if}(x < y) {
        ${languageConfig.print}('please work')
    }
    ${languageConfig.else} {
        ${languageConfig.print}('cry')
    }
    ${languageConfig.return} 1;
  }`,
  ],
  [
    "English Breeds",
    `${languageConfig.string}[] breeds = ["cat", "armadillo", "dog", "snake"]
  ${languageConfig.string}[] names = ["Leslie", "Ben","Andy","April"]
  ${languageConfig.for} (${languageConfig.int} i=0; i < ${languageConfig.length}(breeds); i++) {
    ${languageConfig.print} (names[i] + " is a " + breeds[i] + "!");
  }`,
  ],
];

const semanticErrors = [
  ["String to Integer Declaration", `${languageConfig.int} x = "Hello World!"`],
  [
    "Forgetting Curly Braces when Declaring Dict",
    `${languageConfig.string} cheese = {"brie", "cheddar", "gouda"}`,
  ],
];

const graphChecks = [];

describe("The analyzer", () => {
  for (const [scenario, source] of semanticChecks) {
    it(`recognizes ${scenario}`, () => {
      assert.ok(analyze(parse(source)));
    });
  }
  for (const [scenario, source, errorMessagePattern] of semanticErrors) {
    it(`throws on ${scenario}`, () => {
      assert.throws(() => analyze(parse(source)), errorMessagePattern);
    });
  }
  for (const [scenario, source, graph] of graphChecks) {
    it(`properly rewrites the AST for ${scenario}`, () => {
      assert.deepStrictEqual(analyze(parse(source)), new ast.Program(graph));
    });
  }
});
