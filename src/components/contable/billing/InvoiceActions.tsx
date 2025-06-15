
import { Button } from "@/components/ui/button";
import { Eye, Send } from "lucide-react";

interface InvoiceActionsProps {
  onPreview: () => void;
  onSubmit: () => void;
}

const InvoiceActions = ({ onPreview, onSubmit }: InvoiceActionsProps) => {
  return (
    <div className="flex justify-end gap-4">
      <Button variant="outline" onClick={onPreview}>
        <Eye className="w-4 h-4 mr-2" />
        Vista Previa
      </Button>
      <Button onClick={onSubmit}>
        <Send className="w-4 h-4 mr-2" />
        Crear Factura
      </Button>
    </div>
  );
};

export default InvoiceActions;
