import { Intent } from './intent';
import { Agent } from '../infrastructure/webhook-client';

export class TransactionDecision extends Intent {
  constructor() {
    super('Response actions.intent.TRANSACTION_DECISION');
  }

  async control(agent: Agent) {
    const arg = agent.conv.arguments.get('TRANSACTION_DECISION_VALUE');
    console.log(arg);
    agent.add('Nos a llegado tu pedido');
  }
}
