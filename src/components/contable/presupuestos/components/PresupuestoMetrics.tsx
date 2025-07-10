import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PresupuestoMetricsProps {
  metricas: {
    totalPresupuestado: number;
    totalEjecutado: number;
    variacionTotal: number;
    presupuestosActivos: number;
    porcentajeEjecucion: number;
  };
}

export const PresupuestoMetrics: React.FC<PresupuestoMetricsProps> = ({ metricas }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Presupuestado</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">
            Bs. {metricas.totalPresupuestado.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">Presupuesto actual</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Ejecutado</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            Bs. {metricas.totalEjecutado.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">
            {metricas.porcentajeEjecucion.toFixed(1)}% ejecutado
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Variación Total</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${
            metricas.variacionTotal > 0 ? 'text-red-600' : 
            metricas.variacionTotal < 0 ? 'text-green-600' : 'text-gray-600'
          }`}>
            Bs. {Math.abs(metricas.variacionTotal).toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">
            {metricas.variacionTotal > 0 ? 'Sobre presupuesto' : 
             metricas.variacionTotal < 0 ? 'Bajo presupuesto' : 'En presupuesto'}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Presupuestos Activos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">
            {metricas.presupuestosActivos}
          </div>
          <p className="text-xs text-muted-foreground">En ejecución</p>
        </CardContent>
      </Card>
    </div>
  );
};