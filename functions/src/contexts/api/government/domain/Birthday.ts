import { DateObject } from './../../../../helpers/StringObject';
export class Birthday extends DateObject {
    constructor(birthday: string) {
        if (!birthday) {
            throw Error('invalid birthday')
        }
        super(birthday, "DD/MM/YYYY");
    }
}
