import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { MoreHorizontal } from "lucide-react";
import { useState } from 'react';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
// import { Sidebar } from "@/components/sidebar"; // Sidebar import removed

interface Produto {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  estoque: number;
}

const produtoSchema = z.object({
  nome: z.string()
    .min(3, "O nome deve ter pelo menos 3 caracteres")
    .max(100, "O nome não pode ter mais de 100 caracteres"),
  descricao: z.string()
    .min(10, "A descrição deve ter pelo menos 10 caracteres")
    .max(500, "A descrição não pode ter mais de 500 caracteres"),
  preco: z.string()
    .min(1, "O preço é obrigatório")
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: "O preço deve ser maior que zero"
    }),
  estoque: z.string()
    .min(1, "O estoque é obrigatório")
    .refine((val) => !isNaN(parseInt(val)) && parseInt(val) >= 0, {
      message: "O estoque deve ser um número inteiro maior ou igual a zero"
    })
});

type ProdutoFormData = z.infer<typeof produtoSchema>;

const mockProdutos: Produto[] = [
  { id: "PROD001", nome: "Chanel No. 5", descricao: "Perfume floral aldeídico icônico.", preco: 750.90, estoque: 50 },
  { id: "PROD002", nome: "Dior Sauvage", descricao: "Fragrância masculina fresca e amadeirada.", preco: 550.00, estoque: 35 },
  { id: "PROD003", nome: "Creed Aventus", descricao: "Perfume chipre frutado luxuoso.", preco: 1800.50, estoque: 20 },
  { id: "PROD004", nome: "Yves Saint Laurent Black Opium", descricao: "Fragrância oriental baunilha viciante.", preco: 620.75, estoque: 42 },
  { id: "PROD005", nome: "Tom Ford Oud Wood", descricao: "Perfume amadeirado exótico e raro.", preco: 1200.00, estoque: 15 },
];

export default function ProdutosPage() {
  const [produtos, setProdutos] = useState<Produto[]>(mockProdutos);
  const [open, setOpen] = useState(false);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ProdutoFormData>({
    resolver: zodResolver(produtoSchema),
    defaultValues: {
      nome: "",
      descricao: "",
      preco: "",
      estoque: ""
    }
  });

  const onSubmit = (data: ProdutoFormData) => {
    const novoId = `PROD${String(produtos.length + 1).padStart(3, '0')}`;
    const produto: Produto = {
      id: novoId,
      nome: data.nome,
      descricao: data.descricao,
      preco: parseFloat(data.preco),
      estoque: parseInt(data.estoque)
    };
    
    setProdutos([...produtos, produto]);
    reset();
    setOpen(false);
  };

  const handleEditarProduto = (id: string) => {
    console.log("Editar produto:", id);
  };

  const handleExcluirProduto = (id: string) => {
    setProdutos(produtos.filter(p => p.id !== id));
    console.log("Excluir produto:", id);
  };

  return (
    // <div className="flex h-screen"> // Flex container removed
      // <Sidebar /> // Sidebar component removed
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Gerenciamento de Produtos</CardTitle>
              <CardDescription>
                Visualize, adicione, edite ou exclua produtos do seu e-commerce.
              </CardDescription>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button>Adicionar Produto</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar Novo Produto</DialogTitle>
                  <DialogDescription>
                    Preencha os campos abaixo para adicionar um novo produto.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <label htmlFor="nome">Nome</label>
                    <Input
                      id="nome"
                      {...register("nome")}
                      placeholder="Digite o nome do produto"
                    />
                    {errors.nome && (
                      <span className="text-sm text-red-500">{errors.nome.message}</span>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="descricao">Descrição</label>
                    <Input
                      id="descricao"
                      {...register("descricao")}
                      placeholder="Digite a descrição do produto"
                    />
                    {errors.descricao && (
                      <span className="text-sm text-red-500">{errors.descricao.message}</span>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="preco">Preço</label>
                    <Input
                      id="preco"
                      type="number"
                      step="0.01"
                      {...register("preco")}
                      placeholder="Digite o preço do produto"
                    />
                    {errors.preco && (
                      <span className="text-sm text-red-500">{errors.preco.message}</span>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="estoque">Estoque</label>
                    <Input
                      id="estoque"
                      type="number"
                      {...register("estoque")}
                      placeholder="Digite a quantidade em estoque"
                    />
                    {errors.estoque && (
                      <span className="text-sm text-red-500">{errors.estoque.message}</span>
                    )}
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => {
                      reset();
                      setOpen(false);
                    }}>
                      Cancelar
                    </Button>
                    <Button type="submit">Adicionar</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead>Estoque</TableHead>
                  <TableHead>
                    <span className="sr-only">Ações</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {produtos.map((produto) => (
                  <TableRow key={produto.id}>
                    <TableCell className="font-medium">{produto.id}</TableCell>
                    <TableCell>{produto.nome}</TableCell>
                    <TableCell className="hidden md:table-cell max-w-xs truncate">{produto.descricao}</TableCell>
                    <TableCell>R$ {produto.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                    <TableCell>{produto.estoque}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleEditarProduto(produto.id)}>Editar</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleExcluirProduto(produto.id)} className="text-red-600">Excluir</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {produtos.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Nenhum produto cadastrado ainda.
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    // </div> // Flex container removed
  );
}