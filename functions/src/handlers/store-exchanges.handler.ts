import { EventContext } from 'firebase-functions';
import { Database } from '../database/database';
const request = require('request-promise');

class Exchange {
  async request() {
    const database = new Database();
    const options = {
      method: 'GET',
      url: 'https://currency-exchange.p.rapidapi.com/exchange',
      qs: { q: '1.0', from: 'USD', to: 'MXN' },
      headers: {
        'x-rapidapi-host': 'currency-exchange.p.rapidapi.com',
        'x-rapidapi-key': '',
      },
    };
    const response = await request(options);
    const mxn = Number(response);
    return database.collection('currencies').update('mxn-usd', {
      mxn,
      usd: 1 / mxn,
    });
  }
}

export const storeExchangesHandler = (context: EventContext) => {
  const exchange = new Exchange();
  return exchange.request();
};
