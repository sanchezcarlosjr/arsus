import { CreatorContentProvider } from '../application/CreatorContentProvider';
import { Article } from '../domain/Article';
import moment = require('moment');
const request = require('request-promise');

export class Podcast implements CreatorContentProvider {
  private readonly option = {
    uri: `https://listen-api.listennotes.com/api/v2/best_podcasts`,
    headers: {
      'X-ListenApi-Key': '',
    },
    json: true,
  };

  constructor() { }

  async run(): Promise<Article[]> {
    const articles: Article[] = [];
    const response = await request(this.option);
    const start = moment().subtract(6, 'hour');
    const today = new Date();
    const promise = response.podcasts
      .filter((podcast: any) => {
        podcast.publishedAt = new Date(podcast.latest_pub_date_ms);
        return moment(podcast.publishedAt).isBetween(start, today);
      })
      .map(async (podcast: any) => {
        const publish = await request(this.getPodcast(podcast.id));
        articles.push({
          source: {
            name: podcast.title,
          },
          title: publish.episodes[0].title,
          publishedAt: podcast.publishedAt,
          description: publish.episodes[0].description,
          audio: publish.episodes[0].audio,
          url: publish.episodes[0].link,
          urlToImage: publish.episodes[0].image,
          type: 'podcast',
        });
      });
    await Promise.all(promise);
    return articles;
  }

  private getPodcast = (podcastID: number) => {
    return {
      uri: `https://listen-api.listennotes.com/api/v2/podcasts/${podcastID}`,
      qs: {
        sort: 'recent_first',
      },
      headers: {
        'X-ListenApi-Key': '',
      },
      json: true,
    };
  };
}
