# Auditoria de Navegação por Teclado

> Gerado em: 2026-04-21 | Última atualização: 2026-06-23

---

## 1. Escopos de Navegação Atualmente Definidos

A aplicação **não utiliza HotkeysProvider nem useHotkeysContext** da biblioteca `react-hotkeys-hook`. Portanto, não existe um sistema formal de escopos. O isolamento de hotkeys é feito de forma ad-hoc, via a opção `enabled` em chamadas individuais de `useHotkeys`.

Existem três padrões distintos de "escopo" em uso:

### 1.1 Escopo por condição de estado (`enabled`)

Usado em viewmodels de modais e seções condicionais. O listener existe enquanto o componente está montado, mas só dispara quando a condição é verdadeira.

```ts
// closeCheckout.viewmodel.ts
useHotkeys('enter', handleConfirm, { enabled: isModalOpen && !isPending, preventDefault: true })
useHotkeys('escape', handleCancel, { enabled: isModalOpen })
```

### 1.2 Escopo por rota (sempre ativo)

Usado em viewmodels de páginas de detalhe. O listener fica ativo durante toda a vida do componente, sem restrição.

```ts
// useOrderDetail.viewmodel.ts
useHotkeys('esc', () => navigate({ to: '/orders/list' }), { preventDefault: true })
```

### 1.3 Escopo por elemento focado (`enableOnFormTags`)

Usado onde o listener precisa disparar mesmo com um input focado.

```ts
// useCreateOrder.viewmodel.ts
useHotkeys('esc', handleEsc, { enableOnFormTags: true })
```

### 1.4 Escopo manual via refs (sidebar)

O `AppSidebar` usa um array de `useRef` para rastrear os links e gerencia o foco manualmente via `linkRefs[index].current?.focus()`.

### Resumo dos escopos existentes

| Área | Mecanismo | Isolamento |
|------|-----------|------------|
| App Sidebar | refs manuais + useHotkeys | Fraco — ArrowUp/Down sempre ativos globalmente |
| DataTable | useHotkeys com `enableOnFormTags` | Fraco — ativos sempre que a tabela está montada |
| Modal Close Checkout | `enabled: isModalOpen` | Bom — condicionado ao estado do modal |
| Páginas de detalhe (Order/Medication) | sempre ativo | Inexistente — dispara em qualquer contexto |
| Create Order | multi-condição inline | Complexo e frágil |
| Sidebar Toggle (Ctrl+B) | addEventListener nativo | Isolado em useEffect com cleanup |

---

## 2. Uso de Hotkeys por Fluxo

### 2.1 Fluxo: Sidebar (Navegação entre rotas)

**Arquivo:** `components/app-sidebar.tsx`

| Tecla | Ação | Opções |
|-------|------|--------|
| ArrowDown | Foca o próximo link da sidebar | — |
| ArrowUp | Foca o link anterior da sidebar | — |
| F1–F7 | **NÃO implementado** (apenas label visual) | — |

> **Bug crítico:** As teclas F1–F7 são exibidas na UI como atalhos, mas nenhum `useHotkeys` as registra. O clique via teclado nessas rotas depende de `Tab` + `Enter` no link focado.

### 2.2 Fluxo: Fechar Caixa (`/checkout/close`)

**Arquivo:** `effects/checkout/closeCheckout.viewmodel.ts`

Escopos: `MODAL` (modal de confirmação) + `CONTENT` (tela normal)

| Tecla | Ação | Escopo | Condição |
|-------|------|--------|----------|
| Enter | Confirma fechamento do caixa | `MODAL` | `isModalOpen && !isPending` |
| Escape | Cancela / fecha modal | `MODAL` | `isModalOpen` |
| Escape | Devolve foco à sidebar (link F6) via `focusByPath('/checkout/close')` | `CONTENT` | `!isModalOpen` (`enableOnFormTags: true`) |

**Entrada de foco:** registra callback via `registerContentFocus(() => inputRef.current?.focus())` — ao pressionar Enter no link F6 da sidebar, o foco retorna ao `MoneyInput`.

**Saída de foco:** com o modal fechado, ESC chama `focusByPath('/checkout/close')`, focando o link F6 e ativando o escopo SIDEBAR. A guarda `enabled: !isModalOpen` impede que o ESC do escopo CONTENT colida com o ESC do escopo MODAL (ambos os escopos ficam ativos enquanto o modal está aberto).

Bem implementado — isolamento condicional correto.

