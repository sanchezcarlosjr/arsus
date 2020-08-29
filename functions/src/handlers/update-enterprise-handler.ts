import * as https from 'firebase-functions/lib/providers/https';
import { Enterprise } from '../models/enterprise';
import { EnterpriseForm } from './create-new-enterprise.handler';

export const updateEnterpriseHandler = async (body: EnterpriseForm | null, context: https.CallableContext) => {
  return new Enterprise(body, context.auth.uid).update();
};
