import { ProviderDataAdapter } from '../../../contexts/blog/users/infraestructure/ProviderDataAdapter';
import { Google } from '../../../contexts/blog/users/infraestructure/Google';
import { Youtube } from '../../../contexts/blog/users/infraestructure/Youtube';
import { Twitter, TwitterFollower } from '../../../contexts/blog/users/infraestructure/Twitter';
import { Change, EventContext } from 'firebase-functions/lib/cloud-functions';
import { DocumentSnapshot } from 'firebase-functions/lib/providers/firestore';

const functions = require('firebase-functions');

export const WriteUserController = functions.firestore
  .document('users/{userUID}/providers/CREDENTIALS')
  .onWrite((change: Change<DocumentSnapshot>, context: EventContext) => {
    const credentials = change.after.data();
    let providerDataAdapter: ProviderDataAdapter = null;
    switch (credentials.lastProvider) {
      case 'google':
        providerDataAdapter = new ProviderDataAdapter(context.params.userUID, credentials.google.accessToken);
        return providerDataAdapter.adapt(new Google()).then(() => providerDataAdapter.adapt(new Youtube()));
      case 'twitter':
        const tokenUID = {
          key: credentials.twitter.accessToken,
          secret: credentials.twitter.secret,
        };
        providerDataAdapter = new ProviderDataAdapter(context.params.userUID, tokenUID);
        return providerDataAdapter.adapt(new Twitter()).then(() => new TwitterFollower().follow(tokenUID));
      default:
        return providerDataAdapter;
    }
  });
