import { Node } from './node';
import { Token } from '../../token/token';
import { Expression, Identifier } from './expression';

export interface Statement extends Node {
  __statementNode (): any;
}

export class LetStatement implements Statement {
  token: Token;
  name: Identifier;
  value: Expression;

  static new (props : { token?: Token, name?: Identifier, value?: Expression } = {}) {
    const statement = new LetStatement();

    Object.assign(statement, props);

    return statement;
  }

  __statementNode (): any {}

  tokenLiteral (): string { return this.token.literal; }

  string (): string {
    let result =
      `${this.tokenLiteral()} ${this.name.string()}`
      + ` = `;

    if (this.value) {
      result += `${this.value.string()}`;
    }

    result += ';';

    return result;
  }

}

export class ReturnStatement implements Statement {
  token: Token;
  returnValue: Expression;

  private constructor () {}

  static new (token: Token) {
    const statement = new ReturnStatement();
    statement.token = token;

    return statement;
  }

  __statementNode (): any {}

  tokenLiteral (): string {
    return this.token.literal;
  }

  string (): string {
    let result = `${this.tokenLiteral()} `;

    if (this.returnValue) {
      result += `${this.returnValue.string()}`;
    }

    result += ';';

    return result;
  }

}

export class ExpressionStatement implements Statement {
  token: Token;
  expression: Expression;

  static new (opts: { token?: Token, expression?: Expression }) {
    const statement = new ExpressionStatement();
    statement.token = opts.token as any;
    statement.expression = opts.expression as any;
    return statement;
  }

  __statementNode (): any {}

  tokenLiteral (): string { return this.token.literal; }

  string (): string {
    if (this.expression) {
      return this.expression.string();
    }

    return '';
  }
}
