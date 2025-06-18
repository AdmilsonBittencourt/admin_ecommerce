import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { 
  mockProdutos, 
  mockPedidos, 
  mockClientes, 
  mockUsuarios, 
  type Produto, 
  type Pedido, 
  type Cliente, 
  type Usuario 
} from './mock-data';

// Interface para o contexto
interface AppContextType {
  // Dados
  produtos: Produto[];
  pedidos: Pedido[];
  clientes: Cliente[];
  usuarios: Usuario[];
  
  // Funções para atualizar dados
  updateProdutos: (produtos: Produto[]) => void;
  updatePedidos: (pedidos: Pedido[]) => void;
  updateClientes: (clientes: Cliente[]) => void;
  updateUsuarios: (usuarios: Usuario[]) => void;
  
  // Funções específicas para operações CRUD
  addProduto: (produto: Produto) => void;
  updateProduto: (id: string, produto: Partial<Produto>) => void;
  deleteProduto: (id: string) => void;
  
  addPedido: (pedido: Pedido) => void;
  updatePedido: (id: string, pedido: Partial<Pedido>) => void;
  deletePedido: (id: string) => void;
  
  // Funções utilitárias
  getDashboardStats: () => {
    totalVendas: number;
    pedidosPendentes: number;
    produtosBaixoEstoque: number;
    clientesAtivos: number;
    totalProdutos: number;
    totalPedidos: number;
  };
}

// Criar o contexto
const AppContext = createContext<AppContextType | undefined>(undefined);

// Hook personalizado para usar o contexto
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

// Props do provider
interface AppProviderProps {
  children: ReactNode;
}

// Provider do contexto
export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [produtos, setProdutos] = useState<Produto[]>(mockProdutos);
  const [pedidos, setPedidos] = useState<Pedido[]>(mockPedidos);
  const [clientes, setClientes] = useState<Cliente[]>(mockClientes);
  const [usuarios, setUsuarios] = useState<Usuario[]>(mockUsuarios);

  // Funções para atualizar dados
  const updateProdutos = (newProdutos: Produto[]) => {
    setProdutos(newProdutos);
  };

  const updatePedidos = (newPedidos: Pedido[]) => {
    setPedidos(newPedidos);
  };

  const updateClientes = (newClientes: Cliente[]) => {
    setClientes(newClientes);
  };

  const updateUsuarios = (newUsuarios: Usuario[]) => {
    setUsuarios(newUsuarios);
  };

  // Funções CRUD para produtos
  const addProduto = (produto: Produto) => {
    setProdutos(prev => [...prev, produto]);
  };

  const updateProduto = (id: string, produtoAtualizado: Partial<Produto>) => {
    setProdutos(prev => prev.map(produto => 
      produto.id === id 
        ? { ...produto, ...produtoAtualizado, updatedAt: new Date().toISOString() }
        : produto
    ));
  };

  const deleteProduto = (id: string) => {
    setProdutos(prev => prev.filter(produto => produto.id !== id));
  };

  // Funções CRUD para pedidos
  const addPedido = (pedido: Pedido) => {
    setPedidos(prev => [...prev, pedido]);
  };

  const updatePedido = (id: string, pedidoAtualizado: Partial<Pedido>) => {
    setPedidos(prev => prev.map(pedido => 
      pedido.id === id 
        ? { ...pedido, ...pedidoAtualizado }
        : pedido
    ));
  };

  const deletePedido = (id: string) => {
    setPedidos(prev => prev.filter(pedido => pedido.id !== id));
  };

  // Função para calcular estatísticas do dashboard
  const getDashboardStats = () => {
    const totalVendas = pedidos
      .filter(pedido => pedido.status === 'entregue')
      .reduce((total, pedido) => total + pedido.total, 0);

    const pedidosPendentes = pedidos.filter(pedido => 
      ['pendente', 'aprovado', 'em_preparo'].includes(pedido.status)
    ).length;

    const produtosBaixoEstoque = produtos.filter(produto => produto.estoque < 20).length;

    const clientesAtivos = clientes.filter(cliente => cliente.status === 'ativo').length;

    return {
      totalVendas,
      pedidosPendentes,
      produtosBaixoEstoque,
      clientesAtivos,
      totalProdutos: produtos.length,
      totalPedidos: pedidos.length
    };
  };

  const value: AppContextType = {
    produtos,
    pedidos,
    clientes,
    usuarios,
    updateProdutos,
    updatePedidos,
    updateClientes,
    updateUsuarios,
    addProduto,
    updateProduto,
    deleteProduto,
    addPedido,
    updatePedido,
    deletePedido,
    getDashboardStats
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}; 