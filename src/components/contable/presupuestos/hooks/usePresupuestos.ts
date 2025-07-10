import { useState, useCallback } from 'react';
import { Presupuesto, PresupuestoItem } from '../types';

export const usePresupuestos = () => {
  const [presupuestos, setPresupuestos] = useState<Presupuesto[]>(() => {
    const saved = localStorage.getItem('presupuestos');
    return saved ? JSON.parse(saved) : [];
  });

  const [itemsPresupuesto, setItemsPresupuesto] = useState<PresupuestoItem[]>(() => {
    const saved = localStorage.getItem('itemsPresupuesto');
    return saved ? JSON.parse(saved) : [];
  });

  const savePresupuestos = useCallback((data: Presupuesto[]) => {
    localStorage.setItem('presupuestos', JSON.stringify(data));
    setPresupuestos(data);
  }, []);

  const saveItemsPresupuesto = useCallback((data: PresupuestoItem[]) => {
    localStorage.setItem('itemsPresupuesto', JSON.stringify(data));
    setItemsPresupuesto(data);
  }, []);

  const crearPresupuesto = useCallback((presupuestoData: Omit<Presupuesto, 'id'>) => {
    const nuevoPresupuesto: Presupuesto = {
      ...presupuestoData,
      id: `PRES-${Date.now()}`,
      totalEjecutado: 0
    };
    
    const nuevosPresupuestos = [...presupuestos, nuevoPresupuesto];
    savePresupuestos(nuevosPresupuestos);
    return nuevoPresupuesto;
  }, [presupuestos, savePresupuestos]);

  const actualizarPresupuesto = useCallback((id: string, presupuestoData: Partial<Presupuesto>) => {
    const nuevosPresupuestos = presupuestos.map(p => 
      p.id === id ? { ...p, ...presupuestoData } : p
    );
    savePresupuestos(nuevosPresupuestos);
  }, [presupuestos, savePresupuestos]);

  const eliminarPresupuesto = useCallback((id: string) => {
    const nuevosPresupuestos = presupuestos.filter(p => p.id !== id);
    savePresupuestos(nuevosPresupuestos);
    
    // Eliminar items relacionados
    const nuevosItems = itemsPresupuesto.filter(item => !item.id.startsWith(id));
    saveItemsPresupuesto(nuevosItems);
  }, [presupuestos, itemsPresupuesto, savePresupuestos, saveItemsPresupuesto]);

  const crearItemPresupuesto = useCallback((presupuestoId: string, itemData: Omit<PresupuestoItem, 'id' | 'variacion' | 'porcentajeEjecucion'>) => {
    const nuevoItem: PresupuestoItem = {
      ...itemData,
      id: `${presupuestoId}-ITEM-${Date.now()}`,
      ejecutado: 0,
      variacion: -itemData.presupuestado,
      porcentajeEjecucion: 0
    };

    const nuevosItems = [...itemsPresupuesto, nuevoItem];
    saveItemsPresupuesto(nuevosItems);
    return nuevoItem;
  }, [itemsPresupuesto, saveItemsPresupuesto]);

  const actualizarItemPresupuesto = useCallback((id: string, itemData: Partial<PresupuestoItem>) => {
    const nuevosItems = itemsPresupuesto.map(item => {
      if (item.id === id) {
        const itemActualizado = { ...item, ...itemData };
        itemActualizado.variacion = itemActualizado.ejecutado - itemActualizado.presupuestado;
        itemActualizado.porcentajeEjecucion = itemActualizado.presupuestado > 0 
          ? (itemActualizado.ejecutado / itemActualizado.presupuestado) * 100 
          : 0;
        return itemActualizado;
      }
      return item;
    });
    saveItemsPresupuesto(nuevosItems);
  }, [itemsPresupuesto, saveItemsPresupuesto]);

  const eliminarItemPresupuesto = useCallback((id: string) => {
    const nuevosItems = itemsPresupuesto.filter(item => item.id !== id);
    saveItemsPresupuesto(nuevosItems);
  }, [itemsPresupuesto, saveItemsPresupuesto]);

  const obtenerItemsPorPresupuesto = useCallback((presupuestoId: string) => {
    return itemsPresupuesto.filter(item => item.id.startsWith(presupuestoId));
  }, [itemsPresupuesto]);

  const obtenerMetricas = useCallback(() => {
    const totalPresupuestado = presupuestos.reduce((sum, p) => sum + p.totalPresupuestado, 0);
    const totalEjecutado = presupuestos.reduce((sum, p) => sum + p.totalEjecutado, 0);
    const presupuestosActivos = presupuestos.filter(p => p.estado === 'en_ejecucion').length;
    const variacionTotal = totalEjecutado - totalPresupuestado;

    return {
      totalPresupuestado,
      totalEjecutado,
      variacionTotal,
      presupuestosActivos,
      porcentajeEjecucion: totalPresupuestado > 0 ? (totalEjecutado / totalPresupuestado) * 100 : 0
    };
  }, [presupuestos]);

  return {
    presupuestos,
    itemsPresupuesto,
    crearPresupuesto,
    actualizarPresupuesto,
    eliminarPresupuesto,
    crearItemPresupuesto,
    actualizarItemPresupuesto,
    eliminarItemPresupuesto,
    obtenerItemsPorPresupuesto,
    obtenerMetricas
  };
};