import { CreatorContentProvider } from '../application/CreatorContentProvider';
import { Article } from '../domain/Article';
import { get } from 'request-promise';
import { filterPublishedBetween, from, Operator } from '../application/FeederEvent';

export interface Data {
  url: string;
  title: string;
  description: string;
  links: string[];
  image: string;
  content: string;
  author: string;
  source: string;
  published: string;
  ttr: number;
}

export interface ParseArticle {
  error: number;
  message: string;
  data: Data;
}

export interface Item {
  by: string;
  descendants: number;
  id: number;
  kids: number[];
  score: number;
  time: number;
  title: string;
  text?: string;
  url?: string;
}

const urlTemplate: Operator = (response: any) => {
  return response.map((uid: string) =>
    get({
      url: `https://hacker-news.firebaseio.com/v0/item/${uid}.json`,
      json: true,
    })
  );
};

const map: Operator = (items: Item[]) => {
  return items.map((item) => {
    return {
      source: {
        name: item.by,
      },
      title: item.title,
      url: item.url || `https://news.ycombinator.com/item?id=${item.id}`,
      urlToImage: '',
      description: item.text || '',
      publishedAt: new Date(item.time * 1000),
      type: 'newspaper',
    };
  });
};

const switchMap: Operator = (response: Article[]): Promise<any>[] => {
  return response.map(async (item) => {
    if (item.description) {
      return item;
    }
    const article: ParseArticle = await get(
      `https://us-central1-technews-251304.cloudfunctions.net/article-parser?url=${item.url}`,
      {
        json: true,
      }
    );
    if (!article.data) {
      return item;
    }
    return {
      source: {
        name: article.data.author || article.data.source.replace(/.+\/\/|www.|\..+/g, '') || item.source.name,
      },
      title: item.title,
      url: article.data.url,
      urlToImage: article.data.image,
      description: article.data.content,
      publishedAt: item.publishedAt,
      type: 'newspaper',
    };
  });
};

export class HackerNews implements CreatorContentProvider {
  async run(): Promise<Article[]> {
    return from('https://hacker-news.firebaseio.com/v0/newstories.json')
      .pipe((resp: number[]) => resp.slice(0, 10), urlTemplate, map, switchMap, filterPublishedBetween)
      .toPromise();
  }
}
