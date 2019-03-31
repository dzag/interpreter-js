import { Lexer } from '../lexer/lexer';
import { Token } from '../token/token';
import { TokenType } from '../token/token-type';
import {
  BooleanLiteral,
  Expression,
  ExpressionStatement,
  Identifier,
  InfixExpression,
  InfixParseFn,
  IntegerLiteral,
  LetStatement,
  PrefixExpression,
  PrefixParseFn,
  Program,
  ReturnStatement,
  Statement,
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

const precedences: Map<TokenType, Precedence> = new Map([
  [TokenType.EQ, Precedence.EQUALS],
  [TokenType.NOT_EQ, Precedence.EQUALS],
  [TokenType.LT, Precedence.LESSGREATER],
  [TokenType.GT, Precedence.LESSGREATER],
  [TokenType.PLUS, Precedence.SUM],
  [TokenType.MINUS, Precedence.SUM],
  [TokenType.SLASH, Precedence.PRODUCT],
  [TokenType.ASTERISK, Precedence.PRODUCT],
]);

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

    const parseIdentifier = parser.parseIdentifier.bind(parser);
    const parseBooleanLiteral = parser.parseBooleanLiteral.bind(parser);
    const parseIntegerLiteral = parser.parseIntegerLiteral.bind(parser);
    const parsePrefixExpression = parser.parsePrefixExpression.bind(parser);
    const parseInfixExpression = parser.parseInfixExpression.bind(parser);

    parser.registerPrefix(TokenType.IDENT, parseIdentifier);
    parser.registerPrefix(TokenType.TRUE, parseBooleanLiteral);
    parser.registerPrefix(TokenType.FALSE, parseBooleanLiteral);
    parser.registerPrefix(TokenType.INT, parseIntegerLiteral);
    parser.registerPrefix(TokenType.BANG, parsePrefixExpression);
    parser.registerPrefix(TokenType.MINUS, parsePrefixExpression);

    parser.registerInfix(TokenType.PLUS, parseInfixExpression);
    parser.registerInfix(TokenType.MINUS, parseInfixExpression);
    parser.registerInfix(TokenType.SLASH, parseInfixExpression);
    parser.registerInfix(TokenType.ASTERISK, parseInfixExpression);
    parser.registerInfix(TokenType.EQ, parseInfixExpression);
    parser.registerInfix(TokenType.NOT_EQ, parseInfixExpression);
    parser.registerInfix(TokenType.LT, parseInfixExpression);
    parser.registerInfix(TokenType.GT, parseInfixExpression);

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

    this.nextToken();

    statement.value = this.parseExpression(Precedence.LOWEST) as Expression;

    while (!this.currentTokenIs(TokenType.SEMICOLON)) {
      this.nextToken();
    }

    return statement;
  }

  private parseReturnStatement (): ReturnStatement | null {
    const statement = ReturnStatement.new(this.currentToken);

    this.nextToken();

    statement.returnValue = this.parseExpression(Precedence.LOWEST) as Expression;

    while (!this.currentTokenIs(TokenType.SEMICOLON)) {
      this.nextToken();
    }

    return statement;
  }

  private parseExpressionStatement (): ExpressionStatement | null {
    const statement = ExpressionStatement.new({ token: this.currentToken });

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

  private parseIntegerLiteral (): IntegerLiteral | null {
    const tokenLiteral = parseInt(this.currentToken.literal, 10);

    if (isNaN(tokenLiteral)) {
      this.errors.push(`Could not parse ${this.currentToken.literal} as integer`);
      return null;
    }

    return IntegerLiteral.new(this.currentToken, tokenLiteral);
  }

  private parseBooleanLiteral (): BooleanLiteral {
    return BooleanLiteral.new(this.currentToken, this.currentTokenIs(TokenType.TRUE))
  }

  private parsePrefixExpression (): PrefixExpression | null {
    const expression = PrefixExpression.new({
      token: this.currentToken,
      operator: this.currentToken.literal
    });

    this.nextToken();

    expression.right = this.parseExpression(Precedence.PREFIX) as any;

    return expression;
  }

  private parseInfixExpression (left: Expression): InfixExpression | null {
    const expression = InfixExpression.new({
      token: this.currentToken,
      operator: this.currentToken.literal,
      left,
    });

    const precedence = this.currentPrecedence();
    this.nextToken();
    expression.right = this.parseExpression(precedence) as Expression;

    return expression;
  }

  private parseExpression (precedence: Precedence): Expression | null {
    const prefixFn = this.prefixParseFns.get(this.currentToken.type);

    if (!prefixFn) {
      this.noPrefixParserFnError(this.currentToken.type);
      return null;
    }

    let leftExpression = prefixFn();

    while (!this.peekTokenIs(TokenType.SEMICOLON) && precedence < this.peekPrecedence()) {
      if (!this.infixParseFns.has(this.peekToken.type)) {
        return leftExpression;
      }

      const infixFn = this.infixParseFns.get(this.peekToken.type) as InfixParseFn;
      this.nextToken();
      leftExpression = infixFn(leftExpression)
    }

    return leftExpression;
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

  private peekPrecedence (): Precedence {
    if (!precedences.has(this.peekToken.type)) {
      return Precedence.LOWEST;
    }

    return precedences.get(this.peekToken.type) as Precedence;
  }

  private currentPrecedence (): Precedence {
    if (!precedences.has(this.currentToken.type)) {
      return Precedence.LOWEST;
    }

    return precedences.get(this.peekToken.type) as Precedence;
  }

  private registerPrefix (tokenType: TokenType, fn: PrefixParseFn) {
    this.prefixParseFns.set(tokenType, fn);
  }

  private registerInfix (tokenType: TokenType, fn: InfixParseFn) {
    this.infixParseFns.set(tokenType, fn);
  }

  private noPrefixParserFnError (tokenType: TokenType) {
    this.errors.push(
      `No prefix parse function for TokenType "${tokenType}" found`
    );
  }

}
