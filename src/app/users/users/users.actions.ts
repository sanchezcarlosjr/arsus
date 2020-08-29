import { PayloadFetch } from '@core/pagination.firestore';

export class GetUsers {
  public static readonly type = '[USERS] Get By User';
  constructor(public payload?: PayloadFetch) {}
}

export class FetchUsers {
  public static readonly type = '[USERS] Fetch';

  constructor(public payload?: PayloadFetch) {}
}
