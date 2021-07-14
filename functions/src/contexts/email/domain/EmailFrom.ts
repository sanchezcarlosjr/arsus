import { IncomeEmailStrategy } from '../application/IncomeEmailStrategy';
import { TypeCommunicationFinderRepository } from './TypeCommunicationFinderRepository';
import { IncomeEmailStrategyMaker } from './IncomeEmailStrategyMaker';
import { warn } from '../../shared/Error';

export class EmailFrom {
  constructor(
    private _value: string,
    private typeCommunicationFinderRepository: TypeCommunicationFinderRepository,
    private incomeEmailStrategyMaker: IncomeEmailStrategyMaker
  ) {}

  get value() {
    return this._value;
  }

  async makeStrategy(): Promise<IncomeEmailStrategy> {
    try {
      const typeCommunication = await this.typeCommunicationFinderRepository.find(this.value);
      switch (typeCommunication) {
        case 'content':
          return this.incomeEmailStrategyMaker.makeMailContentStrategy();
        case 'no-reply':
          return this.incomeEmailStrategyMaker.makeNoReplyMailStrategy();
        default:
          return this.incomeEmailStrategyMaker.makeReplyMailStrategy();
      }
    } catch (e) {
      warn('EmailFrom', 29, e.message, 'Income Email Factory');
      return this.incomeEmailStrategyMaker.makeNoReplyMailStrategy();
    }
  }
}
