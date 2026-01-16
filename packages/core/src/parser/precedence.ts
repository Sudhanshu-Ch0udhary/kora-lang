import { TokenType } from "../lexer/token.js";

export const PRECEDENCE: Partial<Record<TokenType, number>> = {
  [TokenType.OR]: 1,
  [TokenType.AND]: 2,

  [TokenType.EQUAL_EQUAL]: 3,
  [TokenType.BANG_EQUAL]: 3,

  [TokenType.GREATER]: 4,
  [TokenType.GREATER_EQUAL]: 4,
  [TokenType.LESS]: 4,
  [TokenType.LESS_EQUAL]: 4,

  [TokenType.PLUS]: 5,
  [TokenType.MINUS]: 5,

  [TokenType.STAR]: 6,
  [TokenType.SLASH]: 6
};