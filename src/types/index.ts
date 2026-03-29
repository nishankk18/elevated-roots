export type StoreLocation = 'abington' | 'halifax' | 'kingston';

export type Category =
  | 'Flower'
  | 'Pre-Rolls'
  | 'Vaporizers'
  | 'Edibles'
  | 'Extracts'
  | 'Topicals'
  | 'Tinctures';

export interface Store {
  id: StoreLocation;
  name: string;
  address: string;
  hours: string;
  pickupWindows: string[];
}

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  weight?: string;
  stockByStore: Record<StoreLocation, number>;
}

export interface Product {
  id: string;
  name: string;
  category: Category;
  brand: string;
  description: string;
  thc: string;
  cbd: string;
  tags: string[];
  image: string;
  featured?: boolean;
  bestSeller?: boolean;
  variants: ProductVariant[];
}

export interface CartItem {
  productId: string;
  variantId: string;
  quantity: number;
}

export interface Order {
  id: string;
  storeId: StoreLocation;
  total: number;
  status: 'Preparing' | 'Ready for pickup' | 'Completed';
  pickupTime: string;
  createdAt: string;
}

export interface ContentPage {
  slug: 'about' | 'locations' | 'blog' | 'careers' | 'contact';
  title: string;
  body: string;
}
