import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PresupuestoItem } from '../types';

interface AnalisisVariacionesProps {
  itemsPresupuesto: PresupuestoItem[];
}

export const AnalisisVariaciones: React.FC<AnalisisVariacionesProps> = ({ itemsPresupuesto }) => {
  const variacionesFavorables = itemsPresupuesto.filter(item => item.variacion < 0);
  const variacionesDesfavorables = itemsPresupuesto.filter(item => item.variacion > 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Variaciones Favorables</CardTitle>
          <CardDescription>
            Conceptos con menor gasto al presupuestado
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {variacionesFavorables.length === 0 ? (
            <p className="text-muted-foreground text-center">No hay variaciones favorables</p>
          ) : (
            variacionesFavorables.map((item) => (
              <div key={item.id} className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <div>
                  <div className="font-medium">{item.concepto}</div>
                  <div className="text-sm text-muted-foreground">{item.categoria}</div>
                </div>
                <div className="text-green-600 font-bold">-Bs. {Math.abs(item.variacion).toLocaleString()}</div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Variaciones Desfavorables</CardTitle>
          <CardDescription>
            Conceptos que exceden el presupuesto
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {variacionesDesfavorables.length === 0 ? (
            <p className="text-muted-foreground text-center">No hay variaciones desfavorables</p>
          ) : (
            variacionesDesfavorables.map((item) => (
              <div key={item.id} className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                <div>
                  <div className="font-medium">{item.concepto}</div>
                  <div className="text-sm text-muted-foreground">{item.categoria}</div>
                </div>
                <div className="text-red-600 font-bold">+Bs. {item.variacion.toLocaleString()}</div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};