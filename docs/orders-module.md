# Orders Module

## 1. Visão geral

Gerencia o ciclo de vida de pedidos de venda: criação, listagem, visualização de detalhes e cancelamento. Cada pedido está vinculado a um checkout aberto e contém um ou mais itens de medicamentos.

Capacidades:
- Criar um novo pedido com itens e valor de pagamento
- Listar pedidos com filtros de status e intervalo de data
- Visualizar detalhes completos de um pedido
- Cancelar um pedido ativo

**Rotas de acesso:** `/orders/create` (atalho `F2`), `/orders/list` (atalho `F3`), `/orders/detail?id=<uuid>`

---

## 2. Estrutura de arquivos

```
src/renderer/src/
├── services/orders/
│   ├── orders.service.ts
│   ├── orders.dto.ts
│   └── orders.query.keys.ts
├── effects/orders/
│   ├── useCreateOrder.viewmodel.ts
│   ├── useListOrders.viewmodel.ts
│   ├── useOrderDetail.viewmodel.ts
│   ├── useAddOrderItem.viewmodel.ts
│   ├── useCloseOrderSection.viewmodel.ts
│   └── useSearchMedicationDialog.viewmodel.ts
├── components/orders/
│   ├── list-orders-columns.tsx
│   └── order-detail-items-columns.tsx
├── sections/orders/create/
│   ├── add-medication-dialog.tsx
│   ├── add-order-item.tsx
│   ├── close-order-section.tsx
│   ├── empty-order-itens-table.tsx
│   ├── order-itens-columns.tsx
│   └── search-medication-columns.tsx
├── contexts/create-order/
│   └── create-order.context.tsx
└── routes/orders/
    ├── create.tsx
    ├── list.tsx
    └── detail.tsx
```

---

## 3. API

> Fonte de verdade: `docs/api-reference.md`.

### `POST /orders` — Criar pedido

**Body:**
```json
{
  "paymentValue": 100.00,
  "orderItems": [
    { "medicationId": "uuid", "amount": 2, "boxType": "unit" }
  ]
}
```

> O `totalValue` de cada item **não** é enviado pelo frontend — o backend o calcula (`amount * boxPrice` para `box`, `amount * unitPrice` para `unit`). Campos extras no item são rejeitados pela validação global (`forbidNonWhitelisted`).

**Response `201`:** objeto do pedido criado com status `COMPLETE`.

---

### `GET /orders` — Listar pedidos

**Query params:**

| Param | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `limit` | `number` | sim | Tamanho da página |
| `offset` | `number` | sim | Índice de início |
| `status` | `'COMPLETE' \| 'CANCELLED' \| 'PROCESSING'` | não | Filtro por status |
| `createdAtFrom` | `string` (ISO 8601) | não | Data inicial |
| `createdAtTo` | `string` (ISO 8601) | não | Data final |

**Response `200`:**
```json
{
  "orders": [{ "id": "uuid", "totalValue": 100.00, "status": "COMPLETE", "createdAt": "..." }],
  "total": 50,
  "limit": 10,
  "offset": 0
}
```

---

### `GET /orders/:id` — Detalhe do pedido

**Response `200`:**
```json
{
  "id": "uuid",
  "totalValue": 100.00,
  "paymentValue": 120.00,
  "status": "COMPLETE",
  "createdAt": "...",
  "updatedAt": "...",
  "orderItems": [
    {
      "id": "uuid",
      "amount": 2,
      "totalValue": 50.00,
      "boxType": "unit",
      "medication": { "id": 1, "name": "...", "unitPrice": 25.00, "boxPrice": 200.00 }
    }
  ]
}
```

> **`medication` pode ser `null`.** Quando o medicamento é removido do catálogo (`DELETE /medication/:id`), o item do pedido persiste mas a relação passa a resolver para `null`. O frontend deve tratar esse caso ao renderizar (ver regra 9 na seção 8).

---

### `PUT /orders/cancel/:id` — Cancelar pedido

**Path params:** `id` (UUID do pedido)

**Response `200`:**
```json
{ "message": "Order cancelled with success" }
```

**Response `4xx`:** `404 / errorCode 004` — pedido não encontrado ou já cancelado.

> Só é possível cancelar pedidos que não estejam com status `CANCELLED`.

---

## 4. Tipos

> **Valores monetários:** todos os campos monetários (`subtotal`, `orderTotalRaw`, `totalValue`) são **inteiros em centavos** (ex: `4800` = R$ 48,00). Para exibição, use `formatMoneyFromCents(value)` de `@/utils/format-money`. Nunca passe um valor em centavos para `formatMoney()` diretamente.



