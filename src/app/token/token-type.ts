export enum TokenType {
  ILLEGAL = 'ILLEGAL',
  EOF = 'EOF',

  // Identifiers + literals
  IDENT = 'IDENT',
  INT = 'INT',

  // Operators
  ASSIGN = '=',
  PLUS = '+',
  MINUS = '-',
  BANG = '!',
  ASTERISK = '*',
  SLASH = '/',

  LT = '<',
  GT = '>',

  // Delimiters
  COMMA = ',',
  SEMICOLON = ';',
  LPAREN = '(',
  RPAREN = ')',
  LBRACE = '{',
  RBRACE = '}',

  EQ = '==',
  NOT_EQ = '!=',

  // Keywords
  FUNCTION = 'FUNCTION',
  LET = 'LET',
  TRUE = 'TRUE',
  FALSE = 'FALSE',
  IF = 'IF',
  ELSE = 'ELSE',
  RETURN = 'RETURN',
}

export const KEYWORDS: { [p: string]: TokenType } = {
  'fn': TokenType.FUNCTION,
  'let': TokenType.LET,
  'true': TokenType.TRUE,
  'false': TokenType.FALSE,
  'if': TokenType.IF,
  'else': TokenType.ELSE,
  'return': TokenType.RETURN,
};
