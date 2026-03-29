import React, { useMemo, useState } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Alert,
  FlatList,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { commerceClient, cmsClient, paymentsClient } from './src/api/client';
import { categories } from './src/data/mockData';
import { usePushNotifications } from './src/hooks/usePushNotifications';
import { colors, spacing } from './src/constants/theme';
import { useAppStore } from './src/store/useAppStore';
import { ContentPage, Product, StoreLocation } from './src/types';

const queryClient = new QueryClient();
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function currency(value: number) {
  return `$${value.toFixed(2)}`;
}

function AppProviders() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <StatusBar style="light" />
        <AppShell />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

function AppShell() {
  const ageVerified = useAppStore((s) => s.ageVerified);
  return (
    <NavigationContainer theme={{ ...DefaultTheme, colors: { ...DefaultTheme.colors, background: colors.background, text: colors.text, card: colors.surface, border: colors.border, primary: colors.primary, notification: colors.primary } }}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!ageVerified ? (
          <Stack.Screen name="AgeGate" component={AgeGateScreen} />
        ) : (
          <Stack.Screen name="Main" component={MainTabs} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function AgeGateScreen() {
  const setAgeVerified = useAppStore((s) => s.setAgeVerified);
  return (
    <LinearGradient colors={[colors.background, '#123223']} style={styles.fullScreenCenter}>
      <View style={styles.ageGateCard}>
        <Text style={styles.kicker}>Massachusetts Adult Use Cannabis</Text>
        <Text style={styles.heroTitle}>You must be 21+ to enter Elevated Roots.</Text>
        <Text style={styles.bodyText}>By continuing, you confirm you are at least 21 years old and understand products are for legal adult use only. Pickup availability, inventory, and pricing vary by store.</Text>
        <View style={styles.disclaimerBox}>
          <Text style={styles.disclaimerTitle}>Compliance Disclaimer</Text>
          <Text style={styles.disclaimerText}>Keep out of reach of children. Cannabis can impair concentration, coordination, and judgment. Do not drive or operate machinery under the influence.</Text>
        </View>
        <Pressable style={styles.primaryButton} onPress={() => setAgeVerified(true)}>
          <Text style={styles.primaryButtonText}>I am 21 or older</Text>
        </Pressable>
      </View>
    </LinearGradient>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator screenOptions={({ route }) => ({
      header: () => <GlobalHeader />,
      tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border, height: 72, paddingBottom: 10 },
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.textMuted,
      sceneStyle: { backgroundColor: colors.background },
      tabBarIcon: ({ color, size }) => {
        const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
          Home: 'home',
          Shop: 'grid',
          Cart: 'cart',
          Rewards: 'gift',
          Account: 'person',
        };
        return <Ionicons name={icons[route.name]} color={color} size={size} />;
      }
    })}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Shop" component={ShopScreen} />
      <Tab.Screen name="Cart" component={CartScreen} />
      <Tab.Screen name="Rewards" component={RewardsScreen} />
      <Tab.Screen name="Account" component={AccountScreen} />
    </Tab.Navigator>
  );
}

function GlobalHeader() {
  const insets = useSafeAreaInsets();
  const selectedStore = useAppStore((s) => s.selectedStore);
  const setSelectedStore = useAppStore((s) => s.setSelectedStore);
  const [storeModal, setStoreModal] = useState(false);
  const pushStatus = usePushNotifications();
  const { data: stores = [] } = useQuery({ queryKey: ['stores'], queryFn: commerceClient.getStores });

  return (
    <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
      <Pressable style={styles.storePill} onPress={() => setStoreModal(true)}>
        <Ionicons name="location" color={colors.primary} size={16} />
        <Text style={styles.storePillText}>{stores.find((store) => store.id === selectedStore)?.name ?? 'Select Store'}</Text>
        <Ionicons name="chevron-down" color={colors.textMuted} size={16} />
      </Pressable>
      <View style={styles.headerActions}>
        <View style={styles.searchPill}><Ionicons name="search" size={16} color={colors.textMuted} /><Text style={styles.searchText}>Search menu</Text></View>
        <Pressable style={styles.iconButton}><Ionicons name="notifications-outline" size={20} color={colors.text} /></Pressable>
      </View>
      <Text style={styles.pushStatus}>{pushStatus}</Text>
      <Modal visible={storeModal} animationType="slide" transparent>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.sectionTitle}>Choose your store</Text>
            {stores.map((store) => (
              <Pressable key={store.id} style={styles.storeRow} onPress={() => { setSelectedStore(store.id); setStoreModal(false); }}>
                <View>
                  <Text style={styles.cardTitle}>{store.name}</Text>
                  <Text style={styles.cardSubtext}>{store.address}</Text>
                </View>
                {selectedStore === store.id && <Ionicons name="checkmark-circle" color={colors.primary} size={20} />}
              </Pressable>
            ))}
            <Pressable style={styles.secondaryButton} onPress={() => setStoreModal(false)}><Text style={styles.secondaryButtonText}>Close</Text></Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function HomeScreen() {
  const selectedStore = useAppStore((s) => s.selectedStore);
  const { data: products = [] } = useQuery({ queryKey: ['products'], queryFn: commerceClient.getProducts });
  const { data: stores = [] } = useQuery({ queryKey: ['stores'], queryFn: commerceClient.getStores });
  const featured = products.filter((product) => product.featured);
  const bestSellers = products.filter((product) => product.bestSeller);
  const reorder = products.slice(0, 3);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.screenContent}>
      <LinearGradient colors={['#22543D', '#102218']} style={styles.banner}>
        <Text style={styles.kicker}>Pickup-first cannabis commerce</Text>
        <Text style={styles.heroTitle}>Order ahead from {stores.find((store) => store.id === selectedStore)?.name}.</Text>
        <Text style={styles.bodyText}>Store-specific inventory, fast reorder, compliant first-launch age gate, and CMS-ready content architecture are wired in.</Text>
      </LinearGradient>
      <Section title="Shop categories">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map((category) => <Chip key={category} label={category} />)}
        </ScrollView>
      </Section>
      <Section title="Featured products">{featured.map((product) => <ProductCard key={product.id} product={product} />)}</Section>
      <Section title="Best sellers">{bestSellers.map((product) => <ProductCard key={product.id} product={product} compact />)}</Section>
      <Section title="Reorder fast">{reorder.map((product) => <ProductCard key={product.id} product={product} compact />)}</Section>
    </ScrollView>
  );
}

