import { Change, EventContext } from 'firebase-functions';
import { DocumentSnapshot } from 'firebase-functions/lib/providers/firestore';

import { EnterpriseData } from '../definitions/enterprise';
import { ActionBoolean, BooleanAdapter } from '../helpers/boolean-action';
import { Database } from '../database/database';

abstract class Subscription extends ActionBoolean {
  protected database = new Database();
  constructor(protected enterpriseUID: string) {
    super();
  }
  abstract execute(): Promise<any>;
  async updateSpace(space: number) {
    await this.database.collection(`enterprises/${this.enterpriseUID}/STATEMENT_OF_INCOME`).update('0', {
      space,
    });
  }

  async updateArticles(type: boolean) {
    const articles = await this.database.collection('articles').whereData('enterpriseUID', '==', this.enterpriseUID);
    const promises = articles.map(
      async (article) =>
        await this.database.collection('articles').update(article.uid, {
          onSold: type,
        })
    );
    Promise.all(promises);
  }
}

class TrueSubscription extends Subscription {
  async execute() {
    await this.updateSpace(Infinity);
    await this.updateArticles(true);
  }
}

class FalseSubscription extends Subscription {
  async execute() {
    await this.updateSpace(5);
    await this.updateArticles(false);
  }
}

export const activeEnterpriseSubscriptionHandler = async (change: Change<DocumentSnapshot>, context: EventContext) => {
  const data: EnterpriseData = change.after.data() as EnterpriseData;
  const objectID = context.params.enterpriseId;
  const booleanAdapter = new BooleanAdapter(data.subscription);
  const trueSubscription = new TrueSubscription(objectID);
  const falseSubscription = new FalseSubscription(objectID);
  booleanAdapter.builder(trueSubscription, falseSubscription);
  return booleanAdapter.execute();
};
