
export enum TokenType {
  LEFT_BRACE,     // {
  RIGHT_BRACE,    // }
  LEFT_PAREN,     // (
  RIGHT_PAREN,    // )
  COMMA,          // ,

  PLUS,           // +
  MINUS,          // -
  STAR,           // *
  SLASH,          // /

  EQUAL_EQUAL,    // ==
  BANG_EQUAL,     // !=
  GREATER,        // >
  GREATER_EQUAL,  // >=
  LESS,           // <
  LESS_EQUAL,     // <=

  EQUAL,          // =

  IDENTIFIER,
  INT_LITERAL,
  FLOAT_LITERAL,
  STRING_LITERAL,

  INT,
  FLOAT,
  STRING,
  BOOL,
  
  IF,
  ELSE,
  WHILE,
  STOP,
  
  FUNC,
  RETURN,
  
  TRUE,
  FALSE,
  NULL,
  
  AND,
  OR,
  NOT,

  EOF
}

export interface Token {
  type: TokenType;
  lexeme: string;
  line: number;
  column: number;
}
