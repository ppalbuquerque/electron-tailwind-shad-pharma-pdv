# Componentes Reutilizáveis

Este documento é a fonte de verdade para componentes reutilizáveis do projeto. Antes de criar qualquer novo componente, consulte este arquivo para verificar se já existe algo que atenda à necessidade.

---

## Componentes UI (`src/renderer/src/components/ui/`)

Componentes genéricos sem domínio fixo, baseados em shadcn/ui + Radix UI + Tailwind CSS.

---

### `<Button />`
**Arquivo:** `components/ui/button.tsx`

Botão customizável com múltiplas variantes e tamanhos.

**Props:**
```typescript
variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
size?: 'default' | 'sm' | 'lg' | 'icon' | 'icon-sm' | 'icon-lg'
asChild?: boolean  // composição via Radix Slot
```

**Variantes de cor:**
- `default` — verde (`bg-green-600`)
- `destructive` — vermelho
- `outline` — borda com fundo transparente
- `ghost` — sem borda, sem fundo
- `link` — estilo de link sublinhado

**Hover:** sempre use um tom mais escuro da cor base (ex: `bg-green-600` → `hover:bg-green-700`). `outline` já herda `hover:bg-accent`.

**Exemplo:**
```tsx
<Button variant="outline" onClick={handleCancel}>Cancelar</Button>
<Button type="submit">Salvar</Button>
<Button variant="destructive" size="sm">Excluir</Button>
```

---

### `<Input />`
**Arquivo:** `components/ui/input.tsx`

Input HTML estilizado com Tailwind CSS.

**Props:** `React.ComponentProps<'input'>` (todos os atributos nativos de input)

**Exemplo:**
```tsx
<Input type="text" placeholder="Nome..." className="w-[280px]" {...register('name')} />
<Input type="date" className="w-[160px]" {...register('createdAtFrom')} />
```

---

### `<Select />` e família
**Arquivo:** `components/ui/select.tsx`

Select acessível baseado em Radix UI. Sempre use junto com `Controller` do react-hook-form.

**Componentes:**
- `Select` — raiz
- `SelectTrigger` — botão que abre o dropdown
- `SelectContent` — conteúdo do dropdown
- `SelectItem` — item individual
- `SelectValue` — exibe o valor selecionado
- `SelectGroup` / `SelectLabel` / `SelectSeparator` — organização interna

**Exemplo:**
```tsx
<Controller
  name="status"
  control={control}
  render={({ field }) => (
    <Select onValueChange={field.onChange} value={field.value}>
      <SelectTrigger className="w-[180px] bg-white">
        <SelectValue placeholder="Todos" />
      </SelectTrigger>
      <SelectContent className="bg-white text-black">
        <SelectItem value="ALL">Todos</SelectItem>
        <SelectItem value="COMPLETE">Concluído</SelectItem>
      </SelectContent>
    </Select>
  )}
/>
```

---

### `<DataTable />`
**Arquivo:** `components/ui/data-table.tsx`

Tabela de dados com TanStack React Table. Suporta seleção de linha, navegação por teclado, estados de carregamento e vazio.

**Props:**
```typescript
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]       // Definição das colunas
  data: TData[]                             // Array de dados
  isLoading?: boolean                       // Exibe spinner quando true
  loadingMessage?: string                   // Texto do estado de carregamento
  emptyMessage?: string                     // Texto do estado vazio
  onConfirmSelection?: (row: TData) => void // Callback ao pressionar Enter em uma linha
  onDeleteSelection?: (row: TData) => void  // Callback ao pressionar Backspace em uma linha
  getRowClassName?: (row: TData) => string  // Classe CSS condicional por linha
}
```

**Navegação por teclado:**
- `↑ / ↓` — navegar entre linhas
- `Enter` — confirmar seleção (`onConfirmSelection`)
- `Backspace` — deletar seleção (`onDeleteSelection`)

**Linha selecionada:** `bg-sky-600 text-white` (tem prioridade sobre `getRowClassName`)

**Exemplo:**
```tsx
<DataTable
  columns={listOrdersColumns}
  data={orders}
  isLoading={isLoading}
  loadingMessage="Carregando pedidos..."
  emptyMessage="Nenhum pedido encontrado"
  onConfirmSelection={handleOrderClick}
  getRowClassName={(row) => row.stock <= 0 ? 'bg-red-100 text-red-800' : ''}
/>
```

**Definindo colunas:**
```tsx
// src/renderer/src/components/<módulo>/list-<módulo>-columns.tsx
import { ColumnDef } from '@tanstack/react-table'

export const listItemsColumns: ColumnDef<MyType>[] = [
  { accessorKey: 'name', header: 'Nome' },
  {
    accessorKey: 'value',
    header: 'Valor',
    cell: ({ row }) => <span>{formatMoney(row.getValue('value'))}</span>
  }
]
```

---

### `<Dialog />` e família
**Arquivo:** `components/ui/dialog.tsx`

Modal de diálogo baseado em Radix UI. Use para confirmações, formulários e detalhes.

**Componentes:**
- `Dialog` — raiz (controlado via `open` / `onOpenChange`)
- `DialogTrigger` — elemento que abre o dialog
- `DialogContent` — corpo do modal (centralizado, com overlay)
- `DialogHeader` / `DialogFooter` — layout interno
- `DialogTitle` / `DialogDescription` — conteúdo textual
- `DialogClose` — botão de fechar

**Props especiais de `DialogContent`:**
```typescript
showCloseButton?: boolean  // padrão: true
```

