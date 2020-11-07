import { InfonavitScrapper } from '../infraestructure/InfonavitScrapper';
import { Birthday } from './../domain/Birthday';
import { InfonavitResponse } from './../domain/InfonavitResponse';
import { SecuritySocialNumber } from './../domain/SecuritySocialNumber';
import { InfonavitIdQueryFinder } from './../infraestructure/InfonavitIdQueryFinder';

export class InfonavitFinder {
    constructor(private curpIdRepository: InfonavitScrapper, private infonavitIdQueryFinder: InfonavitIdQueryFinder) { }
    async find(id: SecuritySocialNumber, birthday: Birthday): Promise<InfonavitResponse> {
        return (await this.infonavitIdQueryFinder.find(id)) || (await this.curpIdRepository.find(id, birthday));
    }
}
