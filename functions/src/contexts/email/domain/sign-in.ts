import { Intent } from './intent';
import { Agent } from '../infrastructure/webhook-client';
import { DialogflowConversation, GoogleCloudDialogflowV2WebhookRequest, Suggestions } from 'actions-on-google';
import { Database } from '../../../database/database';

const { OAuth2Client } = require('google-auth-library');
const functions = require('firebase-functions');

export class SignInContext {
  constructor(private signResponse: any, private conversation: DialogflowConversation) {}

  async factory() {
    if (this.signResponse.status === 'OK') {
      return new SignInOk().ask(this.conversation);
    }
    return new SignInError().ask(this.conversation);
  }
}

export abstract class SignInStrategy {
  abstract ask(conversation: DialogflowConversation): any;
}

export class SignInOk extends SignInStrategy {
  private database = new Database();

  async ask(conversation: DialogflowConversation) {
    const CLIENT_ID = functions.config().google.client_id;
    const client = new OAuth2Client(CLIENT_ID);
    const payload = await conversation.user._verifyProfile(client, CLIENT_ID);
    const bodyDialogFlowConversation = <GoogleCloudDialogflowV2WebhookRequest>conversation.body;
    const name = payload.name.split(' ')[0];
    conversation.contexts.get('');
    const response = `${name}, ${bodyDialogFlowConversation.queryResult.fulfillmentText}`;
    conversation.ask(response);
    const articles = this.database.collection('articles').where('categoryUID', '==', 'Cerveza');
    console.log(articles);
    conversation.ask(new Suggestions('Nombre'));
    return conversation;
  }
}

export class SignInError extends SignInStrategy {
  ask(conversation: DialogflowConversation) {
    conversation.ask(`Lo sentimos, no podemos continuar.`);
    return conversation;
  }
}

export class SignIn extends Intent {
  constructor() {
    super('Google Assistant Sign in');
  }

  async control(agent: Agent) {
    const signInResponse = agent.context.get('actions_intent_sign_in').parameters.SIGN_IN;
    const signInContext = new SignInContext(signInResponse, agent.conv());
    const conversation = await signInContext.factory();
    agent.add(conversation);
  }
}
