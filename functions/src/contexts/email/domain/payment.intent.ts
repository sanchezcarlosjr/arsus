import { Intent } from './intent';
import { Agent } from '../infraestructure/webhook-client';
import { Order } from '../../../models/order';
import { Database } from '../../../database/database';
import { Conversation } from './conversation';
import { GooglePay } from '../../../providers/stripe';

export class PaymentMethods extends Intent {
  constructor() {
    super('PaymentMethods');
  }

  async control(agent: Agent) {
    const conversation = new Conversation();
    conversation.loadProfileByContext(agent.context.get('conversation'));
    const database = new Database();
    const order = await database
      .collection(`users/${conversation.getData().userUID}/conversations`)
      .showData(conversation.getData().conversationUID);
    const querySnapshot = await database
      .collection(
        `users/${conversation.getData().userUID}/conversations/${conversation.getData().conversationUID}/articles`
      )
      .index();
    const modifier = agent.context.get('modifier').parameters;
    let total = Number(order.total);
    const articles = querySnapshot.filter((value) => value.modifiers).sort((a, b) => b.price - a.price);
    if (!articles && articles.length === 0) {
      agent.add('Agrega artículos para continuar');
      return null;
    }
    if (modifier) {
      articles[0].modifiers = [modifier.uid];
      total = order.total + Number(modifier.price ? modifier.price : 0);
    }
    const coords = agent.conv().device.location.coordinates;
    const body = {
      userUID: conversation.getData().userUID,
      total: `$${total}`,
      saving: order.saving,
      subTotal: order.subTotal,
      articles,
      address: '',
      coords,
      thereIsAnArticleForSeniors: articles.filter((value) => value.isForSeniors).length > 0,
      photo: '',
      time: `${order.time} minutos`,
      payment: agent.parameters.PaymentMethods,
      priority: 'low',
      delivery: order.delivery,
      status: 'Recibido',
      comments: agent.parameters.comments,
      driverPhotoURL: '',
    };
    switch (agent.parameters.PaymentMethods) {
      case 'Efectivo':
        agent.add(
          'Entendido, tu forma de pago es Efectivo. Tu pedido esta en camino! Puedes ver el progreso en arsuslife.com'
        );
        return new Order(body, conversation.getData().userUID).action();
      case 'Tarjeta':
        agent.add(`Entendido, tu forma es Tarjeta. Debemos confirmar tu orden.`);
        const conv = agent.conv();
        const googlePay = new GooglePay(
          conv.sandbox,
          articles,
          conversation.getData().conversationUID,
          body.subTotal,
          total
        );
        const transactionDecision = googlePay.getTransactionDecision();
        console.log(transactionDecision);
        conv.ask(transactionDecision);
        return agent.add(conv);
      case 'Criptomoneda':
        agent.add('Tu forma de pago aun no es valida. Intentalo de nuevo en unas semanas');
        break;
    }
  }
}
