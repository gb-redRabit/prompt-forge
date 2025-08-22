# Prompt Forge

Prompt Forge to nowoczesna aplikacja webowa oparta o Vue 3, służąca do tworzenia, generowania i zarządzania promptami dla AI (tekst, wideo, audio, obrazy). Projekt wspiera język polski i angielski, umożliwia wygodne filtrowanie, edycję oraz podgląd szablonów z dynamicznymi placeholderami.

---

## Funkcje

- **Tworzenie promptów**: tekstowych, wideo, audio i obrazów.
- **Dynamiczne szablony**: placeholdery zamieniane na wartości z listy, możliwość interaktywnej edycji lub wpisania własnej wartości.
- **Filtrowanie i tagowanie**: szybkie wyszukiwanie promptów po typie i tagach, zaawansowane filtrowanie narzędzi AI po kategoriach.
- **Podgląd i kopiowanie**: wygodny modal z podglądem szablonu i kopiowaniem do schowka (możliwość kopiowania tylko zoptymalizowanego promptu).
- **Wielojęzyczność**: pełne wsparcie PL/EN, szybkie przełączanie języka.
- **Responsywny design**: Tailwind CSS + DaisyUI.
- **Powiadomienia toast**: stylowe komunikaty dzięki vue3-toastify.
- **Przyjazny interfejs**: nowoczesny wygląd, breadcrumbs, nawigacja boczna.
- **Katalog narzędzi AI**: interaktywna lista narzędzi AI z kategoriami, tagami i opisami, szybkie filtrowanie po zastosowaniu.
- **Wsparcie dla modeli lokalnych**: lista i opisy narzędzi do uruchamiania modeli AI lokalnie (np. LM Studio, Ollama, KoboldAI, ComfyUI).
- **Zaawansowane filtrowanie i wyszukiwanie**: zarówno dla promptów, jak i narzędzi AI.
- **Podgląd i kopiowanie promptów**: możliwość podglądu szablonu z dynamicznymi wartościami oraz kopiowania zoptymalizowanego promptu jednym kliknięciem.

---

## Struktura projektu

```
prompt-forge
├── src
│   ├── assets/                # Style (Tailwind), grafiki
│   ├── components/            # Komponenty UI (Navbar, PromptCard, Tags, Breadcrumbs, LanguageSwitcher)
│   ├── i18n/                  # Tłumaczenia PL/EN
│   ├── pages/                 # Widoki (Home, Prompts, CreatePrompt, About, NotFound, AiToolsView)
│   ├── prompts/               # Dane promptów i opcje placeholderów (JSON)
│   ├── data/                  # Dane narzędzi AI (ai_tools.json)
│   ├── router/                # Routing Vue Router
│   ├── store/                 # Pinia store
│   ├── App.vue                # Główny komponent
│   ├── main.js                # Punkt wejścia
├── public/                    # Publiczne zasoby (vite.svg)
├── package.json               # Zależności i skrypty
├── tailwind.config.js         # Konfiguracja Tailwind CSS
├── vite.config.js             # Konfiguracja Vite
├── README.md                  # Dokumentacja
```

---

## Szybki start

1. **Klonowanie repozytorium**

   ```bash
   git clone <adres-repo>
   cd prompt-forge
   ```

2. **Instalacja zależności**

   ```bash
   npm install
   ```

3. **Uruchomienie serwera developerskiego**
   ```bash
   npm run dev
   ```
   Domyślnie aplikacja dostępna jest pod adresem: [http://localhost:3000](http://localhost:3000)

---

## Wersja online

Aplikacja jest dostępna online pod adresem:  
[https://prompt-forge-pink.vercel.app](https://prompt-forge-pink.vercel.app)

---

## Najważniejsze technologie

- **Vue 3** – główny framework
- **Pinia** – zarządzanie stanem
- **Vue Router** – routing
- **Vue I18n** – tłumaczenia
- **Tailwind CSS + DaisyUI** – stylowanie i motywy
- **vue3-toastify** – powiadomienia toast
- **oh-vue-icons** – ikony SVG

---

## Najważniejsze pliki

- `src/pages/CreatePrompt.vue` – edycja promptu z interaktywnymi placeholderami
- `src/pages/PromptList.vue` – lista promptów z filtrowaniem i tagami
- `src/pages/AiToolsView.vue` – katalog narzędzi AI z filtrowaniem po kategoriach
- `src/components/PromptCard.vue` – karta promptu z podglądem i kopiowaniem
- `src/prompts/selector_options.json` – opcje dla placeholderów
- `src/data/ai_tools.json` – dane narzędzi AI
- `src/i18n/pl.json`, `src/i18n/en.json` – tłumaczenia

---

## Kontrybucja

Chętnie przyjmujemy pull requesty i zgłoszenia błędów!  
Zgłoś problem lub propozycję na GitHubie.

---

## Licencja

MIT

---

```

```
