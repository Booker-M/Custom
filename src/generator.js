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
    // [stdlib.functions.sin, x => `Math.sin(${x})`],
    // [stdlib.functions.cos, x => `Math.cos(${x})`],
    // [stdlib.functions.exp, x => `Math.exp(${x})`],
    // [stdlib.functions.ln, x => `Math.log(${x})`],
    // [stdlib.functions.hypot, (x, y) => `Math.hypot(${x},${y})`],
    // [stdlib.functions.bytes, s => `[...Buffer.from(${s}, "utf8")]`],
    // [stdlib.functions.codepoints, s => `[...(${s})].map(s=>s.codePointAt(0))`],
  ]);

  // Variable and function names in JS will be suffixed with _1, _2, _3,
  // etc. This is because "switch", for example, is a legal name in Carlos,
  // but not in JS. So we want to generate something like "switch_1".
  // We handle this by mapping each name to its suffix.
  // const targetName = (mapping => {
  //   return entity => {
  //     if (!mapping.has(entity)) {
  //       mapping.set(entity, mapping.size + 1);
  //     }
  //     return `${entity.name ?? entity.description}_${mapping.get(entity)}`;
  //   };
  // })(new Map());

  // const gen = node => generators[node.constructor.name](node);
  const gen = node => {
    console.log(output);
    console.log(node);
    return generators[node.constructor.name](node);
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
    // ArrayType(t) {
    //   return t.name;
    // },
    // SetType(t) {
    //   return t.name;
    // },
    // DictType(t) {
    //   return t.name;
    // },
    Index(i) {
      return `${i.collection.name}[${i.index.name ? i.index.name : i.index}]`;
    },
    FunctionDeclaration(d) {
      output.push(`function ${d.id}(${gen(d.params).join(", ")}) {`);
      gen(d.block);
      output.push("}");
    },
    Parameter(p) {
      // return targetName(p);
      return `${p.id}`;
    },
    Variable(v) {
      // if (v === stdlib.constants.π) {
      //   return "Math.PI";
      // }
      // return targetName(v);
      return v.name;
    },
    // Function(f) {
    //   return targetName(f);
    // },
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
      const op = { "==": "===", "!=": "!==" }[e.op] ?? e.op;
      return `(${gen(e.left)} ${op} ${gen(e.right)})`;
    },
    UnaryExpression(e) {
      return `${e.op}(${gen(e.operand)})`;
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
    FunctionCall(c) {
      const targetCode = standardFunctions.has(c.id)
        ? standardFunctions.get(c.id)(gen(c.args))
        : `${c.id.name}(${gen(c.args).join(", ")})`;
      if (c.id instanceof Type || c.id.type.returnType !== Type.VOID) {
        return targetCode;
      }
      output.push(`${targetCode};`);
      // return targetCode;
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
    // String(e) {
    //   return JSON.stringify(e);
    // },
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
