import * as readline from 'readline';
import { Lexer } from '../lexer/lexer';
import { Parser } from '../parser/parser';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.on('line', input => {
  const lexer = Lexer.fromInput(input);
  const parser = Parser.new(lexer);
  const program = parser.parseProgram();

  console.log(program.string());
});

