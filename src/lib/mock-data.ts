// Tipos de dados da aplicação
export interface Produto {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  estoque: number;
  imagem?: string;
  categoria: string;
  marca: string;
  createdAt: string;
  updatedAt: string;
}

export interface Pedido {
  id: number;
  clienteId: string;
  produtos: Array<{
    produtoId: number;
    quantidade: number;
    precoUnitario: number;
  }>;
  status: 'pendente' | 'aprovado' | 'em_preparo' | 'enviado' | 'entregue' | 'cancelado';
  total: number;
  dataPedido: string;
  dataEntrega?: string;
  enderecoEntrega: {
    rua: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
  };
  formaPagamento: 'cartao' | 'pix' | 'boleto';
  observacoes?: string;
}

export interface Cliente {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  dataNascimento: string;
  endereco: {
    rua: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
  };
  dataCadastro: string;
  status: 'ativo' | 'inativo';
}

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  senha: string;
  cargo: 'admin' | 'gerente' | 'vendedor' | 'estoque';
  avatar?: string;
  dataCadastro: string;
  ultimoAcesso: string;
  status: 'ativo' | 'inativo';
}

export interface Categoria {
  id: string;
  nome: string;
  descricao: string;
  icone: string;
}

// Dados mock da aplicação
export const mockProdutos: Produto[] = [
  {
    id: 1,
    nome: "Chanel No. 5",
    descricao: "Perfume floral aldeídico icônico com notas de rosa, jasmim e baunilha. Uma fragrância atemporal que define elegância.",
    preco: 750.90,
    estoque: 50,
    categoria: "perfumes",
    marca: "Chanel",
    imagem: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z"
  },
  {
    id: 2,
    nome: "Dior Sauvage",
    descricao: "Fragrância masculina fresca e amadeirada com notas de bergamota, pimenta e ambroxan. Ideal para o homem moderno.",
    preco: 550.00,
    estoque: 35,
    categoria: "perfumes",
    marca: "Dior",
    imagem: "https://images.unsplash.com/photo-1592945403244-b3faa74b2c98?w=400&h=400&fit=crop",
    createdAt: "2024-01-16T14:20:00Z",
    updatedAt: "2024-01-16T14:20:00Z"
  },
  {
    id: 3,
    nome: "Creed Aventus",
    descricao: "Perfume chipre frutado luxuoso com notas de abacaxi, maçã e musgo de carvalho. Sinônimo de sofisticação.",
    preco: 1800.50,
    estoque: 20,
    categoria: "perfumes",
    marca: "Creed",
    imagem: "https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=400&h=400&fit=crop",
    createdAt: "2024-01-17T09:15:00Z",
    updatedAt: "2024-01-17T09:15:00Z"
  },
  {
    id: 4,
    nome: "Yves Saint Laurent Black Opium",
    descricao: "Fragrância oriental baunilha viciante com notas de café, baunilha e flores brancas. Para mulheres ousadas.",
    preco: 620.75,
    estoque: 42,
    categoria: "perfumes",
    marca: "Yves Saint Laurent",
    imagem: "https://images.unsplash.com/photo-1590736969955-71cc94901354?w=400&h=400&fit=crop",
    createdAt: "2024-01-18T16:45:00Z",
    updatedAt: "2024-01-18T16:45:00Z"
  },
  {
    id: 5,
    nome: "Tom Ford Oud Wood",
    descricao: "Perfume amadeirado exótico e raro com notas de oud, sândalo e baunilha. Uma experiência olfativa única.",
    preco: 1200.00,
    estoque: 15,
    categoria: "perfumes",
    marca: "Tom Ford",
    imagem: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&h=400&fit=crop",
    createdAt: "2024-01-19T11:30:00Z",
    updatedAt: "2024-01-19T11:30:00Z"
  },
  {
    id: 6,
    nome: "Jo Malone London Wood Sage & Sea Salt",
    descricao: "Fragrância fresca e mineral com notas de sal marinho, sálvia e ambrette. Perfeita para o dia a dia.",
    preco: 480.00,
    estoque: 28,
    categoria: "perfumes",
    marca: "Jo Malone London",
    imagem: "https://images.unsplash.com/photo-1590736969955-71cc94901354?w=400&h=400&fit=crop",
    createdAt: "2024-01-20T13:20:00Z",
    updatedAt: "2024-01-20T13:20:00Z"
  },
  {
    id: 7,
    nome: "Maison Margiela Replica Jazz Club",
    descricao: "Fragrância amadeirada com notas de rum, tabaco e baunilha. Inspirada na atmosfera de um jazz club.",
    preco: 680.00,
    estoque: 22,
    categoria: "perfumes",
    marca: "Maison Margiela",
    imagem: "https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=400&h=400&fit=crop",
    createdAt: "2024-01-21T15:10:00Z",
    updatedAt: "2024-01-21T15:10:00Z"
  },
  {
    id: 8,
    nome: "Byredo Gypsy Water",
    descricao: "Fragrância nômade com notas de bergamota, limão e sândalo. Uma viagem olfativa pela liberdade.",
    preco: 890.00,
    estoque: 18,
    categoria: "perfumes",
    marca: "Byredo",
    imagem: "https://images.unsplash.com/photo-1592945403244-b3faa74b2c98?w=400&h=400&fit=crop",
    createdAt: "2024-01-22T10:45:00Z",
    updatedAt: "2024-01-22T10:45:00Z"
  }
];

