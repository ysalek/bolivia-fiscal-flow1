import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const PresupuestoMetrics: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Presupuestado</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">Bs. 0</div>
          <p className="text-xs text-muted-foreground">Presupuesto actual</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Ejecutado</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">Bs. 0</div>
          <p className="text-xs text-muted-foreground">0% ejecutado</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Variación Total</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">Bs. 0</div>
          <p className="text-xs text-muted-foreground">Pendiente de ejecutar</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Presupuestos Activos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">0</div>
          <p className="text-xs text-muted-foreground">En ejecución</p>
        </CardContent>
      </Card>
    </div>
  );
};