import { Agent } from '../infrastructure/webhook-client';

export abstract class Intent {
  constructor(private name: string) {}

  get id() {
    return this.name;
  }

  abstract control(agent: Agent): void;
}
