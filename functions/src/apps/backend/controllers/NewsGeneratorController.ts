import * as functions from 'firebase-functions';
import { NewsCreator } from '../../../contexts/blog/news/application/NewsCreator';
import { FirestoreNewsSaveRepository } from '../../../contexts/blog/news/infraestructure/FirestoreNewsSaveRepository';
import { Youtube } from '../../../contexts/blog/news/infraestructure/Youtube';
import { HackerNews } from '../../../contexts/blog/news/infraestructure/HackerNews';
import { CreatorContentProvider } from '../../../contexts/blog/news/application/CreatorContentProvider';
import { Twitter } from '../../../contexts/blog/news/infraestructure/Twitter';
import { Music } from '../../../contexts/blog/news/infraestructure/Music';
import { Podcast } from '../../../contexts/blog/news/infraestructure/Podcast';

const providers: CreatorContentProvider[] = [
  new HackerNews(),
  new Youtube(),
  new Twitter(),
  new Music(),
  new Podcast(),
];

export const NewsGeneratorController = functions
  .runWith({
    timeoutSeconds: 500,
    memory: '2GB',
  })
  .pubsub.schedule('0 */6 * * *')
  .onRun(async (context: functions.EventContext) => {
    const database = new FirestoreNewsSaveRepository();
    const newsCreator = new NewsCreator(database);
    return newsCreator.create(providers);
  });
