// /components/turmas/turma-inativa-dialog.tsx

"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Turma } from "./turma"

interface Props {
    open: boolean
    onClose: () => void
    onReactivate: (turma: Turma) => void
    turmas: Turma[]
}

export function TurmaInativaDialog({ open, onClose, onReactivate, turmas }: Props) {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl">
                <DialogHeader>
                    <DialogTitle>Turmas Inativas</DialogTitle>
                </DialogHeader>
                <div className="mt-4">
                    {turmas.length > 0 ? (
                        <div className="border rounded-md max-h-[400px] overflow-y-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nome</TableHead>
                                        <TableHead>Disciplina</TableHead>
                                        <TableHead>Professor</TableHead>
                                        <TableHead>Dia</TableHead>
                                        <TableHead className="w-[120px]">Ação</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {turmas.map((turma) => (
                                        <TableRow key={turma.id}>
                                            <TableCell>{turma.nome}</TableCell>
                                            <TableCell>{turma.disciplina?.nome ?? 'N/A'}</TableCell>
                                            <TableCell>{turma.professor?.nome ?? 'N/A'}</TableCell>
                                            <TableCell>{turma.diaSemana}</TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => onReactivate(turma)}
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
                        <p className="text-center text-gray-500 py-8">Não há turmas inativas.</p>
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