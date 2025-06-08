"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { useEffect, useState } from "react"
import type { TurmaDto } from "./turma"
import type { Professor } from "./professores"
import api from "@/api/api"
import type { Sala } from "./salas"
import type { Disciplina } from "./disciplinas"


interface Props {
  open: boolean
  onClose: () => void
  onSave: (turma: TurmaDto) => void
  turma: TurmaDto | null
}

export function TurmaDialog({ open, onClose, onSave, turma }: Props) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors }
  } = useForm<TurmaDto>()

  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([])
  const [salas, setSalas] = useState<Sala[]>([])
  const [professores, setProfessores] = useState<Professor[]>([])

  const fecthDisciplinas = async () => {
    try {
        const response = await api.get('/disciplinas');
        setDisciplinas(response.data);
    }catch(error: any){
        if (error.response) {
            alert(`Erro: ${error.response.data.message}`)
        } else {
            alert('Erro inesperado ao alterar a turma.')
        }
    }
  }

  const fecthSalas = async () => {
    try {
        const response = await api.get('/salas');
        setSalas(response.data);
    }catch(error: any){
        if (error.response) {
            alert(`Erro: ${error.response.data.message}`)
        } else {
            alert('Erro inesperado ao alterar a turma.')
        }
    }
  }

  const fecthProfessores = async () => {
    try {
        const response = await api.get('/professores');
        setProfessores(response.data);
    }catch(error: any){
        if (error.response) {
            alert(`Erro: ${error.response.data.message}`)
        } else {
            alert('Erro inesperado ao alterar a turma.')
        }
    }
  }

  useEffect(() => {
    fecthDisciplinas()
    fecthProfessores()
    fecthSalas()

    if (turma) {
      setValue("nome", turma.nome)
      setValue("horarioInicio", turma.horarioInicio)
      setValue("horarioTermino", turma.horarioTermino)
      setValue("diaSemana", turma.diaSemana)
      setValue("idProfessor", turma.idProfessor)
      setValue("idSala", turma.idSala)
      setValue("idDisciplina", turma.idDisciplina)
    } else {
      reset({ nome: "", horarioInicio: "", horarioTermino: "", diaSemana: "", idProfessor: null, idSala: null, idDisciplina: null })
    }
  }, [turma, setValue, reset])

  const onSubmit = (data: TurmaDto) => {

    onSave({ ...turma, ...data })
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{turma ? "Editar turma" : "Adicionar turma"}</DialogTitle>
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
              placeholder="Horario de Inicio"
              {...register("horarioInicio", {
                required: "horario de Inicio é obrigatório"
              })}
            />
            {errors.horarioInicio && <p className="text-red-500 text-sm">{errors.horarioInicio.message}</p>}
          </div>

          <div>
            <Input
              placeholder="Horario de Termino"
              {...register("horarioTermino", {
                required: "horario de Termino é obrigatório"
              })}
            />
            {errors.horarioTermino && <p className="text-red-500 text-sm">{errors.horarioTermino.message}</p>}
          </div>

          <div>
            <select
                {...register("diaSemana", { required: "Dia é obrigatório" })}
                className="w-full p-2 border border-gray-300 rounded"
                defaultValue=""
            >
                <option value="" disabled>
                Selecione o dia
                </option>
                {Array.from({ length: 10 }, (_, i) => (
                <option key={i + 1} value={`${i + 1}`}>
                    {`${i + 1}`}
                </option>
                ))}
            </select>
            {errors.diaSemana && (
                <p className="text-red-500 text-sm">{errors.diaSemana.message}</p>
            )}
           </div>

          <div>
            <select {...register("idDisciplina", { required: "Disciplina é obrigatória" })} className="w-full border rounded p-2">
              <option value="">Selecione uma disciplina</option>
              {disciplinas.filter(d => d.status === true).map(d => (
                <option key={d.id} value={d.id}>
                  {d.nome}
                </option>
              ))}
            </select>
            {errors.idDisciplina && <p className="text-red-500 text-sm">{errors.idDisciplina.message}</p>}
          </div>

          <div>
            <select {...register("idSala", { required: "Sala é obrigatória" })} className="w-full border rounded p-2">
              <option value="">Selecione uma sala</option>
              {salas.filter(d => d.status === true).map(s => (
                <option key={s.id} value={s.id}>
                  {s.nome}
                </option>
              ))}
            </select>
            {errors.idSala && <p className="text-red-500 text-sm">{errors.idSala.message}</p>}
          </div>

          <div>
            <select {...register("idProfessor", { required: "Professor é obrigatório" })} className="w-full border rounded p-2">
              <option value="">Selecione um professor</option>
              {professores.filter(d => d.status === true).map(p => (
                <option key={p.id} value={p.id}>
                  {p.nome}
                </option>
              ))}
            </select>
            {errors.idProfessor && <p className="text-red-500 text-sm">{errors.idProfessor.message}</p>}
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
