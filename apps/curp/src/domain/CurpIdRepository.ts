import { CurpResponse } from './CurpResponse.js';
import { CurpId } from './CurpId.js';

export abstract class CurpIdRepository {
  abstract search(id: CurpId): Promise<CurpResponse | { error: string } | null>;
}
