import { Statement } from './types/statement';

export class Program {
  statements: Statement[] = [];

  tokenLiteral (): string {

    if (this.statements.length > 0) {
      return this.statements[0].tokenLiteral();
    }

    return '';

  }
}
