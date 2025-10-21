# Prompt Forge – Generator i Biblioteka Promptów AI

Demo: https://prompt-forge-pink.vercel.app/

Prompt Forge to aplikacja Nuxt 3/4 do tworzenia, edycji i organizacji promptów AI. Oferuje bibliotekę zapisów, kolekcje, historię, edytor z placeholderami oraz wbudowany czat z lokalną konfiguracją AI (LM Studio / API kompatybilne z OpenAI).

## Funkcje

- Edytor promptów
  - Placeholdery i podpowiedzi (oparte o content/options)
  - Automatyczna kompozycja finalnego promptu i kopiowanie
  - Tłumaczenia nazw/opisów (PL/EN)
- Biblioteka (useLibrary)
  - Zapisywanie wyników (SavedPrompt), własne prompty (custom), historia, kolekcje
  - Import/Export biblioteki (JSON, localStorage)
- Szablony (Templates)
  - Lista, filtry (typy, kategorie, tagi), sortowanie, paginacja/infinite scroll
  - Podgląd treści szablonu
- Czat (useChat)
  - Konwersacje, retry błędów, zmiana tytułu, trwałość w localStorage
- Ustawienia
  - Konfiguracja AI (endpoint/model), test połączenia, pobieranie listy modeli
  - Motyw (jasny/ciemny/system), język (PL/EN)
- Landing
  - Hero, sekcje funkcji, demo interaktywne (optymalizacja promptu), FAQ, CTA

## Stos technologiczny

- Nuxt 4 (Vue 3 + Vite), TypeScript
- @nuxt/ui, @nuxt/content, @nuxtjs/i18n, @nuxt/image
- Tailwind (klasy w komponentach UI)
- LocalStorage (persistencja konfiguracji i danych użytkownika)

## Struktura (skrót)

- app/components
  - prompts/PromptEditor.vue
  - templates/(TemplateCard|TemplateListItem|TemplateSkeleton).vue
  - library/(… oraz modals/)
  - chat/(ChatWindow|ChatSidebar|ChatMessage|ChatHeader).vue
  - landing/(LandingHero|Features|FAQ|…)
  - settings/(AIConfigSettings|ThemeSettings|SettingsCard).vue
  - AppSidebar.vue
- app/composables
  - useAI.ts (wywołania modeli, test, lista modeli)
  - useLibrary.ts (saved/custom/history/collections, import/export)
  - usePreloadedContent.ts (preload options/prompts/tags z @nuxt/content)
  - useTemplates.ts (filtry i sortowanie listy szablonów)
  - useChat.ts (logika czatu)
  - useInfiniteScroll.ts, useSidebar.ts, usePromptOptimizer.ts
- app/pages
  - index.vue (landing)
  - prompts/index.vue (edytor/picker)
  - templates/index.vue (katalog szablonów)
  - library/index.vue (biblioteka)
  - settings/index.vue (ustawienia)
  - chat/index.vue (czat)
- i18n/locales (pl.json, en.json)
- content
  - prompts.json, options.json, tagi.json (wczytywane przez @nuxt/content)
- content.config.ts (schematy Zod kolekcji content)

## Wymagania

- Node.js 18+
- pnpm / npm / yarn (dowolny)

## Instalacja

```bash
# pnpm
pnpm install
# lub npm
npm install
# lub yarn
yarn install
```

## Development

```bash
# pnpm
pnpm dev
# npm
npm run dev
# yarn
yarn dev
```

Aplikacja: http://localhost:3000

## Build/Preview

```bash
# build
pnpm build
# preview prod
pnpm preview
```

## Konfiguracja AI (LM Studio / OpenAI-compatible)

Composable useAI.ts czyta ustawienia z localStorage (klucz ai_config):

- endpoint: np. http://localhost:1234/v1/chat/completions
- modelId: identyfikator modelu

Uwagi:

- Nagłówek Authorization ustawiony domyślnie na Bearer lm-studio (dostosuj, jeśli potrzeba).
- Użyj ustawień w Ustawienia → AI, aby przetestować połączenie i pobrać listę modeli.

