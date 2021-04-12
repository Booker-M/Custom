#! /usr/bin/env node

import fs from "fs/promises";
import fsNonPromise from "fs";
import util from "util";
import process from "process";
import { Program } from "./ast.js";
import parse from "./parser.js";
import analyze from "./analyzer.js";
// import optimize from "./optimizer.js";
import generate from "./generator.js";

const languageConfig = JSON.parse(
  fsNonPromise.readFileSync("./config/customConfig.json", "utf8")
);

const help = `Custom compiler

Syntax: src/custom.js <filename> <outputType>

Prints to stdout according to <outputType>, which must be one of:

  ast        the abstract syntax tree
  analyzed   the semantically analyzed representation
  optimized  the optimized semantically analyzed representation
  js         the translation to JavaScript
  c          the translation to C
  llvm       the translation to LLVM
  string     the string with any string literals replaced with your custom config values
`;

function compile(source, outputType) {
  outputType = outputType.toLowerCase();
  if (outputType == "string") {
    return source;
  } else if (outputType === "ast") {
    return parse(source);
  } else if (outputType === "analyzed") {
    return analyze(parse(source));
    // } else if (outputType === "optimized") {
    //   return optimize(analyze(parse(source)));
  } else if (outputType === "js") {
    return generate(optimize(analyze(parse(source))));
  } else {
    return "Unknown output type";
  }
}

async function compileFromFile(filename, outputType) {
  try {
    const buffer = await fs.readFile(filename);
    console.log(compile(eval("`" + buffer.toString() + "`"), outputType));
  } catch (e) {
    console.error(`${e}`);
    process.exitCode = 1;
  }
}

if (process.argv.length !== 4) {
  console.log(help);
} else {
  compileFromFile(process.argv[2], process.argv[3]);
}
