// /components/professores/professores.tsx

"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import api from "@/api/api"
import { ProfessorDialog } from "./professor-dialog"
import { ProfessorInativoDialog } from "./professor-inativa-dialog" // Importe o novo diálogo

export interface Cpf {
    value: string;
}
export interface Professor {
    id?: number;
    nome: string,
    cpf: Cpf,
    titulacao: string,
    status: boolean,
}

export default function Professores() {
    const [dialogAberto, setDialogAberto] = useState(false)
    const [dialogInativosAberto, setDialogInativosAberto] = useState(false) // Estado para o novo diálogo
    const [professorSelecionado, setProfessorSelecionado] = useState<Professor | null>(null)
    const [professores, setProfessores] = useState<Professor[]>([])
    const [termoBusca, setTermoBusca] = useState("")

    // Filtra apenas professores ativos para a tabela principal
    const professoresAtivosFiltrados = professores.filter((prof) =>
        prof.status &&
        prof.nome.toLowerCase().includes(termoBusca.toLowerCase())
    )

    // Lista de professores inativos para o novo diálogo
    const professoresInativos = professores.filter((prof) => !prof.status)

    const fecthProfessores = async () => {
        try {
            const response = await api.get('/professores');
            setProfessores(response.data);
        } catch (error: any) {
            const message = error.response ? error.response.data.message : 'Erro inesperado ao buscar professores.'
            alert(`Erro: ${message}`)
        }
    }

    useEffect(() => {
        fecthProfessores();
    }, [])

    const abrirDialogAdicionar = () => {
        setProfessorSelecionado(null)
        setDialogAberto(true)
    }

    const abrirDialogEditar = (id: number) => {
        const professor = professores.find((p) => p.id === id)
        if (professor) {
            setProfessorSelecionado(professor)
            setDialogAberto(true)
        }
    }

    const salvarProfessor = async (prof: Professor) => {
        const endpoint = prof.id ? `/professores/${prof.id}` : '/professores'
        const method = prof.id ? 'put' : 'post'

        try {
            const response = await api[method](endpoint, { ...prof })

            if (response.status === 204 || response.status === 201) {
                alert(`Professor ${prof.id ? 'alterado' : 'salvo'} com sucesso!`)
                setDialogAberto(false)
                fecthProfessores()
            }
        } catch (error: any) {
            const message = error.response ? error.response.data.message : `Erro inesperado ao ${prof.id ? 'alterar' : 'salvar'} o professor.`
            alert(`Erro: ${message}`)
            setDialogAberto(true)
        }
    }

    const handleDesativar = async (prof: Professor) => {
        if (!prof.id) return;
        if (!confirm(`Tem certeza que deseja desativar o professor "${prof.nome}"?`)) return;

        try {
            // Corrigido para enviar o status correto
            await api.put(`/professores/${prof.id}`, { status: false });
            alert('Professor desativado com sucesso!');
            fecthProfessores();
        } catch (error: any) {
            const message = error.response ? error.response.data.message : 'Erro inesperado ao desativar o professor.'
            alert(`Erro: ${message}`)
        }
    }

    const handleReativar = async (prof: Professor) => {
        if (!prof.id) return;

        try {
            await api.put(`/professores/${prof.id}`, { status: true });
            alert('Professor reativado com sucesso!');
            await fecthProfessores(); // Aguarda a busca para atualizar ambas as listas
        } catch (error: any) {
            const message = error.response ? error.response.data.message : 'Erro inesperado ao reativar o professor.'
            alert(`Erro: ${message}`)
        }
    }

    return (
        <div className="flex h-screen bg-white">
            <div className="flex-1 overflow-auto p-6">
                <h1 className="text-2xl font-bold mb-6">Gerenciar Professores</h1>
                <div className="border-b pb-4 mb-6" />

                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Lista de Professores Ativos</h2>
                    <Button onClick={abrirDialogAdicionar} variant="default" className="bg-black text-white hover:bg-gray-800">
                        Adicionar Professor
                    </Button>
                </div>

                <div className="mb-6 flex items-center space-x-4">
                    <Input
                        placeholder="Buscar por nome..."
                        value={termoBusca}
                        onChange={(e) => setTermoBusca(e.target.value)}
                        className="max-w-md"
                    />
                    <Button
                        variant="outline"
                        onClick={() => setDialogInativosAberto(true)}
                    >
                        Ver Inativos
                    </Button>
                </div>

                <div className="border rounded-md">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nome</TableHead>
                                <TableHead>CPF</TableHead>
                                <TableHead>Titulação</TableHead>
                                <TableHead className="w-[100px]">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {professoresAtivosFiltrados.map((prof) => (
                                <TableRow key={prof.id}>
                                    <TableCell>{prof.nome}</TableCell>
                                    <TableCell>{prof.cpf.value}</TableCell>
                                    <TableCell>{prof.titulacao}</TableCell>
                                    <TableCell className="flex space-x-2">
                                        <Button variant="ghost" size="icon" onClick={() => abrirDialogEditar(prof.id!)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                                <path d="m15 5 4 4" />
                                            </svg>
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => handleDesativar(prof)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M3 6h18" />
                                                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                                <line x1="10" x2="10" y1="11" y2="17" />
                                                <line x1="14" x2="14" y1="11" y2="17" />
                                            </svg>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <ProfessorDialog
                open={dialogAberto}
                onClose={() => setDialogAberto(false)}
                onSave={salvarProfessor}
                professor={professorSelecionado}
            />

            <ProfessorInativoDialog
                open={dialogInativosAberto}
                onClose={() => setDialogInativosAberto(false)}
                onReactivate={handleReativar}
                professores={professoresInativos}
            />
        </div>
    )
}