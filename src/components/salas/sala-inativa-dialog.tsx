// /components/salas/sala-inativa-dialog.tsx

"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Sala } from "./salas"

interface Props {
    open: boolean
    onClose: () => void
    onReactivate: (sala: Sala) => void
    salas: Sala[]
}

export function SalaInativaDialog({ open, onClose, onReactivate, salas }: Props) {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Salas e Locais Inativos</DialogTitle>
                </DialogHeader>
                <div className="mt-4">
                    {salas.length > 0 ? (
                        <div className="border rounded-md max-h-[400px] overflow-y-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nome</TableHead>
                                        <TableHead>Capacidade</TableHead>
                                        <TableHead>Local</TableHead>
                                        <TableHead className="w-[120px]">Ação</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {salas.map((sala) => (
                                        <TableRow key={sala.id}>
                                            <TableCell>{sala.nome}</TableCell>
                                            <TableCell>{sala.capacidade}</TableCell>
                                            <TableCell>{sala.local}</TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => onReactivate(sala)}
                                                >
                                                    Reativar
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <p className="text-center text-gray-500 py-8">Não há salas ou locais inativos.</p>
                    )}
                </div>
                <DialogFooter className="mt-4">
                    <Button variant="outline" onClick={onClose}>
                        Fechar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}