function ShopScreen() {
  const selectedStore = useAppStore((s) => s.selectedStore);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<'featured' | 'price-low' | 'price-high'>('featured');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { data: products = [] } = useQuery({ queryKey: ['products'], queryFn: commerceClient.getProducts });

  const filteredProducts = useMemo(() => {
    let next = products.filter((product) =>
      (categoryFilter === 'All' || product.category === categoryFilter) &&
      product.name.toLowerCase().includes(search.toLowerCase())
    );
    if (sort === 'price-low') next = [...next].sort((a, b) => a.variants[0].price - b.variants[0].price);
    if (sort === 'price-high') next = [...next].sort((a, b) => b.variants[0].price - a.variants[0].price);
    return next.filter((product) => product.variants.some((variant) => variant.stockByStore[selectedStore] > 0));
  }, [products, categoryFilter, search, sort, selectedStore]);

  return (
    <View style={styles.screen}>
      <View style={styles.filtersBar}>
        <TextInput value={search} onChangeText={setSearch} placeholder="Search flower, gummies, carts..." placeholderTextColor={colors.textMuted} style={styles.searchInput} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <Chip label="All" active={categoryFilter === 'All'} onPress={() => setCategoryFilter('All')} />
          {categories.map((category) => <Chip key={category} label={category} active={categoryFilter === category} onPress={() => setCategoryFilter(category)} />)}
        </ScrollView>
        <View style={styles.sortRow}>
          {['featured', 'price-low', 'price-high'].map((option) => <Chip key={option} label={option} active={sort === option} onPress={() => setSort(option as typeof sort)} />)}
        </View>
      </View>
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => <ProductCard product={item} onPress={() => setSelectedProduct(item)} />}
      />
      <ProductDetailModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </View>
  );
}

