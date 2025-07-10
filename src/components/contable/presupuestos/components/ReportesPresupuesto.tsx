import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const ReportesPresupuesto: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Reportes Disponibles</CardTitle>
          <CardDescription>
            Genere reportes detallados de ejecución presupuestal
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start">
            Reporte de Ejecución Presupuestal
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Análisis de Variaciones
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Proyección de Gastos
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Comparativo Períodos
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Dashboard Ejecutivo
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Configuración de Reportes</CardTitle>
          <CardDescription>
            Personalice los parámetros de sus reportes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start">
            Configurar Períodos de Comparación
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Definir Centros de Costo
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Establecer Alertas de Variación
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Configurar Aprobaciones
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Exportar Configuración
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};