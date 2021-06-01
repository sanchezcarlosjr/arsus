import { StringObject } from '../../../../helpers/StringObject';

export class INEUrl extends StringObject {
  constructor(s: string) {
    super(s.match(/users\/.*\/uploads\/.*.jpg/)[0]);
  }
}
