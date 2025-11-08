# Prompt Forge

AI Prompt Editor & Library · Nuxt 4 · Vue 3 · TypeScript · PWA

🌐 Demo: https://prompt-forge-pink.vercel.app/

---

## 🇵🇱 Opis

Prompt Forge to aplikacja do tworzenia, optymalizacji i organizowania promptów dla modeli AI (OpenAI‑compatible / LM Studio). Edytor tagów (waga 0.1–2.0, emfaza nawiasami), biblioteka (saved/custom/history/collections + import/export JSON), szablony, czat AI, pełne i18n (PL/EN), PWA oraz responsywny design.

## 🇬🇧 Summary

Prompt Forge is a Nuxt 4 app for crafting, optimizing and organizing prompts for LLMs. It includes a weighted/emphasis tag editor, prompt library (saved/custom/history/collections with JSON import/export), templates catalog, multi‑conversation chat, full i18n (PL/EN), PWA support and mobile‑first UI.

---

## ✨ Features / Funkcje

- Tag editor: weight, emphasis parentheses, positive & negative segments
- Library: saved, custom, history, collections (CRUD, JSON import/export)
- Templates: filtering (type, categories, tags), infinite scroll preview
- AI Chat: multi conversation, retry failed, rename threads
- Settings: endpoint + model ID fetch, theme (light/dark/system), language persistence
- PWA: manifest, icons, runtime caching (@vite-pwa/nuxt)
- Accessibility: ARIA, reduced motion, keyboard nav
- Mobile-first components

## 🧱 Tech Stack / Stos

| Warstwa / Layer | Tech                     |
| --------------- | ------------------------ |
| Framework       | Nuxt 4 (Vue 3, Vite)     |
| Language        | TypeScript               |
| UI              | Tailwind CSS + @nuxt/ui  |
| Content         | @nuxt/content + Zod      |
| i18n            | @nuxtjs/i18n             |
| PWA             | @vite-pwa/nuxt (Workbox) |
| Images          | @nuxt/image              |
| Lint            | ESLint (flat config)     |

## 🗂 Structure / Struktura

```
app/components/   # UI (editor, library, chat, templates, landing)
app/composables/  # useAI, useChat, useLibrary, useTemplates, etc.
app/pages/        # /, /editor, /library, /chat, /templates, /settings
content/          # prompts.json, options.json, tagi.json
public/           # PWA icons + static assets
nuxt.config.ts    # modules, pwa, i18n
content.config.ts # Zod schemas
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
