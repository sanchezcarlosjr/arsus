import { Response } from 'express';
import * as functions from 'firebase-functions';
import { https } from 'firebase-functions';
import { CommandBatch } from '../../../contexts/api/government/application/CommandBatch';
import { InfonavitFinder } from '../../../contexts/api/government/application/InfonavitFinder';
import { ensureIsValidApiKey } from '../../../contexts/api/government/domain/ApiKey';
import { Birthday } from '../../../contexts/api/government/domain/Birthday';
import { SecuritySocialNumber } from '../../../contexts/api/government/domain/SecuritySocialNumber';
import { JsonCommand } from '../../../contexts/api/government/infraestructure/JSONCommand';
import { QuotaCounter } from '../../../contexts/api/government/infraestructure/QuotaCounter';
import { InfonavitIdQueryFinder } from './../../../contexts/api/government/infraestructure/InfonavitIdQueryFinder';
import { InfonavitScrapper } from './../../../contexts/api/government/infraestructure/InfonavitScrapper';

const infonavitFinder = new InfonavitFinder(new InfonavitScrapper(), new InfonavitIdQueryFinder());

export const infonavit = functions
    .runWith({
        timeoutSeconds: 300,
        memory: '2GB',
    })
    .https.onRequest(async (req: https.Request | any, response: Response) => {
        try {
            await ensureIsValidApiKey(req.query.apiKey);
            const infonavitResponse = await infonavitFinder.find(
                new Birthday(req.query.birthday),
                new SecuritySocialNumber(req.query.nss)
            );
            return CommandBatch.getInstance().
                addCommand(new QuotaCounter(req.query.apiKey)).
                addCommand(new JsonCommand(response)).
                execute(infonavitResponse);
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
