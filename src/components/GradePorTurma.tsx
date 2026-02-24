import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DisciplinaCard } from "./DisciplinaCard";
import type { Fase, DisciplinaComContexto } from "@/types/horarios";
import { Badge } from "@/components/ui/badge";

interface GradePorTurmaProps {
  fases: Fase[];
  onSelectDisciplina: (d: DisciplinaComContexto) => void;
}

const TURMA_FILTERS = ["Todas", "T1", "T2"] as const;

export function GradePorTurma({ fases, onSelectDisciplina }: GradePorTurmaProps) {
  const [turma, setTurma] = useState<string>("Todas");

  const filtered = fases.filter((f) => {
    if (turma === "Todas") return true;
    return f.turma === null || f.turma === turma;
  });

  const grouped = filtered.reduce<Record<number, Fase[]>>((acc, f) => {
    (acc[f.fase] ||= []).push(f);
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {TURMA_FILTERS.map((t) => (
          <Button
            key={t}
            size="sm"
            variant={turma === t ? "default" : "secondary"}
            onClick={() => setTurma(t)}
            className="rounded-full"
          >
            {t}
          </Button>
        ))}
      </div>

      {Object.entries(grouped)
        .sort(([a], [b]) => Number(a) - Number(b))
        .map(([num, entries]) => (
          <div key={num}>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-sm font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Fase {num}
              </h3>
              {entries.some((e) => e.turma === null) && (
                <Badge variant="outline" className="text-[10px]">Turma única</Badge>
              )}
            </div>
            {entries.map((entry) => (
              <div key={`${num}-${entry.turma}`} className="mb-3">
                {entry.turma && (
                  <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
                    Turma {entry.turma}
                  </p>
                )}
                <div className="grid gap-2 sm:grid-cols-2">
                  {entry.disciplinas.map((d, i) => (
                    <DisciplinaCard
                      key={`${d.codigo}-${i}`}
                      disciplina={d}
                      onClick={() =>
                        onSelectDisciplina({ ...d, fase: entry.fase, turma: entry.turma })
                      }
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
    </div>
  );
}
