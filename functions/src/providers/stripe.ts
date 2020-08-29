import {
  GoogleActionsV2OrdersProposedOrder,
  GoogleActionsV2TransactionDecisionValueSpec,
  TransactionDecision,
} from 'actions-on-google';

const functions = require('firebase-functions');

export class GooglePay {
  private subTotal: { nanos: number; units: string };
  private total: { nanos: number; units: string };

  constructor(
    private isSandbox: boolean,
    private items: any[],
    private orderUID: string,
    subTotal: number,
    total: number
  ) {
    this.subTotal = this.toAmount(subTotal);
    this.total = this.toAmount(total);
  }

  getTransactionDecision() {
    const options = {
      orderOptions: {
        requestDeliveryAddress: false,
      },
      paymentOptions: {
        googleProvidedOptions: {
          prepaidCardDisallowed: false,
          supportedCardNetworks: ['VISA', 'AMEX', 'DISCOVER', 'MASTERCARD'],
          tokenizationParameters: {
            tokenizationType: 'PAYMENT_GATEWAY',
            parameters: {
              gateway: 'stripe',
              'stripe:publishableKey': this.isSandbox
                ? functions.config().stripe.publishabletestkey
                : functions.config().stripe.publishablelivekey,
              'stripe:version': '2018-11-08',
            },
          },
        },
      },
      proposedOrder: this.getOrder() as GoogleActionsV2OrdersProposedOrder,
    } as GoogleActionsV2TransactionDecisionValueSpec;
    return new TransactionDecision(options);
  }

  toAmount(num: number): { nanos: number; units: string } {
    const temp = String(num).split('.');
    const nanos = temp[1] ? Number(temp[1]) : 0;
    return {
      nanos: nanos,
      units: temp[0],
    };
  }

  getOrder() {
    return {
      id: this.orderUID,
      cart: {
        merchant: {
          id: 'ceo@cest.mx',
          name: 'Arsus',
        },
        lineItems: this.items.map((item) => {
          const discountTotal = item.discountTotal || 0;
          const amount = this.toAmount(item.price - discountTotal);
          return {
            name: item.name,
            id: item.uid,
            price: {
              amount: {
                currentCode: 'MXN',
                nanos: amount.nanos,
                units: amount.units,
              },
              type: 'ESTIMATE',
            },
            type: 'REGULAR',
            quantity: item.amount,
          };
        }),
      },
      otherItems: [
        {
          name: 'Subtotal',
          id: 'subtotal',
          price: {
            amount: {
              currencyCode: 'MXN',
              nanos: this.subTotal.nanos,
              units: this.subTotal.units,
            },
            type: 'ESTIMATE',
          },
          type: 'SUBTOTAL',
        },
        {
          name: 'Tax',
          id: 'tax',
          price: {
            amount: {
              currencyCode: 'MXN',
              nanos: 0,
              units: '0',
            },
            type: 'ESTIMATE',
          },
          type: 'TAX',
        },
      ],
      totalPrice: {
        amount: {
          currencyCode: 'MXN',
          nanos: this.total.nanos,
          units: this.total.units,
        },
        type: 'ESTIMATE',
      },
    };
  }
}
