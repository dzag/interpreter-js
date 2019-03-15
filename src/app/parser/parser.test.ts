import { Lexer } from '../lexer/lexer';
import { Parser } from './parser';
import { LetStatement, Statement } from '../ast/ast';

describe('parse program', () => {
  const input = `
    let x = 5;
    let y = 10;
    let foobar = 838383;
  `;
  const lexer = Lexer.fromInput(input);
  const parser = Parser.new(lexer);

  const program = parser.parseProgram();

  test('program is not null', () => {
    expect(program).not.toBe(null);
  });

  if (!program) {
    return;
  }

  test('program statements can contain only 3 statements', () => {
    expect(program.statements.length).toBe(3);
  });

  const tests = [
    'x', 'y', 'foobar'
  ];

  tests.forEach((identifer, i) => {
    const stmt = program.statements[i];
    testLetStatement(stmt, identifer);
  });

});

function testLetStatement (statement: Statement, name: string) {

  test('statement.tokenLiteral is `let`', () => {
    expect(statement.tokenLiteral()).toBe('let');
  });

  test(`statement is 'LetStatement'`, () => {
    expect(statement).toBeInstanceOf(LetStatement);
  });

  const letStatement: LetStatement = statement as LetStatement;
  test(`letStatement.name.value is '${name}', current '${letStatement.name.value}'`, () => {
    expect(letStatement.name.value).toBe(name);
  });

  test(`name is '${name}', current '${letStatement.name.tokenLiteral()}'`, () => {
    expect(letStatement.name.tokenLiteral()).toBe(name);
  });

}
