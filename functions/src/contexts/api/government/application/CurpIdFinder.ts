import { CurpResponse } from '../domain/CurpResponse';
import { CurpIdRepository } from '../domain/CurpIdRepository';
import { CurpId } from '../domain/CurpId';
import { CurpIdQueryFinder } from '../infraestructure/CurpIdQueryFinder';

export class CurpIdFinder {
  constructor(private curpIdRepository: CurpIdRepository, private curpIdQueryFinder: CurpIdQueryFinder) {}
  async find(id: CurpId): Promise<CurpResponse> {
    return (await this.curpIdQueryFinder.search(id)) || (await this.curpIdRepository.search(id));
  }
}
