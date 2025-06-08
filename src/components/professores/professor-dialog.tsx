// /components/professores/professor-dialog.tsx

"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { useEffect } from "react"
import type { Professor } from "./professores"

interface Props {
    open: boolean
    onClose: () => void
    onSave: (professor: Professor) => void
    professor: Professor | null
}

export function ProfessorDialog({ open, onClose, onSave, professor }: Props) {
    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors }
    } = useForm<Professor>()

    useEffect(() => {
        if (professor) {
            setValue("nome", professor.nome)
            // Ajustado para o campo aninhado "cpf.value"
            setValue("cpf.value", professor.cpf.value)
            setValue("titulacao", professor.titulacao)
            setValue("status", professor.status)
        } else {
            // Corrigido para resetar o CPF como um objeto com valor vazio
            reset({ nome: "", cpf: { value: "" }, titulacao: "", status: true })
        }
    }, [professor, setValue, reset])

    const onSubmit = (data: Professor) => {
        // Os dados já vêm no formato correto devido ao registro 'cpf.value'
        onSave({ ...professor, ...data })
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{professor ? "Editar Professor" : "Adicionar Professor"}</DialogTitle>
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
                            placeholder="CPF"
                            // Ajustado para registrar o valor dentro do objeto CPF
                            {...register("cpf.value", {
                                required: "CPF é obrigatório",
                            })}
                        />
                        {/* Ajustado para acessar o erro aninhado */}
                        {errors.cpf?.value && <p className="text-red-500 text-sm">{errors.cpf.value.message}</p>}
                    </div>

                    <div>
                        <Input
                            placeholder="Titulação"
                            // Corrigida a mensagem de erro
                            {...register("titulacao", { required: "Titulação é obrigatória" })}
                        />
                        {errors.titulacao && <p className="text-red-500 text-sm">{errors.titulacao.message}</p>}
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