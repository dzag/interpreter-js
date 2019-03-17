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

  static new (token: Token) {
    const statement = new LetStatement();

    statement.token = token;

    return statement;
  }

  __statementNode (): any {}

  tokenLiteral (): string { return this.token.literal; }

}
