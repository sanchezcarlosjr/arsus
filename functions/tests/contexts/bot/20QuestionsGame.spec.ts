import * as mocha from 'mocha';
import { IntentCreator } from '../../../src/contexts/blog/bot/application/IntentCreator';
import { google } from '@google-cloud/dialogflow/build/protos/protos';
import { DialogflowIntentCreatorAdapter } from '../../../src/contexts/blog/bot/infraestructure/DialogflowIntentCreatorAdapter';
import { DialogflowIntentCreator } from '../../../src/contexts/blog/bot/infraestructure/DialogflowIntentCreator';
import { DialogflowIntentListing } from '../../../src/contexts/blog/bot/infraestructure/DialogflowIntentListing';
import { QuestionsGame } from '../../../src/contexts/blog/bot/application/QuestionsGame';

const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');

mocha.describe('20QuestionsGame', () => {
  const intentProvider = {
    create: (intent: any) => {
      return new Promise<google.cloud.dialogflow.v2beta1.IIntent>((resolve) => {
        resolve({
          name: 'projects/arsus-production/agent/intents/08b1b830-675e-439b-b875-b55bc3eca161',
        });
      });
    },
  };
  const trainingPhrasesParts = ['Hello, What is weather today?', 'How is the weather today?'];
  const messageTexts = ['Rainy', 'Sunny'];
  it('should list intents', async () => {
    const dialogflowListing = new DialogflowIntentListing();
    await dialogflowListing.list();
  });
  it('should filter intents', async () => {
    const dialogflowListing = new DialogflowIntentListing();
    const questionsGame = new QuestionsGame(dialogflowListing);
    const response = await questionsGame.adapt();
    expect(response.name).to.eq('0');
    expect(response.children[0].name).to.eq('1');
    expect(response.children[0].children[0].name).to.eq('3');
    expect(response.children[0].children[1].name).to.eq('4');
  });
  it('should create intents with parent', async () => {
    const intentCreator = new IntentCreator(new DialogflowIntentCreator());
    const dialogflowIntentCreatorAdapter = new DialogflowIntentCreatorAdapter({
      displayName: 'A',
      trainingPhrasesParts,
      messageTexts,
      hasOutputContext: true,
      parentFollowupIntentName: 'f60fb8f3-92b4-419e-9668-a7be825ee4b3',
      inputContextNames: ['20questionsgamecharacters-followup'],
    });
    await intentCreator.create('id', dialogflowIntentCreatorAdapter);
  });
  it('should create intent', async () => {
    const intentCreator = new IntentCreator(intentProvider);
    const dialogflowIntentCreatorAdapter = new DialogflowIntentCreatorAdapter({
      displayName: 'A',
      trainingPhrasesParts,
      messageTexts,
    });
    await intentCreator.create('id', dialogflowIntentCreatorAdapter);
  });
  it('should create intent by trainingPhrasesParts and message texts', async () => {
    const spy = sinon.spy(intentProvider, 'create');
    const intentCreator = new IntentCreator(intentProvider);
    const dialogflowIntentCreatorAdapter = new DialogflowIntentCreatorAdapter({
      displayName: 'A',
      trainingPhrasesParts,
      messageTexts,
    });
    await intentCreator.create('id', dialogflowIntentCreatorAdapter);
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
