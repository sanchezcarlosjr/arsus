import { Intent } from './intent';
import { Agent } from '../infrastructure/webhook-client';
import { PermissionFactory } from './conversation';

export class Permission extends Intent {
  constructor() {
    super('Response actions.intent.PERMISSION');
  }

  async control(agent: Agent) {
    const userCoords = agent.conv().device.location.coordinates;
    const token = agent.conv().user.profile.token;
    const { response, context } = await new PermissionFactory(token, agent.context).factory(userCoords);
    agent.add(response);
    agent.context.set(context);
  }
}
