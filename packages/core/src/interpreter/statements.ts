import { Statement } from "../ast/nodes";
import {
  ExpressionStatement,
  VariableDeclaration,
  IfStatement,
  WhileStatement,
  StopStatement,
  ReturnStatement,
  FunctionDeclaration,
} from "../ast/statements";

import { Environment } from "./environment";
import { evaluate } from "./expressions";
import {RuntimeValue,NULL,FunctionValue} from "./values";
import { ReturnSignal, StopSignal } from "./control";

export function execute(stmt: Statement, env: Environment): void {
  switch (stmt.kind) {
    case "ExpressionStatement":
      executeExpression(stmt, env);
      return;

    case "VariableDeclaration":
      executeVariableDeclaration(stmt, env);
      return;

    case "IfStatement":
      executeIf(stmt, env);
      return;

    case "WhileStatement":
      executeWhile(stmt, env);
      return;

    case "StopStatement":
      throw new StopSignal();

    case "ReturnStatement":
      executeReturn(stmt, env);
      return;

    case "FunctionDeclaration":
      executeFunctionDeclaration(stmt, env);
      return;

    default:
      throw new Error(`Unknown statement type: ${(stmt as any).kind}`);
  }
}

function executeExpression(
  stmt: ExpressionStatement,
  env: Environment
): void {
  evaluate(stmt.expression, env);
}

function executeVariableDeclaration(
  stmt: VariableDeclaration,
  env: Environment
): void {
  const value: RuntimeValue = stmt.initializer
    ? evaluate(stmt.initializer, env)
    : NULL;

  env.define(stmt.name, value);
}

function executeIf(stmt: IfStatement, env: Environment): void {
  const condition = evaluate(stmt.condition, env);

  if (isTruthy(condition)) {
    executeBlock(stmt.thenBranch.statements, new Environment(env));
  } else if (stmt.elseBranch) {
    executeBlock(stmt.elseBranch.statements, new Environment(env));
  }
}

function executeWhile(stmt: WhileStatement, env: Environment): void {
  try {
    while (isTruthy(evaluate(stmt.condition, env))) {
      try {
        executeBlock(stmt.body.statements, new Environment(env));
      } catch (signal) {
        if (signal instanceof StopSignal) {
          return;
        }
        throw signal;
      }
    }
  } catch (signal) {
    throw signal;
  }
}

function executeReturn(stmt: ReturnStatement, env: Environment): void {
  const value = stmt.value
    ? evaluate(stmt.value, env)
    : NULL;

  throw new ReturnSignal(value);
}

function executeFunctionDeclaration(
  stmt: FunctionDeclaration,
  env: Environment
): void {
  const fn: FunctionValue = {
    type: "function",
    name: stmt.name,
    parameters: stmt.parameters,
    body: stmt.body,
    closure: env,
  };

  env.define(stmt.name, fn);
}

export function executeBlock(
  statements: Statement[],
  env: Environment
): void {
  for (const stmt of statements) {
    execute(stmt, env);
  }
}

function isTruthy(value: RuntimeValue): boolean {
  switch (value.type) {
    case "bool":
      return value.value;
    case "null":
      return false;
    default:
      return true;
  }
}
