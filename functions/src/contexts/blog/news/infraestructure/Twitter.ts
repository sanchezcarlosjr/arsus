import { CreatorContentProvider } from '../application/CreatorContentProvider';
import { Article } from '../domain/Article';
import * as functions from 'firebase-functions';
import { OAuth } from '../../../shared/OAuth';
import { filterPublishedBetween, from, Operator } from '../application/FeederEvent';
import moment = require('moment');

export interface UserMention {
  screen_name: string;
  name: string;
  id: any;
  id_str: string;
  indices: number[];
}

export interface Url {
  url: string;
  expanded_url: string;
  display_url: string;
  indices: number[];
}

export interface Entities {
  hashtags: any[];
  symbols: any[];
  user_mentions: UserMention[];
  urls: Url[];
}

export interface Url3 {
  url: string;
  expanded_url: string;
  display_url: string;
  indices: number[];
}

export interface Url2 {
  urls: Url3[];
}

export interface Description {
  urls: any[];
}

export interface Entities2 {
  url: Url2;
  description: Description;
}

export interface User {
  id: number;
  id_str: string;
  name: string;
  screen_name: string;
  location: string;
  description: string;
  url: string;
  entities: Entities2;
  protected: boolean;
  followers_count: number;
  friends_count: number;
  listed_count: number;
  created_at: string;
  favourites_count: number;
  utc_offset?: any;
  time_zone?: any;
  geo_enabled: boolean;
  verified: boolean;
  statuses_count: number;
  lang?: any;
  contributors_enabled: boolean;
  is_translator: boolean;
  is_translation_enabled: boolean;
  profile_background_color: string;
  profile_background_image_url: string;
  profile_background_image_url_https: string;
  profile_background_tile: boolean;
  profile_image_url: string;
  profile_image_url_https: string;
  profile_banner_url: string;
  profile_link_color: string;
  profile_sidebar_border_color: string;
  profile_sidebar_fill_color: string;
  profile_text_color: string;
  profile_use_background_image: boolean;
  has_extended_profile: boolean;
  default_profile: boolean;
  default_profile_image: boolean;
  following: boolean;
  follow_request_sent: boolean;
  notifications: boolean;
  translator_type: string;
}

export interface UserTimelineResponse {
  created_at: string;
  id: any;
  id_str: string;
  text: string;
  truncated: boolean;
  entities: Entities;
  source: string;
  in_reply_to_status_id: any;
  in_reply_to_status_id_str: string;
  in_reply_to_user_id: any;
  in_reply_to_user_id_str: string;
  in_reply_to_screen_name: string;
  user: User;
  geo?: any;
  coordinates?: any;
  place?: any;
  contributors?: any;
  is_quote_status: boolean;
  retweet_count: number;
  favorite_count: number;
  favorited: boolean;
  retweeted: boolean;
  lang: string;
  possibly_sensitive?: boolean;
}

const map: Operator = (tweets: UserTimelineResponse[]): Article => {
  return {
    source: {
      name: tweets[0].user.name,
    },
    title: '',
    description: '',
    publishedAt: moment(tweets[0]?.created_at, 'dd MMM DD HH:mm:ss ZZ YYYY', 'en').toDate(),
    urlToImage: tweets[0].id_str,
    url: ``,
    type: 'tweet',
  };
};

const switchMap: Operator = (subscriptions: any) =>
  Promise.all(
    subscriptions.subscriptions.map((subscription: any) =>
      from(
        `https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=${subscription.channelID}&count=3`,
        'json',
        new OAuth().getHeaders({
          url: `https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=${subscription.channelID}&count=3`,
          accessToken: {
            key: '',
            secret: '',
          },
        })
      )
        .pipe(map)
        .toObjectPromise()
    )
  );

export class Twitter implements CreatorContentProvider {
  async run(): Promise<Article[]> {
    return from(`users/${functions.config().google.userid}/providers/TWITTER`, 'database')
      .pipe(switchMap, filterPublishedBetween)
      .toPromise();
  }
}
