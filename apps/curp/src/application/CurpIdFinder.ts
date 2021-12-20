import { CurpResponse } from '../domain/CurpResponse.js';
import { CurpIdRepository } from '../domain/CurpIdRepository.js';
import { CurpId } from '../domain/CurpId.js';
import { CurpIdQueryFinder } from '../infrastructure/CurpIdQueryFinder.js';

export class CurpIdFinder {
  constructor(private curpIdRepository: CurpIdRepository, private curpIdQueryFinder: CurpIdQueryFinder) {}
  async find(id: CurpId): Promise<CurpResponse> {
    return (await this.curpIdQueryFinder.search(id)) || (await this.curpIdRepository.search(id));
  }
}
