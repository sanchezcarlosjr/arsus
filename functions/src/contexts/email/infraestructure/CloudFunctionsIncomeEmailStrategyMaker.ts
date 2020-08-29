import { ContentMailStrategy } from '../domain/ContentMailStrategy';
import { FirestoreNewsSaveRepository } from '../../blog/news/infraestructure/FirestoreNewsSaveRepository';
import { NoReplyMailStrategy } from '../domain/NoReplyMailStrategy';
import { FirestoreCommunicationStoreRepository } from './FirestoreCommunicationStoreRepository';
import { ReplyMailStrategy } from '../domain/ReplyMailStrategy';
import { Sendgrid } from './Sendgrid';
import { Dialogflow } from './Dialogflow';
import { IncomeEmailStrategyMaker } from '../domain/IncomeEmailStrategyMaker';

export class CloudFunctionsIncomeEmailStrategyMaker implements IncomeEmailStrategyMaker {
  makeMailContentStrategy(): ContentMailStrategy {
    return new ContentMailStrategy(new FirestoreNewsSaveRepository());
  }

  makeNoReplyMailStrategy(): NoReplyMailStrategy {
    return new NoReplyMailStrategy(new FirestoreCommunicationStoreRepository());
  }

  makeReplyMailStrategy(): ReplyMailStrategy {
    return new ReplyMailStrategy(new FirestoreCommunicationStoreRepository(), new Sendgrid(), new Dialogflow());
  }
}
