
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
  disabled?: boolean;
}

const ProductSearchSelect = ({ 
  productos, 
  value, 
  onValueChange, 
  placeholder = "Buscar producto...",
  disabled = false 
}: ProductSearchSelectProps) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const productosDisponibles = useMemo(() => 
    productos.filter(p => p.categoria !== "Servicios"), 
    [productos]
  );

  const productosFiltrados = useMemo(() => {
    if (!searchValue) return productosDisponibles;
    
    const search = searchValue.toLowerCase();
    return productosDisponibles.filter(p => 
      p.codigo.toLowerCase().includes(search) || 
      p.nombre.toLowerCase().includes(search) ||
      p.categoria.toLowerCase().includes(search)
    );
  }, [productosDisponibles, searchValue]);

  const selectedProduct = productosDisponibles.find(p => p.id === value);

  const handleSelect = (producto: ProductoInventario) => {
    onValueChange(producto.id);
    setOpen(false);
    setSearchValue("");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
        >
          {selectedProduct ? (
            <span className="truncate">
              {selectedProduct.codigo} - {selectedProduct.nombre}
            </span>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[500px] p-0 bg-white border shadow-lg z-50">
        <Command shouldFilter={false}>
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <CommandInput 
              placeholder="Buscar por código, nombre o categoría..." 
              className="border-0 focus:ring-0"
              value={searchValue}
              onValueChange={setSearchValue}
            />
          </div>
          <CommandList className="max-h-[300px]">
            <CommandEmpty>
              {searchValue ? "No se encontraron productos que coincidan con la búsqueda." : "No hay productos disponibles."}
            </CommandEmpty>
            <CommandGroup>
              {productosFiltrados.map((producto) => (
                <CommandItem
                  key={producto.id}
                  onSelect={() => handleSelect(producto)}
                  className="cursor-pointer p-3"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === producto.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium text-sm">
                          {producto.codigo} - {producto.nombre}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Categoría: {producto.categoria}
                        </div>
                      </div>
                      <div className="text-right text-xs">
                        <div className="font-medium">Stock: {producto.stockActual}</div>
                        <div className="text-muted-foreground">
                          Bs. {producto.costoPromedioPonderado.toFixed(2)}
                        </div>
                      </div>
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
