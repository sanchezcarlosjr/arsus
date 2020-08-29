import { CreatorContentProvider } from '../application/CreatorContentProvider';
import { Article } from '../domain/Article';

const functions = require('firebase-functions');
const request = require('request-promise');
import moment = require('moment');

export class NewsApi implements CreatorContentProvider {
  private options = {
    uri: 'https://newsapi.org/v2/top-headlines',
    qs: {
      category: 'technology',
      country: 'us',
      pageSize: 10,
    },
    headers: {
      'x-api-key': functions.config().newsapi.key,
    },
    json: true,
  };

  constructor() {}

  private static uniqueArticles(articles: Article[]) {
    return Array.from(new Set(articles.map((article) => article.title))).map((title) => {
      return articles.find((article) => article.title === title);
    });
  }

  async run(): Promise<Article[]> {
    const start = moment().subtract(2, 'hour');
    const today = new Date();
    let isASafeImage: RegExp;
    isASafeImage = /https:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/;
    const deleteProviderNameFromTitle = /.*(?= -)/;
    const response = await request(this.options);
    return NewsApi.uniqueArticles(response.articles).filter((article: any) => {
      const matches = article.url.match(/https:\/\/www.youtube.com\/watch\?v=(.+)/);
      if (matches) {
        article.styles = {
          width: '100%',
          height: '360px',
        };
        article.urlToImage = `https://www.youtube.com/embed/${matches[1]}`;
        article.type = 'video';
      } else {
        article.type = 'newspaper';
      }
      article.title = article.title.match(deleteProviderNameFromTitle)[0];
      article.publishedAt = new Date(article.publishedAt);
      return (
        article.urlToImage &&
        isASafeImage.test(article.urlToImage) &&
        moment(article.publishedAt).isBetween(start, today)
      );
    });
  }
}
