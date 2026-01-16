#!/usr/bin/env node

import fs from "fs";
import path from "path";
import process from "process";

import { Lexer, Parser, Interpreter } from "@kora-lang/core";

function main() {
  const args = process.argv.slice(2);

  if (args.length < 2 || args[0] !== "run") {
    printUsage();
    process.exit(1);
  }

  const filePath = path.resolve(process.cwd(), args[1]);

  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    process.exit(1);
  }

  const source = fs.readFileSync(filePath, "utf-8");

  try {
    const lexer = new Lexer(source);
    const tokens = lexer.scanTokens();

    const parser = new Parser(tokens);
    const program = parser.parse();

    const interpreter = new Interpreter();
    interpreter.run(program);
  } catch (err: any) {
    console.error("Error:");
    console.error(err.message ?? err);
    process.exit(1);
  }
}

function printUsage() {
  console.log(`
Kora CLI

Usage:
  kora run <file.kora>
`);
}

main();