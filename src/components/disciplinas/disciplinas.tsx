// /components/disciplinas/disciplinas.tsx

"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import api from "@/api/api"
import { DisciplinaDialog } from "./disciplina-dialog"
import { DisciplinaInativaDialog } from "./disciplina-inativa-dialog" // Importe o novo diálogo

export interface Disciplina {
    id?: number,
    nome: string,
    codigo: string,
    periodo: number | null,
    status: boolean,
}

export default function Disciplinas() {
    const [dialogAberto, setDialogAberto] = useState(false)
    const [dialogInativosAberto, setDialogInativosAberto] = useState(false) // Estado para o novo diálogo
    const [disciplinaSelecionada, setDisciplinaSelecionada] = useState<Disciplina | null>(null)
    const [disciplinas, setDisciplinas] = useState<Disciplina[]>([])
    const [termoBusca, setTermoBusca] = useState("")

    // Filtra apenas disciplinas ativas para a tabela principal
    const disciplinasAtivasFiltradas = disciplinas.filter((disciplina) =>
        disciplina.status &&
        disciplina.nome.toLowerCase().includes(termoBusca.toLowerCase())
    )

    // Lista de disciplinas inativas para o novo diálogo
    const disciplinasInativas = disciplinas.filter((disciplina) => !disciplina.status)

    const fecthDisciplinas = async () => {
        try {
            const response = await api.get('/disciplinas');
            setDisciplinas(response.data);
        } catch (error: any) {
            const message = error.response ? error.response.data.message : 'Erro inesperado ao buscar disciplinas.'
            alert(`Erro: ${message}`)
        }
    }

    useEffect(() => {
        fecthDisciplinas();
    }, [])

    const abrirDialogAdicionar = () => {
        setDisciplinaSelecionada(null)
        setDialogAberto(true)
    }

    const abrirDialogEditar = (id: number) => {
        const disciplina = disciplinas.find((d) => d.id === id)
        if (disciplina) {
            setDisciplinaSelecionada(disciplina)
            setDialogAberto(true)
        }
    }

    const salvarDisciplina = async (disciplina: Disciplina) => {
        const endpoint = disciplina.id ? `/disciplinas/${disciplina.id}` : '/disciplinas'
        const method = disciplina.id ? 'put' : 'post'

        try {
            const response = await api[method](endpoint, { ...disciplina })

            if (response.status === 204 || response.status === 201) {
                alert(`Disciplina ${disciplina.id ? 'alterada' : 'salva'} com sucesso!`)
                setDialogAberto(false)
                fecthDisciplinas()
            }
        } catch (error: any) {
            const message = error.response ? error.response.data.message : `Erro inesperado ao ${disciplina.id ? 'alterar' : 'salvar'} a disciplina.`
            alert(`Erro: ${message}`)
            setDialogAberto(true)
        }
    }

    const handleDesativar = async (disciplina: Disciplina) => {
        if (!disciplina.id) return;
        if (!confirm(`Tem certeza que deseja desativar a disciplina "${disciplina.nome}"?`)) return;

        try {
            await api.put(`/disciplinas/${disciplina.id}`, { status: false });
            alert('Disciplina desativada com sucesso!');
            fecthDisciplinas();
        } catch (error: any) {
            const message = error.response ? error.response.data.message : 'Erro inesperado ao desativar a disciplina.'
            alert(`Erro: ${message}`)
        }
    }

    const handleReativar = async (disciplina: Disciplina) => {
        if (!disciplina.id) return;

        try {
            await api.put(`/disciplinas/${disciplina.id}`, { status: true });
            alert('Disciplina reativada com sucesso!');
            await fecthDisciplinas(); // Aguarda a busca para atualizar a lista de inativos
        } catch (error: any) {
            const message = error.response ? error.response.data.message : 'Erro inesperado ao reativar a disciplina.'
            alert(`Erro: ${message}`)
        }
    }


    return (
        <div className="flex h-screen bg-white">
            <div className="flex-1 overflow-auto p-6">
                <h1 className="text-2xl font-bold mb-6">Gerenciar Disciplinas</h1>
                <div className="border-b pb-4 mb-6" />

                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Lista de Disciplinas Ativas</h2>
                    <Button onClick={abrirDialogAdicionar} variant="default" className="bg-black text-white hover:bg-gray-800">
                        Adicionar Disciplina
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
                                <TableHead>Código</TableHead>
                                <TableHead>Período</TableHead>
                                <TableHead className="w-[100px]">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {disciplinasAtivasFiltradas.map((disciplina) => (
                                <TableRow key={disciplina.id}>
                                    <TableCell>{disciplina.nome}</TableCell>
                                    <TableCell>{disciplina.codigo}</TableCell>
                                    <TableCell>{disciplina.periodo}</TableCell>
                                    <TableCell className="flex space-x-2">
                                        <Button variant="ghost" size="icon" onClick={() => abrirDialogEditar(disciplina.id!)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                                <path d="m15 5 4 4" />
                                            </svg>
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => handleDesativar(disciplina)}>
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
            
            <DisciplinaDialog
                open={dialogAberto}
                onClose={() => setDialogAberto(false)}
                onSave={salvarDisciplina}
                disciplina={disciplinaSelecionada}
            />

            <DisciplinaInativaDialog
                open={dialogInativosAberto}
                onClose={() => setDialogInativosAberto(false)}
                onReactivate={handleReativar}
                disciplinas={disciplinasInativas}
            />
        </div>
    )
}