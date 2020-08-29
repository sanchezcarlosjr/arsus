import { Article } from '../domain/Article';
import { CreatorContentProvider } from '../application/CreatorContentProvider';
import * as functions from 'firebase-functions';
import { filterPublishedBetween, from, Operator } from '../application/FeederEvent';

export interface Item {
  channelID: string;
  itemID: string;
}

export interface YoutubeDocument {
  created_at: number;
  subscriptions: Item[];
}

const map: Operator = (parseResponse: any): Article => {
  const videoId = parseResponse.feed.entry[0]['yt:videoId'][0];
  return {
    source: {
      name: parseResponse.feed.title[0],
    },
    styles: {
      width: '100%',
      height: '390px',
    },
    title: parseResponse.feed.entry[0]['media:group'][0]['media:title'][0],
    description: parseResponse.feed.entry[0]['media:group'][0]['media:description'][0],
    url: `https://www.youtube.com/watch?v=${videoId}`,
    urlToImage: `https://www.youtube.com/embed/${videoId}`,
    publishedAt: new Date(parseResponse.feed.entry[0].published[0]),
    type: 'video',
  };
};

const switchMap: Operator = (subscriptions: YoutubeDocument) =>
  Promise.all(
    subscriptions.subscriptions.map((subscription) =>
      from(`https://www.youtube.com/feeds/videos.xml?channel_id=${subscription.channelID}`, 'xml')
        .pipe(map)
        .toObjectPromise()
    )
  );

export class Youtube implements CreatorContentProvider {
  async run(): Promise<Article[]> {
    return from(`users/${functions.config().google.userid}/providers/YOUTUBE`, 'database')
      .pipe(switchMap, filterPublishedBetween)
      .toPromise();
  }
}
