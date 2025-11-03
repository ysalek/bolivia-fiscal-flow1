
import { Button } from "@/components/ui/button";
import { Plus, Minus, FileDown, FileUp } from "lucide-react";

interface InventoryHeaderProps {
  onDownloadFormat: () => void;
  onImportClick: () => void;
  onShowMovementDialog: (tipo: 'entrada' | 'salida') => void;
}

const InventoryHeader = ({ onDownloadFormat, onImportClick, onShowMovementDialog }: InventoryHeaderProps) => {
  return (
    <div className="bg-gradient-primary px-6 py-5 rounded-t-lg">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Gestión de Inventario</h2>
          <p className="text-white/90 text-sm">Control de stock con valuación por promedio ponderado</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onDownloadFormat} className="bg-white/10 border-white/30 text-white hover:bg-white/20">
            <FileDown className="w-4 h-4 mr-2" />
            Descargar
          </Button>
          <Button variant="outline" onClick={onImportClick} className="bg-white/10 border-white/30 text-white hover:bg-white/20">
            <FileUp className="w-4 h-4 mr-2" />
            Importar
          </Button>
          <Button
            onClick={() => onShowMovementDialog('entrada')}
            className="bg-success hover:bg-success-light text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Entrada
          </Button>
          <Button
            onClick={() => onShowMovementDialog('salida')}
            className="bg-warning hover:bg-warning-light text-white"
          >
            <Minus className="w-4 h-4 mr-2" />
            Salida
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InventoryHeader;