function ProductCard({ product, compact, onPress }: { product: Product; compact?: boolean; onPress?: () => void }) {
  const selectedStore = useAppStore((s) => s.selectedStore);
  const toggleFavorite = useAppStore((s) => s.toggleFavorite);
  const favorites = useAppStore((s) => s.favorites);
  const stock = product.variants.reduce((sum, variant) => sum + variant.stockByStore[selectedStore], 0);
  return (
    <Pressable style={[styles.productCard, compact && { minHeight: 120 }]} onPress={onPress}>
      <Image source={{ uri: product.image }} style={styles.productImage} />
      <View style={styles.productContent}>
        <View style={styles.rowBetween}>
          <Text style={styles.cardTitle}>{product.name}</Text>
          <Pressable onPress={() => toggleFavorite(product.id)}><Ionicons name={favorites.includes(product.id) ? 'heart' : 'heart-outline'} color={colors.primary} size={20} /></Pressable>
        </View>
        <Text style={styles.cardSubtext}>{product.brand} · {product.category}</Text>
        <Text style={styles.bodyText}>{product.description}</Text>
        <View style={styles.rowBetween}>
          <Text style={styles.priceText}>{currency(product.variants[0].price)}</Text>
          <Text style={styles.inventoryText}>{stock} in stock</Text>
        </View>
      </View>
    </Pressable>
  );
}

function ProductDetailModal({ product, onClose }: { product: Product | null; onClose: () => void }) {
  const selectedStore = useAppStore((s) => s.selectedStore);
  const addToCart = useAppStore((s) => s.addToCart);
  const [selectedVariant, setSelectedVariant] = useState(0);
  if (!product) return null;
  const variant = product.variants[selectedVariant] ?? product.variants[0];

  return (
    <Modal visible={!!product} animationType="slide">
      <ScrollView style={styles.screen} contentContainerStyle={styles.screenContent}>
        <Image source={{ uri: product.image }} style={styles.detailImage} />
        <Text style={styles.heroTitle}>{product.name}</Text>
        <Text style={styles.cardSubtext}>{product.brand} · {product.category}</Text>
        <View style={styles.metricsRow}><Metric label="THC" value={product.thc} /><Metric label="CBD" value={product.cbd} /><Metric label="Store stock" value={`${variant.stockByStore[selectedStore]}`} /></View>
        <Text style={styles.bodyText}>{product.description}</Text>
        <Section title="Variants">
          {product.variants.map((item, index) => (
            <Pressable key={item.id} style={[styles.variantRow, selectedVariant === index && styles.variantRowActive]} onPress={() => setSelectedVariant(index)}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.priceText}>{currency(item.price)}</Text>
            </Pressable>
          ))}
        </Section>
        <Section title="Tags"><View style={styles.wrap}>{product.tags.map((tag) => <Chip key={tag} label={tag} />)}</View></Section>
        <Pressable style={styles.primaryButton} onPress={() => {
          const result = addToCart({ productId: product.id, variantId: variant.id, quantity: 1 }, selectedStore);
          if (!result.ok) Alert.alert('Cart restricted', result.message);
          else Alert.alert('Added to cart', `${product.name} added for ${selectedStore}.`);
        }}><Text style={styles.primaryButtonText}>Add to cart · {currency(variant.price)}</Text></Pressable>
        <Pressable style={styles.secondaryButton} onPress={onClose}><Text style={styles.secondaryButtonText}>Close</Text></Pressable>
      </ScrollView>
    </Modal>
  );
}

function CartScreen() {
  const cart = useAppStore((s) => s.cart);
  const cartStore = useAppStore((s) => s.cartStore);
  const clearCart = useAppStore((s) => s.clearCart);
  const updateQuantity = useAppStore((s) => s.updateQuantity);
  const { data: products = [] } = useQuery({ queryKey: ['products'], queryFn: commerceClient.getProducts });
  const { data: stores = [] } = useQuery({ queryKey: ['stores'], queryFn: commerceClient.getStores });
  const [showCheckout, setShowCheckout] = useState(false);

  const mapped = cart.map((item) => {
    const product = products.find((p) => p.id === item.productId)!;
    const variant = product.variants.find((v) => v.id === item.variantId)!;
    return { item, product, variant, lineTotal: variant.price * item.quantity };
  });
  const total = mapped.reduce((sum, line) => sum + line.lineTotal, 0);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.screenContent}>
      <Text style={styles.sectionTitle}>Your cart</Text>
      <Text style={styles.cardSubtext}>{cartStore ? `Locked to ${stores.find((store) => store.id === cartStore)?.name}` : 'No active store cart yet'}</Text>
      {mapped.length === 0 ? <EmptyState title="Cart is empty" subtitle="Browse products and add a pickup order." /> : mapped.map(({ item, product, variant, lineTotal }) => (
        <View key={`${item.productId}-${item.variantId}`} style={styles.cartRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>{product.name}</Text>
            <Text style={styles.cardSubtext}>{variant.name}</Text>
            <Text style={styles.priceText}>{currency(lineTotal)}</Text>
          </View>
          <View style={styles.qtyControls}>
            <Pressable style={styles.qtyButton} onPress={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}><Text style={styles.qtyText}>-</Text></Pressable>
            <Text style={styles.cardTitle}>{item.quantity}</Text>
            <Pressable style={styles.qtyButton} onPress={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}><Text style={styles.qtyText}>+</Text></Pressable>
          </View>
        </View>
      ))}
      <View style={styles.checkoutBox}>
        <Text style={styles.cardTitle}>Estimated total</Text>
        <Text style={styles.heroTitle}>{currency(total)}</Text>
        <Pressable style={styles.primaryButton} onPress={() => setShowCheckout(true)} disabled={!mapped.length}><Text style={styles.primaryButtonText}>Checkout</Text></Pressable>
        <Pressable style={styles.secondaryButton} onPress={clearCart}><Text style={styles.secondaryButtonText}>Clear cart</Text></Pressable>
      </View>
      <CheckoutModal visible={showCheckout} onClose={() => setShowCheckout(false)} total={total} storeId={cartStore} />
    </ScrollView>
  );
}

