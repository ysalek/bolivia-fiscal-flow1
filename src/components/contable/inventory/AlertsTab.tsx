
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Package, Plus } from "lucide-react";
import { ProductoInventario } from "./InventoryData";
import { getStockStatus } from "./inventoryUtils";

interface AlertsTabProps {
  productos: ProductoInventario[];
  onShowMovementDialog: (tipo: 'entrada' | 'salida') => void;
}

const AlertsTab = ({ productos, onShowMovementDialog }: AlertsTabProps) => {
  const productosConAlerta = productos.filter(p => getStockStatus(p) === "low");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Alertas de Inventario</CardTitle>
        <CardDescription>
          Productos que requieren atención inmediata
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {productosConAlerta.map((producto) => (
            <div key={producto.id} className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <div>
                  <p className="font-medium">{producto.nombre}</p>
                  <p className="text-sm text-slate-600">
                    Stock actual: {producto.stockActual} | Mínimo: {producto.stockMinimo}
                  </p>
                  <p className="text-xs text-slate-500">
                    Costo promedio: Bs. {producto.costoPromedioPonderado.toFixed(2)}
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                onClick={() => onShowMovementDialog('entrada')}
              >
                <Plus className="w-4 h-4 mr-2" />
                Reabastecer
              </Button>
            </div>
          ))}

          {productosConAlerta.length === 0 && (
            <div className="text-center p-8 text-slate-500">
              <Package className="w-12 h-12 mx-auto mb-4 text-slate-300" />
              <p>No hay alertas de inventario en este momento</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AlertsTab;
