# Módulo de Medicamentos

Este documento descreve a arquitetura, contratos de API, tipos e comportamentos do módulo de medicamentos (`medication`) do Farma POS.

---

## Visão geral

O módulo de medicamentos permite:
- Listar medicamentos com paginação
- Buscar medicamentos por nome via full-text search
- Visualizar disponibilidade de estoque com alerta visual para itens zerados
- Visualizar detalhes completos de um medicamento

**Rotas de acesso:** `/medication/list` (atalho `F7`), `/medication/:id`

---

## Estrutura de arquivos

```
src/renderer/src/
├── services/medication/
│   ├── medication.service.ts       # Chamadas HTTP ao backend
│   ├── medication.dto.ts           # Tipos e interfaces de request/response
│   └── medication.query.keys.ts    # Chaves do React Query
├── effects/medication/
│   ├── useListMedications.viewmodel.ts  # Lógica de negócio da tela de listagem
│   └── useMedicationDetail.viewmodel.ts # Lógica de negócio da tela de detalhe
├── components/medication/
│   └── list-medications-columns.tsx     # Definição das colunas da tabela
├── routes/medication/
│   ├── list.tsx                    # Página de listagem
│   └── $id.tsx                     # Página de detalhe (/medication/:id)
└── types/
    └── medication.d.ts             # Tipo raw da API (legado, snake_case)
```

---

## API

Fonte de verdade: `docs/api-reference.md`. Resumo dos endpoints usados neste módulo:

### `GET /medication` — Listagem paginada

**Query params:**
| Param | Tipo | Padrão | Descrição |
|-------|------|--------|-----------|
| `limit` | number | `10` | Itens por página |
| `offset` | number | `0` | Deslocamento |

**Response `200`:**
```json
{
  "medications": [ /* MedicationSummary[] */ ],
  "nextPage": 15
}
```
> `nextPage` é o valor do próximo `offset`. Retorna `null` quando não há mais páginas.

---

### `GET /medication/search?q=` — Busca por texto

**Query params:** `q` (string, obrigatório)

**Response `200`:** array de objetos `MedicationSummary` (sem paginação)

---

### `GET /medication/:id` — Detalhe por ID

**Path params:** `id` (integer)

**Response `200`:** objeto `MedicationDetail`

**Response `404`:** medicamento não encontrado

---

## Tipos

### `MedicationSummary` (DTO interno)
**Arquivo:** `services/medication/medication.dto.ts`

```typescript
interface MedicationSummary {
  id: number
  name: string
  chemicalComposition: string
  boxPrice: string        // Decimal serializado como string (ex: "10.00")
  unitPrice: string       // Decimal serializado como string
  stockAvailability: number
}
```

### `ListMedicationsResponse`
```typescript
interface ListMedicationsResponse {
  medications: MedicationSummary[]
  nextPage: number | null
}
```

### `ListMedicationsParams`
```typescript
interface ListMedicationsParams {
  limit: number
  offset: number
}
```

### `Medication` (tipo raw — legado)
**Arquivo:** `types/medication.d.ts`

```typescript
type Medication = {
  id: number
  name: string
  box_price: string        // snake_case — retorno raw de search
  unit_price: string
  stock_availability: number
}
```

> **Atenção:** `Medication` (snake_case) é usado apenas pelo método `search`. `MedicationSummary` (camelCase) é o tipo canônico para novos desenvolvimentos.

### `MedicationDetail`
**Arquivo:** `services/medication/medication.dto.ts`

```typescript
interface MedicationDetail {
  id: number
  name: string
  chemicalComposition: string
  stockAvailability: number
  shelfLocation: string
  boxPrice: string
  unitPrice: string
  usefulness: string
  dosageInstructions: string
  samplePhotoUrl: string
  createdAt: string
  updatedAt: string
}
```

---

## Service

**Arquivo:** `services/medication/medication.service.ts`

```typescript
class MedicationService {
  // Listagem paginada — GET /medication
  static async list(params: ListMedicationsParams): Promise<ListMedicationsResponse>

  // Busca full-text — GET /medication/search?q=
  static async search({ query: string }): Promise<SearchResponse>

  // Detalhe por ID — GET /medication/:id
  static async getMedicationById(id: number): Promise<MedicationDetail>
}
```

---

## Query Keys

**Arquivo:** `services/medication/medication.query.keys.ts`

```typescript
MEDICATION_QUERY_KEYS = {
  LIST_MEDICATIONS: 'list-medications',   // lista paginada
  MEDICATION_DETAIL: 'medication-detail', // detalhe por ID
  MEDICATION_SEARCH: 'medication-search'  // busca por texto
}
```

