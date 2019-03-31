import { Lexer } from '../lexer/lexer';
import { Parser } from './parser';
import {
  Expression,
  ExpressionStatement,
  Identifier,
  InfixExpression,
  IntegerLiteral,
  LetStatement,
  PrefixExpression,
  ReturnStatement,
  Statement,
  BooleanLiteral,
} from '../ast/';
import { isNumber, isString } from '../fns';

describe('parse let statements', () => {
  const input = `
    let x = 5;
    let y = 10;
    let foobar = 838383;
  `;
  const lexer = Lexer.fromInput(input);
  const parser = Parser.new(lexer);
  test('parse without no errors', (done) => {
    checkParserErrors(parser, done);
  });

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

  tests.forEach((identifier, i) => {
    const stmt = program.statements[i];
    testLetStatement(stmt, identifier);
  });

});

describe('parse return statements', () => {
  const input = `
    return 5;
    return 10;
    return 838383;
  `;

  const lexer = Lexer.fromInput(input);
  const parser = Parser.new(lexer);
  test('parse without no errors', (done) => {
    checkParserErrors(parser, done);
  });

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

  program.statements.forEach(returnStatement => {
    test('statement is return statement', () => {
      expect(returnStatement).toBeInstanceOf(ReturnStatement);
    });

    test(`returnStatement.tokenLiteral() is 'return'`, () => {
      expect(returnStatement.tokenLiteral()).toBe('return');
    });
  });

});

describe('test identifier expression', () => {
  const input = 'foobar;';

  const lexer = Lexer.fromInput(input);
  const parser = Parser.new(lexer);
  const program = parser.parseProgram();

  test('program should have only 1 statement', () => {
    expect(program.statements.length).toBe(1);
  });

  const statement = program.statements[0] as ExpressionStatement;
  test('statement should be ExpressionStatement', () => {
    expect(statement).toBeInstanceOf(ExpressionStatement);
  });

  const identifier = statement.expression as Identifier;
  test('expression should be an Identifier', () => {
    expect(identifier).toBeInstanceOf(Identifier);
  });

  test('value should be "foobar"', () => {
    expect(identifier.value).toBe('foobar');
  });

  test('token literal should be "foobar"', () => {
    expect(identifier.tokenLiteral()).toBe('foobar');
  });

});

describe('test integer expression', () => {
  const input = '5;';

  const lexer = Lexer.fromInput(input);
  const parser = Parser.new(lexer);
  const program = parser.parseProgram();

  test('program should have only 1 statement', () => {
    expect(program.statements.length).toBe(1);
  });

  const statement = program.statements[0] as ExpressionStatement;
  test('statement should be ExpressionStatement', () => {
    expect(statement).toBeInstanceOf(ExpressionStatement);
  });

  const identifier = statement.expression as IntegerLiteral;
  test('expression should be an IntegerLiteral', () => {
    expect(identifier).toBeInstanceOf(IntegerLiteral);
  });

  test('value should be "5"', () => {
    expect(identifier.value).toBe(5);
  });

  test('token literal should be "5"', () => {
    expect(identifier.tokenLiteral()).toBe('5');
  });
});

describe('test boolean expression', () => {
  const input = 'false;';

  const lexer = Lexer.fromInput(input);
  const parser = Parser.new(lexer);

  test('parse without no errors', (done) => {
    checkParserErrors(parser, done);
  });

  const program = parser.parseProgram();

  test('program should have only 1 statement', () => {
    expect(program.statements.length).toBe(1);
  });

  const statement = program.statements[0] as ExpressionStatement;
  test('statement should be ExpressionStatement', () => {
    expect(statement).toBeInstanceOf(ExpressionStatement);
  });

  const boolean = statement.expression as BooleanLiteral;
  test('expression should be an Boolean', () => {
    expect(boolean).toBeInstanceOf(BooleanLiteral);
  });

  test('value should be "false"', () => {
    expect(boolean.value).toBe(false);
  });

  test('token literal should be "false"', () => {
    expect(boolean.tokenLiteral()).toBe('false');
  });
});

