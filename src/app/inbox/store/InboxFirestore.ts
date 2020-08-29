import { Injectable } from '@angular/core';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { NgxsFirestorePagination } from '@core/pagination.firestore';
import { InboxItem } from './inbox.state';

@Injectable({
  providedIn: 'root',
})
export class InboxFirestore extends NgxsFirestorePagination<InboxItem> {
  protected path = 'communication';
  protected limit = 16;
  protected orderBy: 'created_at' = 'created_at';
  protected orderByDirection = 'desc';

  protected format = (article: InboxItem) => {
    article.created_at = formatDistanceToNow(article.created_at.toDate(), { locale: es });
    return article;
  };
}