export const mockClientes: Cliente[] = [
  {
    id: "CLI001",
    nome: "Maria Silva Santos",
    email: "maria.silva@email.com",
    telefone: "(11) 99999-1111",
    cpf: "123.456.789-01",
    dataNascimento: "1985-03-15",
    endereco: {
      rua: "Rua das Flores",
      numero: "123",
      complemento: "Apto 45",
      bairro: "Centro",
      cidade: "São Paulo",
      estado: "SP",
      cep: "01234-567"
    },
    dataCadastro: "2024-01-10T08:00:00Z",
    status: "ativo"
  },
  {
    id: "CLI002",
    nome: "João Pedro Oliveira",
    email: "joao.oliveira@email.com",
    telefone: "(21) 98888-2222",
    cpf: "987.654.321-09",
    dataNascimento: "1990-07-22",
    endereco: {
      rua: "Avenida Brasil",
      numero: "456",
      bairro: "Copacabana",
      cidade: "Rio de Janeiro",
      estado: "RJ",
      cep: "22070-001"
    },
    dataCadastro: "2024-01-12T14:30:00Z",
    status: "ativo"
  },
  {
    id: "CLI003",
    nome: "Ana Costa Ferreira",
    email: "ana.costa@email.com",
    telefone: "(31) 97777-3333",
    cpf: "456.789.123-45",
    dataNascimento: "1988-11-08",
    endereco: {
      rua: "Rua da Liberdade",
      numero: "789",
      complemento: "Casa",
      bairro: "Savassi",
      cidade: "Belo Horizonte",
      estado: "MG",
      cep: "30112-000"
    },
    dataCadastro: "2024-01-14T16:45:00Z",
    status: "ativo"
  }
];

export const mockPedidos: Pedido[] = [
  {
    id: 1,
    clienteId: "CLI001",
    produtos: [
      { produtoId: 1, quantidade: 1, precoUnitario: 750.90 },
      { produtoId: 4, quantidade: 2, precoUnitario: 620.75 }
    ],
    status: "entregue",
    total: 1992.40,
    dataPedido: "2024-01-20T10:00:00Z",
    dataEntrega: "2024-01-22T14:30:00Z",
    enderecoEntrega: {
      rua: "Rua das Flores",
      numero: "123",
      complemento: "Apto 45",
      bairro: "Centro",
      cidade: "São Paulo",
      estado: "SP",
      cep: "01234-567"
    },
    formaPagamento: "cartao",
    observacoes: "Entregar após 18h"
  },
  {
    id: 2,
    clienteId: "CLI002",
    produtos: [
      { produtoId: 2, quantidade: 1, precoUnitario: 550.00 }
    ],
    status: "enviado",
    total: 550.00,
    dataPedido: "2024-01-21T15:30:00Z",
    enderecoEntrega: {
      rua: "Avenida Brasil",
      numero: "456",
      bairro: "Copacabana",
      cidade: "Rio de Janeiro",
      estado: "RJ",
      cep: "22070-001"
    },
    formaPagamento: "pix"
  },
  {
    id: 3,
    clienteId: "CLI003",
    produtos: [
      { produtoId: 3, quantidade: 1, precoUnitario: 1800.50 },
      { produtoId: 5, quantidade: 1, precoUnitario: 1200.00 }
    ],
    status: "aprovado",
    total: 3000.50,
    dataPedido: "2024-01-22T09:15:00Z",
    enderecoEntrega: {
      rua: "Rua da Liberdade",
      numero: "789",
      complemento: "Casa",
      bairro: "Savassi",
      cidade: "Belo Horizonte",
      estado: "MG",
      cep: "30112-000"
    },
    formaPagamento: "boleto"
  }
];

