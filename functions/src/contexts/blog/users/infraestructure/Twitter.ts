import { ProviderDataAdaptable } from './ProviderDataAdapter';
import { OAuth } from '../../../shared/OAuth';
import { post } from 'request-promise';

export interface Urls {
  url: string;
  expanded_url: string;
  display_url: string;
  indices: number[];
}

export interface Url {
  urls: Urls[];
}

export interface Description {
  urls: any[];
}

export interface Entities {
  url: Url;
  description: Description;
}

export interface Urls {
  url: string;
  expanded_url: string;
  display_url: string;
  indices: number[];
}

export interface Entities {
  hashtags: any[];
  symbols: any[];
  user_mentions: any[];
  urls: Urls[];
}

export interface Status {
  created_at: string;
  id: number;
  id_str: string;
  text: string;
  truncated: boolean;
  entities: Entities;
  source: string;
  in_reply_to_status_id?: any;
  in_reply_to_status_id_str?: any;
  in_reply_to_user_id?: any;
  in_reply_to_user_id_str?: any;
  in_reply_to_screen_name?: any;
  geo?: any;
  coordinates?: any;
  place?: any;
  contributors?: any;
  is_quote_status: boolean;
  retweet_count: number;
  favorite_count: number;
  favorited: boolean;
  retweeted: boolean;
  possibly_sensitive: boolean;
  lang: string;
}

export interface Users {
  id: number;
  id_str: string;
  name: string;
  screen_name: string;
  location: string;
  description: string;
  url: string;
  entities: Entities;
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
  status: Status;
  contributors_enabled: boolean;
  is_translator: boolean;
  is_translation_enabled: boolean;
  profile_background_color: string;
  profile_background_image_url: string;
  profile_background_image_url_https: string;
  profile_background_tile: boolean;
  profile_image_url: string;
  profile_image_url_https: string;
  profile_link_color: string;
  profile_sidebar_border_color: string;
  profile_sidebar_fill_color: string;
  profile_text_color: string;
  profile_use_background_image: boolean;
  has_extended_profile: boolean;
  default_profile: boolean;
  default_profile_image: boolean;
  following: boolean;
  live_following: boolean;
  follow_request_sent: boolean;
  notifications: boolean;
  muting: boolean;
  blocking: boolean;
  blocked_by: boolean;
  translator_type: string;
}

export interface TwitterResponse {
  users: Users[];
  next_cursor: number;
  next_cursor_str: string;
  previous_cursor: number;
  previous_cursor_str: string;
  total_count?: any;
}

export class Twitter implements ProviderDataAdaptable {
  createOptionsFor(accessToken: { key: string; secret: string }) {
    const uri = 'https://api.twitter.com/1.1/friends/list.json';
    return {
      uri,
      headers: new OAuth().getHeaders({
        url: uri,
        includeBodyHash: true,
        accessToken,
      }),
      json: true,
    };
  }

  map(providerResponse: TwitterResponse): any[] {
    return providerResponse.users.map((user) => {
      return {
        channelID: user.screen_name,
        itemID: user.id,
      };
    });
  }
}

export class TwitterFollower {
  async follow(accessToken: { key: string; secret: string }): Promise<void> {
    const oauth = new OAuth();
    const url = 'https://api.twitter.com/1.1/friendships/create.json?screen_name=CharllierJr&follow=true';
    await post({
      url,
      headers: oauth.getHeaders({
        url,
        method: 'POST',
        includeBodyHash: true,
        accessToken,
      }),
    });
  }
}
