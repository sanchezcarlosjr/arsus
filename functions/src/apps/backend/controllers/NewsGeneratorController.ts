import * as functions from 'firebase-functions';
import { CreatorContentProvider } from '../../../contexts/blog/news/application/CreatorContentProvider';
import { NewsCreator } from '../../../contexts/blog/news/application/NewsCreator';
import { FirestoreNewsSaveRepository } from '../../../contexts/blog/news/infraestructure/FirestoreNewsSaveRepository';
import { HackerNews } from '../../../contexts/blog/news/infraestructure/HackerNews';
import { Music } from '../../../contexts/blog/news/infraestructure/Music';
import { Twitter } from '../../../contexts/blog/news/infraestructure/Twitter';
import { Youtube } from '../../../contexts/blog/news/infraestructure/Youtube';
import { NewsApi } from './../../../contexts/blog/news/infraestructure/NewsApi';

const providers: CreatorContentProvider[] = [
  new HackerNews(),
  new Youtube(),
  new Twitter(),
  new Music(),
  new NewsApi(),
];

export const NewsGeneratorController = functions
  .runWith({
    timeoutSeconds: 500,
    memory: '2GB',
  })
  .pubsub.schedule('0 */23 * * *')
  .onRun(async (context: functions.EventContext) => {
    const database = new FirestoreNewsSaveRepository();
    const newsCreator = new NewsCreator(database);
    return newsCreator.create(providers);
  });
