import { useState, useCallback, useEffect } from "react";
import type { DisciplinaComContexto } from "@/types/horarios";

const STORAGE_KEY = "minhas-aulas";
const FIRST_SAVE_KEY = "minhas-aulas-first-save";

function getAulaId(d: DisciplinaComContexto): string {
  return `${d.codigo || d.nome}-${d.fase}-${d.turma || "null"}-${d.dia_semana}`;
}

function loadFromStorage(): DisciplinaComContexto[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function useMinhasAulas() {
  const [minhasAulas, setMinhasAulas] = useState<DisciplinaComContexto[]>(loadFromStorage);
  const [isFirstSave, setIsFirstSave] = useState(() => !localStorage.getItem(FIRST_SAVE_KEY));

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(minhasAulas));
  }, [minhasAulas]);

  const isAulaSalva = useCallback(
    (d: DisciplinaComContexto) => {
      const id = getAulaId(d);
      return minhasAulas.some((a) => getAulaId(a) === id);
    },
    [minhasAulas]
  );

  const addAula = useCallback(
    (d: DisciplinaComContexto) => {
      const id = getAulaId(d);
      setMinhasAulas((prev) => {
        if (prev.some((a) => getAulaId(a) === id)) return prev;
        return [...prev, d];
      });
      if (isFirstSave) {
        localStorage.setItem(FIRST_SAVE_KEY, "true");
        setIsFirstSave(false);
        return true; // signals first save for toast
      }
      return false;
    },
    [isFirstSave]
  );

  const removeAula = useCallback((d: DisciplinaComContexto) => {
    const id = getAulaId(d);
    setMinhasAulas((prev) => prev.filter((a) => getAulaId(a) !== id));
  }, []);

  const toggleAula = useCallback(
    (d: DisciplinaComContexto) => {
      if (isAulaSalva(d)) {
        removeAula(d);
        return { added: false, firstSave: false };
      } else {
        const firstSave = addAula(d);
        return { added: true, firstSave };
      }
    },
    [isAulaSalva, addAula, removeAula]
  );

  return { minhasAulas, addAula, removeAula, isAulaSalva, toggleAula };
}
