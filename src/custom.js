#! /usr/bin/env node

import fs from "fs/promises";
import process from "process";
import compile from "./compiler.js";
import fsNonPromise from "fs";

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
