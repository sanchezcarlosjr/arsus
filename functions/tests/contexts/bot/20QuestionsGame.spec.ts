import * as mocha from 'mocha';
import { IntentCreator } from '../../../src/contexts/blog/bot/application/IntentCreator';
import { google } from '@google-cloud/dialogflow/build/protos/protos';
import { DialogflowIntentCreatorAdapter } from '../../../src/contexts/blog/bot/infraestructure/DialogflowIntentCreatorAdapter';

const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');

mocha.describe('20QuestionsGame', () => {
  const intentProvider = {
    create: (intent: any) => {
      return new Promise<google.cloud.dialogflow.v2beta1.IIntent>((resolve) => {
        resolve({
          name: 'Intent projects/arsus-production/agent/intents/08b1b830-675e-439b-b875-b55bc3eca161 created',
        });
      });
    },
  };
  const trainingPhrasesParts = ['Hello, What is weather today?', 'How is the weather today?'];
  const messageTexts = ['Rainy', 'Sunny'];
  it('should create intent', async () => {
    const intentCreator = new IntentCreator(intentProvider);
    const expr = /Intent projects\/arsus-production\/agent\/intents\/[0-9a-z\-]{36} created/g;
    const dialogflowIntentCreatorAdapter = new DialogflowIntentCreatorAdapter('A', trainingPhrasesParts, messageTexts);
    await expect(intentCreator.create(dialogflowIntentCreatorAdapter)).to.be.eventually.match(expr);
  });
  it.only('should create intent by trainingPhrasesParts and message texts', async () => {
    const spy = sinon.spy(intentProvider, 'create');
    const intentCreator = new IntentCreator(intentProvider);
    const dialogflowIntentCreatorAdapter = new DialogflowIntentCreatorAdapter('A', trainingPhrasesParts, messageTexts);
    await intentCreator.create(dialogflowIntentCreatorAdapter);
    const args = spy.args[0][0];
    expect(args.displayName).to.be.equal('A');
    const phrases = [
      {
        parts: [
          {
            text: trainingPhrasesParts[0],
          },
        ],
        type: 1,
      },
      {
        parts: [
          {
            text: trainingPhrasesParts[1],
          },
        ],
        type: 1,
      },
    ];
    expect(args.trainingPhrases).to.be.eql(phrases);
    const messages = [
      {
        text: {
          text: messageTexts,
        },
      },
    ];
    expect(args.messages).to.be.eql(messages);
  });
});
