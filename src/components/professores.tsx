"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Sidebar } from "@/components/sidebar"
import api from "@/api/api"
import { ProfessorDialog } from "./professor-dialog"

interface Professor {
    id?: number;
    nome: string,
    email: string,
    telefone: string,
    departamento: string,
    ativo: boolean,
}

export default function Professores() {
  const [dialogAberto, setDialogAberto] = useState(false)
  const [professorSelecionado, setProfessorSelecionado] = useState<Professor | null>(null)
  const [professores, setProfessores] = useState<Professor[]>([])
  const [termoBusca, setTermoBusca] = useState("")
  const [mostrarInativos, setMostrarInativos] = useState(false)

  const professoresFiltrados = professores
  .filter((prof) =>
    prof.nome.toLowerCase().includes(termoBusca.toLowerCase()) &&
    prof.ativo === !mostrarInativos
  )

  const fecthProfessores = async  () => {
    const response = await api.get('/professores');
    if(response) {
      setProfessores(response.data);
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
    if (prof.id) {
      try {
        const response = await api.put(`/professores/${prof.id}`, { ...prof })
  
        if (response.status === 204) {
          alert('Professor foi alterado')
          setDialogAberto(false)
          fecthProfessores() 
        }
      } catch (error: any) {
        if (error.response) {
          alert(`Erro: ${error.response.data.message}`)
        } else {
          alert('Erro inesperado ao alterar o professor.')
        }
        setDialogAberto(true)
      }
    } else {
      try {
        const response = await api.post('/professores', { ...prof })
  
        if (response.status === 201) {
          alert('Professor salvo')
          setDialogAberto(false)
          fecthProfessores() 
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

  const handleExcluir = async (prof: Professor) => {
    await api.put(`/professores/${prof.id}`, {
      ativo: !prof.ativo
    });
    fecthProfessores() 
  }

  return (
    <div className="flex h-screen bg-white">
      <Sidebar />
      <div className="flex-1 overflow-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Gerenciar Professores</h1>
        <div className="border-b pb-4 mb-6" />

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Lista de Professores</h2>
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
            onClick={() => setMostrarInativos((prev) => !prev)}
          >
            {mostrarInativos ? "Mostrar Ativos" : "Mostrar Inativos"}
          </Button>
        </div>

        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Departamento</TableHead>
                <TableHead className="w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {professoresFiltrados.map((prof) => (
                <TableRow key={prof.id}>
                  <TableCell>{prof.nome}</TableCell>
                  <TableCell>{prof.email}</TableCell>
                  <TableCell>{prof.telefone}</TableCell>
                  <TableCell>{prof.departamento}</TableCell>
                  <TableCell className="flex space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => abrirDialogEditar(prof.id!)}>
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
                    <Button variant="ghost" size="icon" onClick={() => handleExcluir(prof)}>
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
    </div>
    
  )
}
