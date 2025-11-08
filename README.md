# Prompt Forge – Generator i Biblioteka Promptów AI

🌐 **Demo**: https://prompt-forge-pink.vercel.app/

Prompt Forge to nowoczesna aplikacja Nuxt 4 do tworzenia, edycji i organizacji promptów AI. Oferuje zaawansowany edytor tagów z system wag i emfazy, bibliotekę zapisów z kolekcjami, historię działań oraz wbudowany czat z konfiguracją AI (LM Studio / API kompatybilne z OpenAI). Pełna responsywność z dedykowanymi komponentami mobilnymi.

## ✨ Funkcje

### 📝 Edytor Promptów (`/editor`)

- **System tagów z kategoriami**: wybór tagów pogrupowanych tematycznie
- **Zaawansowane sterowanie**:
  - Weight (waga): precyzyjna kontrola wpływu tagu (0.1-2.0)
  - Emphasis (emfaza): obsługa nawiasów wzmacniających `()` (0-3 poziomy)
- **Filtry i wyszukiwanie**: real-time search, ulubione, kategorie, NSFW toggle
- **Randomizacja**: automatyczny wybór losowych tagów w kategorii
- **Podgląd na żywo**: wizualizacja pozytywnych i negatywnych promptów
- **Copy-to-clipboard**: natychmiastowe kopiowanie wyników
- **Responsywność mobilna**:
  - `EditorMobileSummary`: floating button z slide-up panel na urządzeniach mobilnych
  - `EditorSelectedSummary`: desktop sidebar z pełną kontrolą
  - Optymalizowane przyciski i spacing dla touch devices
- **Zapisywanie**: SavePromptModal z metadanymi i tagami
- **Szablony negatywne**: gotowe zestawy negatywnych promptów

### 📚 Biblioteka (`/library`)

- **4 zakładki**:
  - **Saved**: zapisane finalne prompty z metadanymi
  - **Custom**: własne prompty użytkownika (CRUD)
  - **History**: historia akcji (generowanie, optymalizacja)
  - **Collections**: organizacja w kolekcje z opisami
- **Import/Export**: backup i przywracanie całej biblioteki (JSON)
- **Statystyki**: liczniki, ostatnie aktywności
- **Modal system**: podgląd, edycja, dodawanie do kolekcji

### 🎨 Szablony (`/templates`)

- **Katalog**: lista gotowych szablonów promptów
- **Filtry**: typ, kategorie, tagi (wielokrotny wybór)
- **Sortowanie**: ID, nazwa (A-Z, Z-A)
- **Infinite scroll**: dynamiczne ładowanie przy przewijaniu
- **Podgląd**: modal z pełną treścią szablonu i metadanymi
- **Tłumaczenia**: pełne wsparcie PL/EN

### 💬 Czat AI (`/chat`)

- **Wielowątkowy**: zarządzanie wieloma konwersacjami
- **Retry**: ponowienie nieudanych zapytań
- **Edycja tytułów**: zmiana nazw konwersacji
- **Persistencja**: localStorage synchronizacja
- **Historia**: pełna archiwizacja wiadomości

### ⚙️ Ustawienia (`/settings`)

- **AI Configuration**:
  - Endpoint i model ID (LM Studio / OpenAI-compatible)
  - Test połączenia z diagnostyką
  - Automatyczne pobieranie listy modeli
- **Theme Management**: jasny / ciemny / system z animacjami
- **Language**: PL/EN z persystencją w cookie i localStorage

### 🏠 Landing Page (`/`)

- **Full-page scroll**: sekcje pełnoekranowe z `FullPageDots` nawigacją
- **Hero**: animowany gradient, CTA buttons
- **Features**: karty funkcji z ikonami
- **Interactive Demo**: komponent optymalizacji promptu na żywo
- **How It Works**: kroki użytkowania
- **FAQ**: często zadawane pytania
- **Accessibility**: skip links, ARIA labels, reduced motion support

## 🛠️ Stos technologiczny

### Core

- **Nuxt 4.1.2**: Framework SSR z Vue 3 Composition API
- **Vue 3.5.22**: Reaktywny UI framework
- **TypeScript 5.9.2**: Type-safe development
- **Vite**: Ultra-szybki bundler

### Nuxt Modules

