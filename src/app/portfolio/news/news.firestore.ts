import { Injectable } from '@angular/core';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { NgxsFirestorePagination } from '@core/pagination.firestore';
import { Article } from '@app/portfolio/news/news.state';

@Injectable({
  providedIn: 'root',
})
export class NewsFirestore extends NgxsFirestorePagination<Article> {
  protected path = 'content';
  protected limit = 5;
  protected orderBy: 'publishedAt' = 'publishedAt';
  protected orderByDirection = 'desc';

  protected format = (article: Article) => {
    article.publishedAt = formatDistanceToNow(article.publishedAt.toDate(), { locale: es });
    return article;
  };
}
