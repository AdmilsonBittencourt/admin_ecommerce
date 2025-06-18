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
  type Usuario,
  autenticarUsuario
} from './mock-data';

// Interface para o contexto
interface AppContextType {
  // Dados
  produtos: Produto[];
  pedidos: Pedido[];
  clientes: Cliente[];
  usuarios: Usuario[];
  
  // Autenticação
  usuarioLogado: Usuario | null;
  isAuthenticated: boolean;
  
  // Funções de autenticação
  login: (email: string, senha: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  
  // Funções para atualizar dados
  updateProdutos: (produtos: Produto[]) => void;
  updatePedidos: (pedidos: Pedido[]) => void;
  updateClientes: (clientes: Cliente[]) => void;
  updateUsuarios: (usuarios: Usuario[]) => void;
  
  // Funções específicas para operações CRUD
  addProduto: (produto: Produto) => void;
  updateProduto: (id: number, produto: Partial<Produto>) => void;
  deleteProduto: (id: number) => void;
  
  addPedido: (pedido: Pedido) => void;
  updatePedido: (id: number, pedido: Partial<Pedido>) => void;
  deletePedido: (id: number) => void;
  
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
  const [usuarioLogado, setUsuarioLogado] = useState<Usuario | null>(null);

  // Função de login
  const login = async (email: string, senha: string): Promise<{ success: boolean; message: string }> => {
    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const usuario = autenticarUsuario(email, senha);
      
      if (usuario) {
        setUsuarioLogado(usuario);
        return { success: true, message: "Login realizado com sucesso!" };
      } else {
        return { success: false, message: "Email ou senha incorretos" };
      }
    } catch (error) {
      return { success: false, message: "Erro ao realizar login" };
    }
  };

  // Função de logout
  const logout = () => {
    setUsuarioLogado(null);
  };

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

  const updateProduto = (id: number, produtoAtualizado: Partial<Produto>) => {
    setProdutos(prev => prev.map(produto => 
      produto.id === id 
        ? { ...produto, ...produtoAtualizado, updatedAt: new Date().toISOString() }
        : produto
    ));
  };

  const deleteProduto = (id: number) => {
    setProdutos(prev => prev.filter(produto => produto.id !== id));
  };

  // Funções CRUD para pedidos
  const addPedido = (pedido: Pedido) => {
    setPedidos(prev => [...prev, pedido]);
  };

  const updatePedido = (id: number, pedidoAtualizado: Partial<Pedido>) => {
    setPedidos(prev => prev.map(pedido => 
      pedido.id === id 
        ? { ...pedido, ...pedidoAtualizado }
        : pedido
    ));
  };

  const deletePedido = (id: number) => {
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
    usuarioLogado,
    isAuthenticated: !!usuarioLogado,
    login,
    logout,
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