import assert from "assert/strict"
import parse from "../src/parser.js"
import analyze from "../src/analyzer.js"
import generate from "../src/generator.js"
import fs from "fs";


const languageConfig = JSON.parse(
  fs.readFileSync("./config/customConfig.json", "utf8")
);

function dedent(s) {
  return `${s}`.replace(/(?<=\n)\s+/g, "").trim()
}

const fixtures = [
  {
    name: "definitions",
    source: `
    ${languageConfig.int} i = 11;
    ${languageConfig.float} j = 33.3;
    ${languageConfig.string} k = "Custom is awesome";
    ${languageConfig.bool} l = ${languageConfig.false};
    ${languageConfig.int} m = 11 ^ 5;
    ${languageConfig.int} o = ((((3 + 3) * 5) / 6) % 2);

    `,
    expected: dedent`
      let i = 11;
      let j = 33.3;
      let k = "Custom is awesome";
      let l = false;
      let m = (11 ** 5);
      let o = ((((3 + 3) * 5) / 6) % 2);
    `,
  },

]

describe("The code generator", () => {
  for (const fixture of fixtures) {
    it(`produces expected js output for the ${fixture.name} program`, () => {
      const actual = generate((analyze(parse(fixture.source))))
      assert.deepEqual(actual, fixture.expected)
    })
  }
})
