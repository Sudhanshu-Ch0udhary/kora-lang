import { Token, TokenType } from "../lexer/token";
import { ParseError } from "./parseError";

import { Expression } from "../ast/nodes";
import { LiteralExpression,IdentifierExpression,BinaryExpression,UnaryExpression,CallExpression } from "../ast/expressions";

import { Statement } from "../ast/nodes";
import { VariableDeclaration, ExpressionStatement } from "../ast/statements";

import { IfStatement,BlockStatement } from "../ast/statements";

import { WhileStatement } from "../ast/statements";



export class Parser {
  private tokens: Token[];
  private current = 0;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  parse(): Statement[] {
    const statements: Statement[] = [];
    while (!this.isAtEnd()) {
      statements.push(this.statement());
    }
    return statements;
  }
  private parseExpression(): Expression {
    return this.logicalOr();
  }

  private statement(): Statement {
    if (this.match(TokenType.IF)) {
      return this.ifStatement();
    }

    if (this.match(TokenType.WHILE)) {
      return this.whileStatement();
    }

    if (this.match( TokenType.INT,TokenType.FLOAT,TokenType.STRING,TokenType.BOOL)) {
      return this.variableDeclaration(this.previous().lexeme);
    }

    return this.expressionStatement();
  }

  private variableDeclaration(typeName: string): Statement {
    const nameToken = this.consume(TokenType.IDENTIFIER,"Expected variable name after type");
    this.consume(TokenType.EQUAL,"Expected '=' after variable name");
    const initializer = this.parseExpression();
    return {kind: "VariableDeclaration",typeName,name: nameToken.lexeme,initializer,line: nameToken.line,column: nameToken.column} as VariableDeclaration;
  }

  private expressionStatement(): Statement {
    const expr = this.parseExpression();

    return {
      kind: "ExpressionStatement",
      expression: expr,
      line: expr.line,
      column: expr.column
    } as ExpressionStatement;
  }

  private logicalOr(): Expression {
    let expr = this.logicalAnd();
    while (this.match(TokenType.OR)) {
      const operator = this.previous().lexeme;
      const right = this.logicalAnd();

      expr = {
        kind: "BinaryExpression",
        operator,
        left: expr,
        right,
        line: this.previous().line,
        column: this.previous().column
      } as BinaryExpression;
    }

    return expr;
  }

  private logicalAnd(): Expression {
    let expr = this.equality();

    while (this.match(TokenType.AND)) {
      const operator = this.previous().lexeme;
      const right = this.equality();

      expr = {
        kind: "BinaryExpression",
        operator,
        left: expr,
        right,
        line: this.previous().line,
        column: this.previous().column
      } as BinaryExpression;
    }

    return expr;
  }

  private equality(): Expression {
    let expr = this.comparison();

    while (this.match(TokenType.EQUAL_EQUAL, TokenType.BANG_EQUAL)) {
      const operator = this.previous().lexeme;
      const right = this.comparison();

      expr = {
        kind: "BinaryExpression",
        operator,
        left: expr,
        right,
        line: this.previous().line,
        column: this.previous().column
      } as BinaryExpression;
    }

    return expr;
  }

  private comparison(): Expression {
    let expr = this.term();

    while (
      this.match(
        TokenType.GREATER,
        TokenType.GREATER_EQUAL,
        TokenType.LESS,
        TokenType.LESS_EQUAL
      )
    ) {
      const operator = this.previous().lexeme;
      const right = this.term();

      expr = {
        kind: "BinaryExpression",
        operator,
        left: expr,
        right,
        line: this.previous().line,
        column: this.previous().column
      } as BinaryExpression;
    }

    return expr;
  }

  private term(): Expression {
    let expr = this.factor();

    while (this.match(TokenType.PLUS, TokenType.MINUS)) {
      const operator = this.previous().lexeme;
      const right = this.factor();

      expr = {
        kind: "BinaryExpression",
        operator,
        left: expr,
        right,
        line: this.previous().line,
        column: this.previous().column
      } as BinaryExpression;
    }

    return expr;
  }

  private factor(): Expression {
    let expr = this.unary();

    while (this.match(TokenType.STAR, TokenType.SLASH)) {
      const operator = this.previous().lexeme;
      const right = this.unary();

      expr = {
        kind: "BinaryExpression",
        operator,
        left: expr,
        right,
        line: this.previous().line,
        column: this.previous().column
      } as BinaryExpression;
    }

    return expr;
  }

