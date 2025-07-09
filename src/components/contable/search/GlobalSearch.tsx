import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Search, 
  FileText, 
  Package, 
  Users, 
  Receipt, 
  Calculator,
  TrendingUp,
  Clock,
  Filter
} from "lucide-react";

interface SearchResult {
  id: string;
  type: 'producto' | 'cliente' | 'factura' | 'comprobante' | 'transaccion';
  title: string;
  subtitle: string;
  data: any;
  module: string;
}

interface GlobalSearchProps {
  onNavigate: (moduleId: string, itemId?: string) => void;
}

const GlobalSearch = ({ onNavigate }: GlobalSearchProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Cargar búsquedas recientes del localStorage
  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    setRecentSearches(recent);
  }, []);

  // Función de búsqueda global
  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    const searchResults: SearchResult[] = [];

    try {
      // Buscar en productos
      const productos = JSON.parse(localStorage.getItem('productos') || '[]');
      productos.forEach((producto: any) => {
        if (
          producto.nombre.toLowerCase().includes(query.toLowerCase()) ||
          producto.codigo.toLowerCase().includes(query.toLowerCase())
        ) {
          searchResults.push({
            id: producto.id,
            type: 'producto',
            title: producto.nombre,
            subtitle: `Código: ${producto.codigo} - Stock: ${producto.stockActual}`,
            data: producto,
            module: 'productos'
          });
        }
      });

      // Buscar en clientes
      const clientes = JSON.parse(localStorage.getItem('clientes') || '[]');
      clientes.forEach((cliente: any) => {
        if (
          cliente.nombre.toLowerCase().includes(query.toLowerCase()) ||
          cliente.nit.includes(query)
        ) {
          searchResults.push({
            id: cliente.id,
            type: 'cliente',
            title: cliente.nombre,
            subtitle: `NIT: ${cliente.nit} - Tel: ${cliente.telefono}`,
            data: cliente,
            module: 'clientes'
          });
        }
      });

      // Buscar en facturas
      const facturas = JSON.parse(localStorage.getItem('facturas') || '[]');
      facturas.forEach((factura: any) => {
        if (
          factura.numero.toLowerCase().includes(query.toLowerCase()) ||
          factura.cliente.nombre.toLowerCase().includes(query.toLowerCase())
        ) {
          searchResults.push({
            id: factura.id,
            type: 'factura',
            title: `Factura ${factura.numero}`,
            subtitle: `Cliente: ${factura.cliente.nombre} - Total: Bs. ${factura.total}`,
            data: factura,
            module: 'facturacion'
          });
        }
      });

      // Buscar en asientos contables
      const asientos = JSON.parse(localStorage.getItem('asientosContables') || '[]');
      asientos.forEach((asiento: any) => {
        if (
          asiento.concepto.toLowerCase().includes(query.toLowerCase()) ||
          asiento.referencia.toLowerCase().includes(query.toLowerCase())
        ) {
          searchResults.push({
            id: asiento.id,
            type: 'transaccion',
            title: asiento.concepto,
            subtitle: `Ref: ${asiento.referencia} - Fecha: ${asiento.fecha}`,
            data: asiento,
            module: 'libro-diario'
          });
        }
      });

      setResults(searchResults.slice(0, 10)); // Limitar a 10 resultados
    } catch (error) {
      console.error('Error en búsqueda:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Manejar cambio en el input de búsqueda
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchTerm) {
        performSearch(searchTerm);
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  // Manejar selección de resultado
  const handleResultSelect = (result: SearchResult) => {
    // Agregar a búsquedas recientes
    const updatedRecent = [searchTerm, ...recentSearches.filter(s => s !== searchTerm)].slice(0, 5);
    setRecentSearches(updatedRecent);
    localStorage.setItem('recentSearches', JSON.stringify(updatedRecent));

    // Navegar al módulo correspondiente
    onNavigate(result.module, result.id);
    setIsOpen(false);
    setSearchTerm("");
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'producto': return <Package className="w-4 h-4 text-blue-500" />;
      case 'cliente': return <Users className="w-4 h-4 text-green-500" />;
      case 'factura': return <Receipt className="w-4 h-4 text-purple-500" />;
      case 'transaccion': return <Calculator className="w-4 h-4 text-orange-500" />;
      default: return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  const getResultBadge = (type: string) => {
    const badges = {
      'producto': { label: 'Producto', color: 'bg-blue-100 text-blue-800' },
      'cliente': { label: 'Cliente', color: 'bg-green-100 text-green-800' },
      'factura': { label: 'Factura', color: 'bg-purple-100 text-purple-800' },
      'transaccion': { label: 'Asiento', color: 'bg-orange-100 text-orange-800' }
    };
    
    return badges[type as keyof typeof badges] || { label: 'Documento', color: 'bg-gray-100 text-gray-800' };
  };

  return (
    <>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Buscar productos, clientes, facturas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={() => setIsOpen(true)}
              className="pl-10 pr-4 bg-background/50 backdrop-blur-sm border-primary/20 focus:border-primary/50"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAdvanced(true)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 px-2"
              >
                <Filter className="w-3 h-3" />
              </Button>
            )}
          </div>
        </PopoverTrigger>
        
        <PopoverContent className="w-[400px] p-0" align="start">
          <Command>
            <CommandInput
              placeholder="Buscar en todo el sistema..."
              value={searchTerm}
              onValueChange={setSearchTerm}
            />
            
            {!searchTerm && recentSearches.length > 0 && (
              <CommandGroup heading="Búsquedas recientes">
                {recentSearches.map((recent, index) => (
                  <CommandItem
                    key={index}
                    onSelect={() => setSearchTerm(recent)}
                    className="flex items-center gap-2"
                  >
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    {recent}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {searchTerm && !isLoading && results.length === 0 && (
              <CommandEmpty>No se encontraron resultados.</CommandEmpty>
            )}

            {results.length > 0 && (
              <CommandGroup heading={`Resultados (${results.length})`}>
                {results.map((result) => {
                  const badge = getResultBadge(result.type);
                  return (
                    <CommandItem
                      key={`${result.type}-${result.id}`}
                      onSelect={() => handleResultSelect(result)}
                      className="flex items-center gap-3 p-3"
                    >
                      {getResultIcon(result.type)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium truncate">{result.title}</p>
                          <Badge className={`text-xs ${badge.color}`}>
                            {badge.label}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {result.subtitle}
                        </p>
                      </div>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            )}

            {isLoading && (
              <div className="p-4 text-center text-muted-foreground">
                Buscando...
              </div>
            )}
          </Command>
        </PopoverContent>
      </Popover>

      {/* Modal de búsqueda avanzada */}
      <Dialog open={showAdvanced} onOpenChange={setShowAdvanced}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Búsqueda Avanzada</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Tipo de documento</label>
                <Command className="border rounded-md">
                  <CommandInput placeholder="Seleccionar tipo..." />
                  <CommandGroup>
                    <CommandItem>Productos</CommandItem>
                    <CommandItem>Clientes</CommandItem>
                    <CommandItem>Facturas</CommandItem>
                    <CommandItem>Asientos contables</CommandItem>
                    <CommandItem>Comprobantes</CommandItem>
                  </CommandGroup>
                </Command>
              </div>
              
              <div>
                <label className="text-sm font-medium">Rango de fechas</label>
                <div className="flex gap-2">
                  <Input type="date" placeholder="Desde" />
                  <Input type="date" placeholder="Hasta" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Estado</label>
                <Command className="border rounded-md">
                  <CommandInput placeholder="Seleccionar estado..." />
                  <CommandGroup>
                    <CommandItem>Activo</CommandItem>
                    <CommandItem>Inactivo</CommandItem>
                    <CommandItem>Pendiente</CommandItem>
                    <CommandItem>Completado</CommandItem>
                  </CommandGroup>
                </Command>
              </div>
              
              <div>
                <label className="text-sm font-medium">Monto</label>
                <div className="flex gap-2">
                  <Input type="number" placeholder="Mínimo" />
                  <Input type="number" placeholder="Máximo" />
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowAdvanced(false)} className="flex-1">
                Cancelar
              </Button>
              <Button className="flex-1">
                <Search className="w-4 h-4 mr-2" />
                Buscar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GlobalSearch;