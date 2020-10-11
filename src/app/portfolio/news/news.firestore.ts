import { Injectable } from '@angular/core';
import { Article } from '@app/portfolio/news/news.state';
import { NgxsFirestorePagination } from '@core/pagination.firestore';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

@Injectable({
  providedIn: 'root',
})
export class NewsFirestore extends NgxsFirestorePagination<Article> {
  protected path = 'content';
  protected limit = 5;
  protected orderBy: 'publishedAt' = 'publishedAt';
  protected orderByDirection = 'desc';

  protected format = (article: Article) => {
    article.publishedAt = formatDistanceToNow(article.publishedAt.toDate(), { locale: es, addSuffix: true });
    return article;
  };
}
