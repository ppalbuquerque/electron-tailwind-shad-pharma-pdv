# Checkout Module

## 1. Visão geral

Gerencia o ciclo de vida da sessão de caixa: abertura, consulta de status, resumo de vendas e fechamento. Apenas um checkout pode estar aberto por vez — pedidos só podem ser criados dentro de uma sessão ativa.

Capacidades:
- Abrir um novo caixa com valor inicial em dinheiro
- Consultar o status do checkout mais recente (aberto ou fechado)
- Obter resumo agregado do caixa aberto (totais de pedidos)
- Fechar o caixa com valor físico de fechamento
- Exibir badge visual de estado do caixa (aberto/fechado) no layout

**Rotas de acesso:** `/checkout/open` (atalho `F4`), `/checkout/close` (atalho `F5`)

---

## 2. Estrutura de arquivos

```
src/renderer/src/
├── services/
│   ├── checkout.service.ts
│   └── checkout/
│       └── checkout.query.keys.ts
├── effects/checkout/
│   ├── openCheckout.viewmodel.ts
│   └── closeCheckout.viewmodel.ts
├── components/layout/
│   └── checkoutStatus.tsx          # badge reutilizável de status
└── routes/checkout/
    ├── open.tsx
    └── close.tsx
```

---

## 3. API

> Fonte de verdade: `docs/api-reference.md`.

### `POST /checkout` — Abrir caixa

**Body:**
```json
{ "initialValue": 500.00 }
```

**Response `201`:**
```json
{
  "id": "uuid",
  "isOpen": true,
  "initialValue": 500.00,
  "closingValue": null,
  "closedAt": null,
  "createdAt": "2026-01-01T08:00:00.000Z",
  "updatedAt": "2026-01-01T08:00:00.000Z"
}
```

**Response `4xx`:** `403 / errorCode 001` — já existe um checkout aberto.

---

### `GET /checkout/status` — Status do checkout mais recente

Retorna o checkout mais recente, independente de estar aberto ou fechado. Chamado no layout raiz para popular o cache do React Query.

**Response `200`:**
```json
{
  "id": "uuid",
  "isOpen": true,
  "createdAt": "2026-01-01T08:00:00.000Z",
  "updatedAt": "2026-01-01T08:00:00.000Z",
  "closedAt": null
}
```

**Response `4xx`:** `404 / errorCode 006` — nenhum checkout existe na base.

---

### `GET /checkout/resume` — Resumo do caixa aberto

Agrega pedidos não cancelados vinculados ao checkout aberto.

**Response `200`:**
```json
{
  "openedAt": "2026-01-01T08:00:00.000Z",
  "initialValue": 500.00,
  "totalOrderCount": 3,
  "totalOrdersValue": 300.00,
  "grandTotal": 800.00
}
```

> `grandTotal = initialValue + totalOrdersValue`. Pedidos `CANCELLED` são excluídos do cálculo.

**Response `4xx`:** `404 / errorCode 005` — nenhum checkout aberto.

---

### `POST /checkout/close` — Fechar caixa

**Body:**
```json
{ "checkoutId": "uuid", "closingValue": 750.00 }
```

**Response `201`:**
```json
{
  "id": "uuid",
  "isOpen": false,
  "initialValue": 500.00,
  "closingValue": 750.00,
  "closedAt": "2026-01-01T18:00:00.000Z",
  "createdAt": "2026-01-01T08:00:00.000Z",
  "updatedAt": "2026-01-01T18:00:00.000Z"
}
```

**Response `4xx`:**
- `404 / errorCode 002` — checkout não encontrado pelo ID
- `403 / errorCode 003` — checkout já está fechado

---

## 4. Tipos

