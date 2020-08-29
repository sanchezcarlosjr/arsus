import { CurpResponse } from './CurpResponse';
import { CurpId } from './CurpId';

export abstract class CurpIdRepository {
  abstract search(id: CurpId): Promise<CurpResponse>;
}
