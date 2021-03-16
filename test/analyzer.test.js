import assert from "assert";
import parse from "../src/parser.js";
import analyze from "../src/analyzer.js";
import * as ast from "../src/ast.js";
import fs from "fs";

const languageConfig = JSON.parse(
  fs.readFileSync("./config/customConfig.json", "utf8")
);
const semanticChecks = [
  ["Sample test", `${languageConfig.string} x = "helloworld"`],
  // ["variable declarations", `${languageConfig.string} x = "hello world";\n${languageConfig.bool} y = ${languageConfig.true};\n ${languageConfig.int} i = 0;\n${languageConfig.float} z = 1.234`],
  ["arrays", `${languageConfig.float}[] probabilities=[0.1,0.4,0.5];`],
  // ["nested arrays", `${languageConfig.int}[][] nestedArry = [[1,2],[3,4],[5,6]];`],
  // ["sets", `${languageConfig.string} cheese = {"brie", "cheddar", "gouda"}`],
  // ["nested sets", `${languageConfig.bool} nestedSet = {{${languageConfig.true}, ${languageConfig.false}}, {${languageConfig.false}, ${languageConfig.false}}}`],
];

const semanticErrors = [];

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
