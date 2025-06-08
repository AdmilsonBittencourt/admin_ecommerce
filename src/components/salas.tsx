"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import api from "@/api/api"
import { SalaDialog } from "./sala-dialog"

export interface Sala {
    id?: number,
    nome: string,
    capacidade: number | null,
    local: string,
    status: boolean
}

export default function Salas() {
  const [dialogAberto, setDialogAberto] = useState(false)
  const [salaSelecionado, setSalaSelecionado] = useState<Sala | null>(null)
  const [salas, setSalas] = useState<Sala[]>([])
  const [termoBusca, setTermoBusca] = useState("")
  const [mostrarInativos, setMostrarInativos] = useState(false)

  const salasFiltrados = salas
  .filter((prof) =>
    prof.nome.toLowerCase().includes(termoBusca.toLowerCase()) &&
    prof.status === !mostrarInativos
  )

  const fecthSalas = async () => {
    try {
        const response = await api.get('/salas');
        setSalas(response.data);
    } catch(error: any) {
        if (error.response) {
            alert(`Erro: ${error.response.data.message}`)
        } else {
            alert('Erro inesperado ')
        }
    }
  }

  useEffect(() => {
    fecthSalas();
  }, [])

  const abrirDialogAdicionar = () => {
    setSalaSelecionado(null)
    setDialogAberto(true)
  }
  
  const abrirDialogEditar = (id: number) => {
    const sala = salas.find((p) => p.id === id)
    if (sala) {
      setSalaSelecionado(sala)
      setDialogAberto(true)
    }
  }
  
  const salvarSala = async (prof: Sala) => {
    if (prof.id) {
      try {
        const response = await api.put(`/salas/${prof.id}`, { ...prof })
  
        if (response.status === 204) {
          alert('Sala foi alterada')
          setDialogAberto(false)
          fecthSalas() 
        }
      } catch (error: any) {
        if (error.response) {
          alert(`Erro: ${error.response.data.message}`)
        } else {
          alert('Erro inesperado ao alterar a sala.')
        }
        setDialogAberto(true)
      }
    } else {
      try {
        const response = await api.post('/salas', { ...prof })
  
        if (response.status === 201) {
          alert('Sala salvo')
          setDialogAberto(false)
          fecthSalas() 
        }
      } catch (error: any) {
        if (error.response) {
          alert(`Erro: ${error.response.data.message}`)
        } else {
          alert('Erro inesperado ao salvar sala.')
        }
        setDialogAberto(true)
      }
    }
  }

  const handleExcluir = async (prof: Sala) => {
    await api.put(`/salas/${prof.id}`, {
      status: !prof.status
    });
    fecthSalas() 
  }

  return (
    <div className="flex h-screen bg-white">
    
      <div className="flex-1 overflow-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Gerenciar Locais</h1>
        <div className="border-b pb-4 mb-6" />

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Lista de Locais</h2>
          <Button onClick={abrirDialogAdicionar} variant="default" className="bg-black text-white hover:bg-gray-800">
            Adicionar Local
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
                <TableHead>Capacidade</TableHead>
                <TableHead>Local</TableHead>
                <TableHead className="w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {salasFiltrados.map((prof) => (
                <TableRow key={prof.id}>
                  <TableCell>{prof.nome}</TableCell>
                  <TableCell>{prof.capacidade}</TableCell>
                  <TableCell>{prof.local}</TableCell>
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
                      {prof.status ? (
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
      <SalaDialog
        open={dialogAberto}
        onClose={() => setDialogAberto(false)}
        onSave={salvarSala}
        sala={salaSelecionado}
      />
    </div>
    
  )
}
