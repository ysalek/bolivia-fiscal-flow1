
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen } from "lucide-react";
import { MovimientoInventario } from "./InventoryData";

interface MovementListTabProps {
  movimientos: MovimientoInventario[];
}

const MovementListTab = ({ movimientos }: MovementListTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Historial de Movimientos - Promedio Ponderado</CardTitle>
        <CardDescription>
          Registro de movimientos con cálculo de promedio ponderado y asientos contables automáticos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Fecha</th>
                <th className="text-left p-2">Tipo</th>
                <th className="text-left p-2">Producto</th>
                <th className="text-right p-2">Cantidad</th>
                <th className="text-right p-2">Costo Unit.</th>
                <th className="text-right p-2">Costo Prom.</th>
                <th className="text-right p-2">Stock Ant.</th>
                <th className="text-right p-2">Stock Nuevo</th>
                <th className="text-right p-2">Valor Mov.</th>
                <th className="text-left p-2">Documento</th>
                <th className="text-center p-2">Contabilidad</th>
              </tr>
            </thead>
            <tbody>
              {movimientos.map((movimiento) => (
                <tr key={movimiento.id} className="border-b hover:bg-slate-50">
                  <td className="p-2">{movimiento.fecha}</td>
                  <td className="p-2">
                    <Badge
                      className={
                        movimiento.tipo === 'entrada' ? 'bg-green-100 text-green-800' :
                        movimiento.tipo === 'salida' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }
                    >
                      {movimiento.tipo.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="p-2 font-medium">{movimiento.producto}</td>
                  <td className="p-2 text-right">{movimiento.cantidad}</td>
                  <td className="p-2 text-right">Bs. {movimiento.costoUnitario.toFixed(2)}</td>
                  <td className="p-2 text-right font-semibold text-blue-600">
                    Bs. {movimiento.costoPromedioPonderado.toFixed(2)}
                  </td>
                  <td className="p-2 text-right">{movimiento.stockAnterior}</td>
                  <td className="p-2 text-right">{movimiento.stockNuevo}</td>
                  <td className="p-2 text-right">Bs. {movimiento.valorMovimiento.toFixed(2)}</td>
                  <td className="p-2 font-mono">{movimiento.documento}</td>
                  <td className="p-2 text-center">
                    <Badge className="bg-blue-100 text-blue-800">
                      <BookOpen className="w-3 h-3 mr-1" />
                      Asiento Auto
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default MovementListTab;
