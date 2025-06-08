// /components/disciplinas/disciplina-dialog.tsx

"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { useEffect } from "react"
import type { Disciplina } from "./disciplinas"

interface Props {
    open: boolean
    onClose: () => void
    onSave: (disciplina: Disciplina) => void
    disciplina: Disciplina | null
}

export function DisciplinaDialog({ open, onClose, onSave, disciplina }: Props) {
    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors }
    } = useForm<Disciplina>()

    useEffect(() => {
        if (disciplina) {
            setValue("nome", disciplina.nome)
            setValue("codigo", disciplina.codigo)
            setValue("periodo", disciplina.periodo)
            setValue("status", disciplina.status)
        } else {
            reset({ nome: "", codigo: "", periodo: null, status: true })
        }
    }, [disciplina, setValue, reset])

    const onSubmit = (data: Disciplina) => {
        // Assegura que o período seja enviado como número ou nulo
        const dataToSave = {
            ...disciplina,
            ...data,
            periodo: data.periodo ? Number(data.periodo) : null
        };
        onSave(dataToSave)
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    {/* Título corrigido para "Disciplina" */}
                    <DialogTitle>{disciplina ? "Editar Disciplina" : "Adicionar Disciplina"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
                    <div>
                        <Input
                            placeholder="Nome"
                            {...register("nome", { required: "Nome é obrigatório" })}
                        />
                        {errors.nome && <p className="text-red-500 text-sm">{errors.nome.message}</p>}
                    </div>

                    <div>
                        <Input
                            placeholder="Código"
                            {...register("codigo", { required: "Código é obrigatório" })}
                        />
                        {errors.codigo && <p className="text-red-500 text-sm">{errors.codigo.message}</p>}
                    </div>

                    <div>
                        <Input
                            placeholder="Período"
                            type="number"
                            {...register("periodo", { 
                                required: "Período é obrigatório",
                                valueAsNumber: true 
                            })}
                        />
                        {errors.periodo && <p className="text-red-500 text-sm">{errors.periodo.message}</p>}
                    </div>

                    <div className="flex justify-end space-x-2 pt-4">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button type="submit">Salvar</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}