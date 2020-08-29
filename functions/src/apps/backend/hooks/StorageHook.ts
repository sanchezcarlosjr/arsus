import * as functions from 'firebase-functions';
import { triggerStorageHandler } from '../../../handlers/trigger-storage.handler';

export const triggerStorage = functions
  .runWith({
    timeoutSeconds: 120,
    memory: '2GB',
  })
  .storage.object()
  .onFinalize(triggerStorageHandler);
