// Code Generator Custom -> JavaScript
//
// Invoke generate(program) with the program node to get back the JavaScript
// translation as a string.

import { StatementIfElse, Type, ArrayType, SetType, DictType } from "./ast.js";
import * as stdlib from "./stdlib.js";
import fs from "fs";

const languageConfig = JSON.parse(
  fs.readFileSync("./config/customConfig.json", "utf8")
);

export default function generate(program) {
  const output = [];

  const standardFunctions = new Map([
    [stdlib.functions[languageConfig.print], x => `console.log(${x})`],
    [stdlib.functions[languageConfig.length], x => `${x}.length`],
  ]);

  const gen = (node, { inExpression = false } = {}) => {
    return generators[node.constructor.name](node, inExpression);
  };

  const generators = {
    Program(p) {
      gen(p.statements);
    },
    Block(p) {
      gen(p.statements);
    },
    Declaration(d) {
      // We don't care about const vs. let in the generated code. The analyzer
      // has already checked we never wrote to a const, so let is always fine.
      output.push(`let ${gen(d.variable)} = ${gen(d.assignment.source)};`);
    },
    Index(i) {
      return `${i.collection.name}[${i.index.name ? i.index.name : i.index}]`;
    },
    FunctionDeclaration(d) {
      output.push(`function ${d.id}(${gen(d.params).join(", ")}) {`);
      gen(d.body);
      output.push("}");
    },
    Parameter(p) {
      return `${p.id}`;
    },
    Variable(v) {
      return v.name;
    },
    Increment(s) {
      output.push(`${gen(s.variable)}++;`);
    },
    Decrement(s) {
      output.push(`${gen(s.variable)}--;`);
    },
    Assignment(s) {
      output.push(`${gen(s.target)} = ${gen(s.source)};`);
    },
    BreakStatement(s) {
      output.push("break;");
    },
    ReturnStatement(s) {
      output.push(`return ${gen(s.expression)};`);
    },
    StatementIfElse(s) {
      output.push(`if (${gen(s.test)}) {`);
      gen(s.consequence);
      if (s.alternate[0].constructor === StatementIfElse) {
        const length = output.length;
        gen(s.alternate);
        output[length] = `} else ` + output[length];
      } else {
        output.push("} else {");
        gen(s.alternate);
        output.push("}");
      }
    },
    WhileLoop(s) {
      output.push(`while (${gen(s.test)}) {`);
      gen(s.body);
      output.push("}");
    },
    ForLoop(s) {
      gen(s.declaration);
      output[output.length - 1] =
        `for (` + output[output.length - 1] + ` ${gen(s.test)};`;
      gen(s.assignment);
      const assignment = output[output.length - 1];
      output[output.length - 1] =
        output[output.length - 2] +
        ` ` +
        assignment.substring(0, assignment.length - 1) +
        `) {`;
      output.splice(output.length - 2, 1);
      gen(s.body);
      output.push("}");
    },
    Conditional(e) {
      return `((${gen(e.test)}) ? (${gen(e.consequence)}) : (${gen(
        e.alternate
      )}))`;
    },
    BinaryExpression(e) {
      const op = { "==": "===", "!=": "!==", "^": "**" }[e.op] ?? e.op;
      return `(${gen(e.left, { inExpression: true })} ${op} ${gen(e.right, {
        inExpression: true,
      })})`;
    },
    UnaryExpression(e) {
      return `${e.op}(${gen(e.operand, { inExpression: true })})`;
    },
    CustomArray(e) {
      return `[${gen(e.elements).join(",")}]`;
    },
    CustomSet(e) {
      return `[${gen(e.elements).join(",")}]`;
    },
    CustomDict(e) {
      return `{${gen(e.keyValues).join(",")}}`;
    },
    FunctionCall(c, inExpression) {
      const targetCode = standardFunctions.has(c.id)
        ? standardFunctions.get(c.id)(gen(c.args))
        : `${c.id.name}(${gen(c.args).join(", ")})`;

      if (inExpression) {
        return targetCode;
      } else {
        output.push(`${targetCode};`);
      }
    },
    Number(e) {
      return e;
    },
    BigInt(e) {
      return e;
    },
    Boolean(e) {
      return e;
    },
    Array(a) {
      return a.map(gen);
    },
    Literal(l) {
      return `"${l.value}"`;
    },
    KeyValue(k) {
      return `${gen(k.key)}: ${gen(k.value)}`;
    },
  };

  gen(program);
  return output.join("\n");
}
