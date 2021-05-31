import { Intent } from './intent';
import { Agent } from '../infrastructure/webhook-client';

export class IntentMap {
  private intentMap = new Map<string, (agent: Agent) => void>();

  constructor(private intents: Intent[]) {}

  public get map() {
    return this.intentMap;
  }

  public add() {
    this.intents.forEach((intent) => this.intentMap.set(intent.id, intent.control));
  }
}
