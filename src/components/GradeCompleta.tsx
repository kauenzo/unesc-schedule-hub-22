import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { DisciplinaCard } from "./DisciplinaCard";
import type { Fase, DisciplinaComContexto } from "@/types/horarios";

interface GradeCompletaProps {
  fases: Fase[];
  onSelectDisciplina: (d: DisciplinaComContexto) => void;
}

export function GradeCompleta({ fases, onSelectDisciplina }: GradeCompletaProps) {
  // Group by fase number
  const grouped = fases.reduce<Record<number, Fase[]>>((acc, f) => {
    (acc[f.fase] ||= []).push(f);
    return acc;
  }, {});

  return (
    <Accordion type="multiple" defaultValue={["1"]} className="space-y-2">
      {Object.entries(grouped)
        .sort(([a], [b]) => Number(a) - Number(b))
        .map(([num, entries]) => (
          <AccordionItem key={num} value={num} className="border rounded-xl overflow-hidden bg-card">
            <AccordionTrigger className="px-4 py-3 hover:no-underline">
              <div className="flex items-center gap-2">
                <span className="text-base font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Fase {num}
                </span>
                <Badge variant="secondary" className="text-[10px]">
                  {(() => {
                    const uniqueCodigos = new Set(
                      entries.flatMap(e =>
                        e.disciplinas.map(d => d.codigo ?? `${d.nome}-${d.complemento ?? ""}`)
                      )
                    )

                    return uniqueCodigos.size
                  })()} disciplinas
                </Badge>
                {entries.length > 1 && (
                  <Badge variant="outline" className="text-[10px]">
                    {entries.map((e) => e.turma).join(" · ")}
                  </Badge>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              {entries.map((entry) => (
                <div key={`${num}-${entry.turma}`} className="mb-3 last:mb-0">
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
            </AccordionContent>
          </AccordionItem>
        ))}
    </Accordion>
  );
}
