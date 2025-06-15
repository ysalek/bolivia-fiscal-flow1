import { ItemFactura } from "./BillingData";
import { Producto } from "../products/ProductsData";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Trash2, ChevronsUpDown, Check } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { useState } from "react";
import ProductSearchCombobox from "./ProductSearchCombobox";

interface InvoiceItemRowProps {
  item: ItemFactura;
  index: number;
  productos: Producto[];
  updateItem: (index: number, field: string, value: any) => void;
  removeItem: (index: number) => void;
  itemCount: number;
}

const InvoiceItemRow = ({ item, index, productos, updateItem, removeItem, itemCount }: InvoiceItemRowProps) => {
  return (
    <div key={item.id} className="grid grid-cols-7 gap-4 p-4 border rounded-lg">
      <div>
        <Label>Producto</Label>
        <ProductSearchCombobox
          productos={productos}
          value={item.productoId}
          onChange={(newId) => updateItem(index, 'productoId', newId)}
        />
      </div>
      <div>
        <Label>Descripción</Label>
        <Textarea
          value={item.descripcion}
          onChange={(e) => updateItem(index, 'descripcion', e.target.value)}
          placeholder="Descripción del item"
          className="min-h-[60px]"
        />
      </div>
      <div>
        <Label>Cantidad</Label>
        <Input
          type="number"
          value={item.cantidad}
          onChange={(e) => updateItem(index, 'cantidad', parseInt(e.target.value) || 0)}
          min="1"
        />
      </div>
      <div>
        <Label>Precio Unit.</Label>
        <Input
          type="number"
          value={item.precioUnitario}
          onChange={(e) => updateItem(index, 'precioUnitario', parseFloat(e.target.value) || 0)}
          min="0"
          step="0.01"
        />
      </div>
      <div>
        <Label>Descuento</Label>
        <Input
          type="number"
          value={item.descuento}
          onChange={(e) => updateItem(index, 'descuento', parseFloat(e.target.value) || 0)}
          min="0"
          step="0.01"
        />
      </div>
      <div>
        <Label>Subtotal</Label>
        <Input
          value={`Bs. ${item.subtotal.toFixed(2)}`}
          readOnly
          className="bg-gray-50"
        />
      </div>
      <div className="flex items-end">
        {itemCount > 1 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => removeItem(index)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default InvoiceItemRow;
