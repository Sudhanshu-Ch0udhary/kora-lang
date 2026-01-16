import { Token, TokenType } from "./token.js";
import { KEYWORDS } from "./keywords.js";

export class Lexer {
  private source: string;
  private tokens: Token[] = [];

  private start = 0;
  private current = 0;
  private line = 1;
  private column = 1;

  constructor(source: string) {
    this.source = source;
  }

  scanTokens(): Token[] {
    while (!this.isAtEnd()) {
      this.start = this.current;
      this.scanToken();
    }

    this.tokens.push({
      type: TokenType.EOF,
      lexeme: "",
      line: this.line,
      column: this.column
    });

    return this.tokens;
  }

  private scanToken(): void {
    const char = this.advance();

    switch (char) {
      case "{": return this.addToken(TokenType.LEFT_BRACE);
      case "}": return this.addToken(TokenType.RIGHT_BRACE);
      case "(": return this.addToken(TokenType.LEFT_PAREN);
      case ")": return this.addToken(TokenType.RIGHT_PAREN);
      case ",": return this.addToken(TokenType.COMMA);

      case "+": return this.addToken(TokenType.PLUS);
      case "-": return this.addToken(TokenType.MINUS);
      case "*": return this.addToken(TokenType.STAR);
      case "/": return this.addToken(TokenType.SLASH);

      case "=":
        return this.addToken(
          this.match("=") ? TokenType.EQUAL_EQUAL : TokenType.EQUAL
        );

      case "!":
        if (this.match("=")) {
          return this.addToken(TokenType.BANG_EQUAL);
        }
        throw this.error("Unexpected '!'. Did you mean '!='?");

      case ">":
        return this.addToken(
          this.match("=") ? TokenType.GREATER_EQUAL : TokenType.GREATER
        );

      case "<":
        return this.addToken(
          this.match("=") ? TokenType.LESS_EQUAL : TokenType.LESS
        );

      case " ":
      case "\r":
      case "\t":
        return;

      case "\n":
        this.line++;
        this.column = 1;
        return;

      case "\"":
        return this.string();

      default:
        if (this.isDigit(char)) {
          return this.number();
        }

        if (this.isAlpha(char)) {
          return this.identifier();
        }

        throw this.error(`Unexpected character '${char}'`);
    }
  }


  private advance(): string {
    this.current++;
    this.column++;
    return this.source[this.current - 1];
  }

  private addToken(type: TokenType, lexeme?: string): void {
    const text =
      lexeme ?? this.source.substring(this.start, this.current);

    this.tokens.push({
      type,
      lexeme: text,
      line: this.line,
      column: this.column - (this.current - this.start)
    });
  }

  private match(expected: string): boolean {
    if (this.isAtEnd()) return false;
    if (this.source[this.current] !== expected) return false;

    this.current++;
    this.column++;
    return true;
  }

  private peek(): string {
    if (this.isAtEnd()) return "\0";
    return this.source[this.current];
  }

  private peekNext(): string {
    if (this.current + 1 >= this.source.length) return "\0";
    return this.source[this.current + 1];
  }

  private isAtEnd(): boolean {
    return this.current >= this.source.length;
  }

  private string(): void {
    while (this.peek() !== "\"" && !this.isAtEnd()) {
      if (this.peek() === "\n") {
        this.line++;
        this.column = 1;
      }
      this.advance();
    }

    if (this.isAtEnd()) {
      throw this.error("Unterminated string literal");
    }

    this.advance();

    const value = this.source.substring(this.start + 1, this.current - 1);
    this.addToken(TokenType.STRING_LITERAL, value);
  }

  private number(): void {
    while (this.isDigit(this.peek())) this.advance();

    let isFloat = false;

    if (this.peek() === "." && this.isDigit(this.peekNext())) {
      isFloat = true;
      this.advance(); 

      while (this.isDigit(this.peek())) this.advance();
    }

    const value = this.source.substring(this.start, this.current);

    this.addToken(
      isFloat ? TokenType.FLOAT_LITERAL : TokenType.INT_LITERAL,
      value
    );
  }

  private identifier(): void {
    while (this.isAlphaNumeric(this.peek())) this.advance();

    const text = this.source.substring(this.start, this.current);
    const type = KEYWORDS[text] ?? TokenType.IDENTIFIER;

    this.addToken(type, text);
  }


  private isDigit(char: string): boolean {
    return char >= "0" && char <= "9";
  }

  private isAlpha(char: string): boolean {
    return (
      (char >= "a" && char <= "z") ||
      (char >= "A" && char <= "Z") ||
      char === "_"
    );
  }

  private isAlphaNumeric(char: string): boolean {
    return this.isAlpha(char) || this.isDigit(char);
  }

  private error(message: string): Error {
    return new Error(`[Lexer] Line ${this.line}, Column ${this.column}: ${message}`);
  }
}