function CheckoutModal({ visible, onClose, total, storeId }: { visible: boolean; onClose: () => void; total: number; storeId: StoreLocation | null }) {
  const clearCart = useAppStore((s) => s.clearCart);
  const { data: stores = [] } = useQuery({ queryKey: ['stores'], queryFn: commerceClient.getStores });
  const [pickupTime, setPickupTime] = useState<string | null>(null);
  const [mode, setMode] = useState<'guest' | 'account'>('guest');

  if (!storeId) return null;
  const store = stores.find((item) => item.id === storeId);

  return (
    <Modal visible={visible} animationType="slide">
      <ScrollView style={styles.screen} contentContainerStyle={styles.screenContent}>
        <Text style={styles.heroTitle}>Checkout</Text>
        <Text style={styles.cardSubtext}>Store: {store?.name}</Text>
        <Section title="Fulfillment">
          <Text style={styles.bodyText}>Pickup only. Select a time window below.</Text>
          <View style={styles.wrap}>{store?.pickupWindows.map((window) => <Chip key={window} label={window} active={pickupTime === window} onPress={() => setPickupTime(window)} />)}</View>
        </Section>
        <Section title="Account mode"><View style={styles.wrap}><Chip label="Guest checkout" active={mode === 'guest'} onPress={() => setMode('guest')} /><Chip label="Login / account" active={mode === 'account'} onPress={() => setMode('account')} /></View></Section>
        <Section title="Payments"><Text style={styles.bodyText}>Stripe-compatible payment intent architecture ready. Native secure card capture still needs live gateway credentials.</Text></Section>
        <Pressable style={styles.primaryButton} onPress={async () => {
          if (!pickupTime) return Alert.alert('Pickup time required', 'Choose a pickup window before confirming.');
          const payment = await paymentsClient.createPaymentIntent(total);
          clearCart();
          Alert.alert('Order confirmed', `Pickup at ${store?.name} · ${pickupTime}\nGateway: ${payment.gateway}`);
          onClose();
        }}><Text style={styles.primaryButtonText}>Confirm order · {currency(total)}</Text></Pressable>
        <Pressable style={styles.secondaryButton} onPress={onClose}><Text style={styles.secondaryButtonText}>Back</Text></Pressable>
      </ScrollView>
    </Modal>
  );
}

function RewardsScreen() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.screenContent}>
      <Text style={styles.heroTitle}>Roots Rewards</Text>
      <Text style={styles.bodyText}>Loyalty placeholder is wired as a standalone screen so real rewards APIs can drop in later without rewriting navigation.</Text>
      <View style={styles.rewardCard}><Text style={styles.cardTitle}>Coming soon</Text><Text style={styles.cardSubtext}>Points balance, perks, referral offers, and personalized promotions.</Text></View>
      <View style={styles.rewardCard}><Text style={styles.cardTitle}>Push campaign ready</Text><Text style={styles.cardSubtext}>Designed for Firebase / OneSignal event-triggered promos tied to favorite categories and reorder habits.</Text></View>
    </ScrollView>
  );
}

