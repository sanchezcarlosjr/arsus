import * as functions from 'firebase-functions';
import { https } from 'firebase-functions';
import { INEValidator } from '../../../contexts/api/government/application/INEValidator';
import { INEGoogleCloudVision } from '../../../contexts/api/government/application/INEGoogleCloudVision';
import { GoogleCloudVision } from '../../../contexts/api/government/infrastructure/GoogleCloudVision';
import { BucketFile } from '../../../models/file';

interface INERequest {
  obverseUrl: string;
  backUrl: string;
}

export const validateINE = functions
  .runWith({
    timeoutSeconds: 20,
    memory: '2GB',
  })
  .https.onCall(async (data: INERequest, context: https.CallableContext) => {
    const validator = new INEValidator(
      context.auth.uid,
      new INEGoogleCloudVision(new GoogleCloudVision(), new BucketFile(data.obverseUrl), new BucketFile(data.backUrl))
    );
    return validator.validate();
  });
