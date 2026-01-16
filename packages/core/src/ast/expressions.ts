import { Expression, ExpressionBase } from "./nodes.js";

export interface LiteralExpression extends ExpressionBase {
  kind: "LiteralExpression";
  value: number | string | boolean | null;
}

export interface IdentifierExpression extends ExpressionBase {
  kind: "IdentifierExpression";
  name: string;
}

export interface BinaryExpression extends ExpressionBase {
  kind: "BinaryExpression";
  operator: string;
  left: Expression;
  right: Expression;
}

export interface UnaryExpression extends ExpressionBase {
  kind: "UnaryExpression";
  operator: string;
  operand: Expression;
}

export interface CallExpression extends ExpressionBase {
  kind: "CallExpression";
  callee: string;
  arguments: Expression[];
}

export interface AssignmentExpression extends ExpressionBase {
  kind: "AssignmentExpression";
  name: string;
  value: Expression;
}