**Exemplo:**
```tsx
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent showCloseButton={false}>
    <DialogHeader>
      <DialogTitle>Confirmar cancelamento</DialogTitle>
      <DialogDescription>Essa ação não pode ser desfeita.</DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button variant="outline" onClick={() => setIsOpen(false)}>Voltar</Button>
      <Button variant="destructive" onClick={handleConfirm}>Confirmar</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

---

### `<MoneyInput />`
**Arquivo:** `components/ui/money-input.tsx`

Input formatado para valores monetários em Real (R$). Sempre use com `Controller` do react-hook-form.

**Props:**
```typescript
onValueChange?: (value: string | undefined, name?: string, values?: CurrencyInputOnChangeValues) => void
```

**Exemplo:**
```tsx
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
```

---

### `<BoxValue />`
**Arquivo:** `components/ui/box-value.tsx`

Componente de exibição de par chave-valor. Ideal para resumos e painéis informativos.

**Props:**
```typescript
title: string
value: string
className?: string
```

**Exemplo:**
```tsx
<BoxValue title="Total do caixa" value="R$ 1.250,00" />
<BoxValue title="Pedidos" value="12" className="text-green-700" />
```

---

### `<Spinner />`
**Arquivo:** `components/ui/spinner.tsx`

Indicador de carregamento animado.

**Props:** `className?: string` (padrão: `size-4`)

**Exemplo:**
```tsx
<Spinner className="size-8" />
```

---

### `<Skeleton />`
**Arquivo:** `components/ui/skeleton.tsx`

Placeholder animado para estados de carregamento.

**Exemplo:**
```tsx
<Skeleton className="h-4 w-[200px]" />
<Skeleton className="h-12 w-full" />
```

---

### `<Tooltip />` e família
**Arquivo:** `components/ui/tooltip.tsx`

Tooltip de hover baseado em Radix UI.

**Componentes:** `TooltipProvider`, `Tooltip`, `TooltipTrigger`, `TooltipContent`

**Exemplo:**
```tsx
<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <Button size="icon"><Info /></Button>
    </TooltipTrigger>
    <TooltipContent>Informação adicional</TooltipContent>
  </Tooltip>
</TooltipProvider>
```

---

### `<Separator />`
**Arquivo:** `components/ui/separator.tsx`

Divisor horizontal ou vertical.

**Props:** `orientation?: 'horizontal' | 'vertical'`, `decorative?: boolean`

**Exemplo:**
```tsx
<Separator />
<Separator orientation="vertical" className="h-6" />
```

---

### `<DropdownMenu />` e família
**Arquivo:** `components/ui/dropdown-menu.tsx`

Menu dropdown completo com suporte a submenus, checkboxes e radio buttons.

**Componentes principais:** `DropdownMenu`, `DropdownMenuTrigger`, `DropdownMenuContent`, `DropdownMenuItem`, `DropdownMenuSeparator`, `DropdownMenuLabel`

**Exemplo:**
```tsx
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost"><MoreHorizontal /></Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>Ações</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem onClick={handleEdit}>Editar</DropdownMenuItem>
    <DropdownMenuItem className="text-red-600" onClick={handleDelete}>Excluir</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

---

### `<Sidebar />` e família
**Arquivo:** `components/ui/sidebar.tsx`

Sistema completo de sidebar com suporte a colapso, mobile e persistência de estado.

**Hook:** `useSidebar()` — acesso ao contexto da sidebar (estado, toggle, etc.)

> Para uso interno do layout. Não instanciar diretamente nas rotas — use `<AppSidebar />`.

---

### `<Sheet />` e família
**Arquivo:** `components/ui/sheet.tsx`

Painel deslizante (slide-over). Usado como sidebar em mobile.

**Props de `SheetContent`:** `side?: 'top' | 'right' | 'bottom' | 'left'`

---

### `<Sonner />` (Toast)
**Arquivo:** `components/ui/sonner.tsx`

Sistema de notificações toast. Já está configurado no layout raiz.

**Uso:** importe `toast` diretamente do `sonner`:
```tsx
import { toast } from 'sonner'

toast.success('Pedido criado com sucesso')
toast.error('Erro ao cancelar pedido')
```

---

## Componentes de Layout (`src/renderer/src/components/layout/`)

---

### `<Header />`
**Arquivo:** `components/layout/header.tsx`

Cabeçalho padrão das páginas com nome da rota e status do caixa.

**Props:**
```typescript
routeName: string
variant: 'open' | 'closed'
```

---

### `<SidebarButton />`
**Arquivo:** `components/layout/sidebar-button.tsx`

Botão de item do menu lateral com ícone, título e tecla de atalho.

**Props:**
```typescript
title: string
hotkey: string
icon: React.ComponentType
variant?: 'active' | 'default'
```

> Uso interno do `<AppSidebar />`. Não usar diretamente nas rotas.

---

### `<CheckoutStatus />`
**Arquivo:** `components/layout/checkoutStatus.tsx`

Badge de status do caixa (aberto/fechado).

**Props:** `variant: 'open' | 'closed'`

---

## Guia de decisão

| Necessidade | Componente |
|-------------|-----------|
| Tabela de dados com paginação/seleção | `<DataTable />` |
| Modal de confirmação ou formulário | `<Dialog />` |
| Campo de texto ou data | `<Input />` |
| Campo monetário | `<MoneyInput />` |
| Dropdown de opções | `<Select />` |
| Botão de ação | `<Button />` |
| Menu contextual | `<DropdownMenu />` |
| Par chave-valor em resumos | `<BoxValue />` |
| Indicador de carregamento | `<Spinner />` ou `<Skeleton />` |
| Feedback ao usuário | `toast` (Sonner) |
| Tooltip informativo | `<Tooltip />` |
| Divisor visual | `<Separator />` |
