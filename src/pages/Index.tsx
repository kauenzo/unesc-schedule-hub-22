import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GradeCompleta } from "@/components/GradeCompleta";
import { GradePorFase } from "@/components/GradePorFase";
import { Busca } from "@/components/Busca";
import { MinhasAulas } from "@/components/MinhasAulas";
import { DisciplinaDetail } from "@/components/DisciplinaDetail";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useMinhasAulas } from "@/hooks/useMinhasAulas";
import { useToast } from "@/hooks/use-toast";
import horariosData from "@/data/horarios.json";
import type { HorariosData, DisciplinaComContexto } from "@/types/horarios";
import { GraduationCap, LayoutGrid, Layers, Search, Bookmark, AlertTriangle } from "lucide-react";

const data = horariosData as HorariosData;

const Index = () => {
  const [selected, setSelected] = useState<DisciplinaComContexto | null>(null);
  const { minhasAulas, isAulaSalva, toggleAula } = useMinhasAulas();
  const { toast } = useToast();

  const handleToggle = (d: DisciplinaComContexto) => {
    const result = toggleAula(d);
    if (result.added && result.firstSave) {
      toast({
        title: "Aula adicionada!",
        description: "Seus dados são salvos apenas neste navegador. Se trocar de dispositivo, será necessário adicioná-los novamente.",
      });
    } else if (result.added) {
      toast({ title: "Aula adicionada às suas aulas" });
    } else {
      toast({ title: "Aula removida das suas aulas" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/80 border-b">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-tight">Horários e Salas</h1>
              <p className="text-xs text-muted-foreground">Ciência da Computação · UNESC · 2026/1</p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-4 py-4 pb-20">
        <Alert className="mb-4 border-destructive/40 bg-destructive/10">
          <AlertTriangle className="w-4 h-4 text-destructive" />
          <AlertDescription className="text-xs text-destructive font-medium">
            As informações exibidas podem estar desatualizadas. Consulte a secretaria para confirmar.
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="grade" className="space-y-4">
          <TabsList className="w-full grid grid-cols-4 rounded-full h-11 bg-secondary/50">
            <TabsTrigger value="grade" className="rounded-full gap-1 text-[11px] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Grade</span>
            </TabsTrigger>
            <TabsTrigger value="fase" className="rounded-full gap-1 text-[11px] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Por</span> Fase
            </TabsTrigger>
            <TabsTrigger value="busca" className="rounded-full gap-1 text-[11px] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Search className="w-3.5 h-3.5" />
              Busca
            </TabsTrigger>
            <TabsTrigger value="minhas" className="rounded-full gap-1 text-[11px] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Bookmark className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Minhas</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="grade">
            <GradeCompleta fases={data.fases} onSelectDisciplina={setSelected} />
          </TabsContent>
          <TabsContent value="fase">
            <GradePorFase fases={data.fases} onSelectDisciplina={setSelected} />
          </TabsContent>
          <TabsContent value="busca">
            <Busca fases={data.fases} onSelectDisciplina={setSelected} />
          </TabsContent>
          <TabsContent value="minhas">
            <MinhasAulas aulas={minhasAulas} onSelectDisciplina={setSelected} />
          </TabsContent>
        </Tabs>
      </main>

      <DisciplinaDetail
        disciplina={selected}
        open={selected !== null}
        onClose={() => setSelected(null)}
        isSalva={selected ? isAulaSalva(selected) : false}
        onToggle={handleToggle}
      />
    </div>
  );
};

export default Index;
