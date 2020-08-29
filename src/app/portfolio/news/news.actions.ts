import { PayloadFetch } from '@core/pagination.firestore';

export class GetNews {
  public static readonly type = '[News] Get By Page';
}

export class FetchNews {
  public static readonly type = '[News] Fetch';
  constructor(public payload?: PayloadFetch) {}
}
