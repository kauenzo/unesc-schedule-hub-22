export interface Disciplina {
  codigo: string | null;
  nome: string;
  complemento: string | null;
  professor: string | null;
  sala: string | null;
  laboratorio: string | null;
  modalidade: "presencial" | "a_distancia";
  dia_semana: string;
  observacao?: string;
}

export interface Fase {
  fase: number;
  turma: string | null;
  disciplinas: Disciplina[];
}

export interface HorariosData {
  curso: string;
  semestre: string;
  grade: number;
  fases: Fase[];
}

export interface DisciplinaComContexto extends Disciplina {
  fase: number;
  turma: string | null;
}
