import { Response } from 'express';
import admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { https } from 'firebase-functions';
import { CurpIdFinder } from '../../../contexts/api/government/application/CurpIdFinder';
import { ensureIsValidApiKey } from '../../../contexts/api/government/domain/ApiKey';
import { CurpId } from '../../../contexts/api/government/domain/CurpId';
import { CurpIdQueryFinder } from '../../../contexts/api/government/infraestructure/CurpIdQueryFinder';
import { CurpIdScraper } from '../../../contexts/api/government/infraestructure/CurpIdScraper';
import { CurpResponse } from './../../../contexts/api/government/domain/CurpResponse';

interface Command {
  execute: (curpResponse?: CurpResponse) => any;
}

export class QuotaCounter implements Command {
  constructor(private apiKey: string) { }
  execute() {
    const date = new Date();
    const ref = admin.firestore().collection(`users/${this.apiKey}/quota`).
      doc(`${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`);
    return ref.update('quota', admin.firestore.FieldValue.increment(1)).catch(
      () => ref.set({
        quota: 1
      })
    );
  }
}

export class CURPResponseCommand implements Command {
  constructor(private curpWasFindOnAPI: boolean) { }
  execute(curpResponse: CurpResponse) {
    if (this.curpWasFindOnAPI) {
      return null;
    }
    return admin.firestore().collection('id').doc(curpResponse.curp).set(curpResponse);
  }
}

export class JsonCommand implements Command {
  constructor(private response: Response, private code: number = 200) { }
  execute(curpResponse: CurpResponse) {
    this.response.setHeader('Content-Type', 'application/json');
    this.response.set('Access-Control-Allow-Origin', '*');
    this.response.set('Access-Control-Allow-Methods', 'GET');
    return this.response.status(this.code).send(curpResponse);
  }
}

export class CommandBatch {
  private static INSTANCE: CommandBatch;
  private constructor(private commands: Command[] = []) { }
  public static getInstance() {
    if (!CommandBatch.INSTANCE) {
      CommandBatch.INSTANCE = new CommandBatch();
    }
    return CommandBatch.INSTANCE;
  }
  public addCommand(command: Command) {
    this.commands.push(command);
    return this;
  }
  public execute(response: any): any {
    while (this.commands.length > 1) {
      this.commands.pop().execute(response);
    }
    return this.commands.pop().execute(response);
  }
}

export const curp = functions
  .runWith({
    timeoutSeconds: 70,
    memory: '2GB',
  })
  .https.onRequest(async (req: https.Request | any, response: Response) => {
    response.set('Access-Control-Allow-Origin', '*');
    response.set('Access-Control-Allow-Methods', 'GET');
    try {
      await ensureIsValidApiKey(req.query.apiKey);
      const curpResponse = await new CurpIdFinder(new CurpIdScraper(), new CurpIdQueryFinder())
        .find(
          new CurpId(req.query.curp)
        );
      return CommandBatch.getInstance().
        addCommand(new QuotaCounter(req.query.apiKey)).
        addCommand(new JsonCommand(response)).
        execute(curpResponse);
    } catch (e) {
      console.warn(e);
      return CommandBatch.getInstance().
        addCommand(new JsonCommand(response, 400)).
        execute({
          error: e.message
        });
    }
  });
