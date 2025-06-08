// /components/turmas/turma-dialog.tsx

"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { useEffect, useState } from "react"
import type { TurmaDto } from "./turma"
import type { Professor } from "../professores/professores" // Ajuste o caminho
import api from "@/api/api"
import type { Sala } from "../salas/salas" // Ajuste o caminho
import type { Disciplina } from "../disciplinas/disciplinas" // Ajuste o caminho

interface Props {
    open: boolean
    onClose: () => void
    onSave: (turma: TurmaDto) => void
    turma: TurmaDto | null
}

const DIAS_SEMANA = ["SEGUNDA", "TERCA", "QUARTA", "QUINTA", "SEXTA", "SABADO"];

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
    
    useEffect(() => {
        // Busca os dados para os selects apenas quando o diálogo abrir
        if (open) {
            const fetchData = async () => {
                try {
                    const [disciplinasRes, salasRes, professoresRes] = await Promise.all([
                        api.get('/disciplinas'),
                        api.get('/salas'),
                        api.get('/professores')
                    ]);
                    setDisciplinas(disciplinasRes.data);
                    setSalas(salasRes.data);
                    setProfessores(professoresRes.data);
                } catch (error) {
                    alert('Erro ao carregar dados para o formulário. Tente novamente.')
                }
            };
            fetchData();
        }
    }, [open]);

    useEffect(() => {
        if (turma) {
            setValue("nome", turma.nome)
            setValue("horarioInicio", turma.horarioInicio)
            setValue("horarioTermino", turma.horarioTermino)
            setValue("diaSemana", turma.diaSemana)
            setValue("idProfessor", turma.idProfessor)
            setValue("idSala", turma.idSala)
            setValue("idDisciplina", turma.idDisciplina)
            setValue("status", turma.status)
        } else {
            reset({ nome: "", horarioInicio: "", horarioTermino: "", diaSemana: "", idProfessor: null, idSala: null, idDisciplina: null, status: true })
        }
    }, [turma, reset, setValue])

    const onSubmit = (data: TurmaDto) => {
        // Garante que os IDs sejam números
        const dataToSave = {
            ...turma,
            ...data,
            idDisciplina: Number(data.idDisciplina),
            idProfessor: Number(data.idProfessor),
            idSala: Number(data.idSala)
        }
        onSave(dataToSave)
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>{turma ? "Editar Turma" : "Adicionar Turma"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4 py-4">
                    <div className="col-span-2">
                        <label htmlFor="nome" className="block text-sm font-medium">Nome da Turma</label>
                        <Input id="nome" placeholder="Ex: TADS2025-1" {...register("nome", { required: "Nome é obrigatório" })} />
                        {errors.nome && <p className="text-red-500 text-sm">{errors.nome.message}</p>}
                    </div>

                    <div>
                        <label htmlFor="horarioInicio" className="block text-sm font-medium">Horário de Início</label>
                        <Input id="horarioInicio" type="time" {...register("horarioInicio", { required: "Horário de início é obrigatório" })} />
                        {errors.horarioInicio && <p className="text-red-500 text-sm">{errors.horarioInicio.message}</p>}
                    </div>

                    <div>
                        <label htmlFor="horarioTermino" className="block text-sm font-medium">Horário de Término</label>
                        <Input id="horarioTermino" type="time" {...register("horarioTermino", { required: "Horário de término é obrigatório" })} />
                        {errors.horarioTermino && <p className="text-red-500 text-sm">{errors.horarioTermino.message}</p>}
                    </div>
                    
                    <div className="col-span-2">
                        <label htmlFor="diaSemana" className="block text-sm font-medium">Dia da Semana</label>
                        <select id="diaSemana" {...register("diaSemana", { required: "Dia da semana é obrigatório" })} className="w-full p-2 border border-gray-300 rounded">
                            <option value="" disabled>Selecione um dia</option>
                            {DIAS_SEMANA.map(dia => (<option key={dia} value={dia}>{dia}</option>))}
                        </select>
                        {errors.diaSemana && <p className="text-red-500 text-sm">{errors.diaSemana.message}</p>}
                    </div>

                    <div className="col-span-2">
                        <label htmlFor="idDisciplina" className="block text-sm font-medium">Disciplina</label>
                        <select id="idDisciplina" {...register("idDisciplina", { required: "Disciplina é obrigatória" })} className="w-full border rounded p-2">
                            <option value="">Selecione uma disciplina</option>
                            {disciplinas.filter(d => d.status).map(d => (<option key={d.id} value={d.id}>{d.nome}</option>))}
                        </select>
                        {errors.idDisciplina && <p className="text-red-500 text-sm">{errors.idDisciplina.message}</p>}
                    </div>

                    <div className="col-span-2">
                        <label htmlFor="idProfessor" className="block text-sm font-medium">Professor</label>
                        <select id="idProfessor" {...register("idProfessor", { required: "Professor é obrigatório" })} className="w-full border rounded p-2">
                            <option value="">Selecione um professor</option>
                            {professores.filter(p => p.status).map(p => (<option key={p.id} value={p.id}>{p.nome}</option>))}
                        </select>
                        {errors.idProfessor && <p className="text-red-500 text-sm">{errors.idProfessor.message}</p>}
                    </div>

                    <div className="col-span-2">
                        <label htmlFor="idSala" className="block text-sm font-medium">Sala</label>
                        <select id="idSala" {...register("idSala", { required: "Sala é obrigatória" })} className="w-full border rounded p-2">
                            <option value="">Selecione uma sala</option>
                            {salas.filter(s => s.status).map(s => (<option key={s.id} value={s.id}>{s.nome} (Cap: {s.capacidade})</option>))}
                        </select>
                        {errors.idSala && <p className="text-red-500 text-sm">{errors.idSala.message}</p>}
                    </div>

                    <div className="col-span-2 flex justify-end space-x-2 pt-4">
                        <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
                        <Button type="submit">Salvar</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}