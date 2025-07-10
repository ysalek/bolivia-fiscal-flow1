import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle } from 'lucide-react';
import { PresupuestoItem } from '../types';
import { getVariacionIcon, getVariacionIconColor } from '../utils/presupuestoUtils';

interface EjecucionPresupuestalProps {
  itemsPresupuesto: PresupuestoItem[];
}

export const EjecucionPresupuestal: React.FC<EjecucionPresupuestalProps> = ({ itemsPresupuesto }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ejecución Presupuestal por Conceptos</CardTitle>
        <CardDescription>
          Seguimiento detallado de la ejecución presupuestal
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Concepto</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead className="text-right">Presupuestado</TableHead>
              <TableHead className="text-right">Ejecutado</TableHead>
              <TableHead className="text-right">Variación</TableHead>
              <TableHead>% Ejecución</TableHead>
              <TableHead>Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {itemsPresupuesto.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  No hay items de presupuesto registrados
                </TableCell>
              </TableRow>
            ) : (
              itemsPresupuesto.map((item) => {
                const VariacionIcon = getVariacionIcon(item.variacion);
                return (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.concepto}</TableCell>
                    <TableCell>{item.categoria}</TableCell>
                    <TableCell className="text-right">
                      Bs. {item.presupuestado.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      Bs. {item.ejecutado.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center gap-1">
                        <VariacionIcon className={`w-4 h-4 ${getVariacionIconColor(item.variacion)}`} />
                        <span className={item.variacion > 0 ? 'text-red-600' : 'text-green-600'}>
                          Bs. {Math.abs(item.variacion).toLocaleString()}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">{item.porcentajeEjecucion.toFixed(1)}%</div>
                        <Progress 
                          value={Math.min(item.porcentajeEjecucion, 100)} 
                          className="h-2"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      {item.porcentajeEjecucion > 100 ? (
                        <Badge variant="destructive" className="flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          Sobrepasado
                        </Badge>
                      ) : item.porcentajeEjecucion > 90 ? (
                        <Badge variant="secondary">
                          Próximo al límite
                        </Badge>
                      ) : (
                        <Badge variant="default">
                          En rango
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};