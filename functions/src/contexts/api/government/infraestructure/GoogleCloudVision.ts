import { BucketFile } from '../../../../models/file';
import vision from '@google-cloud/vision';
import { google } from '@google-cloud/vision/build/protos/protos';

export class GoogleCloudVision {
  fullTextAnnotation: string;

  async derive(bucketFile: BucketFile) {
    await bucketFile.download();
    const client = new vision.ImageAnnotatorClient();
    const response: [google.cloud.vision.v1.IAnnotateImageResponse] = await client.textDetection(
      bucketFile.tempPathName
    );
    this.fullTextAnnotation = response[0].fullTextAnnotation.text;
    bucketFile.remove();
    return this.fullTextAnnotation;
  }
}
