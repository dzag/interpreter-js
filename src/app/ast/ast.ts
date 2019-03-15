import { Token } from '../token/token';

export interface Node {
  tokenLiteral (): string;
}

export interface Statement extends Node {
  statementNode (): any;
}

export interface Expression extends Node {
  expressionNode (): any;
}

export class LetStatement implements Statement {
  token: Token;
  name: Identifier;
  value: Expression;

  statementNode (): any {}

  tokenLiteral (): string { return this.token.literal; }

}

export class Identifier implements Expression {
  token: Token;
  value: string;

  expressionNode (): any { }

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
