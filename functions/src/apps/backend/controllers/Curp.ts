import { Response } from 'express';
import * as functions from 'firebase-functions';
import { https } from 'firebase-functions';
import { CurpIdFinder } from '../../../contexts/api/government/application/CurpIdFinder';
import { ensureIsValidApiKey } from '../../../contexts/api/government/domain/ApiKey';
import { CurpId } from '../../../contexts/api/government/domain/CurpId';
import { CurpIdQueryFinder } from '../../../contexts/api/government/infraestructure/CurpIdQueryFinder';
import { CurpIdScraper } from '../../../contexts/api/government/infraestructure/CurpIdScraper';
import { CommandBatch } from './../../../contexts/api/government/application/CommandBatch';
import { JsonCommand } from './../../../contexts/api/government/infraestructure/JSONCommand';
import { QuotaCounter } from './../../../contexts/api/government/infraestructure/QuotaCounter';

export const curp = functions
  .runWith({
    timeoutSeconds: 70,
    memory: '2GB',
  })
  .https.onRequest(async (req: https.Request | any, response: Response) => {
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
        addCommand(new QuotaCounter(req.query.apiKey)).
        addCommand(new JsonCommand(response, 400)).
        execute({
          error: e.message
        });
    }
  });
