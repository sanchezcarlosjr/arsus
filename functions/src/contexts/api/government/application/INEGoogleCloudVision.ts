import { INEVision } from '../domain/INEVision';
import { BucketFile } from '../../../../models/file';
import { CurpId } from '../domain/CurpId';
import { GoogleCloudVision } from '../infrastructure/GoogleCloudVision';
import { INEModelType } from '../domain/INEModelType';
import { INEVisionResponse } from '../domain/INEVisionResponse';

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
