// /components/salas/salas.tsx

"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import api from "@/api/api"
import { SalaDialog } from "./sala-dialog"
import { SalaInativaDialog } from "./sala-inativa-dialog" // Importe o novo diálogo

export interface Sala {
    id?: number,
    nome: string,
    capacidade: number | null,
    local: string,
    status: boolean
}

export default function Salas() {
    const [dialogAberto, setDialogAberto] = useState(false)
    const [dialogInativosAberto, setDialogInativosAberto] = useState(false) // Estado para o novo diálogo
    const [salaSelecionada, setSalaSelecionada] = useState<Sala | null>(null)
    const [salas, setSalas] = useState<Sala[]>([])
    const [termoBusca, setTermoBusca] = useState("")

    // Filtra apenas salas ativas para a tabela principal
    const salasAtivasFiltradas = salas.filter((sala) =>
        sala.status &&
        sala.nome.toLowerCase().includes(termoBusca.toLowerCase())
    )

    // Lista de salas inativas para o novo diálogo
    const salasInativas = salas.filter((sala) => !sala.status)

    const fecthSalas = async () => {
        try {
            const response = await api.get('/salas');
            setSalas(response.data);
        } catch (error: any) {
            const message = error.response ? error.response.data.message : 'Erro inesperado ao buscar as salas.'
            alert(`Erro: ${message}`)
        }
    }

    useEffect(() => {
        fecthSalas();
    }, [])

    const abrirDialogAdicionar = () => {
        setSalaSelecionada(null)
        setDialogAberto(true)
    }

    const abrirDialogEditar = (id: number) => {
        const sala = salas.find((s) => s.id === id)
        if (sala) {
            setSalaSelecionada(sala)
            setDialogAberto(true)
        }
    }

    const salvarSala = async (sala: Sala) => {
        const endpoint = sala.id ? `/salas/${sala.id}` : '/salas'
        const method = sala.id ? 'put' : 'post'

        try {
            const response = await api[method](endpoint, { ...sala })

            if (response.status === 204 || response.status === 201) {
                alert(`Sala/Local ${sala.id ? 'alterado' : 'salvo'} com sucesso!`)
                setDialogAberto(false)
                fecthSalas()
            }
        } catch (error: any) {
            const message = error.response ? error.response.data.message : `Erro inesperado ao ${sala.id ? 'alterar' : 'salvar'} a sala.`
            alert(`Erro: ${message}`)
            setDialogAberto(true)
        }
    }

    const handleDesativar = async (sala: Sala) => {
        if (!sala.id) return;
        if (!confirm(`Tem certeza que deseja desativar a sala/local "${sala.nome}"?`)) return;

        try {
            await api.put(`/salas/${sala.id}`, { status: false });
            alert('Sala/Local desativado com sucesso!');
            fecthSalas();
        } catch (error: any) {
            const message = error.response ? error.response.data.message : 'Erro inesperado ao desativar a sala.'
            alert(`Erro: ${message}`)
        }
    }

    const handleReativar = async (sala: Sala) => {
        if (!sala.id) return;

        try {
            await api.put(`/salas/${sala.id}`, { status: true });
            alert('Sala/Local reativado com sucesso!');
            await fecthSalas();
        } catch (error: any) {
            const message = error.response ? error.response.data.message : 'Erro inesperado ao reativar a sala.'
            alert(`Erro: ${message}`)
        }
    }

    return (
        <div className="flex h-screen bg-white">
            <div className="flex-1 overflow-auto p-6">
                <h1 className="text-2xl font-bold mb-6">Gerenciar Salas e Locais</h1>
                <div className="border-b pb-4 mb-6" />

                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Lista de Salas/Locais Ativos</h2>
                    <Button onClick={abrirDialogAdicionar} variant="default" className="bg-black text-white hover:bg-gray-800">
                        Adicionar Sala/Local
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
                                <TableHead>Capacidade</TableHead>
                                <TableHead>Local</TableHead>
                                <TableHead className="w-[100px]">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {salasAtivasFiltradas.map((sala) => (
                                <TableRow key={sala.id}>
                                    <TableCell>{sala.nome}</TableCell>
                                    <TableCell>{sala.capacidade}</TableCell>
                                    <TableCell>{sala.local}</TableCell>
                                    <TableCell className="flex space-x-2">
                                        <Button variant="ghost" size="icon" onClick={() => abrirDialogEditar(sala.id!)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                                <path d="m15 5 4 4" />
                                            </svg>
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => handleDesativar(sala)}>
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
            
            <SalaDialog
                open={dialogAberto}
                onClose={() => setDialogAberto(false)}
                onSave={salvarSala}
                sala={salaSelecionada}
            />

            <SalaInativaDialog
                open={dialogInativosAberto}
                onClose={() => setDialogInativosAberto(false)}
                onReactivate={handleReativar}
                salas={salasInativas}
            />
        </div>
    )
}