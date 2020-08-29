import { Injectable } from '@angular/core';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { NgxsFirestorePagination } from '@core/pagination.firestore';
import { AuthenticationStateModel } from '../../../store/auth/auth.state';

@Injectable({
  providedIn: 'root',
})
export class UsersFirestore extends NgxsFirestorePagination<AuthenticationStateModel> {
  protected path = 'users';
  protected limit = 20;
  protected orderBy: 'created_at' = 'created_at';
  protected orderByDirection = 'desc';

  protected format = (article: AuthenticationStateModel) => {
    article.created_at = article.created_at.toDate();
    return article;
  };
}
