import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PresupuestoDialog } from './components/PresupuestoDialog';
import { PresupuestoMetrics } from './components/PresupuestoMetrics';
import { PresupuestosList } from './components/PresupuestosList';
import { EjecucionPresupuestal } from './components/EjecucionPresupuestal';
import { AnalisisVariaciones } from './components/AnalisisVariaciones';
import { ReportesPresupuesto } from './components/ReportesPresupuesto';
import { usePresupuestos } from './hooks/usePresupuestos';

const PresupuestosEmpresariales = () => {
  const [showDialog, setShowDialog] = useState(false);
  const { presupuestos, itemsPresupuesto } = usePresupuestos();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Presupuestos Empresariales</h2>
          <p className="text-muted-foreground">
            Gestión y control de presupuestos por departamentos y proyectos
          </p>
        </div>
        <PresupuestoDialog open={showDialog} onOpenChange={setShowDialog} />
      </div>

      <PresupuestoMetrics />

      <Tabs defaultValue="lista-presupuestos" className="space-y-4">
        <TabsList>
          <TabsTrigger value="lista-presupuestos">Lista de Presupuestos</TabsTrigger>
          <TabsTrigger value="ejecucion-presupuestal">Ejecución Presupuestal</TabsTrigger>
          <TabsTrigger value="variaciones">Análisis de Variaciones</TabsTrigger>
          <TabsTrigger value="reportes">Reportes</TabsTrigger>
        </TabsList>

        <TabsContent value="lista-presupuestos">
          <PresupuestosList presupuestos={presupuestos} />
        </TabsContent>

        <TabsContent value="ejecucion-presupuestal">
          <EjecucionPresupuestal itemsPresupuesto={itemsPresupuesto} />
        </TabsContent>

        <TabsContent value="variaciones">
          <AnalisisVariaciones itemsPresupuesto={itemsPresupuesto} />
        </TabsContent>

        <TabsContent value="reportes">
          <ReportesPresupuesto />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PresupuestosEmpresariales;