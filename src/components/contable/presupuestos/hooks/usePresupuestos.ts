import { useState } from 'react';
import { Presupuesto, PresupuestoItem } from '../types';

export const usePresupuestos = () => {
  const [presupuestos] = useState<Presupuesto[]>(() => {
    const saved = localStorage.getItem('presupuestos');
    return saved ? JSON.parse(saved) : [];
  });

  const [itemsPresupuesto] = useState<PresupuestoItem[]>(() => {
    const saved = localStorage.getItem('itemsPresupuesto');
    return saved ? JSON.parse(saved) : [];
  });

  return {
    presupuestos,
    itemsPresupuesto
  };
};