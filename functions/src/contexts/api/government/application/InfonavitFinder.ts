import { InfonavitScrapper } from '../infraestructure/InfonavitScrapper';
import { Birthday } from './../domain/Birthday';
import { InfonavitResponse } from './../domain/InfonavitResponse';
import { SecuritySocialNumber } from './../domain/SecuritySocialNumber';


export class InfonavitFinder {
    constructor(private curpIdRepository: InfonavitScrapper) { }
    async find(id: SecuritySocialNumber, birthday: Birthday): Promise<InfonavitResponse> {
        return this.curpIdRepository.find(id, birthday);
    }
}
