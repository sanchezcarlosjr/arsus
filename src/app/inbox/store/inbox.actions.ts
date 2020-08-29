import { PayloadFetch } from '@core/pagination.firestore';

export class GetInbox {
  public static readonly type = '[INBOX] Get By Page';
  constructor(public payload?: PayloadFetch) {}
}

export class FetchInbox {
  public static readonly type = '[INBOX] Fetch';

  constructor(public payload?: PayloadFetch) {}
}
