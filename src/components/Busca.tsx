import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DisciplinaCard } from "./DisciplinaCard";
import type { Fase, DisciplinaComContexto } from "@/types/horarios";
import { Search, X, SearchX } from "lucide-react";

interface BuscaProps {
  fases: Fase[];
  onSelectDisciplina: (d: DisciplinaComContexto) => void;
}

const DIAS = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
const MODALIDADES = [
  { value: "presencial", label: "Presencial" },
  { value: "a_distancia", label: "À Distância" },
];
const COMPLEMENTOS = ["NCC", "NCA", "NCI"];

export function Busca({ fases, onSelectDisciplina }: BuscaProps) {
  const [query, setQuery] = useState("");
  const [dias, setDias] = useState<string[]>([]);
  const [modalidade, setModalidade] = useState<string | null>(null);
  const [complemento, setComplemento] = useState<string | null>(null);

  const allDisciplinas: DisciplinaComContexto[] = useMemo(
    () => fases.flatMap((f) => f.disciplinas.map((d) => ({ ...d, fase: f.fase, turma: f.turma }))),
    [fases]
  );

  const hasFilters = query.length > 0 || dias.length > 0 || modalidade !== null || complemento !== null;

  const results = useMemo(() => {
    if (!hasFilters) return [];
    const q = query.toLowerCase();
    return allDisciplinas.filter((d) => {
      if (q.length >= 2) {
        const searchable = [d.nome, d.professor, d.sala, d.laboratorio, d.dia_semana]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!searchable.includes(q)) return false;
      }
      if (dias.length > 0 && !dias.includes(d.dia_semana)) return false;
      if (modalidade && d.modalidade !== modalidade) return false;
      if (complemento && d.complemento !== complemento) return false;
      return true;
    });
  }, [allDisciplinas, query, dias, modalidade, complemento, hasFilters]);

  const toggleDia = (dia: string) =>
    setDias((prev) => (prev.includes(dia) ? prev.filter((d) => d !== dia) : [...prev, dia]));

  const clearFilters = () => {
    setQuery("");
    setDias([]);
    setModalidade(null);
    setComplemento(null);
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar disciplina, professor, sala..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9 rounded-full bg-secondary/50"
        />
      </div>

      {/* Dia da semana */}
      <div>
        <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1.5 font-medium">Dia da Semana</p>
        <div className="flex flex-wrap gap-1.5">
          {DIAS.map((d) => (
            <Button
              key={d}
              size="sm"
              variant={dias.includes(d) ? "default" : "secondary"}
              onClick={() => toggleDia(d)}
              className="rounded-full text-xs h-7 px-3"
            >
              {d.slice(0, 3)}
            </Button>
          ))}
        </div>
      </div>

      {/* Modalidade */}
      <div>
        <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1.5 font-medium">Modalidade</p>
        <div className="flex gap-1.5">
          {MODALIDADES.map((m) => (
            <Button
              key={m.value}
              size="sm"
              variant={modalidade === m.value ? "default" : "secondary"}
              onClick={() => setModalidade(modalidade === m.value ? null : m.value)}
              className="rounded-full text-xs h-7 px-3"
            >
              {m.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Complemento */}
      <div>
        <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1.5 font-medium">Complemento</p>
        <div className="flex gap-1.5">
          {COMPLEMENTOS.map((c) => (
            <Button
              key={c}
              size="sm"
              variant={complemento === c ? "default" : "secondary"}
              onClick={() => setComplemento(complemento === c ? null : c)}
              className="rounded-full text-xs h-7 px-3"
            >
              {c}
            </Button>
          ))}
        </div>
      </div>

      {hasFilters && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{results.length}</span> disciplina{results.length !== 1 ? "s" : ""} encontrada{results.length !== 1 ? "s" : ""}
          </p>
          <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs h-7 gap-1">
            <X className="w-3 h-3" /> Limpar filtros
          </Button>
        </div>
      )}

      {hasFilters && results.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <SearchX className="w-12 h-12 mb-3 opacity-40" />
          <p className="font-medium">Nenhuma disciplina encontrada</p>
          <p className="text-sm">Tente ajustar os filtros ou buscar outro termo</p>
        </div>
      )}

      {results.length > 0 && (
        <div className="grid gap-2 sm:grid-cols-2">
          {results.map((d, i) => (
            <DisciplinaCard
              key={`${d.codigo}-${d.fase}-${d.turma}-${i}`}
              disciplina={d}
              onClick={() => onSelectDisciplina(d)}
              searchQuery={query}
            />
          ))}
        </div>
      )}
    </div>
  );
}
