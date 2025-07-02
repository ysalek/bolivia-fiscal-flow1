import { useState, useMemo } from "react";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Proveedor } from "./PurchasesData";

interface ProveedorSearchComboboxProps {
  proveedores: Proveedor[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

const ProveedorSearchCombobox = ({ 
  proveedores, 
  value, 
  onValueChange, 
  placeholder = "Buscar proveedor...",
  disabled = false 
}: ProveedorSearchComboboxProps) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const proveedoresFiltrados = useMemo(() => {
    if (!searchValue) return proveedores;
    
    const search = searchValue.toLowerCase();
    return proveedores.filter(p => 
      p.nombre.toLowerCase().includes(search) ||
      p.nit.toLowerCase().includes(search) ||
      p.email?.toLowerCase().includes(search) ||
      p.telefono?.toLowerCase().includes(search)
    );
  }, [proveedores, searchValue]);

  const selectedProveedor = proveedores.find(p => p.id === value);

  const handleSelect = (proveedor: Proveedor) => {
    onValueChange(proveedor.id);
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
          {selectedProveedor ? (
            <span className="truncate">
              {selectedProveedor.nombre} (NIT: {selectedProveedor.nit})
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
              placeholder="Buscar por nombre, NIT, email o teléfono..." 
              className="border-0 focus:ring-0"
              value={searchValue}
              onValueChange={setSearchValue}
            />
          </div>
          <CommandList className="max-h-[300px]">
            <CommandEmpty>
              {searchValue ? "No se encontraron proveedores que coincidan con la búsqueda." : "No hay proveedores disponibles."}
            </CommandEmpty>
            <CommandGroup>
              {proveedoresFiltrados.map((proveedor) => (
                <CommandItem
                  key={proveedor.id}
                  onSelect={() => handleSelect(proveedor)}
                  className="cursor-pointer p-3"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === proveedor.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium text-sm">
                          {proveedor.nombre}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          NIT: {proveedor.nit}
                        </div>
                      </div>
                      <div className="text-right text-xs">
                        {proveedor.email && (
                          <div className="text-muted-foreground">{proveedor.email}</div>
                        )}
                        {proveedor.telefono && (
                          <div className="text-muted-foreground">{proveedor.telefono}</div>
                        )}
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

export default ProveedorSearchCombobox;