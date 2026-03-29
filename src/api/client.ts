import { contentPages, orders, products, stores } from '../data/mockData';
import { ContentPage, Product, Store } from '../types';

const wait = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

export const cmsClient = {
  async getPages(): Promise<ContentPage[]> {
    await wait();
    return contentPages;
  }
};

export const commerceClient = {
  async getStores(): Promise<Store[]> {
    await wait();
    return stores;
  },
  async getProducts(): Promise<Product[]> {
    await wait();
    return products;
  },
  async getOrders() {
    await wait();
    return orders;
  }
};

export const paymentsClient = {
  async createPaymentIntent(amount: number) {
    await wait();
    return { gateway: 'stripe-compatible', clientSecret: `demo-secret-${amount}` };
  }
};

export const notificationClient = {
  async registerPushToken(token: string) {
    await wait();
    return { provider: 'firebase-or-onesignal', token };
  }
};
