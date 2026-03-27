# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
yarn dev           # Start development server with hot reload
yarn build         # Production build (runs typecheck first)
yarn build:win     # Build Windows executable
yarn build:mac     # Build macOS app
yarn build:linux   # Build Linux packages
yarn lint          # Run ESLint
yarn format        # Format with Prettier
yarn typecheck     # Type-check all (main + renderer)
yarn typecheck:node  # Type-check Electron main process only
yarn typecheck:web   # Type-check React renderer only
```

## Architecture

This is an **Electron + React + TypeScript** POS (point of sale) system for pharmacies.

### Process Separation

- **`src/main/`** — Electron main process (window management, IPC, app lifecycle)
- **`src/preload/`** — Context bridge scripts exposing Electron APIs to renderer
- **`src/renderer/src/`** — React application (all UI logic lives here)

### Renderer Architecture

The renderer follows a layered pattern:

```
Routes (TanStack Router, file-based)
  → ViewModels (src/renderer/src/effects/*.viewmodel.ts)
    → Services (src/renderer/src/services/)
      → api.ts (Axios, http://localhost:3000, 3s timeout)
```

**State Management**:
- `src/renderer/src/contexts/create-order/` — Order state via React Context + `useReducer`
- TanStack React Query — server/async state (medication searches, etc.)
- React Hook Form + Zod — form validation

**UI Components**: shadcn/ui (`src/renderer/src/components/ui/`) built on Radix UI + Tailwind CSS v4.

### Key Routes

| Route | Purpose |
|-------|---------|
| `/` | Home screen |
| `/orders/create` | New sale creation |
| `/checkout/open` | Open cash register |
| `/checkout/close` | Close cash register |

### API Contract

The app expects a backend at `http://localhost:3000`:
- `GET /medication/search?q={query}` — medication search
- `POST /orders` — create order (`CreateOrderDTO`)
- `POST /checkout` — checkout operations

### Core Domain Types

```typescript
type Medication = { id: number; name: string; box_price: string; unit_price: string; stock_availability: number }
type OrderItem = { medication: Medication; quantity: number; boxType: 'box' | 'unit'; subtotal: number }
interface CreateOrderDTO {
  paymentValue: number
  orderItems: { medicationId: string; amount: number; totalValue: number; boxType: 'unit' | 'box' }[]
}
```

### Keyboard Navigation

The app is keyboard-driven (POS context):
- **F1–F6**: Quick navigation between routes
- **Arrow Up/Down**: Sidebar navigation
- **Enter**: Submit forms / advance focus between inputs
- **Esc**: Close dialogs

### Code Style

Prettier config: single quotes, no semicolons, 100-char line width, 2-space indent (enforced via `.prettierrc.yaml` + `.editorconfig`).
