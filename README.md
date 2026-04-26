# Prompt Forge

AI Prompt Editor & Library · Nuxt 4 · Vue 3 · TypeScript · PWA

🌐 Demo: https://prompt-forge-pink.vercel.app/

---

## 🇵🇱 Opis

Prompt Forge to profesjonalna platforma do tworzenia, optymalizacji i organizacji promptów dla modeli AI. Aplikacja oferuje zaawansowany katalog szablonów z filtrowaniem, dynamiczny edytor z systemem zmiennych (placeholders), precyzyjną kontrolę wag tagów oraz rozbudowaną bibliotekę kolekcji. Całość oparta na Nuxt 4, z nowoczesnym designem Glassmorphism, pełnym wsparciem i18n (PL/EN) oraz trybem PWA.

## 🇬🇧 Summary

Prompt Forge is a Nuxt 4 app for crafting, optimizing and organizing prompts for LLMs. It includes a weighted/emphasis tag editor, prompt library (saved/custom/history/collections with JSON import/export), templates catalog, multi‑conversation chat, full i18n (PL/EN), PWA support and mobile‑first UI.

---

## ✨ Features / Funkcje

- **Advanced Template Catalog**: Search, sort, and filter by multiple categories/tags/types with infinite scroll and real-time preview.
- **Dynamic Prompt Editor**: Placeholder system for variables, localized templates, and instant preview of generated prompts.
- **Weighted Tag System**: Precision control over prompt emphasis (weights 0.1-2.0) with SD-compatible syntax.
- **Robust Prompt Library**: Organize in collections, track history, and import/export via JSON.
- **Premium Glassmorphism UI**: High-end aesthetic with responsive layouts, smooth animations, and dark/light mode support.
- **AI-Powered Optimization**: Connect to local LLMs (LM Studio) or OpenAI to refine and expand your prompts.
- **SSR & SEO Optimized**: Full server-side rendering support with consistent locale hydration and meta tag management.
- **PWA & Offline Support**: Installable application with runtime caching for seamless performance.
- **Accessibility & Performance**: ARIA support, optimized bundle size, and reduced motion considerations.

## 🧱 Tech Stack / Stos

| Warstwa / Layer | Tech                     |
| --------------- | ------------------------ |
| Framework       | Nuxt 4 (Vue 3, Vite)     |
| Language        | TypeScript               |
| State           | Pinia (+ PersistedState) |
| UI              | Tailwind CSS + @nuxt/ui  |
| Content         | @nuxt/content + Zod      |
| i18n            | @nuxtjs/i18n             |
| PWA             | @vite-pwa/nuxt (Workbox) |
| Testing         | Vitest + Happy DOM       |
| Lint            | ESLint (flat config)     |

## 🗂 Structure / Struktura

```
app/components/   # UI (editor, library, chat, templates, landing)
app/composables/  # Hooks (usePreloadedContent, etc.)
app/pages/        # Routing (/, /editor, /library, /chat, /settings)
app/stores/       # Pinia state (editor.ts, settings.ts, library.ts)
tests/            # Vitest unit test suites
content/          # JSON data (prompts, options, tags)
public/           # PWA icons + static assets
nuxt.config.ts    # Nuxt modules, PWA, i18n config
vitest.config.ts  # Test runner configuration
```

## 🚀 Quick Start / Szybki start

Wymagania: Node 18+, pnpm (zalecane) / npm

```bash
git clone https://github.com/gb-redRabit/prompt-forge.git
cd prompt-forge
pnpm install    # lub: npm install
pnpm dev        # lub: npm run dev
```

Build & preview:

```bash
pnpm build
pnpm preview
```

Testy jednostkowe (Vitest):

```bash
npx vitest run
```

Lokalnie: http://localhost:3000

## 🤖 AI Configuration / Konfiguracja AI

Settings → AI Configuration zapisuje w localStorage (`ai_config`).
Przykładowa konfiguracja:

```json
{
  "endpoint": "http://localhost:1234/v1/chat/completions",
  "modelId": "gpt-4",
  "apiKey": "opcjonalny"
}
```

Uwagi / Notes:

- LM Studio: lokalny endpoint (port 1234)
- OpenAI: Authorization Bearer <API_KEY>
- Fetch Models: /v1/models (jeśli dostępne)

## 🌐 i18n & Content

- Strategy: no_prefix, default: pl, fallback: pl
- Files: `i18n/locales/pl.json`, `i18n/locales/en.json`
- JSON w `content/` walidowany przez Zod (`content.config.ts`)

## 📱 PWA

- Plugin: `@vite-pwa/nuxt` (konfiguracja w `nuxt.config.ts`)
- Manifest + ikony w `public/`
- Dev Workbox warnings są normalne
- Instalacja działa po deploy na HTTPS (Vercel)

## 🚀 Deploy (Vercel)

```bash
vercel --prod
```

Output: `.output/`

## 📄 License / Licencja

MIT — `LICENSE`

## 👤 Author / Autor

gb-redRabit · https://github.com/gb-redRabit

---

⭐ Jeśli projekt Ci pomaga — dodaj gwiazdkę / Give it a star.
