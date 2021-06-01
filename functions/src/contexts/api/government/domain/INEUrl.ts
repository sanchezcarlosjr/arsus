import { StringObject } from '../../../../helpers/StringObject';

export class INEUrl extends StringObject {
  constructor(s: string) {
    console.log(s);
    super(s.match(/users%2F.*%2Fuploads%2F.*.jpg/)[0].replace(/%2F/g, '/'));
  }
}
