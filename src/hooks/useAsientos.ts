
import { AsientoContable } from "@/components/contable/diary/DiaryData";

export const useAsientos = () => {
  const getAsientos = (): AsientoContable[] => {
    const data = localStorage.getItem('asientosContables');
    return data ? JSON.parse(data) : [];
  };

  return { getAsientos };
};
