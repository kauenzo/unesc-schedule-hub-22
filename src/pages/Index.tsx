import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GradeCompleta } from "@/components/GradeCompleta";
import { GradePorTurma } from "@/components/GradePorTurma";
import { Busca } from "@/components/Busca";
import { DisciplinaDetail } from "@/components/DisciplinaDetail";
import horariosData from "@/data/horarios.json";
import type { HorariosData, DisciplinaComContexto } from "@/types/horarios";
import { GraduationCap, LayoutGrid, Users, Search } from "lucide-react";

const data = horariosData as HorariosData;

const Index = () => {
  const [selected, setSelected] = useState<DisciplinaComContexto | null>(null);

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
              <h1 className="text-lg font-bold leading-tight">CC 2026/1 — Horários</h1>
              <p className="text-xs text-muted-foreground">Ciência da Computação · UNESC</p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-4 py-4 pb-20">
        <Tabs defaultValue="grade" className="space-y-4">
          <TabsList className="w-full grid grid-cols-3 rounded-full h-11 bg-secondary/50">
            <TabsTrigger value="grade" className="rounded-full gap-1.5 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Grade</span> Completa
            </TabsTrigger>
            <TabsTrigger value="turma" className="rounded-full gap-1.5 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Users className="w-3.5 h-3.5" />
              Por Turma
            </TabsTrigger>
            <TabsTrigger value="busca" className="rounded-full gap-1.5 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Search className="w-3.5 h-3.5" />
              Busca
            </TabsTrigger>
          </TabsList>

          <TabsContent value="grade">
            <GradeCompleta fases={data.fases} onSelectDisciplina={setSelected} />
          </TabsContent>
          <TabsContent value="turma">
            <GradePorTurma fases={data.fases} onSelectDisciplina={setSelected} />
          </TabsContent>
          <TabsContent value="busca">
            <Busca fases={data.fases} onSelectDisciplina={setSelected} />
          </TabsContent>
        </Tabs>
      </main>

      <DisciplinaDetail
        disciplina={selected}
        open={selected !== null}
        onClose={() => setSelected(null)}
      />
    </div>
  );
};

export default Index;
