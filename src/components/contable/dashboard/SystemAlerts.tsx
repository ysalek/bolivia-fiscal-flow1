
import { Card, CardContent } from "@/components/ui/card";
import { Package, FileText } from "lucide-react";

interface SystemAlertsProps {
  productosStockBajo: number;
  facturasPendientes: number;
  asientosHoy: number;
  ventasHoy: number;
}

const SystemAlerts = ({ productosStockBajo, facturasPendientes, asientosHoy, ventasHoy }: SystemAlertsProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Alertas del Sistema</h3>
      <div className="grid gap-4">
        {productosStockBajo > 0 && (
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-orange-600" />
                <div>
                  <p className="font-medium text-orange-800">
                    Stock Bajo Detectado
                  </p>
                  <p className="text-sm text-orange-600">
                    {productosStockBajo} producto(s) con stock por debajo del mínimo
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {facturasPendientes > 5 && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-red-600" />
                <div>
                  <p className="font-medium text-red-800">
                    Muchas Facturas Pendientes
                  </p>
                  <p className="text-sm text-red-600">
                    {facturasPendientes} facturas pendientes de cobro
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {asientosHoy === 0 && ventasHoy > 0 && (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-yellow-600" />
                <div>
                  <p className="font-medium text-yellow-800">
                    Verificar Registro Contable
                  </p>
                  <p className="text-sm text-yellow-600">
                    Hay ventas registradas pero sin asientos contables hoy
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SystemAlerts;
