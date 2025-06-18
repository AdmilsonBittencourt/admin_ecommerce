# Mock Data - Documentação

Este arquivo contém todos os dados mock centralizados da aplicação Universys.

## Estrutura dos Dados

### Interfaces

- **Produto**: Produtos do e-commerce com informações completas
- **Pedido**: Pedidos dos clientes com status e detalhes
- **Cliente**: Informações dos clientes cadastrados
- **Usuario**: Usuários do sistema (admin, gerente, vendedor, estoque)
- **Categoria**: Categorias de produtos

### Dados Mock

#### Produtos (`mockProdutos`)
- 8 produtos de perfumaria com imagens reais do Unsplash
- Inclui marcas como Chanel, Dior, Creed, YSL, Tom Ford, etc.
- Dados completos: nome, descrição, preço, estoque, categoria, marca, timestamps

#### Clientes (`mockClientes`)
- 3 clientes com dados completos
- Endereços completos e informações de contato
- Status ativo/inativo

#### Pedidos (`mockPedidos`)
- 3 pedidos com diferentes status
- Relacionamentos com clientes e produtos
- Informações de entrega e pagamento

#### Usuários (`mockUsuarios`)
- 3 usuários com diferentes cargos
- Dados de acesso e status

#### Categorias (`mockCategorias`)
- 4 categorias principais: Perfumes, Cosméticos, Skincare, Acessórios

## Funções Utilitárias

### Busca por ID
- `getProdutoById(id)`: Busca produto por ID
- `getClienteById(id)`: Busca cliente por ID
- `getPedidoById(id)`: Busca pedido por ID
- `getUsuarioById(id)`: Busca usuário por ID

### Busca Relacionada
- `getPedidosByClienteId(clienteId)`: Pedidos de um cliente específico
- `getProdutosByCategoria(categoria)`: Produtos de uma categoria

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
const produto = getProdutoById("PROD001");
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