# Application Module

> Documentação geral da aplicação Pharma PDV. Este arquivo é o ponto de entrada para toda a documentação do projeto — leia-o antes de consultar os módulos específicos.

---

### 1. Visão geral

Sistema de ponto de venda (PDV) para farmácias, construído com Electron + React + TypeScript. Projetado para operação em caixa com navegação exclusivamente por teclado.

**Capacidades:**

- Abertura e fechamento de caixa com controle de sessão
- Criação de pedidos com busca de medicamentos
- Listagem e cancelamento de pedidos
- Busca de medicamentos por nome ou código
- Navegação completa por atalhos de teclado (F1–F6, setas, Enter, Esc)

**Rotas de acesso:**

| Rota | Propósito | Atalho |
|------|-----------|--------|
| `/` | Tela inicial | `F1` |
| `/orders/create` | Nova venda | `F2` |
| `/orders` | Listagem de pedidos | `F3` |
| `/medication` | Listagem de medicamentos | `F4` |
| `/checkout/open` | Abrir caixa | — |
| `/checkout/close` | Fechar caixa | — |

---

### 2. Estrutura de arquivos

```
pharma-pdv/
├── src/
│   ├── main/                         # Electron main process
│   │   └── index.ts                  # BrowserWindow, IPC, app lifecycle
│   ├── preload/                      # Context bridge
│   │   └── index.ts
│   └── renderer/src/                 # React application
│       ├── routes/                   # TanStack Router (file-based)
│       ├── effects/                  # ViewModels por módulo
│       ├── services/                 # Camada de API por módulo
│       ├── components/               # Componentes UI (ui/ + módulos)
│       ├── contexts/                 # React Context (ex: create-order)
│       └── utils/                   # Utilitários (format-money, etc.)
├── docs/                             # Documentação (ver índice abaixo)
├── resources/                        # Assets estáticos (ícone, etc.)
└── electron.vite.config.ts
```

---

### 3. API

> Fonte de verdade: [`docs/api-reference.md`](./api-reference.md).

**Base URL:** `http://localhost:3000` (configurável via `PORT`)  
**Formato:** `application/json`. Erros seguem `{ "message": string, "errorCode": string }`.

Módulos que consomem a API documentam seus endpoints individualmente — consulte o arquivo do módulo correspondente.

---

### 4. Tipos

Tipos canônicos do domínio compartilhados entre módulos:

```typescript
type Medication = {
  id: number
  name: string
  boxPrice: number    // Inteiro em centavos (ex: 4800 = R$ 48,00)
  unitPrice: number   // Inteiro em centavos (ex: 480 = R$ 4,80)
  stockAvailability: number
}

type OrderItem = {
  medication: Medication
  quantity: number
  boxType: 'box' | 'unit'
  subtotal: number    // Inteiro em centavos
}

interface CreateOrderDTO {
  paymentValue: number  // Inteiro em centavos
  orderItems: {
    medicationId: string
    amount: number
    totalValue: number  // Inteiro em centavos
    boxType: 'unit' | 'box'
  }[]
}
```

---

### 5. Window Behavior

O `BrowserWindow` é criado em `src/main/index.ts` com as seguintes opções relevantes:

| Opção | Valor | Motivo |
|-------|-------|--------|
| `fullscreen` | `true` | PDV deve ocupar toda a tela na inicialização |
| `autoHideMenuBar` | `true` | Sem barra de menus no modo operação |
| `show` | `false` | Janela exibida somente após `ready-to-show` para evitar flash |
| `width` / `height` | `900` / `670` | Dimensões de fallback quando fullscreen não está disponível |

---

### 6. Regras de negócio

1. **Valores monetários são sempre inteiros em centavos.** Para exibição, use `formatMoneyFromCents(value)` de `@/utils/format-money`. Nunca passe centavos diretamente para `formatMoney()`.
2. **Pedidos só podem ser criados com caixa aberto.** A lógica de bloqueio é responsabilidade do backend.
3. **Navegação por teclado é obrigatória.** Todo fluxo deve ser operável sem mouse — consulte [`docs/keyboard-navigation-audit.md`](./keyboard-navigation-audit.md) antes de adicionar hotkeys.
4. **Todo listener de teclado usa `useHotkeys`** (`react-hotkeys-hook`) declarado no viewmodel — nunca `onKeyDown` inline no componente.
5. **Todo código de comportamento fica no viewmodel.** Componentes são exclusivamente declarativos.
6. **Inputs de formulário são controlados via `react-hook-form`.** Nunca `useState` para valores de input.

---

### 7. Índice de documentação

| Documento | Conteúdo | Quando consultar |
|-----------|----------|-----------------|
| [`application-module.md`](./application-module.md) | Este arquivo — visão geral e índice | Antes de qualquer tarefa nova |
| [`api-reference.md`](./api-reference.md) | Contratos de todos os endpoints (request, response, erros) | Ao implementar ou alterar integrações com a API |
| [`checkout-module.md`](./checkout-module.md) | Módulo de abertura/fechamento de caixa | Ao trabalhar em checkout |
| [`orders-module.md`](./orders-module.md) | Módulo de criação e listagem de pedidos | Ao trabalhar em orders |
| [`medication-module.md`](./medication-module.md) | Módulo de busca e gestão de medicamentos | Ao trabalhar em medication |
| [`components.md`](./components.md) | Componentes reutilizáveis com props e exemplos | Antes de criar qualquer componente novo |
| [`keyboard-navigation-audit.md`](./keyboard-navigation-audit.md) | Mapa completo de hotkeys, escopos e conflitos | Ao adicionar, remover ou alterar hotkeys |

---

### 8. Extensão futura

Para adicionar um novo módulo ao sistema:

1. Criar `src/renderer/src/services/<módulo>/<módulo>.service.ts` e DTOs
2. Criar `src/renderer/src/effects/<módulo>/use<Feature>.viewmodel.ts`
3. Criar componentes em `src/renderer/src/components/<módulo>/`
4. Adicionar rota em `src/renderer/src/routes/<módulo>/`
5. Registrar atalho de teclado no viewmodel via `useHotkeys` e documentar em `keyboard-navigation-audit.md`
6. Criar `docs/<módulo>-module.md` seguindo o template da skill `doc-module`
7. Atualizar a tabela de índice neste arquivo
