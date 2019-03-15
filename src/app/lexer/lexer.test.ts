import { Lexer } from './lexer';
import { TokenType } from '../token/token-type';

test('next token', () => {
  const input = `let five = 5;
    let ten = 10;

    let add = fn(x, y) {
      x + y;
    };

    let result = add(five, ten);
    
    !-/*5;
    5 < 10 > 5;
    
    `;

  const lexer = Lexer.fromInput(input);

  const tests = [
    [TokenType.LET, 'let'],
    [TokenType.IDENT, 'five'],
    [TokenType.ASSIGN, '='],
    [TokenType.INT, '5'],
    [TokenType.SEMICOLON, ';'],

    [TokenType.LET, 'let'],
    [TokenType.IDENT, 'ten'],
    [TokenType.ASSIGN, '='],
    [TokenType.INT, '10'],
    [TokenType.SEMICOLON, ';'],

    [TokenType.LET, 'let'],
    [TokenType.IDENT, 'add'],
    [TokenType.ASSIGN, '='],
    [TokenType.FUNCTION, 'fn'],
    [TokenType.LPAREN, '('],
    [TokenType.IDENT, 'x'],
    [TokenType.COMMA, ','],
    [TokenType.IDENT, 'y'],
    [TokenType.RPAREN, ')'],
    [TokenType.LBRACE, '{'],
    [TokenType.IDENT, 'x'],
    [TokenType.PLUS, '+'],
    [TokenType.IDENT, 'y'],
    [TokenType.SEMICOLON, ';'],
    [TokenType.RBRACE, '}'],
    [TokenType.SEMICOLON, ';'],

    [TokenType.LET, 'let'],
    [TokenType.IDENT, 'result'],
    [TokenType.ASSIGN, '='],
    [TokenType.IDENT, 'add'],
    [TokenType.LPAREN, '('],
    [TokenType.IDENT, 'five'],
    [TokenType.COMMA, ','],
    [TokenType.IDENT, 'ten'],
    [TokenType.RPAREN, ')'],
    [TokenType.SEMICOLON, ';'],

    [TokenType.BANG, '!'],
    [TokenType.MINUS, '-'],
    [TokenType.SLASH, '/'],
    [TokenType.ASTERISK, '*'],
    [TokenType.INT, '5'],
    [TokenType.SEMICOLON, ';'],

    [TokenType.INT, '5'],
    [TokenType.LT, '<'],
    [TokenType.INT, '10'],
    [TokenType.GT, '>'],
    [TokenType.INT, '5'],
    [TokenType.SEMICOLON, ';'],

  ];

  tests.forEach(([expectedType, expectedLiteral]) => {
    const token = lexer.nextToken();

    expect(token.type).toBe(expectedType);
    expect(token.literal).toBe(expectedLiteral);
  });
});
