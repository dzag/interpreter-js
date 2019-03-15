import { Lexer } from './lexer';
import { TokenType } from '../token/token-type';

test('next token', () => {
  const input = `=+(){},;`;
  const lexer = Lexer.fromInput(input);

  const tests = [
    [TokenType.ASSIGN, "="],
    [TokenType.PLUS, "+"],
    [TokenType.LPAREN, "("],
    [TokenType.RPAREN, ")"],
    [TokenType.LBRACE, "{"],
    [TokenType.RBRACE, "}"],
    [TokenType.COMMA, ","],
    [TokenType.SEMICOLON, ";"],
  ];

  tests.forEach(([expectedType, expectedLiteral]) => {
    const token = lexer.nextToken();

    expect(token.type).toBe(expectedType);
    expect(token.literal).toBe(expectedLiteral);
  });

});