- **@nuxt/ui 4.0**: System komponentów z Tailwind CSS
- **@nuxt/content 3.7**: Content management z walidacją Zod
- **@nuxtjs/i18n 10.1**: Internationalization (PL/EN)
- **@nuxt/image 1.11**: Optymalizacja obrazów
- **@nuxt/eslint 1.9**: Linting z flat config

### UI & Styling

- **Tailwind CSS**: Utility-first CSS framework
- **Heroicons & Lucide**: Icon sets (@iconify-json)
- **Glass Morphism Components**: Custom UI (GlassButton, GlassCard, GlassBadge, GlassPanel)
- **ApexCharts**: Wykresy i wizualizacje danych (vue3-apexcharts)

### State & Storage

- **LocalStorage**: Persistencja ustawień, biblioteki i czatu
- **Composables**: Centralized state management (Composition API)
- **Color Mode**: @nuxt/color-mode dla theme managementu

### Development Tools

- **ESLint 9**: Linting z @antfu/eslint-config
- **Better-SQLite3**: (opcjonalne dla rozszerzeń)
- **@nuxt/test-utils**: Testing utilities

## 📁 Struktura Projektu

### `app/components/`

```
├── ui/                              # Glass Morphism Components
│   ├── GlassButton.vue
│   ├── GlassCard.vue
│   ├── GlassBadge.vue
│   └── GlassPanel.vue
├── editor/                          # Editor Components
│   ├── EditorSidebar.vue           # Kategorie sidebar (desktop)
│   ├── EditorSelectedSummary.vue   # Podsumowanie desktop (sidebar)
│   ├── EditorMobileSummary.vue     # Floating button + slide-up panel (mobile)
│   ├── EditorSearchFilters.vue     # Search & filters bar
│   ├── EditorProgressBar.vue       # Progress indicator
│   ├── EditorStatsCard.vue         # Statistics display
│   └── SavePromptModal.vue         # Save dialog
├── library/                         # Library Components
│   ├── LibrarySavedTab.vue
│   ├── LibraryCustomTab.vue
│   ├── LibraryHistoryTab.vue
│   ├── LibraryCollectionsTab.vue
│   ├── LibraryPromptCard.vue
│   ├── LibraryStats.vue
│   ├── PreviewModal.vue
│   └── modals/                      # CRUD Modals
│       ├── AddToCollectionModal.vue
│       ├── CreateCollectionModal.vue
│       ├── EditPromptModal.vue
│       └── ImportModal.vue
├── templates/                       # Template Components
│   ├── TemplateCard.vue
│   ├── TemplateListItem.vue
│   └── TemplateSkeleton.vue
├── chat/                            # Chat Components
│   ├── ChatWindow.vue
│   ├── ChatSidebar.vue
│   ├── ChatMessage.vue
│   ├── ChatInput.vue
│   └── ChatHeader.vue
├── settings/                        # Settings Components
│   ├── AIConfigSettings.vue
│   ├── ThemeSettings.vue
│   ├── LanguageSettings.vue
│   └── SettingsCard.vue
├── landing/                         # Landing Page Components
│   ├── LandingHero.vue
│   ├── LandingFeatures.vue
│   ├── LandingFeatureCard.vue
│   ├── LandingInteractiveDemo.vue  # Live demo
│   ├── LandingHowItWorks.vue
│   ├── LandingStepCard.vue
│   ├── LandingFAQ.vue
│   ├── LandingStatCard.vue
│   ├── LandingTestimonialCard.vue
│   └── LandingCTA.vue
├── demo/                            # Demo Section Components
│   ├── DemoInputSection.vue
│   ├── DemoOutputSection.vue
│   ├── DemoStateEmpty.vue
│   ├── DemoStateProcessing.vue
│   ├── DemoStateSuccess.vue
│   └── DemoStateError.vue
├── prompts/
│   └── PromptEditor.vue             # Legacy editor (jeśli używany)
├── AppSidebar.vue                   # Main navigation (mobile + desktop)
├── FullPageDots.vue                 # Full-page scroll navigation
├── LoadingOverlay.vue               # Global loading state
├── BackgroundEffects.vue            # Visual effects
└── BaseModal.vue                    # Base modal wrapper
```

### `app/composables/`

