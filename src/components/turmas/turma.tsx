// /components/turmas/turma.tsx (ou o nome do seu arquivo principal)

"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import api from "@/api/api"
import type { Professor } from "../professores/professores" // Ajuste o caminho se necessário
import { TurmaDialog } from "./turma-dialog"
import type { Sala } from "../salas/salas" // Ajuste o caminho se necessário
import type { Disciplina } from "../disciplinas/disciplinas" // Ajuste o caminho se necessário
import { TurmaInativaDialog } from "./turma-inativa-dialog"

export interface Turma {
    id?: number;
    nome: string;
    horarioInicio: string;
    horarioTermino: string;
    diaSemana: string;
    professor: Professor | null;
    sala: Sala | null;
    disciplina: Disciplina | null;
    status: boolean;
}

export interface TurmaDto {
    id?: number;
    nome: string;
    horarioInicio: string;
    horarioTermino: string;
    diaSemana: string;
    idProfessor: number | null;
    idSala: number | null;
    idDisciplina: number | null;
    status: boolean;
}

export default function Turmas() {
    const [dialogAberto, setDialogAberto] = useState(false)
    const [dialogInativosAberto, setDialogInativosAberto] = useState(false) // Estado para o novo diálogo
    const [turmaSelecionada, setTurmaSelecionada] = useState<TurmaDto | null>(null)
    const [turmas, setTurmas] = useState<Turma[]>([])
    const [termoBusca, setTermoBusca] = useState("")

    const turmasAtivasFiltradas = turmas.filter((turma) =>
        turma.status &&
        turma.nome.toLowerCase().includes(termoBusca.toLowerCase())
    )
    
    const turmasInativas = turmas.filter((turma) => !turma.status)

    const fecthTurmas = async () => {
        try {
            const response = await api.get('/turmas');
            setTurmas(response.data);
        } catch (error: any) {
            const message = error.response ? error.response.data.message : 'Erro inesperado ao buscar as turmas.'
            alert(`Erro: ${message}`)
        }
    }

    useEffect(() => {
        fecthTurmas();
    }, [])

    const abrirDialogAdicionar = () => {
        setTurmaSelecionada(null)
        setDialogAberto(true)
    }

    const abrirDialogEditar = (id: number) => {
        const turma = turmas.find((t) => t.id === id)
        if (turma) {
            setTurmaSelecionada({
                id: turma.id,
                nome: turma.nome,
                horarioInicio: turma.horarioInicio,
                horarioTermino: turma.horarioTermino,
                diaSemana: turma.diaSemana,
                status: turma.status,
                idDisciplina: turma.disciplina?.id ?? null,
                idProfessor: turma.professor?.id ?? null,
                idSala: turma.sala?.id ?? null
            })
            setDialogAberto(true)
        }
    }

    const salvarTurma = async (turma: TurmaDto) => {
        const endpoint = turma.id ? `/turmas/${turma.id}` : '/turmas'
        const method = turma.id ? 'put' : 'post'
        
        try {
            const response = await api[method](endpoint, { ...turma })

            if (response.status === 204 || response.status === 201) {
                alert(`Turma ${turma.id ? 'alterada' : 'salva'} com sucesso!`)
                setDialogAberto(false)
                fecthTurmas()
            }
        } catch (error: any) {
            const message = error.response ? error.response.data.message : `Erro inesperado ao ${turma.id ? 'alterar' : 'salvar'} a turma.`
            alert(`Erro: ${message}`)
            setDialogAberto(true)
        }
    }

    const handleDesativar = async (turma: Turma) => {
        if (!turma.id) return;
        if (!confirm(`Tem certeza que deseja desativar a turma "${turma.nome}"?`)) return;

        try {
            await api.put(`/turmas/${turma.id}`, { status: false });
            alert('Turma desativada com sucesso!');
            fecthTurmas();
        } catch (error: any) {
            const message = error.response ? error.response.data.message : 'Erro inesperado ao desativar a turma.'
            alert(`Erro: ${message}`)
        }
    }
    
    const handleReativar = async (turma: Turma) => {
        if (!turma.id) return;
        
        try {
            await api.put(`/turmas/${turma.id}`, { status: true });
            alert('Turma reativada com sucesso!');
            await fecthTurmas();
        } catch (error: any) {
            const message = error.response ? error.response.data.message : 'Erro inesperado ao reativar a turma.'
            alert(`Erro: ${message}`)
        }
    }

    return (
        <div className="flex h-screen bg-white">
            <div className="flex-1 overflow-auto p-6">
                <h1 className="text-2xl font-bold mb-6">Gerenciar Turmas</h1>
                <div className="border-b pb-4 mb-6" />

                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Lista de Turmas Ativas</h2>
                    <Button onClick={abrirDialogAdicionar} variant="default" className="bg-black text-white hover:bg-gray-800">
                        Adicionar Turma
                    </Button>
                </div>

                <div className="mb-6 flex items-center space-x-4">
                    <Input
                        placeholder="Buscar por nome da turma..."
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
                                <TableHead>Disciplina</TableHead>
                                <TableHead>Professor</TableHead>
                                <TableHead>Dia</TableHead>
                                <TableHead>Horário</TableHead>
                                <TableHead>Sala</TableHead>
                                <TableHead className="w-[100px]">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {turmasAtivasFiltradas.map((turma) => (
                                <TableRow key={turma.id}>
                                    <TableCell>{turma.nome}</TableCell>
                                    <TableCell>{turma.disciplina?.nome ?? 'N/A'}</TableCell>
                                    <TableCell>{turma.professor?.nome ?? 'N/A'}</TableCell>
                                    <TableCell>{turma.diaSemana}</TableCell>
                                    <TableCell>{`${turma.horarioInicio} - ${turma.horarioTermino}`}</TableCell>
                                    <TableCell>{turma.sala?.nome ?? 'N/A'}</TableCell>
                                    <TableCell className="flex space-x-2">
                                        <Button variant="ghost" size="icon" onClick={() => abrirDialogEditar(turma.id!)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                                <path d="m15 5 4 4" />
                                            </svg>
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => handleDesativar(turma)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M3 6h18" />
                                                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                            </svg>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
            
            <TurmaDialog
                open={dialogAberto}
                onClose={() => setDialogAberto(false)}
                onSave={salvarTurma}
                turma={turmaSelecionada}
            />
            
            <TurmaInativaDialog 
                open={dialogInativosAberto}
                onClose={() => setDialogInativosAberto(false)}
                onReactivate={handleReativar}
                turmas={turmasInativas}
            />
        </div>
    )
}