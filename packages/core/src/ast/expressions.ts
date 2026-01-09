import { Expression } from "./nodes";

export interface LiteralExpression extends Expression {
  kind: "LiteralExpression";
  value: number | string | boolean | null;
}

export interface IdentifierExpression extends Expression {
  kind: "IdentifierExpression";
  name: string;
}

export interface BinaryExpression extends Expression {
  kind: "BinaryExpression";
  operator: string;
  left: Expression;
  right: Expression;
}

export interface UnaryExpression extends Expression {
  kind: "UnaryExpression";
  operator: string;
  operand: Expression;
}

export interface CallExpression extends Expression {
  kind: "CallExpression";
  callee: string;
  arguments: Expression[];
}
