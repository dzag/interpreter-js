import { Token } from '../token/token';
import { TokenType } from '../token/token-type';

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
      case '0':
        token.literal = '';
        token.type = TokenType.EOF;
        break;
    }

    this.readCharacter();

    return token;
  }

  private readCharacter () {
    if (this.readPosition >= this.input.length) {
      this.character = '0';
    } else {
      this.character = this.input[this.readPosition];
    }

    this.position = this.readPosition;

    this.readPosition += 1;
  }



}
