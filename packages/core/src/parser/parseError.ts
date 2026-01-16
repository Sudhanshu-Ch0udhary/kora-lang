import { Token } from "../lexer/token.js";

export class ParseError extends Error {
  constructor(message: string, token: Token) {
    super(
      `[ParseError] Line ${token.line}, Column ${token.column}: ${message}`
    );
  }
}