### 2.3 Fluxo: Criar Venda (`/orders/create`)

**Arquivo:** `effects/orders/useCreateOrder.viewmodel.ts`

| Tecla | Ação | Condição |
|-------|------|----------|
| Esc | Fecha dialog de busca de medicamento | `searchMedicationDialogIsOpen === true` |
| Esc | Abre seção de fechamento da venda | estado padrão (sem dialog, sem `isClosingOrder`) |

**Arquivo:** `effects/orders/useCloseOrderSection.viewmodel.ts`

| Tecla | Ação | Condição |
|-------|------|----------|
| Esc | Submete o formulário de pagamento | `!isLoading` |

> **Problema:** `Esc` submeter um formulário é UX não-convencional. Dois listeners de `esc` registrados em viewmodels diferentes, dentro da mesma rota, com lógica de prioridade implícita e não garantida.

**Arquivo:** `effects/orders/useAddOrderItem.viewmodel.ts` (via `onKeyDown` nativo)

| Tecla | Campo | Ação |
|-------|-------|------|
| Enter | Quantidade | Move foco para o campo BoxType |
| Enter | BoxType | Submete formulário de adição de item |

### 2.4 Fluxo: Tabelas de Dados (DataTable)

**Arquivo:** `components/ui/data-table.tsx`

| Tecla | Ação | Opções |
|-------|------|--------|
| ArrowDown | Seleciona próxima linha | `enableOnFormTags: true` |
| ArrowUp | Seleciona linha anterior | `enableOnFormTags: true` |
| Enter | Confirma seleção de linha | `enableOnFormTags: true` |
| Backspace | Remove seleção | — |

O componente aceita prop opcional `tableRef?: RefObject<HTMLDivElement | null>` — quando fornecida, a ref é anexada ao wrapper `tabIndex={0}`, permitindo que viewmodels focalizem a tabela programaticamente (e assim ativem o escopo TABLE via `onFocus`).

Usado em: `/orders/list`, `/medication/list`, `/orders/detail`, `/medication/$id`.

### 2.5 Fluxo: Páginas de Detalhe

**Arquivo:** `effects/orders/useOrderDetail.viewmodel.ts`

| Tecla | Ação |
|-------|------|
| Esc | Volta para `/orders/list` |

**Arquivo:** `effects/medication/useMedicationDetail.viewmodel.ts`

| Tecla | Ação |
|-------|------|
| Esc | Volta para `/medication/list` |

### 2.6 Fluxo: Home (`/`) — Navegação nos ShortcutCards

**Arquivo:** `effects/home/useHome.viewmodel.ts`

Escopo: `CONTENT`

| Tecla | Ação | Condição |
|-------|------|----------|
| ArrowRight / ArrowDown | Avança foco para o próximo ShortcutCard | `focusedIndex >= 0` |
| ArrowLeft / ArrowUp | Recua foco para o ShortcutCard anterior | `focusedIndex >= 0` |
| Enter | Navega para a URL do card focado (se não desabilitado) | `focusedIndex >= 0` |
| Escape | Limpa seleção e devolve foco à sidebar via `focusByPath('/')` | sempre ativo no escopo CONTENT |

**Entrada de foco:** via `registerContentFocus` — ao pressionar Enter no link da sidebar para `/`, `focusedIndex` é definido como `0` e o grid recebe foco DOM (`contentAreaRef.current?.focus()`).

### 2.7 Fluxo: Listagem de Medicamentos (`/medication/list`)

**Arquivo:** `effects/medication/useListMedications.viewmodel.ts`

Escopo: `CONTENT`

| Tecla | Ação | Condição |
|-------|------|----------|
| Escape | Devolve foco à sidebar (link F7) via `focusByPath('/medication/list')` | sempre ativo no escopo CONTENT |

**Entrada de foco:** ao montar, o viewmodel executa `tableRef.current?.focus()` automaticamente, que transfere o foco para o wrapper do `DataTable` e ativa o escopo TABLE. O callback também é registrado via `registerContentFocus` — ao pressionar Enter no link F7 da sidebar enquanto já está na rota, o foco retorna à tabela.

**Saída de foco:** ESC chama `focusByPath('/medication/list')`, focando o link F7 na sidebar e ativando o escopo SIDEBAR.

### 2.8 Fluxo: Listagem de Pedidos (`/orders/list`)

**Arquivo:** `effects/orders/useListOrders.viewmodel.ts`

