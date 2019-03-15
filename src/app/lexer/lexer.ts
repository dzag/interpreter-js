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
    token.literal = this.character;

    switch (this.character) {
      case '=':
        token.type = TokenType.ASSIGN;
        break;
      case ';':
        token.type = TokenType.SEMICOLON;
        break;
      case '(':
        token.type = TokenType.LPAREN;
        break;
      case ')':
        token.type = TokenType.RPAREN;
        break;
      case ',':
        token.type = TokenType.COMMA;
        break;
      case '+':
        token.type = TokenType.PLUS;
        break;
      case '{':
        token.type = TokenType.LBRACE;
        break;
      case '}':
        token.type = TokenType.RBRACE;
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

}
