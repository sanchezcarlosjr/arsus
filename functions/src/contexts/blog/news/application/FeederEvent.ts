import admin from 'firebase-admin';
import * as moment from 'moment';
import { get } from 'request-promise';
import * as xml from 'xml2js';
import { warn } from '../../../shared/Error';

export type Operator = (response: any) => any;

export const filterPublishedBetween: Operator = async (response: Promise<any[]>) => {
  const start = moment().subtract(23, 'hours');
  const today = new Date();
  return (await response).filter((item) => moment(item.publishedAt).isBetween(start, today));
};

async function factory(url: string, format: string, headers?: any): Promise<any> {
  if (format === 'xml') {
    return get(url, {
      headers,
    }).then((xmlResponse: any) => xml.parseStringPromise(xmlResponse));
  }
  if (format === 'database') {
    return await admin
      .firestore()
      .doc(url)
      .get()
      .then((document) => document.data());
  }
  return get({
    url,
    headers,
    json: true,
  });
}

export function from<JsonResponse>(
  url: string,
  format: 'xml' | 'json' | 'database' = 'json',
  headers?: any
): FeederEvent {
  const response = factory(url, format, headers);
  return new FeederEvent(response);
}

export class FeederEvent {
  private operators: Operator[] = [];

  constructor(private event: Promise<any>) {}

  pipe(...operators: Operator[]): this {
    this.operators.push(...operators);
    return this;
  }

  async toObjectPromise() {
    let event: any = null;
    try {
      event = await this.event;
    } catch (e) {
      warn(
        'contexts/blog/news/application/FeederEvent.toObjectPromise',
        57,
        `${e.message} by event=${event} and url=${e.options.url}`
      );
      if (!event) {
        return {};
      }
    }
    for (const operator of this.operators) {
      try {
        event = await operator(event);
      } catch (e) {
        warn('contexts/blog/news/application/FeederEvent.toObjectPromise', 63, e.message);
      }
    }
    return event;
  }

  async toPromise<T>(): Promise<any> {
    let event: any = await this.event;
    for (const operator of this.operators) {
      event = await Promise.all(await operator(event));
    }
    return event;
  }
}
