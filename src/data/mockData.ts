import { Category, ContentPage, Order, Product, Store } from '../types';

export const stores: Store[] = [
  {
    id: 'abington',
    name: 'Abington',
    address: '1501 Bedford St, Abington, MA',
    hours: '8AM - 9PM',
    pickupWindows: ['10:00 AM', '11:30 AM', '1:00 PM', '3:30 PM', '6:00 PM']
  },
  {
    id: 'halifax',
    name: 'Halifax',
    address: '319 Plymouth St, Halifax, MA',
    hours: '9AM - 8PM',
    pickupWindows: ['9:30 AM', '12:00 PM', '2:00 PM', '4:30 PM', '7:00 PM']
  },
  {
    id: 'kingston',
    name: 'Kingston',
    address: '38 Main St, Kingston, MA',
    hours: '8AM - 10PM',
    pickupWindows: ['10:30 AM', '12:30 PM', '2:30 PM', '5:00 PM', '7:30 PM']
  }
];

export const categories: Category[] = ['Flower', 'Pre-Rolls', 'Vaporizers', 'Edibles', 'Extracts', 'Topicals', 'Tinctures'];

export const products: Product[] = [
  {
    id: 'p1',
    name: 'Roots Reserve Blue Dream',
    category: 'Flower',
    brand: 'Elevated Roots',
    description: 'Balanced sativa-dominant flower with berry aroma and creative daytime lift.',
    thc: '24%',
    cbd: '1%',
    tags: ['Featured', 'Mood Boost'],
    image: 'https://images.unsplash.com/photo-1603909223429-69bb7101f420?auto=format&fit=crop&w=1200&q=80',
    featured: true,
    bestSeller: true,
    variants: [
      { id: 'p1-v1', name: '3.5g', price: 42, weight: '3.5g', stockByStore: { abington: 15, halifax: 8, kingston: 12 } },
      { id: 'p1-v2', name: '7g', price: 78, weight: '7g', stockByStore: { abington: 7, halifax: 4, kingston: 6 } }
    ]
  },
  {
    id: 'p2',
    name: 'Night Bloom Gummies',
    category: 'Edibles',
    brand: 'Roots Kitchen',
    description: 'Fast-acting blackberry gummies designed for evening relaxation.',
    thc: '5mg x 20',
    cbd: '1mg x 20',
    tags: ['Sleep', 'Best Seller'],
    image: 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?auto=format&fit=crop&w=1200&q=80',
    bestSeller: true,
    variants: [
      { id: 'p2-v1', name: '20 pack', price: 28, stockByStore: { abington: 24, halifax: 18, kingston: 20 } }
    ]
  },
  {
    id: 'p3',
    name: 'Harbor Mist Vape Cart',
    category: 'Vaporizers',
    brand: 'Coastal Extracts',
    description: 'Live resin cartridge with citrus-forward profile and smooth finish.',
    thc: '83%',
    cbd: '0%',
    tags: ['Live Resin'],
    image: 'https://images.unsplash.com/photo-1621807128154-4b4fcd8e4596?auto=format&fit=crop&w=1200&q=80',
    featured: true,
    variants: [
      { id: 'p3-v1', name: '1g cart', price: 55, stockByStore: { abington: 11, halifax: 9, kingston: 13 } }
    ]
  },
  {
    id: 'p4',
    name: 'Calm Current Tincture',
    category: 'Tinctures',
    brand: 'Roots Wellness',
    description: 'Mint tincture for precise sublingual dosing and subtle relief.',
    thc: '300mg',
    cbd: '600mg',
    tags: ['Wellness'],
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1200&q=80',
    variants: [
      { id: 'p4-v1', name: '30ml', price: 48, stockByStore: { abington: 10, halifax: 12, kingston: 7 } }
    ]
  },
  {
    id: 'p5',
    name: 'Classic Pre-Roll 5 Pack',
    category: 'Pre-Rolls',
    brand: 'Elevated Roots',
    description: 'Five-pack of house pre-rolls for easy pickup and quick reorder.',
    thc: '22%',
    cbd: '1%',
    tags: ['Reorder'],
    image: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?auto=format&fit=crop&w=1200&q=80',
    variants: [
      { id: 'p5-v1', name: '5 pack', price: 36, stockByStore: { abington: 20, halifax: 15, kingston: 19 } }
    ]
  }
];

export const orders: Order[] = [
  { id: 'ER-10241', storeId: 'abington', total: 84, status: 'Ready for pickup', pickupTime: 'Today · 6:00 PM', createdAt: '2026-03-27' },
  { id: 'ER-10198', storeId: 'kingston', total: 55, status: 'Completed', pickupTime: 'Mar 25 · 5:00 PM', createdAt: '2026-03-25' }
];

export const contentPages: ContentPage[] = [
  { slug: 'about', title: 'About Elevated Roots', body: 'Community-first cannabis retail built around pickup convenience, compliant shopping, and premium Massachusetts products.' },
  { slug: 'locations', title: 'Locations', body: 'Abington, Halifax, and Kingston stores support menu-level inventory, localized promos, and store-specific pickup windows.' },
  { slug: 'blog', title: 'Blog', body: 'CMS-ready editorial feed for product education, compliance-safe promotions, and community updates.' },
  { slug: 'careers', title: 'Careers', body: 'Recruiting pipeline content page for budtenders, store managers, and retail ops roles.' },
  { slug: 'contact', title: 'Contact', body: 'Customer support, pickup help, and store-specific contact workflows connect here.' }
];
