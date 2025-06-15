
import { Card, CardContent } from "@/components/ui/card";
import { Package, TrendingUp, AlertTriangle, TrendingDown } from "lucide-react";

interface InventoryMetricsProps {
  productCount: number;
  totalInventoryValue: number;
  alertCount: number;
  movementsTodayCount: number;
}

const InventoryMetrics = ({
  productCount,
  totalInventoryValue,
  alertCount,
  movementsTodayCount,
}: InventoryMetricsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Total Productos</p>
              <p className="text-2xl font-bold">{productCount}</p>
            </div>
            <Package className="w-8 h-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Valor Total (Prom. Pond.)</p>
              <p className="text-2xl font-bold">Bs. {totalInventoryValue.toLocaleString()}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Alertas de Stock</p>
              <p className="text-2xl font-bold text-red-600">{alertCount}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Movimientos Hoy</p>
              <p className="text-2xl font-bold">{movementsTodayCount}</p>
            </div>
            <TrendingDown className="w-8 h-8 text-orange-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryMetrics;
