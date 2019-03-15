import { Token } from '../token/token';
import { TokenType } from '../token/token-type';

const isLetter = (character: string): boolean => {
  return 'a' <= character && character <= 'z' || 'A' <= character && character <= 'Z' || character === '_';
};

const isDigit = (character: string): boolean => {
  return '0' <= character && character <= '9';
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
    switch (this.character) {
      case '=':
        if (this.peekChar() === '=') {
          const char = this.character;
          this.readCharacter();
          token = Token.new(
            TokenType.EQ,
            char + this.character,
          );
        } else {
          token = Token.new(TokenType.ASSIGN, this.character);
        }
        break;
      case '+':
        token = Token.new(TokenType.PLUS, this.character);
        break;
      case '-':
        token = Token.new(TokenType.MINUS, this.character);
        break;
      case '!':
        if (this.peekChar() === '=') {
          const char = this.character;
          this.readCharacter();
          token = Token.new(
            TokenType.NOT_EQ,
            char + this.character,
          );
        } else {
          token = Token.new(TokenType.BANG, this.character);
        }
        break;
      case '*':
        token = Token.new(TokenType.ASTERISK, this.character);
        break;
      case '/':
        token = Token.new(TokenType.SLASH, this.character);
        break;
      case '<':
        token = Token.new(TokenType.LT, this.character);
        break;
      case '>':
        token = Token.new(TokenType.GT, this.character);
        break;
      case ';':
        token = Token.new(TokenType.SEMICOLON, this.character);
        break;
      case '(':
        token = Token.new(TokenType.LPAREN, this.character);
        break;
      case ')':
        token = Token.new(TokenType.RPAREN, this.character);
        break;
      case ',':
        token = Token.new(TokenType.COMMA, this.character);
        break;
      case '{':
        token = Token.new(TokenType.LBRACE, this.character);
        break;
      case '}':
        token = Token.new(TokenType.RBRACE, this.character);
        break;
      default:
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

  private peekChar (): string {
    if (this.readPosition >= this.input.length) {
      return '';
    }

    return this.input[this.readPosition];
  }

}
