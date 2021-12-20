import { ensureIsValidApiKey } from './domain/ApiKey.js';
import { CurpIdFinder } from './application/CurpIdFinder.js';
import { CurpIdScraper } from './infrastructure/CurpIdScraper.js';
import { CurpIdQueryFinder } from './infrastructure/CurpIdQueryFinder.js';
import { CurpId } from './domain/CurpId.js';
import { CommandBatch } from './application/CommandBatch.js';
import { QuotaCounter } from './infrastructure/QuotaCounter.js';
import { JsonCommand } from './infrastructure/JSONCommand.js';
import { initializeApp } from 'firebase-admin/app';

const app = initializeApp();

export const curp = async (req: any, response: any) => {
  try {
    await ensureIsValidApiKey(req.query.apiKey);
    const curpResponse = await new CurpIdFinder(new CurpIdScraper(), new CurpIdQueryFinder()).find(
      new CurpId(req.query.curp)
    );
    return CommandBatch.getInstance()
      .addCommand(new QuotaCounter(req.query.apiKey))
      .addCommand(new JsonCommand(response))
      .execute(curpResponse);
  } catch (e) {
    console.warn(e);
    return CommandBatch.getInstance()
      .addCommand(new QuotaCounter(req.query.apiKey))
      .addCommand(new JsonCommand(response, 400))
      .execute({
        error: e.message,
      });
  }
};
