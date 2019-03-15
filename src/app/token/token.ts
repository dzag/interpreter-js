import { KEYWORDS, TokenType } from './token-type';

export class Token {

  public type: TokenType;
  public literal: string;

  constructor () { }

  static new (type: TokenType, literal: string): Token {
    const token = new Token();

    token.type = type;
    token.literal = literal;

    return token;
  }

  static lookupIdent (ident: string): TokenType {
    const keyword = KEYWORDS[ident];

    if (keyword) {
      return keyword;
    }

    return TokenType.IDENT;
  }

}