```typescript
useAI.ts; // AI API calls, test connection, model list
useChat.ts; // Chat state, conversations, retry logic
useLibrary.ts; // Saved/custom/history/collections CRUD, import/export
useTemplates.ts; // Template filters, sorting, pagination
useEditorState.ts; // Centralized editor state (tags, filters, modals)
usePreloadedContent.ts; // Preload content (options, prompts, tags)
usePromptOptimizer.ts; // Prompt optimization logic
useSidebar.ts; // Sidebar open/close state
useTheme.ts; // Theme management (light/dark/system)
useZIndex.ts; // Z-index hierarchy management
useInfiniteScroll.ts; // Infinite scroll implementation
useGooey.ts; // Gooey effect (SVG filters)
```

### `app/pages/`

```
├── index.vue              # Landing page (full-page sections)
├── editor/
│   └── index.vue          # Tag-based prompt editor
├── prompts/
│   └── index.vue          # Alternative prompt picker (jeśli używany)
├── templates/
│   └── index.vue          # Templates catalog
├── library/
│   └── index.vue          # Library with 4 tabs
├── chat/
│   └── index.vue          # AI chat interface
└── settings/
    └── index.vue          # Settings page
```

### `content/`

```json
prompts.json   // Prompt templates (z schematem Zod)
options.json   // Dropdown options (placeholder values)
tagi.json      // Tags database (categories, translations, NSFW)
```

### `i18n/`

```
├── i18n.config.ts         # i18n configuration
└── locales/
    ├── pl.json            # Polish translations
    └── en.json            # English translations
```

### Konfiguracje

```
nuxt.config.ts             # Nuxt configuration
content.config.ts          # Content schemas (Zod validation)
tsconfig.json              # TypeScript config
eslint.config.js           # ESLint flat config
app.config.ts              # App-level config
```

## 📋 Wymagania

- **Node.js**: 18.0.0 lub wyższy
- **Package Manager**: pnpm (zalecany) / npm / yarn

## 🚀 Instalacja

```bash
# Sklonuj repozytorium
git clone https://github.com/gb-redRabit/prompt-forge.git
cd prompt-forge

# Instalacja zależności (pnpm - zalecane)
pnpm install

# Alternatywnie: npm
npm install

# Alternatywnie: yarn
yarn install
```

## 💻 Development

```bash
# Uruchom dev server (pnpm)
pnpm dev

# Lub npm
npm run dev

# Lub yarn
yarn dev
```

**Aplikacja dostępna pod**: http://localhost:3000

### Hot Module Replacement (HMR)

- Zmiany w komponentach Vue są stosowane na żywo
- Zmiany w content/ wymagają czasem przeładowania
- Zmiany w nuxt.config.ts wymagają restartu serwera

## 🏗️ Build & Preview

```bash
# Production build
pnpm build

# Preview production build lokalnie
pnpm preview

# Generate static site (jeśli używasz SSG)
pnpm generate
```

**Output**: `.output/` directory (gotowe do deploy)

## 🤖 Konfiguracja AI (LM Studio / OpenAI-compatible)

### Ustawienia w aplikacji

Przejdź do **Settings → AI Configuration** w aplikacji:

1. **Endpoint URL**:
   - LM Studio: `http://localhost:1234/v1/chat/completions`
   - OpenAI: `https://api.openai.com/v1/chat/completions`
   - Inne kompatybilne API

2. **Model ID**:
   - Wybierz z listy (button "Fetch Models")
   - Lub wpisz ręcznie (np. `gpt-4`, `llama-2-7b`)

3. **Test Connection**:
   - Zweryfikuj połączenie przed użyciem
   - Otrzymasz komunikat o sukcesie/błędzie

### Composable `useAI.ts`

Dane są zapisywane w `localStorage` (klucz: `ai_config`):

```typescript
{
  endpoint: string,    // URL endpointu
  modelId: string,     // ID modelu
  apiKey?: string      // Opcjonalny API key
}
```

### Uwagi

- **Authorization Header**: Domyślnie `Bearer lm-studio` (zmień w kodzie dla innych API)
- **CORS**: LM Studio domyślnie obsługuje CORS z localhost
- **API Key**: Dla OpenAI dodaj klucz w ustawieniach (wymaga modyfikacji kodu)

