import { Node } from './node';
import { Token } from '../../token/token';

export interface Expression extends Node {
  __expressionNode (): any;
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

  string (): string {
    return this.value;
  }

}