export const mockUsuarios: Usuario[] = [
  {
    id: "USR001",
    nome: "Admin Sistema",
    email: "admin@gmail.com",
    telefone: "(11) 99999-9999",
    senha: "123456",
    cargo: "admin",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    dataCadastro: "2024-01-01T00:00:00Z",
    ultimoAcesso: "2024-01-22T16:30:00Z",
    status: "ativo"
  },
  {
    id: "USR002",
    nome: "Gerente Vendas",
    email: "gerente@universys.com",
    telefone: "(11) 88888-8888",
    senha: "123456",
    cargo: "gerente",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    dataCadastro: "2024-01-02T00:00:00Z",
    ultimoAcesso: "2024-01-22T15:45:00Z",
    status: "ativo"
  },
  {
    id: "USR003",
    nome: "Vendedor João",
    email: "joao.vendedor@universys.com",
    telefone: "(11) 77777-7777",
    senha: "123456",
    cargo: "vendedor",
    dataCadastro: "2024-01-03T00:00:00Z",
    ultimoAcesso: "2024-01-22T14:20:00Z",
    status: "ativo"
  }
];

export const mockCategorias: Categoria[] = [
  {
    id: "CAT001",
    nome: "Perfumes",
    descricao: "Fragrâncias masculinas e femininas",
    icone: "🌸"
  },
  {
    id: "CAT002",
    nome: "Cosméticos",
    descricao: "Produtos de beleza e maquiagem",
    icone: "💄"
  },
  {
    id: "CAT003",
    nome: "Skincare",
    descricao: "Produtos para cuidados com a pele",
    icone: "🧴"
  },
  {
    id: "CAT004",
    nome: "Acessórios",
    descricao: "Acessórios de beleza e perfumaria",
    icone: "👜"
  }
];

// Funções utilitárias para manipular os dados mock
export const getProdutoById = (id: number): Produto | undefined => {
  return mockProdutos.find(produto => produto.id === id);
};

export const getClienteById = (id: string): Cliente | undefined => {
  return mockClientes.find(cliente => cliente.id === id);
};

export const getPedidoById = (id: number): Pedido | undefined => {
  return mockPedidos.find(pedido => pedido.id === id);
};

export const getUsuarioById = (id: string): Usuario | undefined => {
  return mockUsuarios.find(usuario => usuario.id === id);
};

export const getPedidosByClienteId = (clienteId: string): Pedido[] => {
  return mockPedidos.filter(pedido => pedido.clienteId === clienteId);
};

export const getProdutosByCategoria = (categoria: string): Produto[] => {
  return mockProdutos.filter(produto => produto.categoria === categoria);
};

// Estatísticas para o dashboard
export const getDashboardStats = () => {
  const totalVendas = mockPedidos
    .filter(pedido => pedido.status === 'entregue')
    .reduce((total, pedido) => total + pedido.total, 0);

  const pedidosPendentes = mockPedidos.filter(pedido => 
    ['pendente', 'aprovado', 'em_preparo'].includes(pedido.status)
  ).length;

  const produtosBaixoEstoque = mockProdutos.filter(produto => produto.estoque < 20).length;

  const clientesAtivos = mockClientes.filter(cliente => cliente.status === 'ativo').length;

  return {
    totalVendas,
    pedidosPendentes,
    produtosBaixoEstoque,
    clientesAtivos,
    totalProdutos: mockProdutos.length,
    totalPedidos: mockPedidos.length
  };
};

// Função para autenticação de usuário
export const autenticarUsuario = (email: string, senha: string): Usuario | null => {
  const usuario = mockUsuarios.find(user => 
    user.email === email && 
    user.senha === senha && 
    user.status === 'ativo'
  );
  
  if (usuario) {
    // Atualizar último acesso
    usuario.ultimoAcesso = new Date().toISOString();
    return usuario;
  }
  
  return null;
};

// Função para buscar usuário por email
export const getUsuarioByEmail = (email: string): Usuario | undefined => {
  return mockUsuarios.find(usuario => usuario.email === email);
}; 