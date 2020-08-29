import { StringObject } from '../../../helpers/StringObject';

export class EmailBody extends StringObject {
  constructor(body: string) {
    const insecureLinksPattern = /['"]http?:\/\/(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\(\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+['"]/g;
    super(body.replace(insecureLinksPattern, `''`));
  }
}
