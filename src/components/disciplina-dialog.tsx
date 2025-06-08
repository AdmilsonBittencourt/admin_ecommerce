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
  onSave: (professor: Disciplina) => void
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

    onSave({ ...disciplina, ...data })
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{disciplina ? "Editar Professor" : "Adicionar Professor"}</DialogTitle>
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
              placeholder="Codigo"
              {...register("codigo", {
                required: "Codigo é obrigatório"
              })}
            />
            {errors.codigo && <p className="text-red-500 text-sm">{errors.codigo.message}</p>}
          </div>

          <div>
            <Input
                placeholder="Periodo"
              {...register("periodo", { required: "Periodo é obrigatório" })}
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
