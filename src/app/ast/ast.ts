import { Token } from '../token/token';

export interface Node {
  tokenLiteral (): string;
}

export interface Statement extends Node {
  __statementNode (): any;
}

export interface Expression extends Node {
  __expressionNode (): any;
}

export class LetStatement implements Statement {
  token: Token;
  name: Identifier;
  value: Expression;

  static new (token: Token) {
    const statement = new LetStatement();

    statement.token = token;

    return statement;
  }

  __statementNode (): any {}

  tokenLiteral (): string { return this.token.literal; }

}

export class Identifier implements Expression {
  token: Token;
  value: string;

  static new (token: Token, value: string) {
    const ident = new Identifier();

    ident.token = token;
    ident.value = value;

    return ident;
  }

  __expressionNode (): any { }

  tokenLiteral (): string { return this.token.literal; }
}

export class Program {
  statements: Statement[] = [];

  tokenLiteral (): string {

    if (this.statements.length > 0) {
      return this.statements[0].tokenLiteral();
    }

    return '';

  }
}
