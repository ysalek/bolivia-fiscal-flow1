
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
      <Card className="bg-gradient-to-tr from-blue-50 to-blue-100 dark:from-blue-900/50 dark:to-slate-900 border-blue-200 dark:border-blue-800">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Total Productos</p>
              <p className="text-2xl font-bold">{productCount}</p>
            </div>
            <Package className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-tr from-green-50 to-green-100 dark:from-green-900/50 dark:to-slate-900 border-green-200 dark:border-green-800">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Valor Total (Prom. Pond.)</p>
              <p className="text-2xl font-bold">Bs. {totalInventoryValue.toLocaleString()}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-tr from-red-50 to-red-100 dark:from-red-900/50 dark:to-slate-900 border-red-200 dark:border-red-800">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Alertas de Stock</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">{alertCount}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-tr from-orange-50 to-orange-100 dark:from-orange-900/50 dark:to-slate-900 border-orange-200 dark:border-orange-800">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Movimientos Hoy</p>
              <p className="text-2xl font-bold">{movementsTodayCount}</p>
            </div>
            <TrendingDown className="w-8 h-8 text-orange-600 dark:text-orange-400" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryMetrics;