## Dane treści (Nuxt Content)

Schematy są wymuszane przez content.config.ts:

- prompts: tablica obiektów z polami m.in. id, type, name.{pl,en}, description.{pl,en}, template.{pl,en}, placeholder_keys[], tags[], categories[]
- options: rekord { [key: string]: OptionItem[] } z polami value, label.{pl,en}
- tags: tablica obiektów z polami pl/en/neg_pl/neg_en/category/nsfw

Upewnij się, że JSONy są poprawne (bez przecinków końcowych i komentarzy). W razie błędów walidacji @nuxt/content odrzuci pliki.

## i18n

- Domyślne locale: pl (fallback: pl)
- Dostępne: pl, en
- Persistencja wyboru języka w localStorage i cookie (plugin i18n-persist.client.ts)

## Skróty funkcjonalne

- Biblioteka: importLibrary, downloadLibrary, createCustomPrompt, updateCustomPrompt, collections CRUD
- Edytor: detekcja placeholderów [key], podmiana wartości, kopiowanie wyniku
- Templates: filtry (typ/kategorie/tagi), sortowanie (id/nazwa), infinite scroll
- Chat: wiele konwersacji, retry po błędzie, auto-tytuł

## Deploy

- Gotowe pod Vercel (zobacz demo).
- Komenda build: npm run build (lub pnpm build)
- Output: .output/ (Nuxt)

## Znane uwagi

- Jeśli pliki content/\*.json nie są poprawnym JSON, należy je naprawić pod schematy z content.config.ts.
- Przy pierwszym uruchomieniu warto wczytać zawartość (usePreloadedContent) lub odwiedzić stronę główną, która triggeruje preload.

## Instrukcja: dodawanie i konfiguracja full-page sekcji (landing)

W projekcie landing page (`app/pages/index.vue`) jest zrealizowany jako zestaw sekcji pełnoekranowych sterowanych komponentem `FullPageDots`.

Jak dodać nową sekcję:

1. Dodaj nowy element `section` wewnątrz `#fullpage-track`:

```html
<section
  id="nowa"
  data-fullpage-section
  class="fullpage-section"
  role="region"
  aria-label="Nowa sekcja"
>
  <UContainer class="py-8 lg:py-16 w-full">
    <!-- treść -->
  </UContainer>
</section>
```

2. Dodaj odpowiadający element do `dotItems` w `app/pages/index.vue`, np.:

```ts
const dotItems = [
  { id: "hero", label: "Hero" },
  // ...
  { id: "nowa", label: "Nowa sekcja" },
];
```

Uwagi dotyczące przewijania wewnętrznego (passthrough wheel):

- Mechanizm sprawdza, czy element pod kursorem (lub jego przodek) ma wewnętrzny overflow i czy może przewinąć się w danym kierunku. Jeśli tak, pozwala na normalne przewijanie wewnątrz tego elementu zamiast przełączać sekcje.
- Jeśli chcesz, aby dana sekcja zawsze przewijała wewnętrznie, upewnij się, że jej kontener ma `overflow-y: auto` oraz ograniczoną wysokość (np. max-height wewnątrz sekcji).

Reduced motion i accessibility:

- Strona honoruje preferencję `prefers-reduced-motion` — animacje przejść są skracane/wyłączane, jeśli użytkownik preferuje zmniejszoną animację.
- Dodano `skip link` (link pomijający na początku strony), `role="main"` oraz `role="region"` i `aria-label` dla poszczególnych sekcji.
- `FullPageDots` posiada `aria-live` (polite) i aktualizuje komunikat dla czytników ekranu przy zmianie sekcji.

Dodatkowe tipy:

- Jeśli sekcja zawiera długą, przewijaną zawartość (np. listę), lepiej dopasować wewnętrzny kontener z `overflow-auto` i paddingami, aby użytkownicy mogli przewijać zawartość bez wywoływania przejścia sekcji.
- Możesz dostosować prędkość i czułość wheel poprzez zmienne `WHEEL_TRIGGER` oraz `WHEEL_DECAY_MS` w `app/components/FullPageDots.vue`.

## Licencja

MIT
