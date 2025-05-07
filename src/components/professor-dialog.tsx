"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { useEffect } from "react"

interface Professor {
  id?: number
  nome: string
  email: string
  telefone: string
  departamento: string
  ativo: boolean
}

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
      setValue("email", professor.email)
      setValue("telefone", professor.telefone)
      setValue("departamento", professor.departamento)
      setValue("ativo", professor.ativo)
    } else {
      reset({ nome: "", email: "", telefone: "", departamento: "", ativo: true })
    }
  }, [professor, setValue, reset])

  const onSubmit = (data: Professor) => {
    const telefoneSomenteNumeros = data.telefone.replace(/\D/g, "")
    if (!/^\d+$/.test(telefoneSomenteNumeros)) {
      alert("O telefone deve conter apenas números.")
      return
    }

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
              placeholder="Email"
              {...register("email", {
                required: "Email é obrigatório",
                pattern: {
                  value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                  message: "Email inválido"
                }
              })}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>

          <div>
            <Input
                placeholder="Telefone"
              {...register("telefone", { required: "Telefone é obrigatório" })}
            />
            {errors.telefone && <p className="text-red-500 text-sm">{errors.telefone.message}</p>}
          </div>

          <div>
            <Input
              placeholder="Departamento"
              {...register("departamento", { required: "Departamento é obrigatório" })}
            />
            {errors.departamento && <p className="text-red-500 text-sm">{errors.departamento.message}</p>}
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
