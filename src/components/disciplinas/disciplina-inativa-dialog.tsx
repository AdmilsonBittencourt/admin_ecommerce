// /components/disciplinas/disciplina-inativa-dialog.tsx

"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Disciplina } from "./disciplinas"

interface Props {
    open: boolean
    onClose: () => void
    onReactivate: (disciplina: Disciplina) => void
    disciplinas: Disciplina[]
}

export function DisciplinaInativaDialog({ open, onClose, onReactivate, disciplinas }: Props) {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Disciplinas Inativas</DialogTitle>
                </DialogHeader>
                <div className="mt-4">
                    {disciplinas.length > 0 ? (
                        <div className="border rounded-md max-h-[400px] overflow-y-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nome</TableHead>
                                        <TableHead>Código</TableHead>
                                        <TableHead className="w-[120px]">Ação</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {disciplinas.map((disciplina) => (
                                        <TableRow key={disciplina.id}>
                                            <TableCell>{disciplina.nome}</TableCell>
                                            <TableCell>{disciplina.codigo}</TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => onReactivate(disciplina)}
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
                        <p className="text-center text-gray-500 py-8">Não há disciplinas inativas.</p>
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