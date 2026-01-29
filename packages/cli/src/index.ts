#!/usr/bin/env node

import fs from "fs";
import path from "path";
import process from "process";
import readline from "readline";

import { Lexer, Parser, Interpreter } from "@sudhanshu_choudhary/kora-core";

function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    startRepl();
    return;
  }

  if (args[0] === "run" && args[1]) {
    runFile(args[1]);
    return;
  }

  printUsage();
}

function runFile(file: string) {
  const filePath = path.resolve(process.cwd(), file);

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
    console.error(err.message ?? err);
  }
}


function startRepl() {
  console.log("Kora REPL v0.1");
  console.log("Press Ctrl+C to exit\n");

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "> ",
  });

  const interpreter = new Interpreter();

  rl.prompt();

  rl.on("line", (line) => {
    try {
      const lexer = new Lexer(line);
      const tokens = lexer.scanTokens();

      const parser = new Parser(tokens);
      const program = parser.parse();

      interpreter.run(program);
    } catch (err: any) {
      console.error(err.message ?? err);
    }

    rl.prompt();
  });

  rl.on("close", () => {
    console.log("\nBye!");
    process.exit(0);
  });
}

function printUsage() {
  console.log(`
Kora CLI

Usage:
  kora run <file.kora>
  kora        (start REPL)
`);
}

main();
