import { Injectable } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { FetchNews, GetNews } from '@app/portfolio/news/news.actions';
import {
  Emitted,
  NgxsFirestoreConnect,

  StreamEmitted
} from '@ngxs-labs/firestore-plugin';
import { Action, NgxsOnInit, Selector, State, StateContext } from '@ngxs/store';
import { append, patch } from '@ngxs/store/operators';
import { NewsFirestore } from './news.firestore';

export interface Source {
  id?: string;
  name: string;
}

export interface Article {
  source?: Source;
  author?: string;
  title?: string;
  description?: string;
  url?: string;
  styles?: any;
  audio?: any;
  urlToImage?: SafeResourceUrl | string | number;
  publishedAt?: any;
  content?: string;
  uid?: string;
  type?: string;
}

export interface NewsStateModel {
  items: Article[];
}

@State<NewsStateModel>({
  name: 'news',
  defaults: {
    items: [],
  },
})
@Injectable()
export class NewsState implements NgxsOnInit {
  constructor(private firestore: NewsFirestore, private ngxsFirestoreConnect: NgxsFirestoreConnect) {}

  @Selector()
  static articles(state: NewsStateModel) {
    return state.items;
  }

  ngxsOnInit(ctx?: StateContext<any>): void | any {
    this.ngxsFirestoreConnect.connect(GetNews, {
      to: () => this.firestore.collection$(),
    });
  }

  @Action(StreamEmitted(GetNews))
  getEmitted(ctx: StateContext<NewsStateModel>, { action, payload }: Emitted<GetNews, Article[]>) {
    ctx.setState(
      patch({
        items: append([...payload]),
      })
    );
  }

  @Action(FetchNews)
  fetch(ctx: StateContext<NewsStateModel>, { payload }: FetchNews) {
    this.firestore.fetch(payload);
  }
}
