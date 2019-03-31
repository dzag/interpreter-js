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

export class IntegerLiteral implements Expression {
  token: Token;
  value: number;

  static new (token: Token, value: number) {
    const ident = new IntegerLiteral();

    ident.token = token;
    ident.value = value;

    return ident;
  }

  __expressionNode (): any {}

  tokenLiteral (): string {
    return `${this.value}`;
  }

  string (): string {
    return this.tokenLiteral();
  }

}

export class BooleanLiteral implements Expression {
  token: Token;
  value: boolean;

  static new(token: Token, value: boolean) {
    const expression = new BooleanLiteral();

    expression.token = token;
    expression.value = value;

    return expression;
  }

  __expressionNode (): any {
  }

  tokenLiteral (): string {
    return this.token.literal;
  }

  string (): string {
    return this.token.literal;
  }
}

export class PrefixExpression implements Expression {
  token: Token;
  operator: string;
  right: Expression;

  static new (opts: { token?: Token, operator?: string; right?: Expression }) {
    const ident = new PrefixExpression();

    ident.token = opts.token as any;
    ident.operator = opts.operator as any;
    ident.right = opts.right as any;

    return ident;
  }

  __expressionNode (): any {
  }

  tokenLiteral (): string {
    return "";
  }

  string (): string {
    return '(' +
      this.operator +
      this.right.string() +
    ')';
  }

}

export class InfixExpression implements Expression {
  token: Token;
  left: Expression;
  operator: string;
  right: Expression;

  static new(opts: { [p in keyof InfixExpression]?: InfixExpression[p] | any }) {
    const expression =  new InfixExpression();

    expression.token = opts.token;
    expression.left = opts.left;
    expression.operator = opts.operator;
    expression.right = opts.right;

    return expression;
  }

  __expressionNode (): any {}

  tokenLiteral (): string {
    return "";
  }

  string (): string {
    return '(' +
      this.left.string() +
      ' ' + this.operator + ' ' +
      this.right.string() +
    ')';
  }

}
