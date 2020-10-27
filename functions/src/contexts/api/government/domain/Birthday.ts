import { DateObject } from './../../../../helpers/StringObject';
export class Birthday extends DateObject {
    constructor(birthday: string) {
        super(birthday, "DD/MM/YYYY");
    }
}
