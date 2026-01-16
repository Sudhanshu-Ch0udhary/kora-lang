//The lexer uses this map to distinguish identifiers from keywords.
import { TokenType } from "./token.js";

export const KEYWORDS: Record<string, TokenType> = {
  int: TokenType.INT,
  float: TokenType.FLOAT,
  string: TokenType.STRING,
  bool: TokenType.BOOL,

  if: TokenType.IF,
  else: TokenType.ELSE,
  while: TokenType.WHILE,
  stop: TokenType.STOP,

  func: TokenType.FUNC,
  return: TokenType.RETURN,

  true: TokenType.TRUE,
  false: TokenType.FALSE,
  null: TokenType.NULL,

  and: TokenType.AND,
  or: TokenType.OR,
  not: TokenType.NOT
};