```typescript
interface CreateOrderDTO {
  paymentValue: number
  orderItems: {
    medicationId: string
    amount: number
    boxType: 'unit' | 'box'
  }[]
}

interface ListOrdersParams {
  limit: number
  offset: number
  status?: 'COMPLETE' | 'CANCELLED' | 'PROCESSING'
  createdAtFrom?: string
  createdAtTo?: string
}

interface OrderSummary {
  id: string
  totalValue: number
  status: 'COMPLETE' | 'CANCELLED' | 'PROCESSING'
  createdAt: string
}

interface ListOrdersResponse {
  orders: OrderSummary[]
  total: number
  limit: number
  offset: number
}

interface OrderItemDetail {
  id: string
  amount: number
  totalValue: number
  boxType: 'unit' | 'box'
  // `null` quando o medicamento foi removido do catálogo (relação órfã)
  medication: {
    id: number
    name: string
    unitPrice: number
    boxPrice: number
  } | null
}

interface OrderDetail {
  id: string
  totalValue: number
  paymentValue: number
  status: 'COMPLETE' | 'CANCELLED' | 'PROCESSING'
  createdAt: string
  updatedAt: string
  orderItems: OrderItemDetail[]
}
```

---

## 5. Service

```typescript
class OrdersService {
  static async createOrder(payload: CreateOrderDTO): Promise<CreateOrderResponse>
  static async listOrders(params: ListOrdersParams): Promise<ListOrdersResponse>
  static async getOrderById(id: string): Promise<OrderDetail>
  static async cancelOrder(id: string): Promise<{ message: string }>
}
```

---

## 6. Query Keys

```typescript
ORDERS_QUERY_KEYS = {
  LIST_ORDERS: 'list-orders',       // useListOrders, invalidado após cancelamento
  GET_ORDER_BY_ID: 'get-order-by-id' // useOrderDetail, invalidado após cancelamento
}
```

> Ambas as keys são invalidadas após um cancelamento bem-sucedido para manter a lista e o detalhe em sincronia.

---

## 7. ViewModels

### `useOrderDetailViewModel`

**Arquivo:** `effects/orders/useOrderDetail.viewmodel.ts`

```typescript
interface OrderDetailViewModel {
  order: OrderDetail | undefined
  isLoading: boolean
  isCancelDialogOpen: boolean
  isCancelPending: boolean
  openCancelDialog: () => void
  closeCancelDialog: () => void
  handleConfirmCancel: () => void
}
```

**Comportamento:**
- Busca o detalhe do pedido via `useQuery([GET_ORDER_BY_ID, id])` → `GET /orders/:id`
- Gerencia estado de abertura/fechamento do modal de cancelamento
- `handleConfirmCancel` aciona `PUT /orders/cancel/:id` via `useMutation`
  - Sucesso: toast `'Order <id> foi cancelada com sucesso'` + invalida `GET_ORDER_BY_ID` e `LIST_ORDERS` + fecha modal + redireciona para `/orders/list` após 3 segundos
  - Erro: toast `'Ocorreu um erro ao cancelar a order'`, usuário permanece na página
- `isCancelPending` desabilita o botão "Confirmar Cancelamento" e exibe spinner durante a requisição
- Atalho `Esc` navega para `/orders/list`

---

### `useListOrdersViewModel`

**Arquivo:** `effects/orders/useListOrders.viewmodel.ts`

Gerencia paginação, filtros de status e intervalo de datas para a listagem de pedidos.

---

### `useCreateOrderViewModel` / seções relacionadas

**Arquivo:** `effects/orders/useCreateOrder.viewmodel.ts`

Orquestra o fluxo de criação de pedido: adicionar itens, calcular totais, confirmar pagamento.

---

## 8. Regras de negócio

1. Um pedido só pode ser cancelado se seu status **não** for `CANCELLED`.
2. O botão "Cancelar Pedido" fica `disabled` quando `order.status === 'CANCELLED'`.
3. Durante o cancelamento (`isCancelPending`), o botão "Confirmar Cancelamento" fica `disabled` com spinner.
4. Após cancelamento bem-sucedido, o cache de lista e detalhe é invalidado (refetch automático).
5. O redirecionamento para `/orders/list` ocorre 3 segundos após o toast de sucesso.
6. Pedidos só podem ser criados enquanto há um checkout aberto.
7. No fechamento do pedido, a venda só é criada quando `paymentValue` (valor do pagamento) for **maior ou igual** ao `totalValue` do pedido (`orderTotalRaw`, em centavos). Valor de pagamento **igual** ao total é válido.
8. Se `paymentValue` for **menor** que `totalValue`, o pedido **não** é criado e o usuário recebe um toast vermelho (`toast.error`) com a mensagem exata `Valor de pagamento insuficiente`. A validação vive em `validateAndConfirm` (`effects/orders/useCloseOrderSection.viewmodel.ts`).
9. Na tabela de detalhes do pedido (`components/orders/order-detail-items-columns.tsx`), quando `medication` é `null` (medicamento removido do catálogo), a coluna **Medicamento** exibe o texto `Medicamento removido` e a coluna **ID do produto** exibe `—`. Isso evita o crash ao acessar `medication.name`/`medication.id` de itens órfãos.

---

## 9. Extensão futura

1. Adicionar método em `orders.service.ts`
2. Adicionar query key em `orders/orders.query.keys.ts` se necessário
3. Criar viewmodel em `effects/orders/`
4. Criar ou atualizar rota em `routes/orders/`
5. Atualizar este documento
