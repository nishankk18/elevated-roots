# Elevated Roots MA Mobile App

React Native + TypeScript mobile app scaffolded with Expo for rapid Android-first delivery.

## Stack
- React Native + TypeScript
- Expo
- Zustand
- TanStack Query
- Expo Notifications placeholder for Firebase / OneSignal integration
- Stripe-compatible payment intent placeholder
- CMS-ready content data layer

## Implemented MVP Screens
- Age Gate + compliance disclaimer
- Store selector (Abington, Halifax, Kingston)
- Home
- Shop / catalog with search, sort, filter, store-specific stock
- Product detail modal with variants, THC/CBD, favorites, add to cart
- Cart with store lock
- Checkout with guest/account toggle, pickup time, confirmation
- Rewards placeholder
- Account with orders, favorites, CMS pages

## Commands
```bash
npm install
npm run start
npm run typecheck
npx expo export --platform android
npm run apk
```

## Build Status
- `npm run typecheck` ✅
- `npx expo export --platform android` ✅
- APK build not executed locally because a signed Android build requires EAS auth/project wiring or a native Android toolchain.

## Files
- `App.tsx` - main app shell and screen implementation
- `src/store/useAppStore.ts` - Zustand store
- `src/api/client.ts` - headless CMS / commerce / notifications / payments placeholder clients
- `src/data/mockData.ts` - seed data for stores, products, orders, content
