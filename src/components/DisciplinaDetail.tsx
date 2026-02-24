import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";
import type { DisciplinaComContexto } from "@/types/horarios";
import { MapPin, User, Calendar, BookOpen, Hash, Monitor, Wifi, FlaskConical, MessageSquare } from "lucide-react";

interface DisciplinaDetailProps {
  disciplina: DisciplinaComContexto | null;
  open: boolean;
  onClose: () => void;
}

function DetailRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 py-2">
      <Icon className="w-4 h-4 mt-0.5 text-muted-foreground shrink-0" />
      <div>
        <p className="text-[11px] text-muted-foreground uppercase tracking-wider">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}

export function DisciplinaDetail({ disciplina, open, onClose }: DisciplinaDetailProps) {
  if (!disciplina) return null;
  const isDistancia = disciplina.modalidade === "a_distancia";

  return (
    <Drawer open={open} onOpenChange={(o) => !o && onClose()}>
      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader className="text-left pb-2">
          <DrawerTitle className="text-lg leading-tight">{disciplina.nome}</DrawerTitle>
          <DrawerDescription className="flex gap-1.5 mt-1.5 flex-wrap">
            <Badge variant="secondary">Fase {disciplina.fase}</Badge>
            {disciplina.turma && <Badge variant="secondary">{disciplina.turma}</Badge>}
            {isDistancia && (
              <Badge className="bg-accent/15 text-accent border-accent/30" variant="outline">
                <Wifi className="w-3 h-3 mr-1" />À Distância
              </Badge>
            )}
            {!isDistancia && (
              <Badge className="bg-primary/15 text-primary border-primary/30" variant="outline">
                <Monitor className="w-3 h-3 mr-1" />Presencial
              </Badge>
            )}
            {disciplina.complemento && <Badge variant="outline">{disciplina.complemento}</Badge>}
          </DrawerDescription>
        </DrawerHeader>

        <div className="px-4 pb-6 divide-y divide-border">
          <div className="space-y-0">
            <DetailRow icon={Hash} label="Código" value={disciplina.codigo} />
            <DetailRow icon={Calendar} label="Dia da Semana" value={disciplina.dia_semana} />
            <DetailRow icon={User} label="Professor" value={disciplina.professor} />
            <DetailRow icon={MapPin} label="Sala" value={disciplina.sala} />
            <DetailRow icon={FlaskConical} label="Laboratório" value={disciplina.laboratorio} />
            <DetailRow icon={MessageSquare} label="Observação" value={disciplina.observacao} />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
