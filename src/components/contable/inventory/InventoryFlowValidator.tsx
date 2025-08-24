import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, XCircle, Wrench } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Producto } from "../products/ProductsData";
import { MovimientoInventario } from "./InventoryData";
import { AsientoContable } from "../diary/DiaryData";
import { useAsientos } from "@/hooks/useAsientos";
import { useReportesContables } from "@/hooks/useReportesContables";
import InventoryAdjustmentDialog from "./InventoryAdjustmentDialog";

interface ValidationIssue {
  type: 'critical' | 'warning' | 'info';
  message: string;
  productId?: string;
  suggestion?: string;
}

interface InventoryFlowValidatorProps {
  productos: Producto[];
  movimientos: MovimientoInventario[];
  onAddMovement: (movement: MovimientoInventario) => void;
}

const InventoryFlowValidator = ({ 
  productos, 
  movimientos, 
  onAddMovement 
}: InventoryFlowValidatorProps) => {
  const [issues, setIssues] = useState<ValidationIssue[]>([]);
  const [showAdjustmentDialog, setShowAdjustmentDialog] = useState(false);
  const { getAsientos } = useAsientos();
  const { getBalanceSheetData, getIncomeStatementData } = useReportesContables();
  const { toast } = useToast();

  useEffect(() => {
    validateInventoryFlow();
  }, [productos, movimientos]);

  const validateInventoryFlow = () => {
    const newIssues: ValidationIssue[] = [];

    // 1. Verificar productos con stock negativo
    productos.forEach(producto => {
      if (producto.stockActual < 0) {
        newIssues.push({
          type: 'critical',
          message: `${producto.nombre} tiene stock negativo: ${producto.stockActual}`,
          productId: producto.id,
          suggestion: 'Realizar ajuste de entrada para regularizar'
        });
      }
    });

    // 2. Verificar productos con stock bajo mínimo
    productos.forEach(producto => {
      if (producto.stockActual > 0 && producto.stockActual <= producto.stockMinimo) {
        newIssues.push({
          type: 'warning',
          message: `${producto.nombre} tiene stock bajo mínimo. Stock: ${producto.stockActual}, Mínimo: ${producto.stockMinimo}`,
          productId: producto.id,
          suggestion: 'Considerar reabastecimiento'
        });
      }
    });

    // 3. Validar coherencia contable
    const asientos = getAsientos();
    const balanceData = getBalanceSheetData();
    const estadoData = getIncomeStatementData();

    // Verificar que el inventario en balance sea positivo
    const inventarioBalance = balanceData.activos.cuentas.find(cuenta => cuenta.codigo === '1141');
    if (inventarioBalance && inventarioBalance.saldo < 0) {
      newIssues.push({
        type: 'critical',
        message: `Inventario en Balance General es negativo: ${inventarioBalance.saldo.toFixed(2)} Bs.`,
        suggestion: 'Revisar asientos contables y realizar ajustes'
      });
    }

    // 4. Verificar asientos con partidas desbalanceadas
    asientos.forEach(asiento => {
      if (Math.abs(asiento.debe - asiento.haber) > 0.01) { // Tolerancia de 1 centavo
        newIssues.push({
          type: 'critical',
          message: `Asiento ${asiento.numero} está desbalanceado. Debe: ${asiento.debe}, Haber: ${asiento.haber}`,
          suggestion: 'Revisar y corregir el asiento contable'
        });
      }
    });

    // 5. Verificar productos sin movimientos con stock
    productos.forEach(producto => {
      const tieneMovimientos = movimientos.some(mov => mov.productoId === producto.id);
      if (!tieneMovimientos && producto.stockActual > 0) {
        newIssues.push({
          type: 'info',
          message: `${producto.nombre} tiene stock (${producto.stockActual}) pero no tiene movimientos registrados`,
          productId: producto.id,
          suggestion: 'Verificar si es inventario inicial'
        });
      }
    });

    setIssues(newIssues);
  };

  const handleAutoFix = () => {
    const criticalIssues = issues.filter(issue => issue.type === 'critical');
    
    if (criticalIssues.length === 0) {
      toast({
        title: "No hay problemas críticos",
        description: "El sistema está funcionando correctamente",
      });
      return;
    }

    // Auto-fix para productos con stock negativo
    const negativeStockProducts = criticalIssues
      .filter(issue => issue.productId && issue.message.includes('stock negativo'))
      .map(issue => issue.productId);

    if (negativeStockProducts.length > 0) {
      setShowAdjustmentDialog(true);
      toast({
        title: "Ajuste requerido",
        description: "Se abrirá el diálogo para corregir stocks negativos",
        variant: "destructive"
      });
    }
  };

  const getIssueIcon = (type: ValidationIssue['type']) => {
    switch (type) {
      case 'critical': return <XCircle className="w-4 h-4 text-destructive" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case 'info': return <CheckCircle className="w-4 h-4 text-blue-500" />;
    }
  };

  const getIssueVariant = (type: ValidationIssue['type']) => {
    switch (type) {
      case 'critical': return 'destructive' as const;
      case 'warning': return 'default' as const;
      case 'info': return 'default' as const;
    }
  };

  const criticalCount = issues.filter(i => i.type === 'critical').length;
  const warningCount = issues.filter(i => i.type === 'warning').length;

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              Validador de Flujo Contable e Inventario
              {criticalCount === 0 && warningCount === 0 && (
                <CheckCircle className="w-5 h-5 text-green-500" />
              )}
            </CardTitle>
            {criticalCount > 0 && (
              <Button onClick={handleAutoFix} variant="destructive" size="sm">
                <Wrench className="w-4 h-4 mr-1" />
                Corregir Automáticamente
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            {criticalCount > 0 && (
              <Badge variant="destructive">{criticalCount} Críticos</Badge>
            )}
            {warningCount > 0 && (
              <Badge variant="secondary">{warningCount} Advertencias</Badge>
            )}
            {criticalCount === 0 && warningCount === 0 && (
              <Badge className="bg-green-100 text-green-800">
                ✓ Sistema Validado
              </Badge>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-3">
          {issues.length === 0 ? (
            <Alert>
              <CheckCircle className="w-4 h-4" />
              <AlertDescription>
                El sistema contable e inventario están funcionando correctamente. 
                No se detectaron inconsistencias.
              </AlertDescription>
            </Alert>
          ) : (
            issues.map((issue, index) => (
              <Alert key={index} variant={getIssueVariant(issue.type)}>
                <div className="flex items-start gap-2">
                  {getIssueIcon(issue.type)}
                  <div className="flex-1">
                    <AlertDescription>
                      <div className="font-medium">{issue.message}</div>
                      {issue.suggestion && (
                        <div className="text-sm text-muted-foreground mt-1">
                          💡 {issue.suggestion}
                        </div>
                      )}
                    </AlertDescription>
                  </div>
                </div>
              </Alert>
            ))
          )}
        </CardContent>
      </Card>

      <InventoryAdjustmentDialog
        open={showAdjustmentDialog}
        onOpenChange={setShowAdjustmentDialog}
        productos={productos.filter(p => p.stockActual < 0)}
        onSaveMovement={onAddMovement}
      />
    </>
  );
};

export default InventoryFlowValidator;