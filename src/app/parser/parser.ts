import { Lexer } from '../lexer/lexer';
import { Token } from '../token/token';
import { TokenType } from '../token/token-type';
import {
  Expression,
  ExpressionStatement,
  Identifier,
  InfixParseFn,
  IntegerLiteral,
  LetStatement,
  PrefixExpression,
  PrefixParseFn,
  Program,
  ReturnStatement,
  Statement
} from '../ast';

enum Precedence {
  _,
  LOWEST,
  EQUALS, // ==
  LESSGREATER, // > or <
  SUM, // +
  PRODUCT, // *
  PREFIX, // -X or !X
  CALL, // myFunction(x)
}

export class Parser {

  lexer: Lexer;
  errors: string[] = [];

  currentToken: Token;
  peekToken: Token;

  prefixParseFns: Map<TokenType, PrefixParseFn> = new Map();
  infixParseFns: Map<TokenType, InfixParseFn> = new Map();

  private constructor () {}

  static new (lexer: Lexer) {
    const parser = new Parser();
    parser.lexer = lexer;

    // Advancing 2 times, so the currentToken will be at the first character
    parser.nextToken();
    parser.nextToken();

    parser.registerPrefix(
      TokenType.IDENT,
      parser.parseIdentifier.bind(parser)
    );

    parser.registerPrefix(
      TokenType.INT,
      parser.parseIntegerLiteral.bind(parser)
    );

    parser.registerPrefix(
      TokenType.BANG,
      parser.parsePrefixExpression.bind(parser)
    );

    parser.registerPrefix(
      TokenType.MINUS,
      parser.parsePrefixExpression.bind(parser)
    );

    return parser;
  }

  parseProgram (): Program {
    const program = Program.new({
      statements: [],
    });

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
      case TokenType.RETURN:
        return this.parseReturnStatement();
      default:
        return this.parseExpressionStatement();
    }
  }

  private parseLetStatement (): LetStatement | null {
    const statement = LetStatement.new({
      token: this.currentToken
    });

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

  private parseReturnStatement (): ReturnStatement | null {
    const statement = ReturnStatement.new(this.currentToken);

    this.nextToken();

    while (!this.currentTokenIs(TokenType.SEMICOLON)) {
      this.nextToken();
    }

    return statement;
  }

  private parseExpressionStatement (): ExpressionStatement | null {
    const statement = ExpressionStatement.new({token: this.currentToken});

    statement.expression = this.parseExpression(Precedence.LOWEST) as Expression;

    if (this.peekTokenIs(TokenType.SEMICOLON)) {
      this.nextToken();
    }

    return statement;
  }

  // Parse Functions
  private parseIdentifier (): Identifier {
    return Identifier.new(this.currentToken, this.currentToken.literal);
  }

  private parseIntegerLiteral(): IntegerLiteral | null {
    const tokenLiteral = parseInt(this.currentToken.literal, 10);

    if (isNaN(tokenLiteral)) {
      this.errors.push(`Could not parse ${this.currentToken.literal} as integer`);
      return null;
    }

    return IntegerLiteral.new(this.currentToken, tokenLiteral);
  }

  private parsePrefixExpression(): PrefixExpression | null {
    const expression = PrefixExpression.new({
      token: this.currentToken,
      operator: this.currentToken.literal
    });

    this.nextToken();

    expression.right = this.parseExpression(Precedence.PREFIX) as any;

    return expression;
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
    );
  }

  private registerPrefix (tokenType: TokenType, fn: PrefixParseFn) {
    this.prefixParseFns.set(tokenType, fn);
  }

  private registerInfix (tokenType: TokenType, fn: InfixParseFn) {
    this.infixParseFns.set(tokenType, fn);
  }

  private parseExpression (precedence: Precedence): Expression | null {
    const lefExpressionFn = this.prefixParseFns.get(this.currentToken.type);

    if (!lefExpressionFn) {
      this.noPrefixParserFnError(this.currentToken.type);
      return null;
    }

    return lefExpressionFn();
  }

  private noPrefixParserFnError (tokenType: TokenType) {
    this.errors.push(
      `No prefix parse function for "${tokenType}" found`
    )
  }

}
