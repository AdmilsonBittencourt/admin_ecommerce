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
      setValue("cpf", professor.cpf)
      setValue("titulacao", professor.titulacao)
      setValue("status", professor.status)
    } else {
      reset({ nome: "", cpf: undefined, titulacao: "", status: true })
    }
  }, [professor, setValue, reset])

  const onSubmit = (data: Professor) => {
   
    console.log({ ...professor, ...data });
    onSave({ ...professor, ...data })
    onClose()
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
              {...register("cpf", {
                required: "CPF é obrigatório",
                // pattern: {
                //   // value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                //   // message: "cpf inválido"
                // }
              })}
            />
            {errors.cpf && <p className="text-red-500 text-sm">{errors.cpf.message}</p>}
          </div>

          <div>
            <Input
                placeholder="Titulação"
              {...register("titulacao", { required: "Telefone é obrigatório" })}
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
