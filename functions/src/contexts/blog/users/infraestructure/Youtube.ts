import * as functions from 'firebase-functions';
import { post } from 'request-promise';
import { ProviderDataAdaptable, SourceNews } from './ProviderDataAdapter';
import { YoutubeResponse } from './YoutubeSubscriptionResponse';

export class Youtube implements ProviderDataAdaptable {
  createOptionsFor(bearer: string): { uri: string; qs: any; auth: any; json: true } {
    return {
      uri: `https://www.googleapis.com/youtube/v3/subscriptions`,
      qs: {
        part: 'snippet',
        maxResults: 50,
        mine: true,
        key: functions.config().google.key,
      },
      auth: {
        bearer,
      },
      json: true,
    };
  }

  map(youtubeResponse: YoutubeResponse): SourceNews[] {
    return youtubeResponse.items.map((item: any) => {
      return {
        name: item.snippet.title,
        id: item.snippet.resourceId.channelId,
        type: 'youtube'
      };
    });
  }
}

export class YoutubeFollower {
  async follow(bearer: string) {
    post({
      uri: `https://www.googleapis.com/youtube/v3/subscriptions`,
      qs: {
        part: 'snippet',
        key: functions.config().google.key,
      },
      auth: {
        bearer,
      },
      body: {
        snippet: {
          resourceId: {
            kind: 'youtube#channel',
            channelId: 'UCUzvgrtcAM2Mj2PpqUN64Lg',
          },
        },
      },
      json: true,
    });
  }
}
