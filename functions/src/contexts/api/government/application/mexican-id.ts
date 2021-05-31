import { Database } from '../../../../database/database';

import vision from '@google-cloud/vision';

export class MexicanId {
  private database = new Database();

  constructor(private temp: any) {}

  public async store(collection: string, id: string): Promise<null> {
    const client = new vision.ImageAnnotatorClient();
    return new Promise(async (resolve, reject) => {
      try {
        const response: any = await client.textDetection(this.temp);
        return this.database.collection(collection).storeWith(id, {
          fullTextAnnotation: response[0].fullTextAnnotation.text,
        });
      } catch (e) {
        reject(e);
      }
    });
  }
}
