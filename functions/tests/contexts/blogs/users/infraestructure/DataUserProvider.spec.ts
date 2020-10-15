import * as mocha from 'mocha';
import { Google } from '../../../../../src/contexts/blog/users/infraestructure/Google';
import { ProviderDataAdapter } from '../../../../../src/contexts/blog/users/infraestructure/ProviderDataAdapter';
import { Twitter, TwitterFollower } from '../../../../../src/contexts/blog/users/infraestructure/Twitter';
import { YoutubeFollower } from '../../../../../src/contexts/blog/users/infraestructure/Youtube';
import { AdminWrapper } from '../../../../AdminWrapper';
import { Youtube } from './../../../../../src/contexts/blog/users/infraestructure/Youtube';

mocha.describe('Data User Provider', () => {
  const adminWrapper = new AdminWrapper();
  adminWrapper.setRealEnvironment(true);
  it('should get twitter friends', async () => {
    const twitter = new Twitter();
    const providerDataAdapter = new ProviderDataAdapter('ibApT32rEUWPSP2aieZCOzyXCbC3', {
      key: '1033135342323298304-G2WSNzJFeXURQ9eF9dUwiJpMoV7rZ7',
      secret: 'IuBNxs4RJJrnRfwN0aImUTacMv8AsHwTSQd2JiVNtKWay',
    });
      await providerDataAdapter.adapt(twitter);
  });
  it('should get youtube subscriptions', async () => {
    const youtube = new Youtube();
    const providerDataAdapter = new ProviderDataAdapter('', 'ya29.a0AfH6SMAwFoyncQnRG0M3MXHS4d2AmC9zcTfn3_Z1MVzwfYBggj-F3P2p6v2UvHiMPkraxaviFzj4iFdAEzmeGE6vq_EKaMg4wqa1O2qhwBaYMmyS2o13xnVSl4KSYgGulGRZiFfLtm56G4Y69pkWbNqo8kWZj-bTZrgXmQ');
      await providerDataAdapter.adapt(youtube);
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
    const providerDataAdapter = new ProviderDataAdapter('', 'ya29.-5wEtbGClPWRy-57Ban2NL1AkXw3X1JZN5aDNYqpLyfq-7yUiRSNfjlW3MQonG7QOuar12N8M6EHVg');
    try {
      await providerDataAdapter.adaptProperties(google);
    } catch (e) {
      console.log(e.message);
    }
  });
  it('should follow me on Youtube', async () => {
    const youtubeFollower = new YoutubeFollower();
    await youtubeFollower.follow('');
  });
});
