import assert from "assert/strict";
import parse from "../src/parser.js";
import analyze from "../src/analyzer.js";
// import optimize from "../src/optimizer.js";
import generate from "../src/generator.js";
import fs from "fs";

const languageConfig = JSON.parse(
  fs.readFileSync("./config/customConfig.json", "utf8")
);

function dedent(s) {
  return `${s}`.replace(/(?<=\n)\s+/g, "").trim();
}

const fixtures = [
  {
    name: "englishBreeds",
    source: `
    ${languageConfig.string}[] breeds = ["cat", "armadillo", "dog", "snake"]
    ${languageConfig.string}[] names = ["Leslie", "Ben","Andy","April"]
    ${languageConfig.for} (${languageConfig.int} i=0; i < ${languageConfig.length}(breeds); i++) {
      ${languageConfig.print} (names[i] + " is a " + breeds[i] + "!");
    }
    `,
    expected: dedent`
    let breeds = ["cat","armadillo","dog","snake"];
    let names = ["Leslie","Ben","Andy","April"];
    for (let i = 0; (i < breeds.length); i++) {
    console.log((((names[i] + " is a ") + breeds[i]) + "!"));
    }
    `,
  },
  {
    name: "${languageConfig.if} ${languageConfig.else}",
    source: `
    ${languageConfig.if}(1 < 2) {
        ${languageConfig.print}('please work')
    }
    ${languageConfig.else} {
        ${languageConfig.print}('cry')
    }
    `,
    expected: dedent`
      if ((1 < 2)) {
      console.log("please work");
      } else {
      console.log("cry");
      }
    `,
  },
  {
    name:
      "${languageConfig.if} ${languageConfig.else} ${languageConfig.if} ${languageConfig.else}",
    source: `
    ${languageConfig.int} main (${languageConfig.int} x, ${languageConfig.int}  y) {
      ${languageConfig.string} str = "hello";
      ${languageConfig.print}(str);
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
    `,
    expected: dedent`
    function main(x, y) {
      let str = "hello";
      console.log(str);
      if ((x < y)) {
      console.log("please work");
      } else if ((x > y)) {
      console.log("cry");
      } else {
      console.log("cry more");
      }
      return 1;
      }
    `,
  },
  {
    name: "structs",
    source: `
    ${languageConfig.float}[] probabilities=[0.1,0.4,0.5];
    ${languageConfig.float} item=probabilities[0];
    item=-probabilities[1];
    item++;
    ${languageConfig.float}[] nothing=[];
    ${languageConfig.string}[][] nestedArray = [["hey","there"],["this","is"],["super","hard"]];
    ${languageConfig.string}{} cheese = {"brie", "cheddar", "gouda"};
    ${languageConfig.bool}{}{} nestedSet = {{${languageConfig.true}, ${languageConfig.false}}, {${languageConfig.false}, ${languageConfig.true}}};
    ${languageConfig.float}{} moreNothing={};
    <${languageConfig.int}, ${languageConfig.string}> cheeses = {1: "brie", 2: "cheddar", 3: "gouda"};
    ${languageConfig.print}(cheeses[1]);
    <${languageConfig.int}, <${languageConfig.int}, ${languageConfig.string}>> moreCheeses = {1: {1: "brie"}, 2: {1: "cheddar"}, 3: {3: "gouda"}};
    <${languageConfig.int}, ${languageConfig.string}> noCheeses = {};
    <${languageConfig.int}[]{}, <${languageConfig.float}[]{}, ${languageConfig.string}{}[]>> evenMoreCheeses = {{[1]}: {{[1.0]}: [{"One"}]}, {[2]}: {{[2.0]}: [{"Two"}]}, {[3]}: {{[3.0]}: [{"Three"}]}};
    `,
    expected: dedent`
    let probabilities = [0.1,0.4,0.5];
    let item = probabilities[0];
    item = -(probabilities[1]);
    item++;
    let nothing = [];
    let nestedArray = [["hey","there"],["this","is"],["super","hard"]];
    let cheese = ["brie","cheddar","gouda"];
    let nestedSet = [[true,false],[false,true]];
    let moreNothing = [];
    let cheeses = {1: "brie",2: "cheddar",3: "gouda"};
    console.log(cheeses[1]);
    let moreCheeses = {1: {1: "brie"},2: {1: "cheddar"},3: {3: "gouda"}};
    let noCheeses = [];
    let evenMoreCheeses = {[[1]]: {[[1]]: [["One"]]},[[2]]: {[[2]]: [["Two"]]},[[3]]: {[[3]]: [["Three"]]}};
    `,
  },
  {
    name: "Ternary",
    source: `
    ${languageConfig.print}((${languageConfig.true} ? "true" : "false"));
    `,
    expected: dedent`
    console.log(((true) ? ("true") : ("false")));
    `,
  },
  {
    name: "While Loop w/ Break",
    source: `
    ${languageConfig.int} i = 0;
    ${languageConfig.while} (i < 10) {
        i++;
        break;
      }
      i--;
    `,
    expected: dedent`
    let i = 0;
    while ((i < 10)) {
      i++;
      break;
    }
    i--;
    `,
  },
  {
    name: "Function Declaration and Execution",
    source: `
    ${languageConfig.int} add(${languageConfig.int} a, ${languageConfig.int} b) {
      ${languageConfig.return} (a + b);
    }
    add(1, 2);
    `,
    expected: dedent`
    function add(a, b) {
      return (a + b);
    }
    add(1, 2);
    `,
  },
];

describe("The code generator", () => {
  for (const fixture of fixtures) {
    it(`produces expected js output for the ${fixture.name} program`, () => {
      // const actual = generate(optimize(analyze(parse(fixture.source))));
      const actual = generate(analyze(parse(fixture.source)));
      assert.deepEqual(actual, fixture.expected);
    });
  }
});
