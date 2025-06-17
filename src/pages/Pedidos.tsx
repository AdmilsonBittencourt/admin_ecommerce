import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Eye, Package, Truck, CheckCircle2, XCircle } from "lucide-react";
import { useState } from 'react';

interface ProdutoPedido {
  id: string;
  nome: string;
  quantidade: number;
  precoUnitario: number;
  imagem?: string;
}

interface Pedido {
  id: string;
  numero: string;
  cliente: {
    nome: string;
    email: string;
    telefone: string;
  };
  endereco: {
    rua: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
  };
  produtos: ProdutoPedido[];
  status: 'pendente' | 'processando' | 'enviado' | 'entregue' | 'cancelado';
  data: string;
  valorTotal: number;
  formaPagamento: 'cartao' | 'boleto' | 'pix';
  observacoes?: string;
}

const mockPedidos: Pedido[] = [
  {
    id: "PED001",
    numero: "2024-001",
    cliente: {
      nome: "João Silva",
      email: "joao.silva@email.com",
      telefone: "(11) 98765-4321"
    },
    endereco: {
      rua: "Rua das Flores",
      numero: "123",
      complemento: "Apto 45",
      bairro: "Centro",
      cidade: "São Paulo",
      estado: "SP",
      cep: "01234-567"
    },
    produtos: [
      {
        id: "PROD001",
        nome: "Chanel No. 5",
        quantidade: 1,
        precoUnitario: 750.90,
        imagem: "https://example.com/chanel.jpg"
      }
    ],
    status: "pendente",
    data: "2024-03-15T10:30:00",
    valorTotal: 750.90,
    formaPagamento: "cartao",
    observacoes: "Entregar no período da tarde"
  },
  {
    id: "PED002",
    numero: "2024-002",
    cliente: {
      nome: "Maria Santos",
      email: "maria.santos@email.com",
      telefone: "(11) 91234-5678"
    },
    endereco: {
      rua: "Avenida Principal",
      numero: "456",
      bairro: "Jardim América",
      cidade: "São Paulo",
      estado: "SP",
      cep: "04567-890"
    },
    produtos: [
      {
        id: "PROD002",
        nome: "Dior Sauvage",
        quantidade: 2,
        precoUnitario: 550.00,
        imagem: "https://example.com/dior.jpg"
      },
      {
        id: "PROD003",
        nome: "Creed Aventus",
        quantidade: 1,
        precoUnitario: 1800.50,
        imagem: "https://example.com/creed.jpg"
      }
    ],
    status: "enviado",
    data: "2024-03-14T15:45:00",
    valorTotal: 2900.50,
    formaPagamento: "pix"
  }
];

