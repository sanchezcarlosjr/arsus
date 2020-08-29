import { StringObject } from '../../../helpers/StringObject';

export class EmailText extends StringObject {
  constructor(text: string, subject: string) {
    super(text.trim() || subject.trim());
  }
}
