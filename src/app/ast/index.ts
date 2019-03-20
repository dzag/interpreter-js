import { Expression } from './types/expression';

export * from './types/expression';
export * from './types/statement';
export * from './types/node';
export * from './program';

export type PrefixParseFn = () => Expression;
export type InfixParseFn = (left: Expression) => Expression;