### Testowanie połączenia

```bash
# LM Studio (upewnij się, że serwer działa)
curl http://localhost:1234/v1/models

# Powinno zwrócić listę dostępnych modeli
```

## 📦 Content Management (@nuxt/content)

### Struktura plików

Wszystkie pliki znajdują się w `content/` i są walidowane przez `content.config.ts` (Zod schemas):

#### `prompts.json`

```typescript
{
  id: string,
  type: string,
  name: { pl: string, en: string },
  description: { pl: string, en: string },
  template: { pl: string, en: string },
  placeholder_keys: string[],
  tags: string[],
  categories: string[]
}
```

#### `options.json`

```typescript
{
  [key: string]: Array<{
    value: string,
    label: { pl: string, en: string }
  }>
}
```

#### `tagi.json`

```typescript
{
  pl: string,           // Polski tag
  en: string,           // Angielski tag
  neg_pl: string,       // Polski negatywny
  neg_en: string,       // Angielski negatywny
  category: string,     // Kategoria
  nsfw: boolean         // NSFW flag
}
```

### Ważne uwagi

- ✅ **Format**: Tylko poprawny JSON (bez trailing commas, komentarzy)
- ✅ **Walidacja**: @nuxt/content automatycznie waliduje z Zod
- ⚠️ **Błędy**: Niepoprawne pliki zostaną odrzucone w build time
- 🔄 **HMR**: Zmiany w content wymają czasem ręcznego reload

## 🌐 Internationalization (i18n)

### Konfiguracja

- **Strategy**: `no_prefix` (brak `/pl` lub `/en` w URL)
- **Default Locale**: `pl` (Polski)
- **Available**: `pl` (Polski), `en` (English)
- **Fallback**: `pl`

### Persistencja

- **Cookie**: `locale` (dla SSR)
- **LocalStorage**: `locale` (dla client-side)
- **Plugin**: `i18n-persist.client.ts` synchronizuje wybór

### Dodawanie tłumaczeń

1. Edytuj `i18n/locales/pl.json` i `en.json`
2. Użyj w komponentach: `{{ $t('klucz.zagnieżdżony') }}`
3. W composables: `const { t } = useI18n()` → `t('klucz')`

## 🎯 Kluczowe Funkcjonalności

### Biblioteka (useLibrary)

- `createCustomPrompt()` - Tworzenie własnych promptów
- `updateCustomPrompt()` - Edycja zapisanych
- `deleteCustomPrompt()` - Usuwanie
- `importLibrary()` - Import z JSON
- `downloadLibrary()` - Export do JSON
- `createCollection()` - Nowa kolekcja
- `addToCollection()` - Dodaj prompt do kolekcji

### Edytor (useEditorState)

- **Tag Selection**: `selectedTags` (Record<category, TagItem[]>)
- **Weight Control**: 0.1 - 2.0 (slider)
- **Emphasis Control**: 0-3 nawiasy `()` (slider)
- **Filters**: search, favorites, NSFW toggle
- **Copy**: Instant clipboard copy (pozytywny/negatywny)

### Templates (useTemplates)

- **Filters**: Multiple categories, tags, types
- **Sort**: ID, Name (A-Z, Z-A)
- **Pagination**: Infinite scroll z `useInfiniteScroll`
- **Preview**: Modal z pełną zawartością

### Chat (useChat)

- **Multi-conversation**: Zarządzanie wieloma wątkami
- **Retry Logic**: Ponowienie nieudanych zapytań
- **Title Edit**: Zmiana nazw konwersacji
- **History**: Pełna archiwizacja w localStorage

## 🚀 Deploy

### Vercel (Zalecane)

