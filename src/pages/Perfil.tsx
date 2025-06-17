import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Camera, Loader2 } from "lucide-react";

const perfilSchema = z.object({
  nome: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  email: z.string().email("Email inválido"),
  telefone: z.string().min(10, "Telefone inválido"),
  senhaAtual: z.string().min(6, "Senha atual deve ter no mínimo 6 caracteres").optional(),
  novaSenha: z.string().min(6, "Nova senha deve ter no mínimo 6 caracteres").optional(),
  confirmarSenha: z.string().optional(),
}).refine((data) => {
  if (data.novaSenha && !data.senhaAtual) {
    return false;
  }
  return true;
}, {
  message: "Senha atual é obrigatória para alterar a senha",
  path: ["senhaAtual"],
}).refine((data) => {
  if (data.novaSenha && data.novaSenha !== data.confirmarSenha) {
    return false;
  }
  return true;
}, {
  message: "As senhas não conferem",
  path: ["confirmarSenha"],
});

type PerfilFormData = z.infer<typeof perfilSchema>;

// Mock data - substituir por dados reais da API
const mockAdminData = {
  nome: "Admin",
  email: "admin@universys.com",
  telefone: "(11) 99999-9999",
  avatar: "https://github.com/shadcn.png"
};

export default function PerfilPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [avatar, setAvatar] = useState(mockAdminData.avatar);
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<PerfilFormData>({
    resolver: zodResolver(perfilSchema),
    defaultValues: {
      nome: mockAdminData.nome,
      email: mockAdminData.email,
      telefone: mockAdminData.telefone,
    }
  });

  const onSubmit = async (data: PerfilFormData) => {
    try {
      setIsLoading(true);
      // Simular chamada à API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Aqui você faria a chamada real à API
      console.log("Dados atualizados:", data);
      
      toast.success("Perfil atualizado com sucesso!");
      reset(data);
    } catch (error) {
      toast.error("Erro ao atualizar perfil");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsEditingAvatar(true);
      // Simular upload da imagem
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Aqui você faria o upload real da imagem
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
        toast.success("Avatar atualizado com sucesso!");
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast.error("Erro ao atualizar avatar");
    } finally {
      setIsEditingAvatar(false);
    }
  };

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Perfil do Administrador</CardTitle>
            <CardDescription>
              Gerencie suas informações pessoais e credenciais de acesso.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <img
                    src={avatar}
                    alt="Avatar"
                    className="w-24 h-24 rounded-full object-cover"
                  />
                  <label
                    htmlFor="avatar"
                    className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-2 rounded-full cursor-pointer hover:bg-primary/90 transition-colors"
                  >
                    {isEditingAvatar ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Camera className="w-4 h-4" />
                    )}
                    <input
                      type="file"
                      id="avatar"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                      disabled={isEditingAvatar}
                    />
                  </label>
                </div>
                <p className="text-sm text-muted-foreground">
                  Clique no ícone para alterar sua foto
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome</Label>
                  <Input
                    id="nome"
                    {...register("nome")}
                    placeholder="Seu nome completo"
                  />
                  {errors.nome && (
                    <p className="text-sm text-red-500">{errors.nome.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    placeholder="seu@email.com"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    {...register("telefone")}
                    placeholder="(00) 00000-0000"
                  />
                  {errors.telefone && (
                    <p className="text-sm text-red-500">{errors.telefone.message}</p>
                  )}
                </div>

                <div className="pt-4 border-t">
                  <h3 className="text-lg font-medium mb-4">Alterar Senha</h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="senhaAtual">Senha Atual</Label>
                      <Input
                        id="senhaAtual"
                        type="password"
                        {...register("senhaAtual")}
                        placeholder="Digite sua senha atual"
                      />
                      {errors.senhaAtual && (
                        <p className="text-sm text-red-500">{errors.senhaAtual.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="novaSenha">Nova Senha</Label>
                      <Input
                        id="novaSenha"
                        type="password"
                        {...register("novaSenha")}
                        placeholder="Digite a nova senha"
                      />
                      {errors.novaSenha && (
                        <p className="text-sm text-red-500">{errors.novaSenha.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmarSenha">Confirmar Nova Senha</Label>
                      <Input
                        id="confirmarSenha"
                        type="password"
                        {...register("confirmarSenha")}
                        placeholder="Confirme a nova senha"
                      />
                      {errors.confirmarSenha && (
                        <p className="text-sm text-red-500">{errors.confirmarSenha.message}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Salvar Alterações
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