Escopo: `CONTENT`

| Tecla | Ação | Condição |
|-------|------|----------|
| Escape | Devolve foco à sidebar (link F5) via `focusByPath('/orders/list')` | sempre ativo no escopo CONTENT |

**Entrada de foco:** ao montar, o viewmodel executa `tableRef.current?.focus()` automaticamente, que transfere o foco para o wrapper do `DataTable` e ativa o escopo TABLE. O callback também é registrado via `registerContentFocus` — ao pressionar Enter no link F5 da sidebar enquanto já está na rota, o foco retorna à tabela.

**Saída de foco:** ESC chama `focusByPath('/orders/list')`, focando o link F5 na sidebar e ativando o escopo SIDEBAR.

Espelha o padrão de `/medication/list` (§2.7).

### 2.9 Rotas sem hotkeys implementadas

| Rota | Viewmodel | Status |
|------|-----------|--------|
| `/checkout/open` | `openCheckout.viewmodel.ts` | Sem hotkeys |
| `/checkout/resume` | `checkoutResume.viewmodel.ts` | Sem hotkeys |
| `/medication/create` | — | Sem hotkeys |
| `/medication/edit.$id` | — | Sem hotkeys |

---

## 3. Conflitos de Hotkeys

### 3.1 `ArrowDown` / `ArrowUp` — Sidebar vs. DataTable

Ambos registram listeners para as mesmas teclas sem escopo isolado. Quando uma página com `DataTable` está ativa (ex: `/orders/list`), os dois listeners coexistem:

- `app-sidebar.tsx` → move foco nos links da sidebar
- `data-table.tsx` → move seleção nas linhas

**Como acontece na prática:** o comportamento depende de qual elemento está focado no DOM. Se o foco estiver na tabela, ambos os handlers são acionados simultaneamente. Isso causa comportamento imprevisível — a seleção da tabela avança e o foco da sidebar também pode se mover.

### 3.2 `Esc` — createOrder vs. closeOrderSection

Dois listeners de `esc` registrados na mesma rota (`/orders/create`):

- `useCreateOrder.viewmodel.ts` → fecha dialog ou abre seção de fechamento
- `useCloseOrderSection.viewmodel.ts` → submete o formulário de pagamento

A prioridade de execução entre os dois não é definida explicitamente. Ambos têm `enableOnFormTags: true` e dependem de estado que muda durante a sessão. Existe risco real de os dois dispararem ao mesmo tempo, especialmente durante transições de estado.

### 3.3 `Enter` — DataTable vs. Formulários

O `DataTable` registra `Enter` com `enableOnFormTags: true`. Se um `DataTable` estiver visível e um input de formulário estiver focado na mesma página, o `Enter` pode acionar a confirmação de linha da tabela ao mesmo tempo que o handler de formulário.

### 3.4 F1–F7 — Sem implementação vs. comportamento nativo do browser

As teclas F1–F7 são exibidas como atalhos na sidebar mas não possuem listeners. O browser processa essas teclas com seus comportamentos padrão (ex: F1 abre ajuda). Não há `preventDefault` cobrindo esses casos.

### Tabela de Conflitos

| Tecla | Listener A | Listener B | Risco |
|-------|-----------|-----------|-------|
| ArrowDown/Up | app-sidebar.tsx | data-table.tsx | Alto — sem isolamento por área |
| Esc | useCreateOrder.vm | useCloseOrderSection.vm | Alto — mesma rota, sem prioridade definida |
| Enter | data-table.tsx | form onKeyDown | Médio — enableOnFormTags amplifica o conflito |
| F1–F7 | (nenhum) | browser nativo | Baixo — UX quebrada mas sem conflito técnico |

---

## 4. Refatoração Sugerida: Isolamento de Escopo por Área

### Objetivo

Garantir que apenas os listeners da área com foco ativo estejam operando. As duas áreas principais são:

- **App Sidebar** — navegação entre rotas (F1–F7, ArrowUp/Down)
- **Content Area** — interação com o conteúdo da rota atual (tabelas, formulários, modais)

### Estratégia: HotkeysProvider com Escopos Nomeados

A biblioteca `react-hotkeys-hook` oferece suporte nativo a escopos via `HotkeysProvider` e `useHotkeysContext`. O `enableScope` / `disableScope` permite ativar apenas o escopo correto em cada momento.

#### 4.1 Definição de Escopos