Projekt jest zoptymalizowany pod Vercel (zobacz [demo](https://prompt-forge-pink.vercel.app/)):

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production
vercel --prod
```

### Inne platformy (Netlify, Cloudflare, etc.)

```bash
# Build
pnpm build

# Output directory
.output/
```

### Environment Variables (opcjonalne)

```bash
# .env
NUXT_PUBLIC_API_BASE=https://your-api.com
```

## ⚠️ Znane uwagi i rozwiązywanie problemów

### Content validation errors

- ✅ **Problem**: `@nuxt/content` odrzuca pliki z błędami
- 🔧 **Rozwiązanie**: Sprawdź `content/*.json` - usuń trailing commas i komentarze
- 📝 **Walidacja**: Schematy w `content.config.ts`

### Hydration mismatch

- ✅ **Problem**: Warning o różnicach SSR vs Client
- 🔧 **Rozwiązanie**: Użyj `<ClientOnly>` dla komponentów zależnych od `window`/`localStorage`
- 📝 **Przykład**: Theme toggle, language selector

### LocalStorage nie działa po refresh

- ✅ **Problem**: Dane znikają po odświeżeniu
- 🔧 **Rozwiązanie**: Sprawdź `plugins/i18n-persist.client.ts` i composables
- 📝 **Debug**: Otwórz DevTools → Application → Local Storage

### Mobile menu nie działa poprawnie

- ✅ **Problem**: Linki znikają po nawigacji (FIXED w najnowszej wersji)
- 🔧 **Rozwiązanie**: `AppSidebar.vue` używa `v-show` zamiast `v-if`
- 📝 **Commit**: Zmiana zapobiega niszczeniu komponentów przy zamykaniu menu

### Content nie ładuje się

- ✅ **Problem**: Brak danych z `content/`
- 🔧 **Rozwiązanie**: Użyj `usePreloadedContent()` w `app.vue` lub odwiedź landing page
- 📝 **Dev Mode**: Restart dev servera po zmianach w content/

### Build failures

- ✅ **Problem**: TypeScript errors podczas buildu
- 🔧 **Rozwiązanie**: `pnpm dlx nuxt typecheck` dla diagnostyki
- 📝 **Common**: Missing types dla custom composables - dodaj `*.d.ts`

## 📄 Landing Page: Full-Page Scroll Sections

Landing page (`app/pages/index.vue`) wykorzystuje `FullPageDots.vue` do nawigacji pełnoekranowej.

### Dodawanie nowej sekcji

**Krok 1**: Dodaj `<section>` w `app/pages/index.vue`:

```vue
<section
  id="nova-section"
  data-fullpage-section
  class="fullpage-section"
  role="region"
  aria-label="Nova Section"
>
  <UContainer class="py-8 lg:py-16 w-full">
    <!-- Twoja zawartość -->
  </UContainer>
</section>
```

**Krok 2**: Dodaj do `dotItems` (w tym samym pliku):

```typescript
const dotItems = [
  { id: "hero", label: "Hero" },
  { id: "features", label: "Features" },
  { id: "nova-section", label: "Nova" }, // <-- Nowa
];
```

### Przewijanie wewnętrzne (Passthrough Wheel)

Komponent automatycznie wykrywa elementy z `overflow-y: auto` i pozwala na przewijanie wewnętrzne:

```vue
<!-- Przykład sekcji z długą zawartością -->
<section id="long-content" data-fullpage-section class="fullpage-section">
  <div class="max-h-screen overflow-y-auto">
    <!-- Długa lista - przewijanie wewnątrz sekcji -->
  </div>
</section>
```

**Mechanizm**:

- Sprawdza element pod kursorem i jego przodków
- Jeśli element może się przewijać w danym kierunku → przewija wewnętrznie
- Jeśli nie może → przełącza sekcję

### Accessibility & Reduced Motion

✅ **Implemented features**:

- `skip link` na początku strony (pomija do głównej treści)
- `role="main"` i `role="region"` dla sekcji
- `aria-label` dla każdej sekcji
- `aria-live="polite"` w `FullPageDots` (komunikaty dla screen readers)
- Obsługa `prefers-reduced-motion`:
  - Jeśli włączone → animacje są skracane/wyłączane
  - Przejścia natychmiastowe zamiast animowanych

### Customizacja

Edytuj `app/components/FullPageDots.vue`:

```typescript
// Czułość scroll wheel (niższa = łatwiej przełączyć sekcję)
const WHEEL_TRIGGER = 100;

// Czas decay (ms) - jak długo ignorować dodatkowe scroll events
const WHEEL_DECAY_MS = 50;
```

### Touch Support

- **Swipe**: Przesuń palcem góra/dół (mobile)
- **Threshold**: 50px minimum swipe distance
- **Velocity**: Wykrywa szybkie gesty

## 🎨 Design System

### Glass Morphism Components

Projekt wykorzystuje custom Glass Morphism UI:

- **GlassButton**: Przyciski z efektem szkła i backdrop-blur
- **GlassCard**: Karty z przezroczystym tłem
- **GlassBadge**: Odznaczniki z glassmorphism
- **GlassPanel**: Panele z efektem szklanym

**Użycie**:

```vue
<GlassButton variant="solid" color="primary" size="md">
  Click me
</GlassButton>

<GlassCard class="p-6">
  <h3>Card Content</h3>
</GlassCard>
```

### Color Palette

- **Primary**: Blue gradient (primary-500 → primary-600)
- **Secondary**: Purple accent (purple-500 → purple-600)
- **Neutral**: Gray scale (gray-50 → gray-900)
- **Status**: Success (green), Error (red), Warning (yellow), Info (blue)

### Responsive Breakpoints

```css
sm: 640px   /* Tablet portrait */
md: 768px   /* Tablet landscape */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
2xl: 1536px /* Extra large */
```

### Z-Index Hierarchy (useZIndex)

```typescript
BACKGROUND: 0-10
CONTENT: 20-40
SIDEBAR/NAV: 50
DROPDOWN: 60-65
MODAL: 70-80
LOADING/TOAST: 90-100
```

## 📱 Mobile Optimization

### Responsive Features

- **EditorMobileSummary**: Floating button (z-40) + slide-up panel (z-50)
- **AppSidebar**: `v-show` dla menu (zamiast `v-if` - zapobiega znikaniu linków)
- **Compact UI**: Zmniejszone paddingi, gaps i font-size na mobile
- **Touch Feedback**: `active:scale-95` dla lepszego UX
- **Safe Area Support**: `env(safe-area-inset-bottom)` dla notched devices

### Mobile-First Classes

```vue
<!-- Przykład responsive class pattern -->
<div class="p-3 sm:p-4 lg:p-6"></div>
```

## 🤝 Contributing

### Development Workflow

1. Fork repository
2. Utwórz branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push: `git push origin feature/amazing-feature`
5. Otwórz Pull Request

### Code Style

- **ESLint**: `@antfu/eslint-config` (flat config)
- **Format**: Auto-format on save (VS Code + ESLint)
- **TypeScript**: Strict mode enabled
- **Conventions**:
  - Composables: `use[Name].ts`
  - Components: PascalCase.vue
  - Props/Events: camelCase

### Testing

```bash
# Type check
pnpm dlx nuxt typecheck

# Lint
pnpm lint

# Build test
pnpm build
```

## 📚 Dodatkowe Zasoby

### Dokumentacja

- [Nuxt 4 Docs](https://nuxt.com)
- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [@nuxt/ui](https://ui.nuxt.com)
- [@nuxt/content](https://content.nuxt.com)

### Tutorials

- [Prompt Engineering Guide](https://www.promptingguide.ai/)
- [Stable Diffusion Prompting](https://stable-diffusion-art.com/prompt-guide/)

## 📝 Changelog

### v2.0.0 (Current)

- ✨ Nowy system tagów z weight/emphasis control
- 📱 Dedykowane komponenty mobilne (EditorMobileSummary)
- 🎨 Glass Morphism design system
- 🐛 Fix: Mobile menu links disappearing (v-if → v-show)
- 📦 Upgrade: Nuxt 4.1.2, Vue 3.5.22
- 🌐 Enhanced i18n with better persistence

### v1.0.0

- 🎉 Initial release
- 📝 Edytor promptów z placeholderami
- 📚 Biblioteka (saved, custom, history, collections)
- 🎨 Katalog szablonów
- 💬 AI Chat integration

## 📄 Licencja

MIT License - zobacz [LICENSE](LICENSE) dla szczegółów

## 👤 Author

**gb-redRabit**

- GitHub: [@gb-redRabit](https://github.com/gb-redRabit)
- Project: [prompt-forge](https://github.com/gb-redRabit/prompt-forge)

## 🙏 Acknowledgments

- [Nuxt Team](https://nuxt.com) za framework
- [Heroicons](https://heroicons.com) za ikony
- Społeczność AI/ML za inspirację do promptów

---

**⭐ Star this repo if you find it useful!**
