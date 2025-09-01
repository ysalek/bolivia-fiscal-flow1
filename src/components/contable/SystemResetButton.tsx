import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from '@/components/ui/alert-dialog';
import { useSystemReset } from '@/hooks/useSystemReset';
import { RefreshCw, AlertTriangle } from 'lucide-react';

const SystemResetButton = () => {
  const [isResetting, setIsResetting] = useState(false);
  const { resetearSistemaCompleto } = useSystemReset();

  const handleReset = async () => {
    setIsResetting(true);
    try {
      await resetearSistemaCompleto();
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Resetear Sistema
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            ¿Resetear todo el sistema?
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>Esta acción eliminará PERMANENTEMENTE todos los datos del sistema:</p>
            <ul className="list-disc pl-6 space-y-1 text-sm">
              <li>Todos los productos y su inventario</li>
              <li>Todos los movimientos de inventario</li>
              <li>Todas las facturas y compras</li>
              <li>Todos los clientes y proveedores</li>
              <li>Todos los asientos contables</li>
              <li>Todos los empleados y nóminas</li>
              <li>Todos los activos fijos</li>
              <li>Todas las cuentas bancarias y movimientos</li>
              <li>Todos los presupuestos</li>
            </ul>
            <p className="font-semibold text-destructive">
              Esta acción NO se puede deshacer. ¿Está seguro?
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleReset}
            disabled={isResetting}
            className="bg-destructive hover:bg-destructive/90"
          >
            {isResetting ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Reseteando...
              </>
            ) : (
              'Sí, resetear todo'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default SystemResetButton;