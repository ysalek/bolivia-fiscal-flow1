import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus, FileDown, FileUp, Package, TrendingUp, AlertTriangle } from "lucide-react";
import { EnhancedHeader } from "../dashboard/EnhancedLayout";

interface EnhancedInventoryHeaderProps {
  onDownloadFormat: () => void;
  onImportClick: () => void;
  onShowMovementDialog: (tipo: 'entrada' | 'salida') => void;
  stockStats?: {
    total: number;
    stockBajo: number;
    agotados: number;
    valorTotal: number;
  };
}

const EnhancedInventoryHeader = ({ 
  onDownloadFormat, 
  onImportClick, 
  onShowMovementDialog, 
  stockStats 
}: EnhancedInventoryHeaderProps) => {
  const getStockBadgeVariant = () => {
    if (!stockStats) return "default";
    if (stockStats.agotados > 0) return "destructive";
    if (stockStats.stockBajo > 0) return "outline";
    return "default";
  };

  const getStockIcon = () => {
    if (!stockStats) return Package;
    if (stockStats.agotados > 0) return AlertTriangle;
    if (stockStats.stockBajo > 0) return TrendingUp;
    return Package;
  };

  const StockIcon = getStockIcon();

  return (
    <EnhancedHeader
      title="Gestión de Inventario"
      subtitle="Control avanzado de stock con valuación por promedio ponderado e integración contable automática"
      badge={{
        text: stockStats ? `${stockStats.total} productos` : "Inventario",
        variant: getStockBadgeVariant()
      }}
      actions={
        <div className="flex items-center gap-3">
          {stockStats && (
            <div className="hidden lg:flex items-center gap-4 px-4 py-2 bg-card rounded-lg border">
              <div className="flex items-center gap-2 text-sm">
                <StockIcon className="w-4 h-4 text-primary" />
                <span className="font-medium">Bs. {stockStats.valorTotal.toLocaleString()}</span>
                <span className="text-muted-foreground">valor total</span>
              </div>
              {stockStats.stockBajo > 0 && (
                <Badge variant="outline" className="text-xs">
                  {stockStats.stockBajo} stock bajo
                </Badge>
              )}
              {stockStats.agotados > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {stockStats.agotados} agotados
                </Badge>
              )}
            </div>
          )}
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onDownloadFormat}>
              <FileDown className="w-4 h-4 mr-2" />
              Formato
            </Button>
            <Button variant="outline" size="sm" onClick={onImportClick}>
              <FileUp className="w-4 h-4 mr-2" />
              Importar
            </Button>
            <Button
              size="sm"
              className="btn-primary-gradient text-primary-foreground"
              onClick={() => onShowMovementDialog('entrada')}
            >
              <Plus className="w-4 h-4 mr-2" />
              Entrada
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onShowMovementDialog('salida')}
            >
              <Minus className="w-4 h-4 mr-2" />
              Salida
            </Button>
          </div>
        </div>
      }
    />
  );
};

export default EnhancedInventoryHeader;