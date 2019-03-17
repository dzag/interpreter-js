import { Statement } from './types/statement';
import { Node } from './types/node';

export class Program implements Node {
  statements: Statement[] = [];

  private constructor () {}

  static new ({statements}: { statements: Statement[] }) {
    const program = new Program();
    program.statements = statements;

    return program;
  }

  tokenLiteral (): string {

    if (this.statements.length > 0) {
      return this.statements[0].tokenLiteral();
    }

    return '';

  }

  string (): string {
    return this.statements
      .map(st => st.string())
      .join('\n');
  }

}
