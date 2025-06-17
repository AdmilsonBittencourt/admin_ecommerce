import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { MoreHorizontal, Upload } from "lucide-react";
import { useState, useRef } from 'react';
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
  imagem?: string;
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
    }),
  imagem: z.string().optional()
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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm<ProdutoFormData>({
    resolver: zodResolver(produtoSchema),
    defaultValues: {
      nome: "",
      descricao: "",
      preco: "",
      estoque: "",
      imagem: ""
    }
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPreviewImage(base64String);
        setValue('imagem', base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOpenDialog = (mode: 'add' | 'edit', id?: string) => {
    if (mode === 'edit' && id) {
      const produto = produtos.find(p => p.id === id);
      if (produto) {
        setValue('nome', produto.nome);
        setValue('descricao', produto.descricao);
        setValue('preco', produto.preco.toString());
        setValue('estoque', produto.estoque.toString());
        setValue('imagem', produto.imagem || '');
        setPreviewImage(produto.imagem || null);
        setEditingId(id);
      }
    } else {
      reset();
      setPreviewImage(null);
      setEditingId(null);
    }
    setOpen(true);
    setOpenDropdownId(null);
  };

  const onSubmit = (data: ProdutoFormData) => {
    if (editingId) {
      // Editar produto existente
      setProdutos(produtos.map(p => 
        p.id === editingId 
          ? {
              ...p,
              nome: data.nome,
              descricao: data.descricao,
              preco: parseFloat(data.preco),
              estoque: parseInt(data.estoque),
              imagem: data.imagem
            }
          : p
      ));
    } else {
      // Adicionar novo produto
      const novoId = `PROD${String(produtos.length + 1).padStart(3, '0')}`;
      const produto: Produto = {
        id: novoId,
        nome: data.nome,
        descricao: data.descricao,
        preco: parseFloat(data.preco),
        estoque: parseInt(data.estoque),
        imagem: data.imagem
      };
      setProdutos([...produtos, produto]);
    }
    
    reset();
    setPreviewImage(null);
    setOpen(false);
    setEditingId(null);
  };

  const handleExcluirProduto = (id: string) => {
    setProdutos(produtos.filter(p => p.id !== id));
    setOpenDropdownId(null);
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
                <Button onClick={() => handleOpenDialog('add')}>Adicionar Produto</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingId ? 'Editar Produto' : 'Adicionar Novo Produto'}</DialogTitle>
                  <DialogDescription>
                    {editingId 
                      ? 'Atualize as informações do produto abaixo.'
                      : 'Preencha os campos abaixo para adicionar um novo produto.'}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <label htmlFor="imagem">Imagem do Produto</label>
                    <div className="flex flex-col items-center gap-4">
                      {previewImage && (
                        <div className="relative w-32 h-32">
                          <img
                            src={previewImage}
                            alt="Preview"
                            className="w-full h-full object-cover rounded-lg"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute -top-2 -right-2"
                            onClick={() => {
                              setPreviewImage(null);
                              setValue('imagem', '');
                              if (fileInputRef.current) {
                                fileInputRef.current.value = '';
                              }
                            }}
                          >
                            <span className="sr-only">Remover imagem</span>
                            ×
                          </Button>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Input
                          id="imagem"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          ref={fileInputRef}
                          onChange={handleImageChange}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          {previewImage ? 'Alterar Imagem' : 'Adicionar Imagem'}
                        </Button>
                      </div>
                    </div>
                  </div>
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
                      setPreviewImage(null);
                      setOpen(false);
                      setEditingId(null);
                    }}>
                      Cancelar
                    </Button>
                    <Button type="submit">{editingId ? 'Salvar' : 'Adicionar'}</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Imagem</TableHead>
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
                    <TableCell>
                      {produto.imagem ? (
                        <img
                          src={produto.imagem}
                          alt={produto.nome}
                          className="w-12 h-12 object-cover rounded"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                          <span className="text-xs text-muted-foreground">Sem imagem</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{produto.id}</TableCell>
                    <TableCell>{produto.nome}</TableCell>
                    <TableCell className="hidden md:table-cell max-w-xs truncate">{produto.descricao}</TableCell>
                    <TableCell>R$ {produto.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                    <TableCell>{produto.estoque}</TableCell>
                    <TableCell>
                      <DropdownMenu open={openDropdownId === produto.id} onOpenChange={(open) => setOpenDropdownId(open ? produto.id : null)}>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleOpenDialog('edit', produto.id)}>Editar</DropdownMenuItem>
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