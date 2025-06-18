# Mock Data - Documentação

Este arquivo contém todos os dados mock centralizados da aplicação Universys.

## Estrutura dos Dados

### Interfaces

- **Produto**: Produtos do e-commerce com informações completas (ID numérico)
- **Pedido**: Pedidos dos clientes com status e detalhes (ID numérico)
- **Cliente**: Informações dos clientes cadastrados (ID string)
- **Usuario**: Usuários do sistema (admin, gerente, vendedor, estoque) (ID string)
- **Categoria**: Categorias de produtos (ID string)

### Dados Mock

#### Produtos (`mockProdutos`)
- 8 produtos de perfumaria com imagens reais do Unsplash
- IDs numéricos sequenciais (1, 2, 3, 4, 5, 6, 7, 8)
- Inclui marcas como Chanel, Dior, Creed, YSL, Tom Ford, etc.
- Dados completos: nome, descrição, preço, estoque, categoria, marca, timestamps

#### Clientes (`mockClientes`)
- 3 clientes com dados completos
- IDs string (CLI001, CLI002, CLI003)
- Endereços completos e informações de contato
- Status ativo/inativo

#### Pedidos (`mockPedidos`)
- 3 pedidos com diferentes status
- IDs numéricos sequenciais (1, 2, 3)
- Relacionamentos com clientes e produtos
- Informações de entrega e pagamento

#### Usuários (`mockUsuarios`)
- 3 usuários com diferentes cargos
- IDs string (USR001, USR002, USR003)
- Dados de acesso e status

#### Categorias (`mockCategorias`)
- 4 categorias principais: Perfumes, Cosméticos, Skincare, Acessórios
- IDs string (CAT001, CAT002, CAT003, CAT004)

## Funções Utilitárias

### Busca por ID
- `getProdutoById(id: number)`: Busca produto por ID numérico
- `getClienteById(id: string)`: Busca cliente por ID string
- `getPedidoById(id: number)`: Busca pedido por ID numérico
- `getUsuarioById(id: string)`: Busca usuário por ID string

### Busca Relacionada
- `getPedidosByClienteId(clienteId: string)`: Pedidos de um cliente específico
- `getProdutosByCategoria(categoria: string)`: Produtos de uma categoria

### Estatísticas
- `getDashboardStats()`: Retorna estatísticas para o dashboard
  - Total de vendas
  - Pedidos pendentes
  - Produtos com estoque baixo
  - Clientes ativos
  - Total de produtos e pedidos

## Como Usar

```typescript
import { 
  mockProdutos, 
  mockClientes, 
  getDashboardStats,
  type Produto 
} from "@/lib/mock-data";

// Usar dados diretamente
const produtos = mockProdutos;

// Usar funções utilitárias
const stats = getDashboardStats();
const produto = getProdutoById(1); // ID numérico
const cliente = getClienteById("CLI001"); // ID string
```

## Vantagens do Mock Centralizado

1. **Consistência**: Todos os componentes usam os mesmos dados
2. **Manutenibilidade**: Mudanças em um local refletem em toda a aplicação
3. **Reutilização**: Funções utilitárias podem ser usadas em qualquer componente
4. **Tipagem**: TypeScript garante consistência de tipos
5. **Facilidade de migração**: Fácil substituição por API real no futuro

## Migração para API Real

Quando for necessário migrar para uma API real:

1. Substituir as importações do mock pelos serviços da API
2. Manter as interfaces para garantir compatibilidade
3. Adaptar as funções utilitárias para fazer chamadas à API
4. Implementar cache e loading states conforme necessário

## Notas sobre IDs

- **Produtos e Pedidos**: IDs numéricos sequenciais (1, 2, 3...)
- **Clientes, Usuários e Categorias**: IDs string com prefixos (CLI001, USR001, CAT001)
- Esta estrutura facilita a migração para bancos de dados reais onde produtos e pedidos geralmente usam auto-increment 