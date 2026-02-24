import { DisciplinaCard } from "./DisciplinaCard";
import type { DisciplinaComContexto } from "@/types/horarios";
import { BookmarkX, Sparkles, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

interface MinhasAulasProps {
  aulas: DisciplinaComContexto[];
  onSelectDisciplina: (d: DisciplinaComContexto) => void;
}

const DIAS_ORDEM = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

const DIA_MAP: Record<string, number> = {
  Segunda: 1,
  "Terça": 2,
  Quarta: 3,
  Quinta: 4,
  Sexta: 5,
  "Sábado": 6,
};

function getProximoDia(aulas: DisciplinaComContexto[]): string | null {
  if (aulas.length === 0) return null;
  const hoje = new Date().getDay(); // 0=Dom, 1=Seg...6=Sab
  const diasComAula = [...new Set(aulas.map((a) => DIA_MAP[a.dia_semana]).filter(Boolean))];
  if (diasComAula.length === 0) return null;

  // Find the next day with classes (today or later, wrapping around)
  diasComAula.sort((a, b) => a - b);
  const proximoNum = diasComAula.find((d) => d >= hoje) ?? diasComAula[0];
  return Object.entries(DIA_MAP).find(([, v]) => v === proximoNum)?.[0] ?? null;
}

export function MinhasAulas({ aulas, onSelectDisciplina }: MinhasAulasProps) {
  if (aulas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <BookmarkX className="w-12 h-12 text-muted-foreground/40 mb-4" />
        <h3 className="font-semibold text-lg mb-1">Nenhuma aula salva</h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          Navegue pelas disciplinas e toque em "Adicionar às minhas aulas" para montar sua grade personalizada.
        </p>
      </div>
    );
  }

  const proximoDia = getProximoDia(aulas);

  const grouped = DIAS_ORDEM.reduce<Record<string, DisciplinaComContexto[]>>((acc, dia) => {
    const doDia = aulas.filter((a) => a.dia_semana === dia);
    if (doDia.length > 0) acc[dia] = doDia;
    return acc;
  }, {});

  // Keep natural day order (don't reorder)
  const sortedDias = Object.keys(grouped).sort((a, b) =>
    DIAS_ORDEM.indexOf(a) - DIAS_ORDEM.indexOf(b)
  );

  return (
    <div className="space-y-4">
      <Alert className="border-accent/40 bg-accent/10">
        <Info className="w-4 h-4 text-accent" />
        <AlertDescription className="text-xs text-accent font-medium">
          Suas aulas são salvas apenas neste navegador. Se trocar de dispositivo ou limpar os dados, será necessário adicioná-las novamente.
        </AlertDescription>
      </Alert>

      {sortedDias.map((dia) => {
        const isProximo = dia === proximoDia;
        return (
          <div key={dia}>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-sm font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {dia}
              </h3>
              {isProximo && (
                <Badge className="bg-primary/15 text-primary border-primary/30 text-[10px]" variant="outline">
                  <Sparkles className="w-3 h-3 mr-1" />Próximas aulas
                </Badge>
              )}
            </div>
            <div className={`grid gap-2 sm:grid-cols-2 ${isProximo ? "ring-2 ring-accent/50 rounded-xl p-2.5 -m-2.5 bg-accent/5" : ""}`}>
              {grouped[dia].map((d, i) => (
                <DisciplinaCard
                  key={`${d.codigo}-${d.fase}-${d.turma}-${i}`}
                  disciplina={d}
                  fase={d.fase}
                  turma={d.turma}
                  onClick={() => onSelectDisciplina(d)}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
