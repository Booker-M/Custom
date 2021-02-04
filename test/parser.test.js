import assert from "assert"
import util from "util"
import isLegal from "../src/parser.js"

const correctExamples = {
  "Main function" : 
`int main(int argc, char  argv){
  print("hello");
  if(x < y) {
      print('please work')
  }
  else {
      print('cry')
  }
  return 1;
}`,
"Operators" : 
`x = -1 - 3 * 2 % 3 ^ 10;`,
"Ternary Operator" : 
`let x = (x == y) ? 0 : 1;`,
"For Loop" : 
`for (int i = 0; i < 10; i++) { print(i); }`,
"Declaration" : 
`let x = [1,2,3]`,
"Id can start with a keyword as long as more characters follow" : 
`let x = iffy`,
}

const incorrectExamples = {
  "Id CANNOT be a keyword" : 
  'let x = if',
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
