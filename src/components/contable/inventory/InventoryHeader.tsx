
import { Button } from "@/components/ui/button";
import { Plus, Minus, FileDown, FileUp } from "lucide-react";

interface InventoryHeaderProps {
  onDownloadFormat: () => void;
  onImportClick: () => void;
  onShowMovementDialog: (tipo: 'entrada' | 'salida') => void;
}

const InventoryHeader = ({ onDownloadFormat, onImportClick, onShowMovementDialog }: InventoryHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold">Gestión de Inventario - Promedio Ponderado</h2>
        <p className="text-slate-600 dark:text-slate-400">Control de stock con valuación por promedio ponderado e integración contable</p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={onDownloadFormat}>
          <FileDown className="w-4 h-4 mr-2" />
          Descargar Formato
        </Button>
        <Button variant="outline" onClick={onImportClick}>
          <FileUp className="w-4 h-4 mr-2" />
          Importar
        </Button>
        <Button
          className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-primary-foreground"
          onClick={() => onShowMovementDialog('entrada')}
        >
          <Plus className="w-4 h-4 mr-2" />
          Entrada
        </Button>
        <Button
          className="bg-amber-600 hover:bg-amber-700 dark:bg-amber-700 dark:hover:bg-amber-800 text-primary-foreground"
          onClick={() => onShowMovementDialog('salida')}
        >
          <Minus className="w-4 h-4 mr-2" />
          Salida
        </Button>
      </div>
    </div>
  );
};

export default InventoryHeader;
