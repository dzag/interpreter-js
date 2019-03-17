import { Program } from './program';
import { LetStatement } from './types/statement';
import { Token } from '../token/token';
import { TokenType } from '../token/token-type';
import { Identifier } from './types/expression';

describe(`test string`, () => {

  const program = Program.new({
    statements: [
      LetStatement.new({
        token: Token.new(TokenType.LET, 'let'),
        name: Identifier.new(
          Token.new(TokenType.IDENT, 'myVar'),
          'myVar'
        ),
        value: Identifier.new(
          Token.new(TokenType.IDENT, 'anotherVar'),
          'anotherVar'
        )
      })
    ]
  });

  test('let myVar = anotherVar;', () => {
    console.info(`got ${program.string()}`);
    expect(program.string()).toBe('let myVar = anotherVar;');
  });

});
