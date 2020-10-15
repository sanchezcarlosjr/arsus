import * as functions from 'firebase-functions';
import { https } from 'firebase-functions';
import { Source } from '../../../contexts/blog/users/infraestructure/ProviderDataAdapter';
import { SourceNews } from './../../../contexts/blog/users/infraestructure/ProviderDataAdapter';

function toNameAlgorithm(id: string, type: string): string {
     if (type == 'email') {
          return id.match(/.*(?= <)/)[0].replace(/"/g, '');
     }
     return id;
}

export const AddSourceNewsController = functions
  .runWith({
    timeoutSeconds: 20,
    memory: '2GB',
  })
  .https.onCall(async (sourceNews: SourceNews, context: https.CallableContext) => {
       const source = new Source();
       return source.save([
         {
               id: sourceNews.id,
               name: toNameAlgorithm(sourceNews.id, sourceNews.type),
               type: sourceNews.type,
         }
       ], context.auth.uid);
  });
