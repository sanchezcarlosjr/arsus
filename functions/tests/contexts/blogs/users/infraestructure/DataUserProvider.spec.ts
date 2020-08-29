import { expect } from 'chai';
import * as mocha from 'mocha';
import { Twitter, TwitterFollower } from '../../../../../src/contexts/blog/users/infraestructure/Twitter';
import { ProviderDataAdapter } from '../../../../../src/contexts/blog/users/infraestructure/ProviderDataAdapter';
import { AdminWrapper } from '../../../../AdminWrapper';
import { Database } from '../../../../../src/database/database';
import * as functions from 'firebase-functions';
import { Google } from '../../../../../src/contexts/blog/users/infraestructure/Google';
import { YoutubeFollower } from '../../../../../src/contexts/blog/users/infraestructure/Youtube';

mocha.describe('Data User Provider', () => {
  const adminWrapper = new AdminWrapper();
  adminWrapper.setRealEnvironment(true);
  const userUID = functions.config().google.userid;
  const googleToken =
    'ya29.a0AfH6SMC_oE2t5VdvlBoSJk5HJsaBch7Uj9RqB1sfkyx2bev84HMIAhUm8EbRWWLrVJZTf2A5wOOJnbHQLpOFX8BX-5wEtbGClPWRy-57Ban2NL1AkXw3X1JZN5aDNYqpLyfq-7yUiRSNfjlW3MQonG7QOuar12N8M6EHVg';
  it('should get twitter friends', async () => {
    const database = new Database();
    const twitter = new Twitter();
    const providerDataAdapter = new ProviderDataAdapter('lIt7kGBih2TqGkAAdvQyubtqNMJ3', {
      key: '203054799-w4bNDD3Hekps966HpxWVoLAW1zeul6YQ1T3kCKqC',
      secret: 'HI1CCp3rc4g87hEVY7DdCOD1mhX3qxnBIQ2Xc682eelgs',
    });
    try {
      await providerDataAdapter.adapt(twitter);
    } catch (e) {
      console.log(e);
    }
    const response: any = await database.showData(`lIt7kGBih2TqGkAAdvQyubtqNMJ3/providers/TWITTER`);
    expect(!!response.subscriptions).equal(true);
  });
  it('should follow me on Twitter', async () => {
    const follower = new TwitterFollower();
    await follower.follow({
      key: '203054799-w4bNDD3Hekps966HpxWVoLAW1zeul6YQ1T3kCKqC',
      secret: 'HI1CCp3rc4g87hEVY7DdCOD1mhX3qxnBIQ2Xc682eelgs',
    });
  });
  it('should get people data from google', async () => {
    const google = new Google();
    const providerDataAdapter = new ProviderDataAdapter(userUID, googleToken);
    try {
      await providerDataAdapter.adapt(google);
    } catch (e) {
      console.log(e.message);
    }
  });
  it('should follow me on Youtube', async () => {
    const youtubeFollower = new YoutubeFollower();
    await youtubeFollower.follow('');
  });
});
