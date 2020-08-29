import { ContentMailStrategy } from './ContentMailStrategy';
import { NoReplyMailStrategy } from './NoReplyMailStrategy';
import { ReplyMailStrategy } from './ReplyMailStrategy';

export interface IncomeEmailStrategyMaker {
  makeMailContentStrategy: () => ContentMailStrategy;
  makeNoReplyMailStrategy: () => NoReplyMailStrategy;
  makeReplyMailStrategy: () => ReplyMailStrategy;
}
