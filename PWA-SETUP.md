# 📱 PWA Configuration Guide

## ✅ Co już jest skonfigurowane:

### 1. **@vite-pwa/nuxt** zainstalowane

```bash
npm install @vite-pwa/nuxt
```

### 2. **nuxt.config.ts** - Pełna konfiguracja PWA

- ✅ Web App Manifest (nazwa, opis, kolory)
- ✅ Service Worker z Workbox
- ✅ Runtime caching strategies
- ✅ Auto-update registration
- ✅ Dev mode enabled

---

## 🎯 Co musisz zrobić:

### **Krok 1: Wygeneruj ikony**

1. Otwórz `scripts/generate-pwa-icons.html` w przeglądarce
2. Kliknij przyciski "Pobierz" dla każdej ikony
3. Zapisz pliki w folderze `public/`:
   - `icon-64x64.png`
   - `icon-192x192.png`
   - `icon-512x512.png`

**ALTERNATYWNIE:** Użyj narzędzia online:

- https://realfavicongenerator.net/
- https://www.pwabuilder.com/imageGenerator

---

### **Krok 2: Opcjonalnie dodaj screenshoty**

Dla lepszej prezentacji w instalacji PWA:

1. **Wide Screenshot (Desktop):**
   - Zrób screenshot landing page
   - Rozdzielczość: 1280x720
   - Zapisz jako: `public/screenshot-wide.png`

2. **Mobile Screenshot:**
   - Zrób screenshot na telefonie lub w dev tools (Mobile view)
   - Rozdzielczość: 750x1334
   - Zapisz jako: `public/screenshot-mobile.png`

**Jeśli nie chcesz screenów:** Usuń sekcję `screenshots` z `nuxt.config.ts`

---

### **Krok 3: Test PWA**

#### **Development:**

```bash
npm run dev
```

Otwórz Chrome DevTools → Application → Manifest
Sprawdź czy manifest jest poprawnie załadowany.

#### **Production Build:**

```bash
npm run build
npm run preview
```

#### **Test instalacji:**

1. Otwórz w Chrome/Edge
2. W pasku adresu pojawi się ikona instalacji (+)
3. Kliknij "Zainstaluj"

---

## 📋 Checklist PWA:

- [ ] Ikony wygenerowane i zapisane w `public/`
- [ ] Build production bez błędów
- [ ] Service Worker rejestruje się poprawnie
- [ ] Manifest.json jest dostępny pod `/manifest.webmanifest`
- [ ] Aplikacja instaluje się na desktop/mobile
- [ ] Offline mode działa (spróbuj wyłączyć internet)
- [ ] Cache strategia działa (Network/Cache/StaleWhileRevalidate)

---

## 🔧 Debugowanie:

### **Sprawdź manifest:**

```
http://localhost:3000/manifest.webmanifest
```

### **Sprawdź Service Worker:**

Chrome DevTools → Application → Service Workers

### **Wyczyść cache:**

```javascript
// W konsoli przeglądarki:
navigator.serviceWorker.getRegistrations().then(function (registrations) {
  for (let registration of registrations) {
    registration.unregister();
  }
});
```

---

## 📊 Konfiguracja Workbox - Co robi:

### **1. API Requests** (NetworkFirst)

```typescript
urlPattern: /^https:\/\/api\./;
handler: "NetworkFirst";
```

- Najpierw próba sieć → jeśli fail, użyj cache
- Cache przez 1 godzinę
- Max 50 wpisów

### **2. Images** (CacheFirst)

```typescript
urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/;
handler: "CacheFirst";
```

- Cache-first strategy
- Cache przez 30 dni
- Max 100 obrazów

### **3. Google Fonts** (StaleWhileRevalidate)

- Używa cache, ale aktualizuje w tle
- Długi cache (1 rok dla webfonts)

---

## 🚀 Deployment:

### **Vercel/Netlify:**

PWA działa automatycznie po build.

### **Sprawdź Lighthouse:**

Chrome DevTools → Lighthouse → PWA audit

**Cel:** 100/100 w kategorii PWA

---

## 🔄 Auto-Update:

Aplikacja automatycznie aktualizuje się dzięki:

```typescript
registerType: "autoUpdate";
```

Użytkownik nie musi nic robić - nowa wersja załaduje się przy następnym otwarciu.

---

## 📱 Testowanie na urządzeniach mobilnych:

1. **Deploy na Vercel/Netlify**
2. **Otwórz na telefonie**
3. **Chrome:** "Dodaj do ekranu głównego"
4. **Safari (iOS):** Share → "Dodaj do ekranu głównego"

---

## ⚙️ Zaawansowane:

### **Custom Service Worker:**

Jeśli potrzebujesz custom logiki:

```typescript
// app/service-worker.js
self.addEventListener("push", (event) => {
  // Custom push notification logic
});
```

```typescript
// nuxt.config.ts
workbox: {
  importScripts: ["/custom-sw.js"];
}
```

### **Offline Page:**

```typescript
workbox: {
  offlinePage: '/offline.html',
  offlineAssets: ['/offline-image.png']
}
```

---

## 🎓 Resources:

- [Vite PWA Docs](https://vite-pwa-org.netlify.app/)
- [Workbox Documentation](https://developer.chrome.com/docs/workbox/)
- [Web App Manifest Spec](https://www.w3.org/TR/appmanifest/)
- [PWA Best Practices](https://web.dev/progressive-web-apps/)

---

## 💡 Tips:

1. **Test offline mode:** DevTools → Network → Offline checkbox
2. **Clear cache często:** Podczas development
3. **iOS Safari wymaga HTTPS:** Nawet w dev (użyj ngrok)
4. **Maskable icons:** Dla lepszego wyglądu na Androidzie
5. **Screenshots boostują instalacje:** Użytkownicy widzą jak wygląda app

---

**Status:** ✅ Konfiguracja PWA jest kompletna - pozostało tylko wygenerować ikony!
