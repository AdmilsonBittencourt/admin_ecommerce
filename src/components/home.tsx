import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "./sidebar";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { useState } from "react";
import api from "@/api/api";


interface EntidadeItem {
  id: number
  nome: string
}

export default function Home() {

    const [entidade, setEntidade] = useState("turmas")
    const [termoBusca, setTermoBusca] = useState("")
    const [resultados, setResultados] = useState<EntidadeItem[]>([])
    const [buscando, setBuscando] = useState(false)

    const handleBuscar = async () => {
        setBuscando(true)
        try {
        const response = await api.get(`/${entidade}?nome=${termoBusca}`)
        setResultados(response.data)
        } catch (error) {
        alert("Erro ao buscar dados")
        } finally {
        setBuscando(false)
        }
    }

    const location = useLocation();
    const isHomeRoute = location.pathname === '/home';

    return (
        <div className="flex h-screen">
            <Sidebar />
            <div className="flex-1 overflow-auto p-6">
                {isHomeRoute && <div>
                    <h1 className="text-2xl font-bold mb-6">Buscar Dados</h1>

                    <div className="flex flex-wrap items-end gap-4 mb-6">
                        <div className="flex flex-col">
                        <label className="text-sm font-medium mb-1">Entidade</label>
                        <select
                            className="border rounded-md px-3 py-2"
                            value={entidade}
                            onChange={(e) => setEntidade(e.target.value)}
                        >
                            <option value="turmas">Turmas</option>
                            <option value="disciplinas">Disciplinas</option>
                            <option value="Professores">Professores</option>
                            <option value="Locais">Locais</option>
                        </select>
                        </div>

                        <div className="flex flex-col">
                        <label className="text-sm font-medium mb-1">Nome</label>
                        <Input
                            value={termoBusca}
                            onChange={(e) => setTermoBusca(e.target.value)}
                            placeholder="Digite o nome para buscar"
                        />
                        </div>

                        <Button onClick={handleBuscar} className="mt-5 bg-black text-white hover:bg-gray-800">
                        {buscando ? "Buscando..." : "Buscar"}
                        </Button>
                    </div>

                    <div className="border rounded-md">
                        <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Nome</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {resultados.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={2} className="text-center text-gray-500">
                                Nenhum resultado encontrado
                                </TableCell>
                            </TableRow>
                            ) : (
                            resultados.map((item) => (
                                <TableRow key={item.id}>
                                <TableCell>{item.id}</TableCell>
                                <TableCell>{item.nome}</TableCell>
                                </TableRow>
                            ))
                            )}
                        </TableBody>
                        </Table>
                    </div>
                </div>}
                <Outlet />
            </div>
        </div>
    );
}