```ts
// src/renderer/src/lib/hotkey-scopes.ts
export const HotkeyScope = {
  SIDEBAR: 'sidebar',
  CONTENT: 'content',
  MODAL: 'modal',
  TABLE: 'table',
  FORM: 'form',
} as const
```

**Hierarquia de prioridade (maior sobrescreve menor):**

```
MODAL > FORM > TABLE > CONTENT > SIDEBAR
```

#### 4.2 Configuração do Provider na raiz

```tsx
// src/renderer/src/routes/__root.tsx
import { HotkeysProvider } from 'react-hotkeys-hook'
import { HotkeyScope } from '@/lib/hotkey-scopes'

export function RootLayout() {
  return (
    <HotkeysProvider initiallyActiveScopes={[HotkeyScope.SIDEBAR, HotkeyScope.CONTENT]}>
      <AppSidebar />
      <main>{children}</main>
    </HotkeysProvider>
  )
}
```

#### 4.3 Sidebar — escopo isolado

```ts
// effects/navigation/useSidebarNavigation.viewmodel.ts
import { useHotkeys } from 'react-hotkeys-hook'
import { HotkeyScope } from '@/lib/hotkey-scopes'

useHotkeys('f1', () => navigate({ to: '/' }), { scopes: [HotkeyScope.SIDEBAR] })
useHotkeys('f2', () => navigate({ to: '/checkout/open' }), { scopes: [HotkeyScope.SIDEBAR] })
useHotkeys('f3', () => navigate({ to: '/orders/create' }), { scopes: [HotkeyScope.SIDEBAR] })
useHotkeys('f4', () => navigate({ to: '/checkout/resume' }), { scopes: [HotkeyScope.SIDEBAR] })
useHotkeys('f5', () => navigate({ to: '/orders/list' }), { scopes: [HotkeyScope.SIDEBAR] })
useHotkeys('f6', () => navigate({ to: '/checkout/close' }), { scopes: [HotkeyScope.SIDEBAR] })
useHotkeys('f7', () => navigate({ to: '/medication/list' }), { scopes: [HotkeyScope.SIDEBAR] })
useHotkeys('arrowdown', focusNextLink, { scopes: [HotkeyScope.SIDEBAR] })
useHotkeys('arrowup', focusPrevLink, { scopes: [HotkeyScope.SIDEBAR] })
```

#### 4.4 Gerenciamento de escopo ativo por área de foco

```tsx
// components/app-sidebar.tsx
import { useHotkeysContext } from 'react-hotkeys-hook'
import { HotkeyScope } from '@/lib/hotkey-scopes'

function AppSidebar() {
  const { enableScope, disableScope } = useHotkeysContext()

  return (
    <aside
      onFocus={() => {
        enableScope(HotkeyScope.SIDEBAR)
        disableScope(HotkeyScope.CONTENT)
        disableScope(HotkeyScope.TABLE)
      }}
      onBlur={() => {
        disableScope(HotkeyScope.SIDEBAR)
        enableScope(HotkeyScope.CONTENT)
      }}
    >
      {/* links */}
    </aside>
  )
}
```

```tsx
// routes/__root.tsx (content area wrapper)
function ContentArea({ children }) {
  const { enableScope, disableScope } = useHotkeysContext()

  return (
    <main
      onFocus={() => {
        enableScope(HotkeyScope.CONTENT)
        disableScope(HotkeyScope.SIDEBAR)
      }}
    >
      {children}
    </main>
  )
}
```

#### 4.5 DataTable — escopo TABLE

```ts
// components/ui/data-table.tsx
useHotkeys('arrowdown', selectNext, { scopes: [HotkeyScope.TABLE], enableOnFormTags: true })
useHotkeys('arrowup', selectPrev, { scopes: [HotkeyScope.TABLE], enableOnFormTags: true })
useHotkeys('enter', confirmSelection, { scopes: [HotkeyScope.TABLE], enableOnFormTags: true })
useHotkeys('backspace', deleteSelection, { scopes: [HotkeyScope.TABLE] })
```

O escopo `TABLE` deve ser habilitado quando o `DataTable` receber foco e desabilitado ao perder.

#### 4.6 Modais — escopo MODAL (sobrescreve tudo)

```ts
// effects/checkout/closeCheckout.viewmodel.ts
const { enableScope, disableScope } = useHotkeysContext()

useEffect(() => {
  if (isModalOpen) {
    enableScope(HotkeyScope.MODAL)
  } else {
    disableScope(HotkeyScope.MODAL)
  }
}, [isModalOpen])

useHotkeys('enter', handleConfirm, { scopes: [HotkeyScope.MODAL], preventDefault: true })
useHotkeys('escape', handleCancel, { scopes: [HotkeyScope.MODAL] })
```