describe('test parsing prefix expression', () => {
  const prefixTests = [
    { input: '!5', operator: '!', integerValue: 5 },
    { input: '-15', operator: '-', integerValue: 15 },
  ];

  for (const { input, operator, integerValue } of prefixTests) {
    const lexer = Lexer.fromInput(input);
    const parser = Parser.new(lexer);

    test('parse without no errors', (done) => {
      checkParserErrors(parser, done);
    });

    const program = parser.parseProgram();

    test('program should have only 1 statement', () => {
      expect(program.statements.length).toBe(1);
    });

    const statement = program.statements[0] as ExpressionStatement;
    test('statement should be ExpressionStatement', () => {
      expect(statement).toBeInstanceOf(ExpressionStatement);
    });

    const expression = statement.expression as PrefixExpression;
    test('expression should be an PrefixExpression', () => {
      expect(expression).toBeInstanceOf(PrefixExpression);
    });

    test(`expression operator should be ${operator}`, () => {
      expect(expression.operator).toBe(operator);
    });

    testIntegerLiteral(expression.right, integerValue);
  }
});

describe('test parsing infix expression', () => {
  const infixTests = [
    { input: '5 + 5', leftValue: 5, operator: '+', rightValue: 5 },
    { input: '5 - 5', leftValue: 5, operator: '-', rightValue: 5 },
    { input: '5 * 5', leftValue: 5, operator: '*', rightValue: 5 },
    { input: '5 / 5', leftValue: 5, operator: '/', rightValue: 5 },
    { input: '5 > 5', leftValue: 5, operator: '>', rightValue: 5 },
    { input: '5 < 5', leftValue: 5, operator: '<', rightValue: 5 },
    { input: '5 == 5', leftValue: 5, operator: '==', rightValue: 5 },
    { input: '5 != 5', leftValue: 5, operator: '!=', rightValue: 5 },
  ];

  for (const { input, leftValue, operator, rightValue } of infixTests) {
    const lexer = Lexer.fromInput(input);
    const parser = Parser.new(lexer);

    test('parse without no errors', (done) => {
      checkParserErrors(parser, done);
    });

    const program = parser.parseProgram();

    test('program should have only 1 statement', () => {
      expect(program.statements.length).toBe(1);
    });

    const statement = program.statements[0] as ExpressionStatement;
    test('statement should be ExpressionStatement', () => {
      expect(statement).toBeInstanceOf(ExpressionStatement);
    });

    const expression = statement.expression as InfixExpression;
    test('expression should be an InfixExpression', () => {
      expect(expression).toBeInstanceOf(InfixExpression);
    });

    testIntegerLiteral(expression.left, leftValue);

    test(`expression operator should be ${operator}`, () => {
      expect(expression.operator).toBe(operator);
    });

    testIntegerLiteral(expression.left, rightValue);
  }
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

function testIntegerLiteral (exp: Expression, value: number) {
  const integerLiteral = exp as IntegerLiteral;

  test('expression should be IntegerLiteral', () => {
    expect(integerLiteral).toBeInstanceOf(IntegerLiteral);
  });

  test(`expression value should be "${value}"`, () => {
    expect(integerLiteral.value).toBe(value);
  });

  test(`expression tokenLiteral() should be "${integerLiteral.value}"`, () => {
    expect(integerLiteral.tokenLiteral()).toBe(`${value}`);
  });
}

function testIdentifier (expression: Expression, value: string) {
  const identifier = expression as Identifier;

  test('expression should be Identifier', () => {
    expect(identifier).toBeInstanceOf(Identifier);
  });

  test(`identifier.value should be ${value}`, () => {
    expect(identifier.value).toBe(value);
  });

  test(`identifier.tokenLiteral() should be ${value}`, () => {
    expect(identifier.tokenLiteral()).toBe(value);
  });
}

function testInfixExpression (expression: Expression, left: any, operator: string, right: any) {

  const infix = expression as InfixExpression;

  test(`expression should be an InfixExpression`, () => {
    expect(infix).toBeInstanceOf(InfixExpression);
  });

  testLiteralExpression(infix.left, left);

  test(`operator should be ${operator}`, () => {
    expect(infix.operator).toBe(operator);
  });

  testLiteralExpression(infix.right, right);
}

function testLiteralExpression (expression: Expression, expected: any) {

  if (isNumber(expected)) {
    return testIntegerLiteral(expression, expected);
  }

  if (isString(expected)) {
    return testIdentifier(expression, expected);
  }

}

function checkParserErrors (parser: Parser, done: any) {
  const errs = parser.errors;

  if (errs.length === 0) {
    done();
    return;
  }

  errs.forEach(err => console.error(err));
  done.fail(`parser has ${errs.length} errors`);
}
