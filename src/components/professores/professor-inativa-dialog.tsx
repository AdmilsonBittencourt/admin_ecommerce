// /components/professores/professor-inativo-dialog.tsx

"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Professor } from "./professores"

interface Props {
    open: boolean
    onClose: () => void
    onReactivate: (professor: Professor) => void
    professores: Professor[]
}

export function ProfessorInativoDialog({ open, onClose, onReactivate, professores }: Props) {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Professores Inativos</DialogTitle>
                </DialogHeader>
                <div className="mt-4">
                    {professores.length > 0 ? (
                        <div className="border rounded-md max-h-[400px] overflow-y-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nome</TableHead>
                                        <TableHead>CPF</TableHead>
                                        <TableHead>Titulação</TableHead>
                                        <TableHead className="w-[120px]">Ação</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {professores.map((prof) => (
                                        <TableRow key={prof.id}>
                                            <TableCell>{prof.nome}</TableCell>
                                            <TableCell>{prof.cpf.value}</TableCell>
                                            <TableCell>{prof.titulacao}</TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => onReactivate(prof)}
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
                        <p className="text-center text-gray-500 py-8">Não há professores inativos.</p>
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