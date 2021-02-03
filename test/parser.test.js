import assert from "assert"
import util from "util"
import isLegal from "../src/parser.js"

const examples = [
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
`x = -1 - 3 * 2 % 3 ^ 10;`,
`let x = (x == y) ? 0 : 1;`,
`for (int i = 0; i < 10; i++) { print(i); }`,
`let x = [1,2,3]`,
]

describe("The parser", () => {
  for (const example of examples) {
    it(`Correctly parses:\n\n${example}\n`, done => {
      assert.ok(isLegal(example))
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
