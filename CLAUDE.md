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

**Regra:** sempre que for necessário implementar uma integração com a API (novos endpoints, parâmetros, schemas de request/response), consulte `docs/api-reference.md` como fonte de verdade antes de escrever qualquer código. Não assuma contratos — verifique o documento.

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

### Form Inputs

All form inputs **must** be controlled via `react-hook-form`. Never use `useState` to manage input values directly.

- Simple text/number inputs: use `register` from `useForm`
- Third-party input components (e.g. `MoneyInput`, `Select`): wrap in `Controller` and bind via `field.onChange` / `field.ref`
- The viewmodel exposes `register` and `control` to the component — the component never owns input state

```tsx
// ✅ Correct — Controller for third-party component
<Controller
  name="paymentValue"
  control={control}
  render={({ field }) => (
    <MoneyInput
      ref={field.ref}
      onValueChange={(_, __, values) => field.onChange(values?.float ?? 0)}
    />
  )}
/>

// ❌ Wrong — input state owned by useState
const [paymentValue, setPaymentValue] = useState(0)
<MoneyInput onValueChange={(_, __, values) => setPaymentValue(values?.float ?? 0)} />
```

### Code Style

Prettier config: single quotes, no semicolons, 100-char line width, 2-space indent (enforced via `.prettierrc.yaml` + `.editorconfig`).

### Feature Sliced Architecture

O projeto adota Feature Sliced Architecture. Cada domínio (ex: `orders`, `checkout`, `medication`) possui seu próprio módulo e todos os artefatos relacionados a ele devem viver dentro desse módulo:

- Componentes de UI → `src/renderer/src/components/<módulo>/`
- ViewModels / hooks de negócio → `src/renderer/src/effects/<módulo>/`
- Services e DTOs → `src/renderer/src/services/<módulo>/`
- Contextos → `src/renderer/src/contexts/<módulo>/`

ViewModels devem seguir o padrão `effects/[Module]/use<Feature>.viewmodel.ts` — nunca na raiz de `effects/` nem em pastas de outros módulos. Componentes genéricos e reutilizáveis sem domínio fixo ficam em `components/ui/`.

### Design Guide

**Hover em botões:** todo botão deve ter uma ação de hover visível. Use sempre um tom mais escuro da cor de fundo do botão — nunca dependa de variáveis CSS genéricas como `hover:bg-primary/90` se a cor base for utilitária (ex: `bg-green-600` → `hover:bg-green-700`). Botões com `variant="outline"` já herdam `hover:bg-accent` do componente base.

**Box de conteúdo:** todo conteúdo principal dentro de uma rota deve ser envolto em uma box de fundo branco para dar destaque contra o fundo padrão da aplicação. Use sempre o padrão:

```tsx
<div className="p-6">
  <div className="bg-white rounded-sm p-12 border-slate-300 border text-black">
    {/* conteúdo */}
  </div>
</div>
```

### Planejamento

Sempre que criar um plano de implementação, quebre-o em tasks isoladas usando o `TaskCreate`. Cada task deve:
- Ter escopo único e bem definido (uma responsabilidade por task)
- Ser executável de forma independente
- Ser marcada como concluída imediatamente após sua execução
