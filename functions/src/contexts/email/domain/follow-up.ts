import { Intent } from './intent';
import { Agent } from '../infraestructure/webhook-client';
import { Database } from '../../../database/database';
import { random } from '../../../providers/random';
import { Conversation } from './conversation';

export class FollowUpRecommendation extends Intent {
  constructor() {
    super('Response actions.intent.PERMISSION - yes');
  }

  async control(agent: Agent) {
    const conversation = new Conversation();
    conversation.loadProfileByContext(agent.context.get('conversation'));
    const name = conversation.getData().name;
    const database = new Database();
    const collection = `users/${conversation.getData().userUID}/conversations/${
      conversation.getData().conversationUID
    }/articles`;
    const articles = await database.collection(collection).index();
    const articlesWithModifiers = articles.filter((value) => value.modifiers).sort((a, b) => b.price - a.price);
    if (articlesWithModifiers.length > 0) {
      const article = articlesWithModifiers[0];
      const index = random(0, article.modifiers.length);
      const id = article.modifiers[index];
      const modifierData = await database.collection('modifiers').showData(id);
      agent.add(
        `Anotado ${name}. ¿Te gustaría agregar ${modifierData.name} por ${modifierData.price} pesos más para tu ${
          article.name.split(' ')[0]
        }?`
      );
      agent.context.set({
        name: 'modifier',
        lifespan: 5,
        parameters: {
          uid: modifierData.uid,
          price: modifierData.price,
        },
      });
    } else {
      agent.add(`Agregado, ${name} ¿te gustaría agregar algo más?`);
      agent.context.set({
        name: 'modifier',
        lifespan: 5,
        parameters: {
          uid: '',
          price: 0,
        },
      });
    }
  }
}
