
import { ItemFactura } from "./BillingData";
import { Producto } from "../products/ProductsData";
import { Button } from "@/components/ui/button";
import { Plus, AlertCircle } from "lucide-react";
import InvoiceItemRow from "./InvoiceItemRow";

interface InvoiceItemsProps {
  items: ItemFactura[];
  productos: Producto[];
  updateItem: (index: number, field: string, value: any) => void;
  addItem: () => void;
  removeItem: (index: number) => void;
  error?: string;
}

const InvoiceItems = ({ items, productos, updateItem, addItem, removeItem, error }: InvoiceItemsProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Items de la Factura</h3>
        <Button onClick={addItem} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Agregar Item
        </Button>
      </div>

      {error && (
        <p className="text-sm text-red-500 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {error}
        </p>
      )}

      <div className="space-y-4">
        {items.map((item, index) => (
          <InvoiceItemRow
            key={item.id}
            item={item}
            index={index}
            productos={productos}
            updateItem={updateItem}
            removeItem={removeItem}
            itemCount={items.length}
          />
        ))}
      </div>
    </div>
  );
};

export default InvoiceItems;
