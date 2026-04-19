# Pokémon Collection — Frontend Admin

Pannello di amministrazione per l'applicazione Pokémon Collection, costruito con **Vue 3**, **TypeScript** e **DaisyUI**.

---

## Stack

| Tecnologia | Versione | Utilizzo |
|---|---|---|
| Vue 3 | — | Framework UI (Composition API + `<script setup>`) |
| TypeScript | — | Tipizzazione |
| Vite | — | Build tool e dev server |
| Tailwind CSS | 4.x | Utility CSS |
| DaisyUI | 5.x | Componenti UI (temi `pokemon` / `pokemon-dark`) |
| FormKit | 1.x | Gestione form (locale italiano) |
| TanStack Vue Query | — | Fetching, cache e sincronizzazione dati |
| Pinia | — | State management |
| Lucide Vue Next | — | Icone |
| Vue Router | 4.x | Routing |

---

## Requisiti

- Node.js >= 18
- npm >= 9

---

## Installazione

```bash
# Entra nella cartella frontend
cd admin

# Installa le dipendenze
npm install
```

---

## Avvio in sviluppo

```bash
npm run dev
```

L'app sarà disponibile su `http://localhost:5173`.

## Build per produzione

```bash
npm run build
```

## Type check

```bash
npm run type-check
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
├── components/
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
