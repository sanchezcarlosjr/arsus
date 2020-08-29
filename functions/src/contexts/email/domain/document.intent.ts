import { Intent } from './intent';
import { Agent } from '../infraestructure/webhook-client';
import { profile } from '../../../providers/profile';

export class Document extends Intent {
  constructor() {
    super('show my [Document]');
  }

  async control(agent: Agent) {
    const user = await profile(agent.conv().user.profile.token);
    const name = user.name.split(' ')[0];
    agent.add('Tu ');
  }
}