const statusConfig = {
  pendente: {
    label: "Pendente",
    color: "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20",
    icon: Package
  },
  processando: {
    label: "Processando",
    color: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20",
    icon: Package
  },
  enviado: {
    label: "Enviado",
    color: "bg-purple-500/10 text-purple-500 hover:bg-purple-500/20",
    icon: Truck
  },
  entregue: {
    label: "Entregue",
    color: "bg-green-500/10 text-green-500 hover:bg-green-500/20",
    icon: CheckCircle2
  },
  cancelado: {
    label: "Cancelado",
    color: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
    icon: XCircle
  }
};

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>(mockPedidos);
  const [selectedPedido, setSelectedPedido] = useState<Pedido | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const handleViewPedido = (pedido: Pedido) => {
    setSelectedPedido(pedido);
    setOpenDialog(true);
    setOpenDropdownId(null);
  };

  const handleUpdateStatus = (pedidoId: string, newStatus: Pedido['status']) => {
    setPedidos(pedidos.map(pedido => 
      pedido.id === pedidoId 
        ? { ...pedido, status: newStatus }
        : pedido
    ));
    setOpenDropdownId(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle>Gerenciamento de Pedidos</CardTitle>
          <CardDescription>
            Visualize e gerencie todos os pedidos do seu e-commerce.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Valor Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Forma de Pagamento</TableHead>
                <TableHead>
                  <span className="sr-only">Ações</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pedidos.map((pedido) => {
                const StatusIcon = statusConfig[pedido.status].icon;
                return (
                  <TableRow key={pedido.id}>
                    <TableCell className="font-medium">{pedido.numero}</TableCell>
                    <TableCell>{pedido.cliente.nome}</TableCell>
                    <TableCell>{formatDate(pedido.data)}</TableCell>
                    <TableCell>
                      R$ {pedido.valorTotal.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={statusConfig[pedido.status].color}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {statusConfig[pedido.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {pedido.formaPagamento === 'cartao' && 'Cartão de Crédito'}
                      {pedido.formaPagamento === 'boleto' && 'Boleto'}
                      {pedido.formaPagamento === 'pix' && 'PIX'}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu open={openDropdownId === pedido.id} onOpenChange={(open) => setOpenDropdownId(open ? pedido.id : null)}>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleViewPedido(pedido)}>
                            <Eye className="w-4 h-4 mr-2" />
                            Ver Detalhes
                          </DropdownMenuItem>
                          {pedido.status === 'pendente' && (
                            <DropdownMenuItem onClick={() => handleUpdateStatus(pedido.id, 'processando')}>
                              <Package className="w-4 h-4 mr-2" />
                              Processar Pedido
                            </DropdownMenuItem>
                          )}
                          {pedido.status === 'processando' && (
                            <DropdownMenuItem onClick={() => handleUpdateStatus(pedido.id, 'enviado')}>
                              <Truck className="w-4 h-4 mr-2" />
                              Marcar como Enviado
                            </DropdownMenuItem>
                          )}
                          {pedido.status === 'enviado' && (
                            <DropdownMenuItem onClick={() => handleUpdateStatus(pedido.id, 'entregue')}>
                              <CheckCircle2 className="w-4 h-4 mr-2" />
                              Marcar como Entregue
                            </DropdownMenuItem>
                          )}
                          {['pendente', 'processando'].includes(pedido.status) && (
                            <DropdownMenuItem 
                              onClick={() => handleUpdateStatus(pedido.id, 'cancelado')}
                              className="text-red-600"
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Cancelar Pedido
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          {pedidos.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum pedido encontrado.
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-3xl">
          {selectedPedido && (
            <>
              <DialogHeader>
                <DialogTitle>Detalhes do Pedido {selectedPedido.numero}</DialogTitle>
                <DialogDescription>
                  Informações completas do pedido e do cliente.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-6">
                <div className="grid gap-4">
                  <div>
                    <h3 className="font-semibold mb-2">Informações do Cliente</h3>
                    <div className="grid gap-2 text-sm">
                      <p><span className="font-medium">Nome:</span> {selectedPedido.cliente.nome}</p>
                      <p><span className="font-medium">Email:</span> {selectedPedido.cliente.email}</p>
                      <p><span className="font-medium">Telefone:</span> {selectedPedido.cliente.telefone}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Endereço de Entrega</h3>
                    <div className="grid gap-2 text-sm">
                      <p>{selectedPedido.endereco.rua}, {selectedPedido.endereco.numero}</p>
                      {selectedPedido.endereco.complemento && (
                        <p>Complemento: {selectedPedido.endereco.complemento}</p>
                      )}
                      <p>{selectedPedido.endereco.bairro}</p>
                      <p>{selectedPedido.endereco.cidade} - {selectedPedido.endereco.estado}</p>
                      <p>CEP: {selectedPedido.endereco.cep}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Produtos</h3>
                    <div className="border rounded-lg">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Produto</TableHead>
                            <TableHead>Quantidade</TableHead>
                            <TableHead>Preço Unitário</TableHead>
                            <TableHead>Subtotal</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedPedido.produtos.map((produto) => (
                            <TableRow key={produto.id}>
                              <TableCell className="flex items-center gap-2">
                                {produto.imagem && (
                                  <img
                                    src={produto.imagem}
                                    alt={produto.nome}
                                    className="w-8 h-8 object-cover rounded"
                                  />
                                )}
                                {produto.nome}
                              </TableCell>
                              <TableCell>{produto.quantidade}</TableCell>
                              <TableCell>
                                R$ {produto.precoUnitario.toLocaleString('pt-BR', {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2
                                })}
                              </TableCell>
                              <TableCell>
                                R$ {(produto.quantidade * produto.precoUnitario).toLocaleString('pt-BR', {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2
                                })}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Valor Total:</span>
                      <span className="text-lg font-semibold">
                        R$ {selectedPedido.valorTotal.toLocaleString('pt-BR', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Forma de Pagamento:</span>
                      <span>
                        {selectedPedido.formaPagamento === 'cartao' && 'Cartão de Crédito'}
                        {selectedPedido.formaPagamento === 'boleto' && 'Boleto'}
                        {selectedPedido.formaPagamento === 'pix' && 'PIX'}
                      </span>
                    </div>
                    {selectedPedido.observacoes && (
                      <div>
                        <span className="font-medium">Observações:</span>
                        <p className="text-sm text-muted-foreground">{selectedPedido.observacoes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpenDialog(false)}>
                  Fechar
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}
