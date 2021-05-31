import * as admin from 'firebase-admin';

const fs = require('fs');
const path = require('path');
const os = require('os');

export class StreamWrapper {
  constructor(private readonly filePath: string, private stream: any) {
    this.filePath = path.join(os.tmpdir(), filePath);
  }

  async write(destination: string, contentType?: string) {
    const file = fs.createWriteStream(this.filePath);
    this.stream.pipe(file);
    const bucket = admin.storage().bucket();
    await bucket.upload(this.filePath, {
      destination,
      metadata: {
        contentType,
      },
    });
    const fileFromBucket = await bucket.file(destination);
    const today = new Date();
    today.setFullYear(today.getFullYear() + 5);
    const urls = await fileFromBucket.getSignedUrl({
      action: 'read',
      expires: today,
    });
    return urls[0];
  }
}

export class BucketFile {
  private readonly _uid: string;

  constructor(private filePath: string) {
    this._uid = this.filePath.split('/')[2];
  }

  private _tempPathName = '';

  get tempPathName() {
    return this._tempPathName;
  }

  get uid() {
    return this._uid;
  }

  readAsStream() {
    return fs.createReadStream(this.tempPathName);
  }

  read<T>(parse: (arg: any) => any) {
    return parse(fs.readFileSync(this.tempPathName));
  }

  remove() {
    fs.unlinkSync(this.tempPathName);
  }

  async download() {
    const fileName = path.basename(this.filePath);
    const bucket = admin.storage().bucket('gs://arsus-production.appspot.com');
    this._tempPathName = path.join(os.tmpdir(), fileName);
    try {
      await bucket.file(this.filePath).download({ destination: this._tempPathName });
    } catch (e) {
      console.warn(e);
    }
  }
}
