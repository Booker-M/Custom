import assert from "assert"
import util from "util"
import isLegal from "../parser/parser.js"
import fs from 'fs'

const languageConfig = JSON.parse(fs.readFileSync('./config/customConfig.json', 'utf8'))

const correctExamples = {
  "English Example" : 
  `${languageConfig.string} breeds = ["cat", "armadillo", "dog", "snake"]
  ${languageConfig.string} names = ["Leslie", "Ben","Andy","April"]
  
  ${languageConfig.for} (${languageConfig.int} i=0; i < breeds.size; i++) {
    ${languageConfig.print} (names[i] + " is a " + breeds[i] + "!");
  }`,

  "${languageConfig.if} ${languageConfig.else}" : 
`${languageConfig.int} main(${languageConfig.int} argc, ${languageConfig.char}  argv){
  ${languageConfig.print}("hello");
  ${languageConfig.if}(x < y) {
      ${languageConfig.print}('please work')
  }
  ${languageConfig.else} {
      ${languageConfig.print}('cry')
  }
  ${languageConfig.return} 1;
}`,

"Operators" : 
`x = -1 - 3 * 2 % 3 ^ 10;`,

"Ternary Operator" : 
`${languageConfig.float} x = (x == y) ? 0 : 1;`,

"${languageConfig.for} Loop" : 
`${languageConfig.for} (${languageConfig.int} i = 0; i < 10; i++) { ${languageConfig.print}(i); }`,

"Declaration" : 
`${languageConfig.int} x = [1,2,3]`,

"id can start with a keyword as long as more characters follow" : 
`${languageConfig.bool} x = ${languageConfig.if}fy`,

"Array indexing" : 
`${languageConfig.string} x = Dogs[i]`,

"Object properties" : 
`${languageConfig.string} y = Person.name`,
}

const incorrectExamples = {
  "id CANNOT be a keyword" : 
  `let x = ${languageConfig.if}`,
}

describe("Checking parsing on correct code", () => {
  for (const [example, code] of Object.entries(correctExamples)) {
    it(`${example}:\n\n${code}\n`, done => {
      assert.ok(isLegal(code))
      done()
    })
  }
})

describe("Checking parsing on incorrect code", () => {
  for (const [example, code] of Object.entries(incorrectExamples)) {
    it(`${example}:\n\n${code}\n`, done => {
      assert.rejects(isLegal(code))
      done()
    })
  }
})

// const expectedAst = 
// const errorFixture = []

// describe("The parser", () => {
//   it("can parse all the nodes", done => {
//     assert.deepStrictEqual(util.format(parse(source)), expectedAst)
//     done()
//   })
//   for (const [scenario, source, errorMessagePattern] of errorFixture) {
//     it(`throws on ${scenario}`, done => {
//       assert.throws(() => parse(source), errorMessagePattern)
//       done()
//     })
//   }
// })
