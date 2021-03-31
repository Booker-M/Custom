import assert from "assert";
import parse from "../src/parser.js";
import analyze from "../src/analyzer.js";
import * as ast from "../src/ast.js";
import fs from "fs";

const languageConfig = JSON.parse(
  fs.readFileSync("./config/customConfig.json", "utf8")
);

//To implement:
//${languageConfig.string} index = dictionary[1]

const semanticChecks = [
  [
    "Array indexing",
    `
      ${languageConfig.float}[] array = [9.0, 3.0, 7.0]
      ${languageConfig.float} value = array[1]
    `,
  ],
  [
    "Dictionary indexing",
    `
    <${languageConfig.int},${languageConfig.string}> dictionary = {1: "one", 2: "two", 3: "three"}
    `,
  ],
  [
    "Return Statement",
    `
    ${languageConfig.int} sevenPlease() {
      ${languageConfig.int} seven = 7;
      ${languageConfig.return} (seven);
    }
    `,
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
