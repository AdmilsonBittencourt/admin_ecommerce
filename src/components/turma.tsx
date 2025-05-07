"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Sidebar } from "@/components/sidebar"
import api from "@/api/api"
import type { Professor } from "./professores"
import { TurmaDialog } from "./turma-dialog"
import type { Sala } from "./salas"
import type { Disciplina } from "./disciplinas"

export interface Turma {
    id?: number;
    codigo: string;
    horario: string;
    semestre: string;
    professor: Professor | null;
    sala: Sala | null;
    disciplina: Disciplina | null;
}

export interface TurmaDto {
    id?: number;
    codigo: string;
    horario: string;
    semestre: string;
    idProfessor: number | null;
    idSala: number | null;
    idDisciplina: number | null;
}

export default function Turmas() {
  const [dialogAberto, setDialogAberto] = useState(false)
  const [turmaSelecionado, setTurmaSelecionado] = useState<TurmaDto | null>(null)
  const [turmas, setTurmas] = useState<Turma[]>([])
  const [termoBusca, setTermoBusca] = useState("")

  const professoresFiltrados = turmas
  .filter((turma) => turma.codigo.toLowerCase().includes(termoBusca.toLowerCase()))

  const fecthTurmas = async  () => {
    const response = await api.get('/turmas');
    if(response) {
      setTurmas(response.data);
    }
  }

  useEffect(() => {
    fecthTurmas();
  }, [])

  const abrirDialogAdicionar = () => {
    setTurmaSelecionado(null)
    setDialogAberto(true)
  }
  
  const abrirDialogEditar = (id: number) => {
    const turma = turmas.find((p) => p.id === id)
    if (turma) {
        setTurmaSelecionado({
            codigo: turma.codigo,
            horario: turma.horario,
            semestre: turma.semestre,
            id: turma.id,
            idDisciplina: turma.disciplina?.id!,
            idProfessor: turma.professor?.id!,
            idSala: turma.sala?.id!            
        })
      setDialogAberto(true)
    }
  }
  
  const salvarTurma = async (turma: TurmaDto) => {
    if (turma.id) {
      try {
        const response = await api.put(`/turmas/${turma.id}`, { ...turma })
  
        if (response.status === 204) {
          alert('Turma foi alterado')
          setDialogAberto(false)
          fecthTurmas() 
        }
      } catch (error: any) {
        if (error.response) {
          alert(`Erro: ${error.response.data.message}`)
        } else {
          alert('Erro inesperado ao alterar a turma.')
        }
        setDialogAberto(true)
      }
    } else {
      try {
        const response = await api.post('/turmas', { ...turma })
  
        if (response.status === 201) {
          alert('Turma salva')
          setDialogAberto(false)
          fecthTurmas() 
        }
      } catch (error: any) {
        if (error.response) {
          alert(`Erro: ${error.response.data.message}`)
        } else {
          alert('Erro inesperado ao salvar professor.')
        }
        setDialogAberto(true)
      }
    }
  }

//   const handleExcluir = async (turma: Turma) => {
//     await api.put(`/turmas/${turma.id}`, {
//       ativo: !turma.ativo
//     });
//     fecthTurmas() 
//   }

  return (
    <div className="flex h-screen bg-white">
      <Sidebar />
      <div className="flex-1 overflow-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Gerenciar Turmas</h1>
        <div className="border-b pb-4 mb-6" />

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Lista de Turmas</h2>
          <Button onClick={abrirDialogAdicionar} variant="default" className="bg-black text-white hover:bg-gray-800">
            Adicionar Turma
          </Button>
        </div>

        <div className="mb-6 flex items-center space-x-4">
          <Input
            placeholder="Buscar por codigo..."
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
            className="max-w-md"
          />
          {/* <Button
            variant="outline"
            onClick={() => setMostrarInativos((prev) => !prev)}
          >
            {mostrarInativos ? "Mostrar Ativos" : "Mostrar Inativos"}
          </Button> */}
        </div>

        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Codigo</TableHead>
                <TableHead>Horario</TableHead>
                <TableHead>Semestre</TableHead>
                <TableHead>Professor</TableHead>
                <TableHead>Sala</TableHead>
                <TableHead>Disciplina</TableHead>
                <TableHead className="w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {professoresFiltrados.map((turma) => (
                <TableRow key={turma.id}>
                  <TableCell>{turma.codigo}</TableCell>
                  <TableCell>{turma.horario}</TableCell>
                  <TableCell>{turma.semestre}</TableCell>
                  <TableCell>{turma.professor!.nome}</TableCell>
                  <TableCell>{turma.sala!.nome}</TableCell>
                  <TableCell>{turma.disciplina!.nome}</TableCell>
                  <TableCell className="flex space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => abrirDialogEditar(turma.id!)}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                        <path d="m15 5 4 4" />
                      </svg>
                    </Button>
                    {/* <Button variant="ghost" size="icon" onClick={() => handleExcluir(prof)}>
                      {prof.ativo ? (
                        // Ícone de lixeira
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M3 6h18" />
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                          <line x1="10" x2="10" y1="11" y2="17" />
                          <line x1="14" x2="14" y1="11" y2="17" />
                        </svg>
                      ) : (
                        // Ícone de ativar (seta de restauração)
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="1 4 1 10 7 10" />
                          <path d="M3.51 15a9 9 0 1 0 .49-5.27L1 10" />
                        </svg>
                      )}
                    </Button> */}
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
        turma={turmaSelecionado}
      />
    </div>
    
  )
}