function AccountScreen() {
  const favorites = useAppStore((s) => s.favorites);
  const { data: orders = [] } = useQuery({ queryKey: ['orders'], queryFn: commerceClient.getOrders });
  const { data: products = [] } = useQuery({ queryKey: ['products'], queryFn: commerceClient.getProducts });
  const { data: pages = [] } = useQuery({ queryKey: ['pages'], queryFn: cmsClient.getPages });

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.screenContent}>
      <Text style={styles.heroTitle}>Account</Text>
      <View style={styles.accountCard}><Text style={styles.cardTitle}>Auth flows</Text><Text style={styles.cardSubtext}>Signup, login, and guest checkout entry points are structured as placeholders for live auth integration.</Text></View>
      <Section title="Order history">{orders.map((order) => <View key={order.id} style={styles.orderRow}><Text style={styles.cardTitle}>{order.id}</Text><Text style={styles.cardSubtext}>{order.status} · {order.pickupTime} · {currency(order.total)}</Text></View>)}</Section>
      <Section title="Saved favorites">{favorites.length === 0 ? <EmptyState title="No favorites yet" subtitle="Tap the heart on any product." /> : favorites.map((favoriteId) => {
        const product = products.find((p) => p.id === favoriteId);
        return product ? <ProductCard key={product.id} product={product} compact /> : null;
      })}</Section>
      <Section title="CMS pages">{pages.map((page) => <ContentPageCard key={page.slug} page={page} />)}</Section>
    </ScrollView>
  );
}

function ContentPageCard({ page }: { page: ContentPage }) {
  return (
    <View style={styles.contentCard}>
      <Text style={styles.cardTitle}>{page.title}</Text>
      <Text style={styles.bodyText}>{page.body}</Text>
    </View>
  );
}

function Section({ title, children }: React.PropsWithChildren<{ title: string }>) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={{ gap: spacing.md }}>{children}</View>
    </View>
  );
}

function Chip({ label, active, onPress }: { label: string; active?: boolean; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, active && styles.chipActive]}>
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </Pressable>
  );
}

function EmptyState({ title, subtitle }: { title: string; subtitle: string }) {
  return <View style={styles.emptyState}><Text style={styles.cardTitle}>{title}</Text><Text style={styles.cardSubtext}>{subtitle}</Text></View>;
}

function Metric({ label, value }: { label: string; value: string }) {
  return <View style={styles.metric}><Text style={styles.metricLabel}>{label}</Text><Text style={styles.metricValue}>{value}</Text></View>;
}

