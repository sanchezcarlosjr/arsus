import { CurpIdRepository } from '../domain/CurpIdRepository.js';
import { CurpId } from '../domain/CurpId.js';

export class CurpIdFinder {
  private readonly _curpIdRepositories: CurpIdRepository[];

  constructor(...curpIdRepository: CurpIdRepository[]) {
    this._curpIdRepositories = curpIdRepository;
  }

  async find(id: CurpId) {
    for (const curpIdRepository of this._curpIdRepositories) {
      const t = await curpIdRepository.search(id);
      if (t !== null) {
        return t;
      }
    }
    throw new Error('Server error. CURP not found.');
  }
}
