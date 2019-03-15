import { Lexer } from '../lexer/lexer';
import { Token } from '../token/token';
import { Program } from '../ast/ast';

export class Parser {

  lexer: Lexer;

  currentToken: Token;
  peekToken: Token;

  private constructor () {}

  static new (lexer: Lexer) {
    const parser = new Parser();
    parser.lexer = lexer;

    parser.nextToken();
    parser.nextToken();

    return parser;
  }

  parseProgram (): Program {
    return null as any;
  }

  private nextToken () {
    this.currentToken = this.peekToken;
    this.peekToken = this.lexer.nextToken();
  }

}