  private unary(): Expression {
    if (this.match(TokenType.NOT, TokenType.MINUS)) {
      const operator = this.previous().lexeme;
      const operand = this.unary();

      return {
        kind: "UnaryExpression",
        operator,
        operand,
        line: this.previous().line,
        column: this.previous().column
      } as UnaryExpression;
    }

    return this.primary();
  }

  private primary(): Expression {
    if (this.match(TokenType.FALSE)) {
      return this.literal(false);
    }

    if (this.match(TokenType.TRUE)) {
      return this.literal(true);
    }

    if (this.match(TokenType.NULL)) {
      return this.literal(null);
    }

    if (this.match(TokenType.INT_LITERAL, TokenType.FLOAT_LITERAL)) {
      return this.literal(Number(this.previous().lexeme));
    }

    if (this.match(TokenType.STRING_LITERAL)) {
      return this.literal(this.previous().lexeme);
    }

    if (this.match(TokenType.IDENTIFIER)) {
      const name = this.previous().lexeme;

      if (this.match(TokenType.LEFT_PAREN)) {
        return this.finishCall(name);
      }

      return {
        kind: "IdentifierExpression",
        name,
        line: this.previous().line,
        column: this.previous().column
      } as IdentifierExpression;
    }

    if (this.match(TokenType.LEFT_PAREN)) {
      const expr = this.parseExpression();
      this.consume(TokenType.RIGHT_PAREN, "Expected ')' after expression");
      return expr;
    }

    throw new ParseError("Expected expression", this.peek());
  }

  private ifStatement(): Statement {
    const condition = this.parseExpression();
    const thenBranch = this.block();
    let elseBranch: BlockStatement | undefined;
    if (this.match(TokenType.ELSE)) {
      elseBranch = this.block();
    }
    return {
      kind: "IfStatement",
      condition,
      thenBranch,
      elseBranch,
      line: condition.line,
      column: condition.column
    } as IfStatement;
  }

  private block(): BlockStatement {
    this.consume(TokenType.LEFT_BRACE, "Expected '{' to start block");
    const statements: Statement[] = [];

    while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
      statements.push(this.statement());
    }

    this.consume(TokenType.RIGHT_BRACE, "Expected '}' after block");

    return {
      kind: "BlockStatement",
      statements,
      line: this.previous().line,
      column: this.previous().column
    } as BlockStatement;
  }


  private finishCall(callee: string): Expression {
    const args: Expression[] = [];

    if (!this.check(TokenType.RIGHT_PAREN)) {
      do {
        args.push(this.parseExpression());
      } while (this.match(TokenType.COMMA));
    }

    this.consume(TokenType.RIGHT_PAREN, "Expected ')' after arguments");

    return {
      kind: "CallExpression",
      callee,
      arguments: args,
      line: this.previous().line,
      column: this.previous().column
    } as CallExpression;
  }

  private literal(value: number | string | boolean | null): Expression {
    return {
      kind: "LiteralExpression",
      value,
      line: this.previous().line,
      column: this.previous().column
    } as LiteralExpression;
  }

  private whileStatement(): Statement {
  const condition = this.parseExpression();
  const body = this.block();

  return {
    kind: "WhileStatement",
    condition,
    body,
    line: condition.line,
    column: condition.column
  } as WhileStatement;
}


  private match(...types: TokenType[]): boolean {
    for (const type of types) {
      if (this.check(type)) {
        this.advance();
        return true;
      }
    }
    return false;
  }

  private consume(type: TokenType, message: string): Token {
    if (this.check(type)) return this.advance();
    throw new ParseError(message, this.peek());
  }

  private check(type: TokenType): boolean {
    if (this.isAtEnd()) return false;
    return this.peek().type === type;
  }

  private advance(): Token {
    if (!this.isAtEnd()) this.current++;
    return this.previous();
  }

  private isAtEnd(): boolean {
    return this.peek().type === TokenType.EOF;
  }

  private peek(): Token {
    return this.tokens[this.current];
  }

  private previous(): Token {
    return this.tokens[this.current - 1];
  }
}
