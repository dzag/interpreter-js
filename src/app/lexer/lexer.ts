import { Token } from '../token/token';
import { TokenType } from '../token/token-type';

const isLetter = (character: string): boolean => {
  return 'a' <= character && character <= 'z' || 'A' <= character && character <= 'Z' || character === '_';
};

const isDigit = (character: string): boolean => {
  return '0' <= character && character <= '9';
};

const COMMON_TYPES: { [p: string]: TokenType } = {
  '=': TokenType.ASSIGN,
  '+': TokenType.PLUS,
  '-': TokenType.MINUS,
  '!': TokenType.BANG,
  '*': TokenType.ASTERISK,
  '/': TokenType.SLASH,
  '<': TokenType.LT,
  '>': TokenType.GT,
  ',': TokenType.COMMA,
  ';': TokenType.SEMICOLON,
  '(': TokenType.LPAREN,
  ')': TokenType.RPAREN,
  '{': TokenType.LBRACE,
  '}': TokenType.RBRACE,
};

export class Lexer {

  input: string;
  position: number;
  readPosition = 0;
  character: string;

  static fromInput (input: string): Lexer {
    const lexer = new Lexer();
    lexer.input = input;
    lexer.readCharacter();

    return lexer;
  }

  nextToken (): Token {
    this.skipWhiteSpace();

    let token = new Token();
    token.literal = this.character;

    const type = COMMON_TYPES[this.character];

    if (type) {
      token.type = type;
    } else {
      if (isLetter(this.character)) {
        token.literal = this.readIdentifier();
        token.type = Token.lookupIdent(token.literal);
        return token;
      } else if (isDigit(this.character)) {
        token.type = TokenType.INT;
        token.literal = this.readNumber();
        return token;
      }

      token = Token.new(TokenType.ILLEGAL, this.character);
    }

    this.readCharacter();

    return token;
  }

  private readCharacter () {
    if (this.readPosition >= this.input.length) {
      this.character = '';
    } else {
      this.character = this.input[this.readPosition];
    }

    this.position = this.readPosition;

    this.readPosition += 1;
  }

  private readIdentifier () {
    const position = this.position;

    while (isLetter(this.character)) {
      this.readCharacter();
    }

    return this.input.substring(position, this.position);
  }

  private readNumber () {
    const position = this.position;

    while (isDigit(this.character)) {
      this.readCharacter();
    }

    return this.input.substring(position, this.position);
  }

  private skipWhiteSpace () {
    while (this.character === ' '
    || this.character === '\t'
    || this.character === '\n'
    || this.character === '\r') {
      this.readCharacter();
    }
  }

}
