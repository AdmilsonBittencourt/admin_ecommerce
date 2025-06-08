// /components/salas/sala-dialog.tsx

"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { useEffect } from "react"
import type { Sala } from "./salas"

interface Props {
    open: boolean
    onClose: () => void
    // Corrigido o nome do parâmetro de 'professor' para 'sala'
    onSave: (sala: Sala) => void
    sala: Sala | null
}

export function SalaDialog({ open, onClose, onSave, sala }: Props) {
    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors }
    } = useForm<Sala>()

    useEffect(() => {
        if (sala) {
            setValue("nome", sala.nome)
            setValue("capacidade", sala.capacidade)
            setValue("local", sala.local)
            setValue("status", sala.status)
        } else {
            reset({ nome: "", capacidade: null, local: "", status: true })
        }
    }, [sala, setValue, reset])

    const onSubmit = (data: Sala) => {
        // Assegura que a capacidade seja enviada como número ou nulo
        const dataToSave = {
            ...sala,
            ...data,
            capacidade: data.capacidade ? Number(data.capacidade) : null
        };
        onSave(dataToSave)
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    {/* Corrigido o título do diálogo */}
                    <DialogTitle>{sala ? "Editar Sala/Local" : "Adicionar Sala/Local"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
                    <div>
                        <Input
                            placeholder="Nome (Ex: Sala 101, Laboratório de Informática)"
                            {...register("nome", { required: "Nome é obrigatório" })}
                        />
                        {errors.nome && <p className="text-red-500 text-sm">{errors.nome.message}</p>}
                    </div>

                    <div>
                        <Input
                            type="number"
                            placeholder="Capacidade"
                            {...register("capacidade", {
                                required: "Capacidade é obrigatória",
                                valueAsNumber: true
                            })}
                        />
                        {errors.capacidade && <p className="text-red-500 text-sm">{errors.capacidade.message}</p>}
                    </div>

                    <div>
                        <Input
                            placeholder="Local (Ex: Bloco A, Prédio Principal)"
                            // Corrigida a mensagem de erro
                            {...register("local", { required: "Local é obrigatório" })}
                        />
                        {errors.local && <p className="text-red-500 text-sm">{errors.local.message}</p>}
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