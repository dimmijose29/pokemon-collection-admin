# Pokémon Collection — Frontend Admin

Pannello di amministrazione per l'applicazione Pokémon Collection, costruito con **Vue 3**, **TypeScript** e **DaisyUI**.

---

## Stack

| Tecnologia | Versione | Utilizzo |
|---|---|---|
| Vue 3 | 3.5 | Framework UI (Composition API + `<script setup>`) |
| TypeScript | 5.9 | Tipizzazione |
| Vite | 7.x | Build tool e dev server |
| Tailwind CSS | 4.x | Utility CSS |
| DaisyUI | 5.x | Componenti UI (temi `pokemon` / `pokemon-dark`) |
| VeeValidate + Zod | 4.x / 4.x | Form e validazione (schemi in `src/validation`) |
| Reka UI | 2.x | Componenti headless (combobox) |
| TanStack Vue Query | 5.x | Fetching, cache e sincronizzazione dati |
| Pinia | 3.x | State management |
| Axios | 1.x | Client HTTP |
| Chart.js | 4.x | Grafici della dashboard |
| Lucide Vue Next | — | Icone |
| Vue Router | 5.x | Routing |
| Vitest | 4.x | Test (con Testing Library) |

---

## Requisiti

- Node.js ^20.19 oppure >= 22.12 (richiesto da Vite 7)
- npm >= 10
- L'API `pokemon-collection-api` in esecuzione

---

## Installazione

```bash
npm install
```

L'indirizzo dell'API si imposta con `VITE_API_URL` (default `http://localhost:8000/api`), per esempio in un file
`.env.local`. Il valore viene incluso al momento della build.

---

## Avvio in sviluppo

```bash
npm run dev
```

L'app sarà disponibile su `http://localhost:5173`. Il pannello è riservato agli utenti admin.

## Build per produzione

```bash
npm run build
```

## Type check

```bash
npm run type-check
```

## Test

```bash
npm run test
```

## Lint

```bash
npm run lint
```

---

## Struttura

```
src/
├── api/            # Client HTTP per ogni entità (Axios)
├── composables/    # useToast, useErrorList, useXxxModal...
├── validation/     # Schemi Zod condivisi e adattatore per VeeValidate
├── components/
│   ├── base/       # Campi dei form: BaseInput, BaseSelect, BaseCheckbox
│   ├── app/        # Componenti base: AppModal, AppTable, AppLoading
│   ├── forms/      # Form presentazionali (emettono submit, non fanno API call)
│   ├── modals/     # Wrapper AppModal per ogni entità
│   ├── tables/     # Tabelle con query TanStack + mutations
│   ├── settings/   # Card impostazioni profilo utente
│   ├── shared/     # ActionColumn, StatusFilter, FontSizePopover
│   └── utils/      # ErrorAlert, AppToast
├── layouts/        # AdminPage, AdminSidebar, AdminNavbar, AppPage...
├── stores/         # auth, layout, modal (Pinia)
├── types/          # Interfacce TypeScript per ogni entità
├── views/          # Una view per voce di menu
└── router/         # Route divise per area (auth, dashboard, errors)
```

---

## Architettura Componenti

Il progetto segue un pattern a strati:

```
View  →  Table / Card  →  Modal  →  Form
```

- Le **View** sono thin: montano tabella, modale e poco altro
- Le **Table** gestiscono query e mutations (TanStack Query)
- I **composables** `useXxxModal` centralizzano la logica delle modali (API call, errori, toast)
- I **Form** sono puramente presentazionali: ricevono props, emettono `submit`

---

## Temi

L'app supporta tema chiaro e scuro tramite l'attributo `data-theme` su `<html>`:

- `pokemon` — tema chiaro
- `pokemon-dark` — tema scuro

Il cambio tema è gestito da `useLayoutStore` in Pinia e persiste nel `localStorage`.

---

## Estensioni consigliate (Cursor / VS Code)

- **Vue - Official** (Volar) — supporto Vue 3 + TypeScript
- **Tailwind CSS IntelliSense** — autocomplete classi Tailwind
- **ESLint** — linting
- **Prettier** — formattazione
