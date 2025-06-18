# Sistema de Estado Global - Context API

Este documento explica como o sistema de estado global funciona na aplicação Universys, permitindo que atualizações em uma página sejam automaticamente refletidas em outras páginas.

## 🎯 Objetivo

Implementar um sistema de estado compartilhado que garante que:
- Mudanças na página de Produtos sejam refletidas no Dashboard
- Mudanças na página de Pedidos sejam refletidas no Dashboard
- Todas as estatísticas sejam atualizadas em tempo real

## 🏗️ Arquitetura

### Context Provider (`src/lib/context.tsx`)

O `AppProvider` envolve toda a aplicação e gerencia o estado global:

```typescript
// Estado global
const [produtos, setProdutos] = useState<Produto[]>(mockProdutos);
const [pedidos, setPedidos] = useState<Pedido[]>(mockPedidos);
const [clientes, setClientes] = useState<Cliente[]>(mockClientes);
const [usuarios, setUsuarios] = useState<Usuario[]>(mockUsuarios);
```

### Funções CRUD Disponíveis

#### Produtos
- `addProduto(produto)`: Adiciona novo produto
- `updateProduto(id, produtoAtualizado)`: Atualiza produto existente
- `deleteProduto(id)`: Remove produto

#### Pedidos
- `addPedido(pedido)`: Adiciona novo pedido
- `updatePedido(id, pedidoAtualizado)`: Atualiza pedido existente
- `deletePedido(id)`: Remove pedido

#### Estatísticas
- `getDashboardStats()`: Calcula estatísticas em tempo real

## 🔄 Fluxo de Atualização

### 1. Página de Produtos
```typescript
const { produtos, addProduto, updateProduto, deleteProduto } = useAppContext();

// Ao adicionar produto
addProduto(novoProduto);

// Ao editar produto
updateProduto(id, dadosAtualizados);

// Ao excluir produto
deleteProduto(id);
```

### 2. Página de Pedidos
```typescript
const { pedidos, updatePedido } = useAppContext();

// Ao atualizar status
updatePedido(pedidoId, { status: novoStatus });
```

### 3. Dashboard
```typescript
const { pedidos, clientes, getDashboardStats } = useAppContext();
const stats = getDashboardStats(); // Calcula automaticamente
```

## 📊 Estatísticas Atualizadas Automaticamente

O Dashboard sempre mostra dados em tempo real:

- **Faturamento Total**: Soma de pedidos entregues
- **Pedidos Pendentes**: Contagem de pedidos em processamento
- **Produtos em Estoque**: Total de produtos cadastrados
- **Produtos com Estoque Baixo**: Produtos com menos de 20 unidades
- **Clientes Ativos**: Clientes com status ativo

## 🎨 Como Usar

### 1. Importar o Hook
```typescript
import { useAppContext } from "@/lib/context";
```

### 2. Extrair Dados e Funções
```typescript
const { 
  produtos, 
  pedidos, 
  addProduto, 
  updateProduto, 
  getDashboardStats 
} = useAppContext();
```

### 3. Usar as Funções
```typescript
// Adicionar produto
addProduto({
  id: "PROD009",
  nome: "Novo Perfume",
  preco: 100.00,
  // ... outros campos
});

// Atualizar produto
updateProduto("PROD001", {
  preco: 150.00,
  estoque: 25
});

// Obter estatísticas
const stats = getDashboardStats();
```

## 🔧 Configuração

### App.tsx
```typescript
import { AppProvider } from './lib/context';

function App() {
  return (
    <AppProvider>
      <Routes>
        {/* ... rotas */}
      </Routes>
    </AppProvider>
  );
}
```

## ✅ Benefícios

1. **Sincronização Automática**: Mudanças em qualquer página são refletidas instantaneamente
2. **Performance**: Evita re-renders desnecessários
3. **Manutenibilidade**: Estado centralizado e fácil de gerenciar
4. **Escalabilidade**: Fácil adicionar novas funcionalidades
5. **Consistência**: Dados sempre sincronizados entre componentes

## 🚀 Exemplo Prático

### Cenário: Usuário adiciona produto

1. **Página de Produtos**: Usuário preenche formulário e clica "Adicionar"
2. **Context**: `addProduto()` é chamada, atualizando o estado global
3. **Dashboard**: Automaticamente recalcula estatísticas e atualiza:
   - Total de produtos (+1)
   - Produtos com estoque baixo (se aplicável)
4. **Resultado**: Dashboard mostra dados atualizados sem refresh

### Cenário: Usuário atualiza status de pedido

1. **Página de Pedidos**: Usuário muda status de "Pendente" para "Enviado"
2. **Context**: `updatePedido()` é chamada, atualizando o estado global
3. **Dashboard**: Automaticamente recalcula estatísticas e atualiza:
   - Pedidos pendentes (-1)
   - Faturamento total (se pedido for entregue)
4. **Resultado**: Dashboard mostra dados atualizados em tempo real

## 🔮 Migração para API Real

Quando migrar para uma API real:

1. **Substituir estado local por chamadas à API**
2. **Manter as mesmas funções do contexto**
3. **Adicionar loading states e error handling**
4. **Implementar cache e otimizações**

```typescript
// Exemplo futuro com API
const addProduto = async (produto: Produto) => {
  const response = await api.post('/produtos', produto);
  setProdutos(prev => [...prev, response.data]);
};
```

O sistema de contexto facilita essa migração mantendo a mesma interface para os componentes. 