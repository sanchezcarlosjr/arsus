import { config } from 'firebase-functions';
import Stripe from 'stripe';

export class StripeWrapper {
  private stripe = new Stripe(config().stripe.apikey, { apiVersion: '2020-03-02' });
  constructor(private user: { email: string; source: string; plan: string }) {}

  async deleteSubscription(subscription: string) {
    return this.stripe.subscriptions.del(subscription);
  }

  getCostumer(id: string) {
    return this.stripe.subscriptions.list({ customer: id, limit: 1 });
  }

  async createSubscription() {
    const customer = await this.createCostumer();
    return await this.stripe.subscriptions.create({
      customer: customer.id,
      items: [
        {
          plan: this.user.plan,
        },
      ],
      expand: ['latest_invoice.payment_intent'],
    });
  }
  async createCostumer() {
    return await this.stripe.customers.create({
      email: this.user.email,
      source: this.user.source,
    });
  }
}
