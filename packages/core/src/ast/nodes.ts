export type NodeType =
  | "LiteralExpression"
  | "IdentifierExpression"
  | "UnaryExpression"
  | "BinaryExpression"
  | "CallExpression"
  | "ExpressionStatement"
  | "VariableDeclaration"
  | "IfStatement"
  | "WhileStatement"
  | "StopStatement"
  | "ReturnStatement"
  | "FunctionDeclaration"
  | "BlockStatement";

export interface BaseNode {
  type: NodeType;
  line: number;
  column: number;
}

export interface ExpressionBase extends BaseNode {}
export interface StatementBase extends BaseNode {}


export type Expression =
  | import("./expressions").LiteralExpression
  | import("./expressions").IdentifierExpression
  | import("./expressions").UnaryExpression
  | import("./expressions").BinaryExpression
  | import("./expressions").CallExpression;

export type Statement =
  | import("./statements").ExpressionStatement
  | import("./statements").VariableDeclaration
  | import("./statements").IfStatement
  | import("./statements").WhileStatement
  | import("./statements").StopStatement
  | import("./statements").ReturnStatement
  | import("./statements").FunctionDeclaration
  | import("./statements").BlockStatement;
