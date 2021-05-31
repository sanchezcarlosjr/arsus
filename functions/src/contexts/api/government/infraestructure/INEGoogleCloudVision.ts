import { INEVision } from '../domain/INEVision';
import { INEModel, INEModelC, INEModelD, INEModelEFGH, INEVisionResponse } from '../domain/INE';
import { BucketFile } from '../../../../models/file';
import vision from '@google-cloud/vision';
import { google } from '@google-cloud/vision/build/protos/protos';
import { CurpId } from '../domain/CurpId';
import { StringObject } from '../../../../helpers/StringObject';

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

export class INEModelType extends StringObject {
  constructor(value: string) {
    super(value);
    this.value = !!value.match(/NACIO/) ? 'INEModelEFGH' : 'INEModelD';
  }

  factory(): INEModel {
    switch (this.value) {
      case 'INEModelEFGH':
        return new INEModelEFGH('', '');
      case 'INEModelD':
        return new INEModelD('', '');
      case 'INEModelC':
        return new INEModelC('', '', '');
      default:
        return null;
    }
  }
}

export class INEGoogleCloudVision implements INEVision {
  constructor(
    private googleCloudVision: GoogleCloudVision,
    private observeFile: BucketFile,
    private backFile: BucketFile
  ) {}

  async derive(): Promise<INEVisionResponse> {
    const obverseText = await this.googleCloudVision.derive(this.observeFile);
    const backText = await this.googleCloudVision.derive(this.backFile);
    return {
      type: new INEModelType(obverseText).factory().match(obverseText, backText),
      curp: new CurpId(obverseText).value,
    };
  }
}
