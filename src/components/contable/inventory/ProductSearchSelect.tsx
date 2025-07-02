
import { useState, useMemo } from "react";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ProductoInventario } from "./InventoryData";

interface ProductSearchSelectProps {
  productos: ProductoInventario[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
}

const ProductSearchSelect = ({ productos, value, onValueChange, placeholder = "Buscar producto..." }: ProductSearchSelectProps) => {
  const [open, setOpen] = useState(false);

  const productosDisponibles = useMemo(() => 
    productos.filter(p => p.categoria !== "Servicios"), 
    [productos]
  );

  const selectedProduct = productosDisponibles.find(p => p.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedProduct ? (
            <span className="truncate">
              {selectedProduct.codigo} - {selectedProduct.nombre}
            </span>
          ) : (
            placeholder
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0 bg-white border shadow-lg z-50">
        <Command>
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <CommandInput placeholder="Buscar por código o nombre..." className="border-0 focus:ring-0" />
          </div>
          <CommandList>
            <CommandEmpty>No se encontraron productos.</CommandEmpty>
            <CommandGroup>
              {productosDisponibles.map((producto) => (
                <CommandItem
                  key={producto.id}
                  value={`${producto.codigo} ${producto.nombre}`}
                  onSelect={() => {
                    onValueChange(producto.id);
                    setOpen(false);
                  }}
                  className="cursor-pointer"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === producto.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex-1">
                    <div className="font-medium">{producto.codigo} - {producto.nombre}</div>
                    <div className="text-sm text-muted-foreground">
                      Stock: {producto.stockActual} | Costo: Bs. {producto.costoPromedioPonderado.toFixed(2)}
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default ProductSearchSelect;