```typescript
interface OpenCheckoutDTO {
  initialValue: number // Valor float em reais (ex: 500.00 = R$ 500,00)
}

interface CloseCheckoutDTO {
  checkoutId: string   // UUID do checkout a fechar
  closingValue: number // Valor físico no caixa ao fechar (float em reais)
}

interface CheckoutStatusResponse {
  id: string
  isOpen: boolean
  createdAt: string   // ISO 8601
  updatedAt: string   // ISO 8601
  closedAt: string | null
}

interface CheckoutResumeResponse {
  openedAt: string          // ISO 8601
  initialValue: number      // Float em reais
  totalOrderCount: number
  totalOrdersValue: number  // Float em reais
  grandTotal: number        // initialValue + totalOrdersValue, float em reais
}

// Formulário interno — abertura de caixa
interface OpenCheckoutForm {
  initialValue: number
}

// Formulário interno — fechamento de caixa
interface CloseCheckoutForm {
  closingValue: number
}
```

---

## 5. Service

```typescript
class CheckoutService {
  static openCheckout({ initialValue }: { initialValue: number }): Promise<void>
  static async getCheckoutStatus(): Promise<CheckoutStatusResponse>
  static async getCheckoutResume(): Promise<CheckoutResumeResponse>
  static async closeCheckout(dto: CloseCheckoutDTO): Promise<void>
}
```

---

## 6. Query Keys

```typescript
CHECKOUT_QUERY_KEYS = {
  STATUS: 'checkout-status',  // usado no layout raiz e no viewmodel de fechamento
  RESUME: 'checkout-resume',  // usado no viewmodel de fechamento
}
```

> `CHECKOUT_QUERY_KEYS.STATUS` é populado no layout raiz (`__root.tsx`) para que o `checkoutId` fique disponível em cache desde o início da sessão.

---

## 7. ViewModels

### `useOpenCheckoutViewModel`

**Arquivo:** `effects/checkout/openCheckout.viewmodel.ts`

```typescript
interface OpenCheckoutViewModel {
  control: Control<OpenCheckoutForm>
  isLoading: boolean
  onSubmit: () => Promise<void>
}
```

**Comportamento:**
- Gerencia o formulário via `react-hook-form`
- Submissão chama `CheckoutService.openCheckout` via `useMutation`
- Em caso de sucesso: exibe toast `'Caixa aberto com sucesso'` e navega para `/orders/create`
- Em caso de erro: exibe toast `'Error ao abrir o caixa'`
- Expõe `isLoading` (derivado de `isPending`) para desabilitar o botão durante a requisição

---

### `useCloseCheckoutViewModel`

**Arquivo:** `effects/checkout/closeCheckout.viewmodel.ts`

```typescript
interface CloseCheckoutViewModel {
  control: Control<CloseCheckoutForm>
  isLoading: boolean
  isModalOpen: boolean
  grandTotal: number        // valor vindo de GET /checkout/resume
  closingValue: number      // valor digitado pelo operador (watch do form)
  difference: number        // closingValue - grandTotal
  openModal: () => void
  handleCancel: () => void
  handleConfirm: () => Promise<void>
  onSubmit: () => void      // handleSubmit wrapper que chama openModal
}
```

**Comportamento:**
- Lê `checkoutId` da cache via `useQuery([CHECKOUT_QUERY_KEYS.STATUS])` — sem nova requisição à API
- Busca `grandTotal` via `useQuery([CHECKOUT_QUERY_KEYS.RESUME])` → `GET /checkout/resume`
- Gerencia o formulário via `react-hook-form`; `closingValue` é observado com `watch`
- `openModal` é chamado via submit do form (Enter no input) e pelo botão "Fechar Caixa"
- `handleCancel` fecha o modal sem fazer requisição
- `handleConfirm` chama `POST /checkout/close` via `useMutation`
  - Sucesso: toast `'Caixa fechado com sucesso'` + `setTimeout(5000)` → navega para `/`
  - Erro: toast `'Erro ao fechar o caixa'`, modal permanece aberto
- `isLoading` (`isPending` da mutation) desabilita ambos os botões do modal durante a requisição

---

## 8. Componentes

### `CheckoutStatus`

**Arquivo:** `components/layout/checkoutStatus.tsx`

Badge visual que indica o estado atual do caixa. Componente de layout — não pertence ao domínio de uma rota específica.

| Prop | Tipo | Descrição |
|------|------|-----------|
| `variant` | `'open' \| 'closed'` | Define cor e texto exibido |

