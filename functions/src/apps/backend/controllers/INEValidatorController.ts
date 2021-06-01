import * as functions from 'firebase-functions';
import { https } from 'firebase-functions';
import { INEValidator } from '../../../contexts/api/government/application/INEValidator';
import { INEGoogleCloudVision } from '../../../contexts/api/government/application/INEGoogleCloudVision';
import { GoogleCloudVision } from '../../../contexts/api/government/infrastructure/GoogleCloudVision';
import { BucketFile } from '../../../models/file';
import { INEUrl } from '../../../contexts/api/government/domain/INEUrl';

interface INERequest {
  obverseUrl: string;
  backUrl: string;
}

export const validateINE = functions
  .runWith({
    timeoutSeconds: 300,
    memory: '2GB',
  })
  .https.onCall(async (data: INERequest, context: https.CallableContext) => {
    const validator = new INEValidator(
      context.auth.uid,
      new INEGoogleCloudVision(
        new GoogleCloudVision(),
        new BucketFile(new INEUrl(data.obverseUrl).value),
        new BucketFile(new INEUrl(data.backUrl).value)
      )
    );
    return validator.validate();
  });
