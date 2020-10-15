import * as crypto from 'crypto';
import * as functions from 'firebase-functions';
const OAuth1 = require('oauth-1.0a');

export interface OAuthHeadersOptions {
  url: string;
  method?: string;
  includeBodyHash?: boolean;
  accessToken?: { secret: string; key?: string };
}

export class OAuth {
  private consumerKey = functions.config().twitter.consumerkey;
  private consumerSecret = functions.config().twitter.consumersecret;
  private oauth: any;

  constructor() {
    this.oauth = OAuth1({
      consumer: { key: this.consumerKey, secret: this.consumerSecret },
      signature_method: 'HMAC-SHA1',
      hash_function: (base_string: string, key: string) =>
        crypto.createHmac('sha1', key).update(base_string).digest('base64'),
    });
  }

  getHeaders(options: OAuthHeadersOptions) {
    const token = options.includeBodyHash ? options.accessToken : options.accessToken.key;
    const method = options.method ? options.method : 'GET';
    return this.oauth.toHeader(
      this.oauth.authorize(
        {
          url: options.url,
          method,
          includeBodyHash: options.includeBodyHash,
        },
        token
      )
    );
  }
}