**Variantes:**
- `open` — fundo `bg-green-200`, texto `text-green-700`, exibe "Caixa Aberto"
- `closed` — fundo `bg-slate-300`, texto `text-slate-600`, exibe "Caixa Fechado"

---

## 9. Rotas

### `/checkout/open`

**Arquivo:** `routes/checkout/open.tsx`

#### Layout

```
┌─────────────────────────────────┐
│  [ícone carrinho - bg-sky-100]  │
│  Abrir novo caixa               │
│  Coloque o valor inicial...     │
│                                 │
│  ┌─────────────────────────┐    │
│  │ Valor inicial           │    │
│  │ [MoneyInput]            │    │
│  │ [Cancelar] [Confirmar]  │    │
│  └─────────────────────────┘    │
│                                 │
│  ⚠ Lembretes importantes        │
│  • Observe o valor na gaveta    │
│  • Confira se está correto      │
└─────────────────────────────────┘
```

#### Comportamento
- Foco automático no `MoneyInput` ao montar (via `useRef` + `useEffect`)
- Input controlado via `Controller` (react-hook-form) ligado ao `MoneyInput`
- Botão "Confirmar" desabilitado durante a requisição (`isLoading`)
- Spinner exibido no botão durante loading
- Após sucesso navega automaticamente para `/orders/create`

---

### `/checkout/close`

**Arquivo:** `routes/checkout/close.tsx`

#### Layout

```
┌─────────────────────────────────┐
│  [ícone cadeado - bg-red-100]   │
│  Fechar caixa                   │
│  Informe o valor total...       │
│                                 │
│  ┌─────────────────────────┐    │
│  │ Valor de fechamento     │    │
│  │ [MoneyInput]            │    │
│  │ [Cancelar] [Fechar Cx]  │    │
│  └─────────────────────────┘    │
│                                 │
│  [Dialog de confirmação]        │
│  Total vendido:   R$ xxx        │
│  Valor contado:   R$ xxx        │
│  Diferença:       R$ xxx        │
│  [Cancelar] [Confirmar]         │
└─────────────────────────────────┘
```

#### Comportamento
- Foco automático no `MoneyInput` ao montar (via `useRef` + `useEffect`)
- Botão "Fechar Caixa" desabilitado enquanto `closingValue <= 0`
- Enter no input (form submit) → abre modal de confirmação (se `closingValue > 0`)
- Modal exibe: `grandTotal`, `closingValue` e `difference` formatados via `formatMoney`
- `difference` exibido em vermelho se negativo, verde se positivo/zero (`BoxValue.className`)
- Esc com modal aberto → fecha modal via `onOpenChange` + retorna foco ao input
- Enter com modal aberto → chama `handleConfirm()` via `onKeyDown` no `DialogContent`
- Botões Cancelar e Confirmar do modal desabilitados durante `isLoading`
- Spinner no botão Confirmar durante loading
- Após sucesso: toast verde + redirect para `/` após 5 segundos

---

## 10. Regras de negócio

1. Apenas um checkout pode estar aberto por vez — tentar abrir um segundo retorna erro `001`.
2. Pedidos só podem ser criados enquanto há um checkout aberto.
3. O `initialValue` deve ser informado pelo operador ao abrir o caixa — representa o fundo de troco físico.
4. O `closingValue` é obrigatório no formulário de fechamento (botão desabilitado se vazio).
5. `grandTotal` é calculado pelo backend: `initialValue + totalOrdersValue` (pedidos cancelados excluídos).
6. Um checkout fechado não pode ser reaberto.
7. O `checkoutId` necessário para fechar o caixa é obtido da cache do React Query populada no layout raiz — não há chamada extra à API na tela de fechamento.

---

## 11. Extensão futura

1. Adicionar método em `checkout.service.ts`
2. Adicionar query key em `checkout/checkout.query.keys.ts` se necessário
3. Criar viewmodel em `effects/checkout/`
4. Criar rota em `routes/checkout/`
5. Atualizar este documento
