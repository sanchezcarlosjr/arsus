import { Response } from 'express';
import * as functions from 'firebase-functions';
import { https } from 'firebase-functions';
import { InfonavitFinder } from '../../../contexts/api/government/application/InfonavitFinder';
import { ensureIsValidApiKey } from '../../../contexts/api/government/domain/ApiKey';
import { SecuritySocialNumber } from '../../../contexts/api/government/domain/SecuritySocialNumber';
import { InfonavitScrapper } from './../../../contexts/api/government/infraestructure/InfonavitScrapper';
import { CommandBatch, JsonCommand, QuotaCounter } from './Curp';

export const infonavit = functions
    .runWith({
        timeoutSeconds: 15,
        memory: '2GB',
    })
    .https.onRequest(async (req: https.Request | any, response: Response) => {
        try {
            await ensureIsValidApiKey(req.query.apiKey);
            const infonavitResponse = await new InfonavitFinder(new InfonavitScrapper())
                .find(
                    new SecuritySocialNumber(req.query.nss),
                    req.query.birthday
                );
            return CommandBatch.getInstance().
                addCommand(new QuotaCounter(req.query.apiKey)).
                addCommand(new JsonCommand(response)).
                execute(infonavitResponse);
        } catch (e) {
            console.warn(e);
            return CommandBatch.getInstance().
                addCommand(new JsonCommand(response, 400)).
                execute({
                    error: e.message
                });
        }
    });
