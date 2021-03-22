import { Type, FunctionType, Variable, Function, ArrayType } from "./ast.js";
import fs from "fs";

const languageConfig = JSON.parse(
  fs.readFileSync("./config/customConfig.json", "utf8")
);

function makeConstant(name, type, value) {
  return Object.assign(new Variable(name, true), { type, value });
}

function makeFunction(name, type) {
  return Object.assign(new Function(name), { type });
}

const floatsType = new ArrayType(Type.FLOAT);
const floatFloatType = new FunctionType([Type.FLOAT], Type.FLOAT);
const floatFloatFloatType = new FunctionType(
  [Type.FLOAT, Type.FLOAT],
  Type.FLOAT
);
const stringToIntsType = new FunctionType([Type.STRING], floatsType);

export const types = {
  int: Type.INT,
  float: Type.FLOAT,
  boolean: Type.BOOLEAN,
  string: Type.STRING,
  void: Type.VOID,
};

export const constants = {
  // true: makeConstant("true", Type.BOOLEAN, true),
};

const functions = {};
functions[languageConfig.print] = makeFunction(
  `${languageConfig.print}`,
  new FunctionType([Type.STRING], Type.VOID)
);
functions[languageConfig.length] = makeFunction(
  `${languageConfig.length}`,
  new FunctionType([new ArrayType(Type.ANY)], Type.INT)
);

export { functions };
