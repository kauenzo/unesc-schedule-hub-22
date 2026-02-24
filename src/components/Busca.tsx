import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DisciplinaCard } from "./DisciplinaCard";
import type { Fase, DisciplinaComContexto } from "@/types/horarios";
import { Search, X, SearchX, CalendarCheck } from "lucide-react";

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

const TCC_ALIASES = ["tcc", "trabalho de conclusão", "trabalho de conclusao"];
const TCC_MATERIAS = [
  "projeto em computação",
  "projeto inovador i",
  "projeto inovador ii",
  "projeto inovador 1",
  "projeto inovador 2",
  "tcc ii",
  "tcc iii",
];

const DIA_SEMANA_MAP: Record<number, string> = {
  0: "", // Domingo
  1: "Segunda",
  2: "Terça",
  3: "Quarta",
  4: "Quinta",
  5: "Sexta",
  6: "Sábado",
};

function getHojeDiaSemana(): string {
  return DIA_SEMANA_MAP[new Date().getDay()] ?? "";
}

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

  const hoje = getHojeDiaSemana();

  const results = useMemo(() => {
    if (!hasFilters) return [];
    const q = query.toLowerCase().trim();
    const isTccSearch = TCC_ALIASES.some((alias) => q.includes(alias));

    return allDisciplinas.filter((d) => {
      if (q.length >= 2) {
        const searchable = [d.nome, d.professor, d.sala, d.laboratorio, d.dia_semana]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        const matchesQuery = searchable.includes(q);
        const matchesTcc = isTccSearch && TCC_MATERIAS.some((m) => d.nome.toLowerCase().includes(m));
        if (!matchesQuery && !matchesTcc) return false;
      }
      if (dias.length > 0 && !dias.includes(d.dia_semana)) return false;
      if (modalidade && d.modalidade !== modalidade) return false;
      if (complemento && d.complemento !== complemento) return false;
      return true;
    });
  }, [allDisciplinas, query, dias, modalidade, complemento, hasFilters]);

  // Separate today's classes and sort them first
  const sortedResults = useMemo(() => {
    if (!hoje) return results;
    const hojeResults = results.filter((d) => d.dia_semana === hoje);
    const otherResults = results.filter((d) => d.dia_semana !== hoje);
    return [...hojeResults, ...otherResults];
  }, [results, hoje]);

  const hojeCount = useMemo(
    () => results.filter((d) => d.dia_semana === hoje).length,
    [results, hoje]
  );

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

      {sortedResults.length > 0 && (
        <div className="space-y-2">
          {hojeCount > 0 && (
            <div className="flex items-center gap-1.5 mb-1">
              <CalendarCheck className="w-3.5 h-3.5 text-accent" />
              <span className="text-xs font-semibold text-accent">Aulas hoje</span>
            </div>
          )}
          <div className="grid gap-2 sm:grid-cols-2">
            {sortedResults.map((d, i) => {
              const isHoje = d.dia_semana === hoje;
              const isFirstNonHoje = !isHoje && i > 0 && sortedResults[i - 1]?.dia_semana === hoje;
              return (
                <div key={`${d.codigo}-${d.fase}-${d.turma}-${i}`} className={isFirstNonHoje ? "col-span-full h-0" : undefined}>
                  {isFirstNonHoje ? (
                    <div className="border-t border-border my-2" />
                  ) : null}
                  {!isFirstNonHoje && (
                    <div className={isHoje ? "ring-2 ring-accent/40 rounded-xl" : ""}>
                      <DisciplinaCard
                        disciplina={d}
                        onClick={() => onSelectDisciplina(d)}
                        searchQuery={query}
                        isHoje={isHoje}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}