---

## ViewModels

### `useListMedicationsViewModel`
**Arquivo:** `effects/medication/useListMedications.viewmodel.ts`

```typescript
interface ListMedicationsViewModel {
  medications: MedicationSummary[]
  isLoading: boolean
  currentPage: number           // 1-based
  hasNextPage: boolean          // true quando nextPage da API não é null
  goToNextPage: () => void
  goToPrevPage: () => void
  register: UseFormRegister     // campo 'q' para o input de busca
  handleSearchSubmit: (e?) => Promise<void>
}
```

**Comportamento:**
- **`PAGE_SIZE = 15`** itens por página
- **Modo lista:** quando `searchQuery` está vazio → chama `MedicationService.list` com paginação
- **Modo busca:** quando `searchQuery` tem valor → chama `MedicationService.search`, paginação desativada
- Ao submeter busca com campo vazio: retorna ao modo lista, offset resetado para 0
- React Query gerencia cache separadamente por modo (chave de query diferente)

---

### `useMedicationDetailViewModel`
**Arquivo:** `effects/medication/useMedicationDetail.viewmodel.ts`

```typescript
interface MedicationDetailViewModel {
  medication: MedicationDetail | undefined
  isLoading: boolean
  isError: boolean
}
```

**Comportamento:**
- Chama `MedicationService.getMedicationById(id)` via React Query com `retry: false`
- Tecla **ESC** navega de volta para `/medication/list`
- Query desabilitada se `id` for falsy

---

## Componente de colunas

**Arquivo:** `components/medication/list-medications-columns.tsx`

| Coluna | Campo | Observação |
|--------|-------|------------|
| Nome | `name` | — |
| Composição | `chemicalComposition` | Truncado em 40 chars; tooltip exibe valor completo |
| Estoque | `stockAvailability` | — |
| Preço caixa | `boxPrice` | Formatado com `formatMoney` |
| Preço unitário | `unitPrice` | Formatado com `formatMoney` |

---

## Rotas

### `/medication/list`
**Arquivo:** `routes/medication/list.tsx`

#### Layout
```
[ Input de busca ] [ Botão Buscar ]

[ DataTable com listMedicationsColumns ]
  ↳ Linhas com stockAvailability <= 0 ficam bg-red-100 text-red-800
  ↳ Enter na linha navega para /medication/:id

[ Anterior ]  Página N  [ Próxima ]
```

#### Comportamento de paginação
- Botão **Anterior** desabilitado na página 1
- Botão **Próxima** desabilitado quando `hasNextPage === false`
- No modo busca, controles de paginação permanecem visíveis mas Próxima fica desabilitado (sem nextPage)

---

### `/medication/:id`
**Arquivo:** `routes/medication/$id.tsx`

#### Layout
```
[ Foto do medicamento (samplePhotoUrl) ]

[ Nome do medicamento ]  [ Botão Editar (noop) ]

[ Informações Gerais ]        ← box com borda preta
  Nome, Composição Química, Indicação Terapêutica, Posologia

[ Informações de Estoque ]    ← box com borda preta
  Localização na Prateleira, Estoque Disponível

[ Informações de Preço ]      ← box com borda preta
  Preço por Caixa, Preço por Unidade

[ Metadados ]                 ← box com borda preta
  Criado em, Atualizado em
```

#### Comportamento
- Loading: exibe mensagem de carregamento
- Erro ou sem dados: exibe `"Ocorreu um erro ao buscar os dados do medicamento."`
- ESC navega de volta para `/medication/list`
- Botão **Editar** está desabilitado (noop)

---

## Regras de negócio

1. Medicamentos com `stockAvailability <= 0` são destacados em vermelho na listagem
2. A busca substitui completamente a listagem paginada — não são filtros sobrepostos
3. Limpar o campo de busca e submeter retorna à listagem paginada do início
4. `boxPrice` e `unitPrice` chegam como string do backend e devem ser convertidos via `parseFloat` antes de formatar

---

## Extensão futura

Para adicionar novos casos de uso ao módulo (ex: edição, criação):

1. Adicionar método estático em `medication.service.ts`
2. Adicionar tipos em `medication.dto.ts`
3. Adicionar query key em `medication.query.keys.ts` se necessário
4. Criar viewmodel em `effects/medication/use<Feature>.viewmodel.ts`
5. Criar rota em `routes/medication/<feature>.tsx`
6. Atualizar este documento
