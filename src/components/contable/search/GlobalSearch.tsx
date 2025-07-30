import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  Filter,
  ChevronRight
} from "lucide-react";

interface SearchResult {
  id: string;
  name: string;
  keywords: string[];
}

interface GlobalSearchProps {
  onNavigate: (moduleId: string) => void;
}

const GlobalSearch = ({ onNavigate }: GlobalSearchProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Lista de módulos del sistema
  const modules = [
    { id: 'dashboard', name: 'Dashboard', keywords: ['inicio', 'panel', 'dashboard'] },
    { id: 'productos', name: 'Productos', keywords: ['inventario', 'stock', 'artículos'] },
    { id: 'clientes', name: 'Clientes', keywords: ['clientes', 'contactos'] },
    { id: 'facturacion', name: 'Facturación', keywords: ['facturas', 'ventas', 'cobros'] },
    { id: 'compras', name: 'Compras', keywords: ['compras', 'proveedores', 'gastos'] },
    { id: 'libro-diario', name: 'Libro Diario', keywords: ['asientos', 'contabilidad', 'diario'] },
    { id: 'plan-cuentas', name: 'Plan de Cuentas', keywords: ['cuentas', 'plan contable'] },
    { id: 'balance-comprobacion', name: 'Balance de Comprobación', keywords: ['balance', 'comprobación'] },
    { id: 'balance-general', name: 'Balance General', keywords: ['balance general', 'estados financieros'] },
    { id: 'estado-resultados', name: 'Estado de Resultados', keywords: ['pérdidas', 'ganancias', 'resultados'] },
    { id: 'reportes', name: 'Reportes', keywords: ['informes', 'reportes'] },
    { id: 'bancos', name: 'Bancos', keywords: ['bancos', 'conciliación'] },
    { id: 'kardex', name: 'Kardex', keywords: ['kardex', 'movimientos'] },
    { id: 'punto-venta', name: 'Punto de Venta', keywords: ['pos', 'venta', 'caja'] },
    { id: 'inventario', name: 'Inventario', keywords: ['inventario', 'stock'] },
    { id: 'declaraciones-tributarias', name: 'Declaraciones Tributarias', keywords: ['impuestos', 'iva', 'declaraciones'] },
    { id: 'activos-fijos', name: 'Activos Fijos', keywords: ['activos', 'depreciación'] },
    { id: 'backup', name: 'Respaldo', keywords: ['backup', 'respaldo', 'copia'] },
    { id: 'configuracion', name: 'Configuración', keywords: ['configurar', 'ajustes'] },
    { id: 'tutorial', name: 'Tutorial', keywords: ['ayuda', 'tutorial', 'guía'] },
    { id: 'auditoria', name: 'Auditoría y Control', keywords: ['auditoría', 'control', 'revisión'] },
    { id: 'analisis-financiero', name: 'Análisis Financiero', keywords: ['análisis', 'financiero', 'indicadores'] },
    { id: 'anticipos', name: 'Gestión de Anticipos', keywords: ['anticipos', 'adelantos'] },
    { id: 'nomina', name: 'Nómina', keywords: ['nómina', 'sueldos', 'salarios', 'gestora'] },
    { id: 'centros-costo', name: 'Centros de Costo', keywords: ['centros', 'costo', 'departamentos'] },
    { id: 'flujo-caja', name: 'Flujo de Caja', keywords: ['flujo', 'caja', 'efectivo'] },
    { id: 'presupuestos', name: 'Presupuestos', keywords: ['presupuesto', 'planificación'] },
    { id: 'rentabilidad', name: 'Análisis de Rentabilidad', keywords: ['rentabilidad', 'beneficios'] }
  ];

  // Cargar búsquedas recientes del localStorage
  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    setRecentSearches(recent);
  }, []);

  // Función de búsqueda en módulos
  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    const searchQuery = searchTerm.toLowerCase();
    const filteredModules = modules.filter((module) => {
      const matchesName = module.name.toLowerCase().includes(searchQuery);
      const matchesKeywords = module.keywords.some(keyword => 
        keyword.toLowerCase().includes(searchQuery)
      );
      return matchesName || matchesKeywords;
    });

    setResults(filteredModules.slice(0, 6));
  }, [searchTerm]);

  // Manejar selección de resultado
  const handleResultSelect = (module: SearchResult) => {
    // Agregar a búsquedas recientes
    const updatedRecent = [module.name, ...recentSearches.filter(s => s !== module.name)].slice(0, 5);
    setRecentSearches(updatedRecent);
    localStorage.setItem('recentSearches', JSON.stringify(updatedRecent));

    // Navegar al módulo
    onNavigate(module.id);
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleRecentSelect = (recent: string) => {
    setSearchTerm(recent);
    setIsOpen(true);
  };

  return (
    <div className="relative flex-1 max-w-lg">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
      <Input
        placeholder="Buscar módulos del sistema..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        className="pl-10 pr-4 bg-background/50 backdrop-blur-sm border-primary/20 focus:border-primary/50"
      />
      
      {isOpen && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-[100] shadow-lg border-primary/20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/90">
          <CardContent className="p-0 max-h-96 overflow-y-auto">
            {!searchTerm && recentSearches.length > 0 && (
              <div className="p-2 border-b">
                <div className="text-xs font-medium text-muted-foreground mb-2 px-2">Búsquedas recientes</div>
                {recentSearches.map((recent, index) => (
                  <div
                    key={index}
                    onClick={() => handleRecentSelect(recent)}
                    className="flex items-center gap-2 p-2 hover:bg-accent rounded cursor-pointer"
                  >
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{recent}</span>
                  </div>
                ))}
              </div>
            )}

            {searchTerm && results.length === 0 && (
              <div className="p-4 text-center text-muted-foreground">
                <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No se encontraron módulos</p>
              </div>
            )}

            {results.length > 0 && (
              <div className="p-2">
                <div className="text-xs font-medium text-muted-foreground mb-2 px-2">
                  Módulos ({results.length})
                </div>
                {results.map((result) => (
                  <div
                    key={result.id}
                    onClick={() => handleResultSelect(result)}
                    className="flex items-center justify-between p-3 hover:bg-accent rounded cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-primary" />
                      <div>
                        <p className="font-medium text-sm">{result.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {result.keywords.slice(0, 3).join(', ')}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GlobalSearch;