#### 4.7 Resolução do conflito Esc no CreateOrder

Separar as responsabilidades em escopos distintos elimina o conflito atual:

```ts
// useCreateOrder.viewmodel.ts — escopo CONTENT
useHotkeys('esc', handleCloseDialog, {
  scopes: [HotkeyScope.CONTENT],
  enabled: searchMedicationDialogIsOpen,
})
useHotkeys('esc', handleOpenCloseOrder, {
  scopes: [HotkeyScope.CONTENT],
  enabled: !searchMedicationDialogIsOpen && !isClosingOrder,
})

// useCloseOrderSection.viewmodel.ts — escopo FORM
useHotkeys('enter', handleSubmit(onCloseOrderSubmit), {
  scopes: [HotkeyScope.FORM],
  enabled: !isLoading,
  enableOnFormTags: true,
})
// Esc no escopo FORM fecha a seção, não submete
useHotkeys('esc', handleCancelCloseOrder, { scopes: [HotkeyScope.FORM] })
```

---

## 5. Locais que Precisam de Implementação de Navegação

### 5.1 Críticos (funcionalidade quebrada)

| Local | O que implementar | Arquivo |
|-------|-------------------|---------|
| App Sidebar | F1–F7 para navegar entre rotas | `effects/navigation/useSidebarNavigation.viewmodel.ts` (novo) |
| Root Layout | `HotkeysProvider` com escopos iniciais | `routes/__root.tsx` |

### 5.2 Importantes (melhoria de UX)

| Local | O que implementar | Arquivo | Status |
|-------|-------------------|---------|--------|
| `/medication/list` | Auto-foco na tabela ao entrar; Esc devolve foco à sidebar | `effects/medication/useListMedications.viewmodel.ts` | ✅ Implementado (2026-06-11) |
| `/orders/list` | Auto-foco na tabela ao entrar; Esc devolve foco à sidebar (link F5) | `effects/orders/useListOrders.viewmodel.ts` | ✅ Implementado (2026-06-23) |
| `/checkout/close` | Esc (modal fechado) devolve foco à sidebar; Enter na sidebar retorna foco ao input | `effects/checkout/closeCheckout.viewmodel.ts` | ✅ Implementado (2026-06-23) |
| `/checkout/open` | Enter para submeter formulário de abertura do caixa | `effects/checkout/openCheckout.viewmodel.ts` | Pendente |
| `/checkout/resume` | Esc para voltar, Enter para confirmar ações | `effects/checkout/checkoutResume.viewmodel.ts` | Pendente |
| `/medication/create` | Enter para avançar entre campos, Esc para cancelar | viewmodel do módulo medication | Pendente |
| `/medication/edit.$id` | Enter para salvar, Esc para cancelar | viewmodel do módulo medication | Pendente |
| CloseOrderSection | Corrigir Esc (atualmente submete; deveria cancelar) | `effects/orders/useCloseOrderSection.viewmodel.ts` | Pendente |

### 5.3 Arquiteturais (refatoração)

| Local | O que implementar |
|-------|-------------------|
| `routes/__root.tsx` | Adicionar `HotkeysProvider` com `initiallyActiveScopes` |
| `components/app-sidebar.tsx` | Adicionar `onFocus`/`onBlur` para gerenciar escopo SIDEBAR |
| `components/ui/data-table.tsx` | Migrar listeners para escopo TABLE, adicionar ativação por foco |
| Todos os viewmodels com `useHotkeys` | Adicionar `scopes` a cada chamada existente |
| `lib/hotkey-scopes.ts` (novo) | Centralizar constantes de escopos |

### 5.4 Estimativa de Impacto por Local

| Prioridade | Local | Esforço |
|------------|-------|---------|
| P0 | HotkeysProvider no root | Baixo |
| P0 | F1–F7 na sidebar | Baixo |
| P1 | Escopos em todos os useHotkeys existentes | Médio |
| P1 | onFocus/onBlur na sidebar e content area | Médio |
| P2 | Hotkeys nos fluxos de checkout/open e resume | Baixo |
| P2 | Hotkeys nos fluxos de medication/create e edit | Baixo |
| P3 | Correção do Esc no closeOrderSection | Baixo |