const styles = StyleSheet.create({
  fullScreenCenter: { flex: 1, justifyContent: 'center', padding: spacing.lg },
  ageGateCard: { backgroundColor: '#102218', borderRadius: 24, padding: spacing.lg, borderWidth: 1, borderColor: colors.border, gap: spacing.md },
  screen: { flex: 1, backgroundColor: colors.background },
  screenContent: { padding: spacing.md, gap: spacing.lg, paddingBottom: 120 },
  header: { backgroundColor: colors.background, paddingHorizontal: spacing.md, paddingBottom: spacing.sm, gap: spacing.sm },
  headerActions: { flexDirection: 'row', gap: spacing.sm, alignItems: 'center' },
  storePill: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colors.surfaceAlt, borderRadius: 999, paddingHorizontal: 14, paddingVertical: 10, alignSelf: 'flex-start' },
  storePillText: { color: colors.text, fontSize: 14, fontWeight: '700' },
  searchPill: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colors.surfaceAlt, borderRadius: 16, paddingHorizontal: 14, paddingVertical: 12 },
  searchText: { color: colors.textMuted },
  iconButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.surfaceAlt, alignItems: 'center', justifyContent: 'center' },
  pushStatus: { color: colors.textMuted, fontSize: 12 },
  banner: { borderRadius: 24, padding: spacing.lg, gap: spacing.sm },
  kicker: { color: colors.warning, textTransform: 'uppercase', letterSpacing: 1, fontSize: 12, fontWeight: '700' },
  heroTitle: { color: colors.text, fontSize: 28, lineHeight: 34, fontWeight: '800' },
  bodyText: { color: colors.textMuted, fontSize: 14, lineHeight: 20 },
  section: { gap: spacing.sm },
  sectionTitle: { color: colors.text, fontSize: 20, fontWeight: '800' },
  chip: { marginRight: spacing.sm, marginBottom: spacing.sm, borderWidth: 1, borderColor: colors.border, borderRadius: 999, paddingHorizontal: 14, paddingVertical: 10, backgroundColor: colors.surface },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { color: colors.text, fontWeight: '700' },
  chipTextActive: { color: colors.background },
  productCard: { backgroundColor: colors.card, borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: colors.border },
  productImage: { width: '100%', height: 180, backgroundColor: colors.surface },
  productContent: { padding: spacing.md, gap: spacing.sm },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: spacing.sm },
  cardTitle: { color: colors.text, fontSize: 16, fontWeight: '800', flexShrink: 1 },
  cardSubtext: { color: colors.textMuted, fontSize: 13, lineHeight: 18 },
  priceText: { color: colors.primary, fontSize: 18, fontWeight: '800' },
  inventoryText: { color: colors.success, fontSize: 12, fontWeight: '700' },
  filtersBar: { paddingHorizontal: spacing.md, paddingTop: spacing.md, gap: spacing.sm },
  searchInput: { backgroundColor: colors.surfaceAlt, borderRadius: 16, color: colors.text, paddingHorizontal: 14, paddingVertical: 14, borderWidth: 1, borderColor: colors.border },
  sortRow: { flexDirection: 'row', flexWrap: 'wrap' },
  listContent: { padding: spacing.md, paddingBottom: 140, gap: spacing.md },
  detailImage: { width: '100%', height: 280, borderRadius: 24, backgroundColor: colors.surface },
  metricsRow: { flexDirection: 'row', gap: spacing.sm },
  metric: { flex: 1, backgroundColor: colors.surface, borderRadius: 18, padding: spacing.md, borderWidth: 1, borderColor: colors.border },
  metricLabel: { color: colors.textMuted, fontSize: 12 },
  metricValue: { color: colors.text, fontSize: 18, fontWeight: '800' },
  variantRow: { backgroundColor: colors.surface, borderRadius: 16, padding: spacing.md, borderWidth: 1, borderColor: colors.border, flexDirection: 'row', justifyContent: 'space-between' },
  variantRowActive: { borderColor: colors.primary, backgroundColor: colors.surfaceAlt },
  primaryButton: { backgroundColor: colors.primary, borderRadius: 16, paddingVertical: 16, alignItems: 'center' },
  primaryButtonText: { color: colors.background, fontWeight: '800', fontSize: 16 },
  secondaryButton: { backgroundColor: colors.surface, borderRadius: 16, paddingVertical: 16, alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  secondaryButtonText: { color: colors.text, fontWeight: '700' },
  cartRow: { backgroundColor: colors.card, borderRadius: 18, padding: spacing.md, borderWidth: 1, borderColor: colors.border, flexDirection: 'row', gap: spacing.md },
  qtyControls: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  qtyButton: { width: 34, height: 34, borderRadius: 17, backgroundColor: colors.surfaceAlt, justifyContent: 'center', alignItems: 'center' },
  qtyText: { color: colors.text, fontSize: 20, fontWeight: '800' },
  checkoutBox: { backgroundColor: colors.surface, borderRadius: 20, padding: spacing.lg, gap: spacing.md, borderWidth: 1, borderColor: colors.border },
  rewardCard: { backgroundColor: colors.card, borderRadius: 20, padding: spacing.lg, borderWidth: 1, borderColor: colors.border, gap: spacing.sm },
  accountCard: { backgroundColor: colors.card, borderRadius: 20, padding: spacing.lg, borderWidth: 1, borderColor: colors.border },
  orderRow: { backgroundColor: colors.card, borderRadius: 18, padding: spacing.md, borderWidth: 1, borderColor: colors.border },
  contentCard: { backgroundColor: colors.card, borderRadius: 18, padding: spacing.md, borderWidth: 1, borderColor: colors.border, gap: spacing.sm },
  emptyState: { backgroundColor: colors.surface, borderRadius: 18, padding: spacing.lg, borderWidth: 1, borderColor: colors.border, gap: spacing.sm },
  wrap: { flexDirection: 'row', flexWrap: 'wrap' },
  disclaimerBox: { borderRadius: 18, backgroundColor: '#173023', padding: spacing.md, borderColor: colors.warning, borderWidth: 1, gap: spacing.sm },
  disclaimerTitle: { color: colors.warning, fontWeight: '800', fontSize: 14 },
  disclaimerText: { color: colors.text, lineHeight: 20 },
  modalBackdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.45)' },
  modalCard: { backgroundColor: colors.background, padding: spacing.lg, borderTopLeftRadius: 24, borderTopRightRadius: 24, gap: spacing.md, borderTopWidth: 1, borderColor: colors.border },
  storeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.surface, borderRadius: 16, padding: spacing.md, borderWidth: 1, borderColor: colors.border }
});

export default AppProviders;
