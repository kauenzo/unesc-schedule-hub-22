import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { DisciplinaComContexto, Disciplina } from "@/types/horarios";
import { MapPin, Monitor, User, Calendar, Wifi, AlertTriangle } from "lucide-react";

interface DisciplinaCardProps {
  disciplina: Disciplina | DisciplinaComContexto;
  fase?: number;
  turma?: string | null;
  onClick?: () => void;
  searchQuery?: string;
  isHoje?: boolean;
}

function highlightText(text: string, query: string) {
  if (!query || query.length < 2) return text;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark key={i} className="bg-accent/30 text-accent-foreground rounded px-0.5">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

export function DisciplinaCard({ disciplina, fase, turma, onClick, searchQuery, isHoje }: DisciplinaCardProps) {
  const contextFase = "fase" in disciplina ? (disciplina as DisciplinaComContexto).fase : fase;
  const contextTurma = "turma" in disciplina ? (disciplina as DisciplinaComContexto).turma : turma;
  const isDistancia = disciplina.modalidade === "a_distancia";
  const local = disciplina.laboratorio || disciplina.sala || "Sala não informada";
  const GRADE_ANTERIOR_CODIGOS = ["23245", "23279", "10889", "23280", "10894"];
  const isGradeAtual = !GRADE_ANTERIOR_CODIGOS.includes(disciplina.codigo);

  return (
    <Card
      className="p-4 cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all duration-200 hover:shadow-lg hover:shadow-primary/10 group"
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="font-semibold text-sm leading-tight group-hover:text-primary transition-colors">
          {searchQuery ? highlightText(disciplina.nome, searchQuery) : disciplina.nome}
        </h4>
        <div className="flex gap-1 shrink-0">
          {isHoje && (
            <Badge className="text-[10px] px-1.5 py-0 bg-accent/15 text-accent border-accent/30" variant="outline">
              Hoje
            </Badge>
          )}
          {isDistancia && (
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-accent/15 text-accent border-accent/30">
              <Wifi className="w-3 h-3 mr-0.5" />
              EaD
            </Badge>
          )}
          {disciplina.complemento && (
            <Badge variant="outline" className="text-[10px] px-1.5 py-0">
              {disciplina.complemento}
            </Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Calendar className="w-3 h-3 shrink-0" />
          <span>{disciplina.dia_semana}</span>
        </div>
        <div className="flex items-center gap-1">
          <MapPin className="w-3 h-3 shrink-0" />
          <span className="truncate">{searchQuery ? highlightText(local, searchQuery) : local}</span>
        </div>
        {disciplina.professor && (
          <div className="flex items-center gap-1 col-span-2">
            <User className="w-3 h-3 shrink-0" />
            <span className="truncate">
              {searchQuery ? highlightText(disciplina.professor, searchQuery) : disciplina.professor}
            </span>
          </div>
        )}
      </div>

      {(contextFase || contextTurma) && (
        <div className="mt-2 pt-2 border-t flex gap-1.5 flex-wrap">
          {contextFase && !isGradeAtual && (
            <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-destructive/50 bg-destructive/10 text-destructive">
              <AlertTriangle className="w-3 h-3 mr-0.5" />
              Fase {contextFase} — grade anterior
            </Badge>
          )}
          {contextFase && isGradeAtual && (
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
              Fase {contextFase}
            </Badge>
          )}
          {contextTurma && (
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
              {contextTurma}
            </Badge>
          )}
        </div>
      )}
    </Card>
  );
}
