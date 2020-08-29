import * as functions from 'firebase-functions';
import { YoutubeResponse } from './YoutubeSubscriptionResponse';
import { ProviderDataAdaptable } from './ProviderDataAdapter';
import { post } from 'request-promise';

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

  map(youtubeResponse: YoutubeResponse): any[] {
    return youtubeResponse.items.map((item: any) => {
      return {
        itemID: item.id,
        channelID: item.snippet.resourceId.channelId,
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
