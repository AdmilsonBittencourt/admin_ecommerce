import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Eye, Package, Truck, CheckCircle2, XCircle, FileText, Calendar, Loader2 } from "lucide-react";
import { useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { toast } from 'react-hot-toast';
import { useAppContext } from "@/lib/context";
import { type Pedido } from "@/lib/mock-data";

// Adicionar a interface para o jsPDF com autoTable
interface jsPDFWithAutoTable extends jsPDF {
  lastAutoTable: {
    finalY: number;
  };
}

// Interface para adaptar os dados do contexto para o formato de exibição
interface PedidoDisplay {
  id: number;
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
  produtos: Array<{
    id: number;
    nome: string;
    quantidade: number;
    precoUnitario: number;
    imagem?: string;
  }>;
  status: 'pendente' | 'processando' | 'enviado' | 'entregue' | 'cancelado';
  data: string;
  valorTotal: number;
  formaPagamento: 'cartao' | 'boleto' | 'pix';
  observacoes?: string;
}

export default function PedidosPage() {
  const { pedidos, clientes, produtos, updatePedido } = useAppContext();
  const [selectedPedido, setSelectedPedido] = useState<PedidoDisplay | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  // Função para converter dados do contexto para o formato de exibição
  const convertPedidosForDisplay = (): PedidoDisplay[] => {
    return pedidos.map(pedido => {
      const cliente = clientes.find(c => c.id === pedido.clienteId);
      const produtosComDetalhes = pedido.produtos.map(item => {
        const produto = produtos.find(p => p.id === item.produtoId);
        return {
          id: item.produtoId,
          nome: produto?.nome || 'Produto não encontrado',
          quantidade: item.quantidade,
          precoUnitario: item.precoUnitario,
          imagem: produto?.imagem
        };
      });

      // Mapear status do contexto para o formato de exibição
      const statusMapping: Record<string, PedidoDisplay['status']> = {
        'pendente': 'pendente',
        'aprovado': 'processando',
        'em_preparo': 'processando',
        'enviado': 'enviado',
        'entregue': 'entregue',
        'cancelado': 'cancelado'
      };

      return {
        id: pedido.id,
        numero: pedido.id.toString(),
        cliente: {
          nome: cliente?.nome || 'Cliente não encontrado',
          email: cliente?.email || '',
          telefone: cliente?.telefone || ''
        },
        endereco: pedido.enderecoEntrega,
        produtos: produtosComDetalhes,
        status: statusMapping[pedido.status] || 'pendente',
        data: pedido.dataPedido,
        valorTotal: pedido.total,
        formaPagamento: pedido.formaPagamento,
        observacoes: pedido.observacoes
      };
    });
  };

  const pedidosDisplay = convertPedidosForDisplay();

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

  const handleViewPedido = (pedido: PedidoDisplay) => {
    setSelectedPedido(pedido);
    setOpenDialog(true);
    setOpenDropdownId(null);
  };

  const handleUpdateStatus = (pedidoId: number, newStatus: PedidoDisplay['status']) => {
    // Mapear status de exibição para status do contexto
    const statusMapping: Record<string, Pedido['status']> = {
      'pendente': 'pendente',
      'processando': 'aprovado',
      'enviado': 'enviado',
      'entregue': 'entregue',
      'cancelado': 'cancelado'
    };

    const contextStatus = statusMapping[newStatus];
    if (contextStatus) {
      updatePedido(pedidoId, { status: contextStatus });
    }
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

  const generatePDF = (periodo: 'hoje' | 'semana' | 'mes') => {
    setIsGeneratingReport(true);
    
    try {
      const doc = new jsPDF() as jsPDFWithAutoTable;
      const today = new Date();
      let startDate: Date;
      let title: string;

      // Definir período do relatório
      switch (periodo) {
        case 'hoje':
          startDate = new Date(today.setHours(0, 0, 0, 0));
          title = 'Relatório de Pedidos - Hoje';
          break;
        case 'semana':
          startDate = new Date(today.setDate(today.getDate() - 7));
          title = 'Relatório de Pedidos - Última Semana';
          break;
        case 'mes':
          startDate = new Date(today.setDate(today.getDate() - 30));
          title = 'Relatório de Pedidos - Último Mês';
          break;
      }

      // Filtrar pedidos pelo período
      const pedidosFiltrados = pedidosDisplay.filter(pedido => {
        const pedidoDate = new Date(pedido.data);
        return pedidoDate >= startDate && pedidoDate <= new Date();
      });

      // Adicionar título
      doc.setFontSize(16);
      doc.text(title, 14, 15);
      doc.setFontSize(10);
      doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 14, 22);

      // Configurar tabela
      const tableColumn = ['Número', 'Cliente', 'Data', 'Valor Total', 'Status', 'Forma de Pagamento'];
      const tableRows: any[] = [];

      // Preencher dados
      pedidosFiltrados.forEach(pedido => {
        const pedidoData = [
          pedido.numero,
          pedido.cliente.nome,
          formatDate(pedido.data),
          `R$ ${pedido.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
          statusConfig[pedido.status].label,
          pedido.formaPagamento === 'cartao' ? 'Cartão de Crédito' :
          pedido.formaPagamento === 'boleto' ? 'Boleto' : 'PIX'
        ];
        tableRows.push(pedidoData);
      });

      // Adicionar tabela ao PDF
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 30,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [41, 128, 185] }
      });

      // Adicionar resumo
      const totalPedidos = pedidosFiltrados.length;
      const valorTotal = pedidosFiltrados.reduce((acc, pedido) => acc + pedido.valorTotal, 0);
      const pedidosPorStatus = pedidosFiltrados.reduce((acc, pedido) => {
        acc[pedido.status] = (acc[pedido.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      doc.setFontSize(12);
      doc.text('Resumo:', 14, doc.lastAutoTable.finalY + 15);
      doc.setFontSize(10);
      doc.text(`Total de Pedidos: ${totalPedidos}`, 14, doc.lastAutoTable.finalY + 25);
      doc.text(`Valor Total: R$ ${valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 14, doc.lastAutoTable.finalY + 32);
      
      let yOffset = 40;
      doc.text('Pedidos por Status:', 14, doc.lastAutoTable.finalY + yOffset);
      Object.entries(pedidosPorStatus).forEach(([status, count], index) => {
        doc.text(`${statusConfig[status as keyof typeof statusConfig].label}: ${count}`, 14, doc.lastAutoTable.finalY + yOffset + 8 + (index * 8));
      });

      // Salvar PDF
      doc.save(`relatorio-pedidos-${periodo}-${new Date().toISOString().split('T')[0]}.pdf`);
      toast.success('Relatório gerado com sucesso!');
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      toast.error('Erro ao gerar relatório');
    } finally {
      setIsGeneratingReport(false);
    }
  };

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Gerenciamento de Pedidos</CardTitle>
            <CardDescription>
              Visualize e gerencie todos os pedidos do seu e-commerce.
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" disabled={isGeneratingReport}>
                {isGeneratingReport ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Gerando...
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4 mr-2" />
                    Relatório
                  </>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Selecione o Período</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => generatePDF('hoje')}>
                <Calendar className="w-4 h-4 mr-2" />
                Hoje
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => generatePDF('semana')}>
                <Calendar className="w-4 h-4 mr-2" />
                Última Semana
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => generatePDF('mes')}>
                <Calendar className="w-4 h-4 mr-2" />
                Último Mês
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
              {pedidosDisplay.map((pedido) => {
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
          {pedidosDisplay.length === 0 && (
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
