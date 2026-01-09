import { Expression, Statement } from "./nodes";

export interface BlockStatement extends Statement {
  kind: "BlockStatement";
  statements: Statement[];
}

export interface VariableDeclaration extends Statement {
  kind: "VariableDeclaration";
  typeName: string;
  name: string;
  initializer: Expression;
}

export interface ExpressionStatement extends Statement {
  kind: "ExpressionStatement";
  expression: Expression;
}

export interface IfStatement extends Statement {
  kind: "IfStatement";
  condition: Expression;
  thenBranch: BlockStatement;
  elseBranch?: BlockStatement;
}

export interface WhileStatement extends Statement {
  kind: "WhileStatement";
  condition: Expression;
  body: BlockStatement;
}

export interface StopStatement extends Statement {
  kind: "StopStatement";
}

export interface FunctionDeclaration extends Statement {
  kind: "FunctionDeclaration";
  name: string;
  parameters: {
    typeName: string;
    name: string;
  }[];
  body: BlockStatement;
}

export interface ReturnStatement extends Statement {
  kind: "ReturnStatement";
  value?: Expression;
}