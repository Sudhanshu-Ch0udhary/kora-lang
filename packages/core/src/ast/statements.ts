import { Expression, Statement, StatementBase } from "./nodes";

export interface BlockStatement extends StatementBase {
  kind: "BlockStatement";
  statements: Statement[];
}

export interface VariableDeclaration extends StatementBase {
  kind: "VariableDeclaration";
  typeName: string;
  name: string;
  initializer: Expression;
}

export interface ExpressionStatement extends StatementBase {
  kind: "ExpressionStatement";
  expression: Expression;
}

export interface IfStatement extends StatementBase {
  kind: "IfStatement";
  condition: Expression;
  thenBranch: BlockStatement;
  elseBranch?: BlockStatement;
}

export interface WhileStatement extends StatementBase {
  kind: "WhileStatement";
  condition: Expression;
  body: BlockStatement;
}

export interface StopStatement extends StatementBase {
  kind: "StopStatement";
}

export interface FunctionDeclaration extends StatementBase {
  kind: "FunctionDeclaration";
  name: string;
  parameters: {
    typeName: string;
    name: string;
  }[];
  body: BlockStatement;
}

export interface ReturnStatement extends StatementBase {
  kind: "ReturnStatement";
  value?: Expression;
}