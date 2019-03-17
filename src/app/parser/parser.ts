import { Lexer } from '../lexer/lexer';
import { Token } from '../token/token';
import { TokenType } from '../token/token-type';
import { Identifier, Program, LetStatement, Statement } from '../ast';

export class Parser {

  lexer: Lexer;

  currentToken: Token;
  peekToken: Token;

  errors: string[] = [];

  private constructor () {}

  static new (lexer: Lexer) {
    const parser = new Parser();
    parser.lexer = lexer;

    // Advancing 2 times, so the currentToken will be at the first character
    parser.nextToken();
    parser.nextToken();

    return parser;
  }

  parseProgram (): Program {
    const program = new Program();
    program.statements = [];

    while (this.currentToken.type !== TokenType.EOF) {
      const statement = this.parseStatement();

      if (statement !== null) {
        program.statements.push(statement);
      }

      this.nextToken();
    }

    return program;
  }

  private nextToken () {
    this.currentToken = this.peekToken;
    this.peekToken = this.lexer.nextToken();
  }

  private parseStatement (): Statement | null {
    switch (this.currentToken.type) {
      case TokenType.LET:
        return this.parseLetStatement();
      default:
        return null;
    }
  }

  private parseLetStatement (): LetStatement | null {
    const statement = LetStatement.new(this.currentToken);

    if (!this.expectPeek(TokenType.IDENT)) {
      return null;
    }

    statement.name = Identifier.new(
      this.currentToken,
      this.currentToken.literal
    );

    if (!this.expectPeek(TokenType.ASSIGN)) {
      return null;
    }

    while (!this.currentTokenIs(TokenType.SEMICOLON)) {
      this.nextToken();
    }

    return statement;
  }

  /**
   * Assertion function, checking the type before advancing
   */
  private expectPeek (tokenType: TokenType): boolean {
    if (this.peekTokenIs(tokenType)) {
      this.nextToken();
      return true;
    }

    this.peekErrors(tokenType);
    return false;
  }

  private currentTokenIs (tokenType: TokenType): boolean {
    return this.currentToken.type === tokenType;
  }

  private peekTokenIs (tokenType: TokenType): boolean {
    return this.peekToken.type === tokenType;
  }

  private peekErrors (tokenType: TokenType) {
    this.errors.push(
      `Expected next token to be '${tokenType}', got '${this.peekToken.type}' instead,`
    )
  }

}
