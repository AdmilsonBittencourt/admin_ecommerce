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
  onSave: (professor: Sala) => void
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
      setValue("tipo", sala.tipo)
      setValue("ativo", sala.ativo)
    } else {
      reset({ nome: "", capacidade: null, tipo: "", ativo: true })
    }
  }, [sala, setValue, reset])

  const onSubmit = (data: Sala) => {

    onSave({ ...sala, ...data })
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{sala ? "Editar Professor" : "Adicionar Professor"}</DialogTitle>
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
              placeholder="Capacidade"
              {...register("capacidade", {
                required: "Capacidade é obrigatório"
              })}
            />
            {errors.capacidade && <p className="text-red-500 text-sm">{errors.capacidade.message}</p>}
          </div>

          <div>
            <Input
                placeholder="Tipo"
              {...register("tipo", { required: "Tipo é obrigatório" })}
            />
            {errors.tipo && <p className="text-red-500 text-sm">{errors.tipo.message}</p>}
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
