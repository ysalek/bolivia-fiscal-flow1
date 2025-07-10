import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Edit, Eye } from 'lucide-react';
import { Presupuesto } from '../types';
import { getEstadoColor } from '../utils/presupuestoUtils';

interface PresupuestosListProps {
  presupuestos: Presupuesto[];
}

export const PresupuestosList: React.FC<PresupuestosListProps> = ({ presupuestos }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Presupuestos Registrados</CardTitle>
        <CardDescription>
          Lista de todos los presupuestos empresariales
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Período</TableHead>
              <TableHead>Responsable</TableHead>
              <TableHead className="text-right">Presupuestado</TableHead>
              <TableHead className="text-right">Ejecutado</TableHead>
              <TableHead>% Ejecución</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {presupuestos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground">
                  No hay presupuestos registrados
                </TableCell>
              </TableRow>
            ) : (
              presupuestos.map((presupuesto) => (
                <TableRow key={presupuesto.id}>
                  <TableCell className="font-medium">
                    {presupuesto.nombre}
                  </TableCell>
                  <TableCell>{presupuesto.periodo}</TableCell>
                  <TableCell>{presupuesto.responsable}</TableCell>
                  <TableCell className="text-right">
                    Bs. {presupuesto.totalPresupuestado.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    Bs. {presupuesto.totalEjecutado.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-sm">
                        {presupuesto.totalPresupuestado > 0 
                          ? ((presupuesto.totalEjecutado / presupuesto.totalPresupuestado) * 100).toFixed(1)
                          : 0}%
                      </div>
                      <Progress 
                        value={presupuesto.totalPresupuestado > 0 
                          ? (presupuesto.totalEjecutado / presupuesto.totalPresupuestado) * 100
                          : 0} 
                        className="h-2"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getEstadoColor(presupuesto.estado)}>
                      {presupuesto.estado.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};