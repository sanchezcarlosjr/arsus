import { InfonavitScrapper } from '../infrastructure/InfonavitScrapper';
import { Birthday } from './../domain/Birthday';
import { InfonavitResponse } from './../domain/InfonavitResponse';
import { SecuritySocialNumber } from './../domain/SecuritySocialNumber';
import { InfonavitIdQueryFinder } from '../infrastructure/InfonavitIdQueryFinder';

export class InfonavitFinder {
  constructor(private curpIdRepository: InfonavitScrapper, private infonavitIdQueryFinder: InfonavitIdQueryFinder) {}
  async find(birthday: Birthday, id: SecuritySocialNumber): Promise<InfonavitResponse> {
    return (await this.infonavitIdQueryFinder.find(id)) || this.curpIdRepository.find(id, birthday);
  }
}
