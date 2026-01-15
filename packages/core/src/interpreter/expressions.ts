import { Expression } from "../ast/nodes"
import {
  LiteralExpression,
  IdentifierExpression,
  UnaryExpression,
  BinaryExpression,
  CallExpression,
  AssignmentExpression
} from "../ast/expressions";

import { Environment } from "./environment";

import { executeBlock } from "./statements";
import { ReturnSignal } from "./control";

import {
  RuntimeValue,
  INT,
  FLOAT,
  STRING,
  BOOL,
  NULL,
  FunctionValue,
} from "./values";

export function evaluate(expr: Expression, env: Environment): RuntimeValue {
  switch (expr.kind) {
    case "LiteralExpression":
      return evaluateLiteral(expr);

    case "IdentifierExpression":
      return evaluateIdentifier(expr, env);

    case "UnaryExpression":
      return evaluateUnary(expr, env);

    case "BinaryExpression":
      return evaluateBinary(expr, env);

    case "CallExpression":
      return evaluateCall(expr, env);

    case "AssignmentExpression":
      return evaluateAssignment(expr as AssignmentExpression, env);
    
      default:
      throw new Error(`Unknown expression type: ${(expr as any).kind}`);
  }
}

function evaluateLiteral(expr: LiteralExpression): RuntimeValue {
  const value = expr.value;

  if (typeof value === "number") {
    return Number.isInteger(value) ? INT(value) : FLOAT(value);
  }

  if (typeof value === "string") {
    return STRING(value);
  }

  if (typeof value === "boolean") {
    return BOOL(value);
  }

  return NULL;
}

function evaluateIdentifier(
  expr: IdentifierExpression,
  env: Environment
): RuntimeValue {
  return env.lookup(expr.name);
}

function evaluateUnary(
  expr: UnaryExpression,
  env: Environment
): RuntimeValue {
  const right = evaluate(expr.operand, env);

  switch (expr.operator) {
    case "-":
      if (right.type === "int" || right.type === "float") {
        return right.type === "int"
          ? INT(-right.value)
          : FLOAT(-right.value);
      }
      break;

    case "not":
      if (right.type === "bool") {
        return BOOL(!right.value);
      }
      break;
  }

  throw new Error(`Invalid unary operation '${expr.operator}'`);
}

function evaluateBinary(
  expr: BinaryExpression,
  env: Environment
): RuntimeValue {
  const left = evaluate(expr.left, env);
  const right = evaluate(expr.right, env);

  switch (expr.operator) {
    case "+": {
      if (left.type === "int" && right.type === "int") {
        return INT(left.value + right.value);
      }

      if (
        (left.type === "int" || left.type === "float") &&
        (right.type === "int" || right.type === "float")
      ) {
        return FLOAT(left.value + right.value);
      }

      if (left.type === "string" || right.type === "string") {
        const l =
          left.type === "string" ? left.value : String(getNumericValue(left));
        const r =
          right.type === "string" ? right.value : String(getNumericValue(right));
        return STRING(l + r);
      }

      break;
    }

    case "-":
    case "*":
    case "/": {
      if (
        (left.type === "int" || left.type === "float") &&
        (right.type === "int" || right.type === "float")
      ) {
        const l = left.value;
        const r = right.value;

        switch (expr.operator) {
          case "-":
            return FLOAT(l - r);
          case "*":
            return FLOAT(l * r);
          case "/":
            return FLOAT(l / r);
        }
      }
      break;
    }

    case ">":
    case ">=":
    case "<":
    case "<=": {
      if (
        (left.type === "int" || left.type === "float") &&
        (right.type === "int" || right.type === "float")
      ) {
        switch (expr.operator) {
          case ">":
            return BOOL(left.value > right.value);
          case ">=":
            return BOOL(left.value >= right.value);
          case "<":
            return BOOL(left.value < right.value);
          case "<=":
            return BOOL(left.value <= right.value);
        }
      }
      break;
    }

    case "==":
      return BOOL(isEqual(left, right));

    case "!=":
      return BOOL(!isEqual(left, right));

    case "and":
      return BOOL(isTruthy(left) && isTruthy(right));

    case "or":
      return BOOL(isTruthy(left) || isTruthy(right));
  }

  throw new Error(`Invalid binary operation '${expr.operator}'`);
}

function getNumericValue(value: RuntimeValue): number {
  if (value.type === "int" || value.type === "float") {
    return value.value;
  }
  throw new Error("Expected numeric value");
}


function evaluateCall(
  expr: CallExpression,
  env: Environment
): RuntimeValue {
  const callee = env.lookup(expr.callee);

  if (callee.type !== "function") {
    throw new Error(`'${expr.callee}' is not a function`);
  }

  const args = expr.arguments.map(arg => evaluate(arg, env));
  if (args.length !== callee.parameters.length) {
    throw new Error(
      `Expected ${callee.parameters.length} arguments but got ${args.length}`
    );
  }

  const fnEnv = new Environment(callee.closure);

  for (let i = 0; i < callee.parameters.length; i++) {
    const param = callee.parameters[i];
    fnEnv.define(param.name, args[i]);
  }

  try {
    executeBlock(callee.body.statements, fnEnv);
  } catch (signal) {
    if (signal instanceof ReturnSignal) {
      return signal.value;
    }
    throw signal;
  }

  return NULL;
}

function evaluateAssignment(
  expr: AssignmentExpression,
  env: Environment
): RuntimeValue {
  const value = evaluate(expr.value, env);
  env.assign(expr.name, value);
  return value;
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

function isEqual(a: RuntimeValue, b: RuntimeValue): boolean {
  if (a.type !== b.type) return false;
  if ("value" in a && "value" in b) {
    return a.value === b.value;
  }
  return true;
}
