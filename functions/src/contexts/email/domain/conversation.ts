import { search } from '../../../providers/algolia-search';
import { UserLocalization } from '../../../models/user-localization';
import { GoogleTypeLatLng } from 'actions-on-google';
import { Profile } from '../../../providers/profile';
import { Database } from '../../../database/database';

export class PermissionFactory {
  private articles: { name: string; amount: string }[];

  constructor(private token: string, private context: any) {
    this.loadParameters();
  }

  loadParameters() {
    const articles = this.context.get('articles').parameters.articles;
    const amount = this.context.get('amount').parameters.amount;
    this.articles = articles.map((name: string, index: number) => {
      return {
        name,
        amount: amount[index] || 1,
      };
    });
  }

  async factory(userCoords: any) {
    const conversation = new Conversation();
    conversation.loadProfileByContext(this.context.get('conversation'));
    await conversation.loadProfile(this.token);
    const articleContext = new ArticleContext(conversation.getData());
    await articleContext.search(this.articles, userCoords);
    const context = articleContext.getContext();
    await conversation.store(userCoords, context);
    await conversation.storeArticles(articleContext.getArticles());
    return {
      response: articleContext.response(),
      context: conversation.getContext(),
    };
  }
}

export class Conversation {
  private profile: { conversationUID: string; userUID: string; name: string };
  private database = new Database();

  async loadProfile(token: string) {
    const profile = new Profile(token);
    await profile.request();
    this.profile = {
      name: profile.getName(),
      userUID: profile.getUID(),
      conversationUID: '',
    };
  }

  loadProfileByContext(value: any) {
    if (value && value.parameters) {
      this.profile = {
        ...value.parameters,
      };
    }
  }

  getData() {
    return this.profile;
  }

  async store(coords: GoogleTypeLatLng, context: any) {
    const collection = `users/${this.profile.userUID}/conversations`;
    const body = {
      _geoloc: {
        lat: coords.latitude,
        lng: coords.longitude,
      },
      ...context,
    };
    const exits = this.profile.conversationUID
      ? await this.database.collection(collection).exits(this.profile.conversationUID)
      : undefined;
    if (exits) {
      await this.database.collection(collection).update(this.profile.conversationUID, body);
    } else {
      const document = await this.database.collection(collection).storeAutogeneratedUID(body);
      this.profile.conversationUID = document.id;
    }
  }

  async storeArticles(articles: any[]) {
    articles.forEach((value) =>
      this.database
        .collection(`users/${this.profile.userUID}/conversations/${this.profile.conversationUID}/articles`)
        .storeWith(value.uid, value)
    );
  }

  getContext() {
    return {
      name: 'conversation',
      lifespan: 99,
      parameters: {
        conversationUID: this.profile.conversationUID,
        userUID: this.profile.userUID,
        name: this.profile.name,
      },
    };
  }

  updateContext() {
    return this.database
      .collection(`users/${this.profile.userUID}/conversations`)
      .update(this.profile.conversationUID, {});
  }
}

export class Search {
  static async getAHit(query: string, coords: any) {
    const hits = await search(query, coords);
    return hits[0];
  }
}

export class Cashier {
  private localization: { time: number; delivery: number };
  private total: number = 0;
  private saving: number = 0;
  private subTotal: number = 0;

  constructor(
    private userCoords: any,
    private uid: string,
    private hits: { discountTotal: number; price: number; _geoloc: any; amount: number }[]
  ) {}

  calculateTotal() {
    this.subTotal = this.hits.reduce((previousValue, currentValue) => {
      const discountTotal = currentValue.discountTotal || 0;
      const amount = currentValue.amount || 1;
      this.saving += discountTotal;
      return previousValue + (currentValue.price - discountTotal) * amount;
    }, 0);
    this.total = Math.ceil(this.localization.delivery + this.subTotal);
    return this;
  }

  getTotal() {
    return {
      total: this.total,
      saving: this.saving,
      subTotal: this.subTotal,
      ...this.localization,
    };
  }

  async locate() {
    const userLocalization = new UserLocalization(
      {
        coords: this.userCoords,
        articlesCoords: this.hits.map((hit) => {
          return {
            latitude: hit._geoloc.lat,
            longitude: hit._geoloc.lng,
          };
        }),
        timestamp: 0,
      },
      this.uid
    );
    const temp = await userLocalization.locate();
    this.localization = {
      time: temp.time,
      delivery: temp.delivery,
    };
    return this;
  }
}

export class ArticleContext {
  protected context: {
    total: number;
    query: { name: string; amount: number; totalUnitsSold: number }[];
    time: number;
    subTotal: number;
    saving: number;
  };
  private cashier: any;
  constructor(protected userData: { name: string; userUID: string }) {}

  async searchHits(queries: { name: string; amount: string }[], coords: GoogleTypeLatLng) {
    const hits = queries.map(async (query: { name: string; amount: any }) => {
      const value = await Search.getAHit(query.name, coords);
      return {
        ...value,
        amount: query.amount,
      };
    });
    return await Promise.all(hits);
  }

  async search(queries: { name: string; amount: string }[], coords: GoogleTypeLatLng) {
    const hits = (await this.searchHits(queries, coords)) as any;
    const cashier = new Cashier(coords, this.userData.userUID, hits);
    await cashier.locate();
    this.cashier = cashier.calculateTotal().getTotal();
    this.context = {
      ...this.cashier,
      query: hits,
    };
    return this;
  }

  getContext() {
    return this.cashier;
  }

  getArticles() {
    return this.context.query;
  }

  response() {
    if (this.context.saving > 0) {
      const percentage = Math.ceil((this.context.saving * 100) / this.context.total);
      return `${this.userData.name},
                    ${this.context.query.map((value) => value.totalUnitsSold)} personas recomiendan
                    ${this.context.query.map((value) => value.name)}.
                    Recíbelo en ${this.context.time} minutos con un total de ${this.context.total} pesos y ahorra ${
        this.context.saving
      }, eso es ${percentage}%.
                    ¿Te parece bien o elige lo que gustes?`;
    }
    return `${this.userData.name},
                    ${this.context.query.map((value) => value.totalUnitsSold)} personas recomiendan
                    ${this.context.query.map((value) => value.name)}. Recíbelo en ${
      this.context.time
    } minutos con un total de ${this.context.total} pesos. ¿Te parece bien o elige lo que gustes?`;
  }
}
