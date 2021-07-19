import * as functions from 'firebase-functions';
import { https } from 'firebase-functions';
import { Response } from 'express';
import { DialogflowIntentListing } from '../../../contexts/blog/bot/infraestructure/DialogflowIntentListing';
import { QuestionsGame } from '../../../contexts/blog/bot/application/QuestionsGame';
import { CommandBatch } from '../../../contexts/api/government/application/CommandBatch';
import { JsonCommand } from '../../../contexts/api/government/infrastructure/JSONCommand';

export const questionsGameTree = functions
  .region('us-west4')
  .runWith({
    timeoutSeconds: 20,
    memory: '8GB',
  })
  .https.onRequest(async (req: https.Request | any, response: Response) => {
    const dialogflowListing = new DialogflowIntentListing();
    const questionsGame = new QuestionsGame(dialogflowListing);
    const tree = await questionsGame.adapt();
    return CommandBatch.getInstance().addCommand(new JsonCommand(response)).execute(tree);
  });
