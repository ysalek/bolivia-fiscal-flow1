import { useState, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ProductoInventario, 
  MovimientoInventario, 
  productosIniciales, 
  movimientosIniciales 
} from "./inventory/InventoryData";
import InventoryMovementDialog from "./inventory/InventoryMovementDialog";
import { useContabilidadIntegration } from "@/hooks/useContabilidadIntegration";
import { useToast } from "@/hooks/use-toast";
import * as XLSX from 'xlsx';
import InventoryHeader from "./inventory/InventoryHeader";
import InventoryMetrics from "./inventory/InventoryMetrics";
import ProductListTab from "./inventory/ProductListTab";
import MovementListTab from "./inventory/MovementListTab";
import AlertsTab from "./inventory/AlertsTab";
import MethodologyTab from "./inventory/MethodologyTab";
import { getStockStatus } from "./inventory/inventoryUtils";

const InventarioModule = () => {
  const [productos, setProductos] = useState<ProductoInventario[]>(productosIniciales);
  const [movimientos, setMovimientos] = useState<MovimientoInventario[]>(movimientosIniciales);
  const [filtroCategoria, setFiltroCategoria] = useState("all");
  const [busqueda, setBusqueda] = useState("");
  const [showMovementDialog, setShowMovementDialog] = useState<{ open: boolean; tipo: 'entrada' | 'salida' }>({
    open: false,
    tipo: 'entrada'
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { generarAsientoInventario } = useContabilidadIntegration();
  const { toast } = useToast();

  const handleMovimiento = (nuevoMovimiento: MovimientoInventario, productoActualizado: ProductoInventario) => {
    setMovimientos(prev => [nuevoMovimiento, ...prev]);
    setProductos(prev => prev.map(p => p.id === productoActualizado.id ? productoActualizado : p));

    // Generar asiento contable automáticamente
    const asientoContable = generarAsientoInventario(nuevoMovimiento);
    
    console.log("Asiento contable generado:", asientoContable);
    
    toast({
      title: "Movimiento registrado",
      description: `${nuevoMovimiento.tipo === 'entrada' ? 'Entrada' : 'Salida'} registrada y asiento contable generado`,
    });
  };

  const handleDownloadFormat = () => {
    const sampleData = [
      {
        codigo: "PROD-EJEMPLO-01",
        nombre: "Producto de Ejemplo 1",
        categoria: "Equipos",
        stockActual: 20,
        stockMinimo: 5,
        stockMaximo: 100,
        costoUnitario: 150.50,
        precioVenta: 250.00,
        ubicacion: "Almacén A-1"
      },
      {
        codigo: "PROD-EJEMPLO-02",
        nombre: "Producto de Ejemplo 2",
        categoria: "Accesorios",
        stockActual: 50,
        stockMinimo: 10,
        stockMaximo: 200,
        costoUnitario: 25.00,
        precioVenta: 45.00,
        ubicacion: "Almacén B-3"
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(sampleData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Inventario");

    worksheet['!cols'] = [
        { wch: 20 }, { wch: 30 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }
    ];
    
    XLSX.writeFile(workbook, "formato_importacion_inventario.xlsx");
    
    toast({
        title: "Formato descargado",
        description: "El archivo 'formato_importacion_inventario.xlsx' ha sido descargado.",
    });
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = e.target?.result;
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const json = XLSX.utils.sheet_to_json<any>(worksheet);

            if (json.length === 0 || !json[0]['codigo'] || !json[0]['nombre']) {
                toast({
                    title: "Error de formato",
                    description: "El archivo Excel debe contener las columnas 'codigo' y 'nombre'.",
                    variant: "destructive",
                });
                return;
            }

            const productosExistentesCodigos = new Set(productos.map(p => p.codigo));
            const productosNuevos: ProductoInventario[] = [];
            const productosOmitidos: string[] = [];

            json.forEach((row, index) => {
                const codigo = String(row.codigo);
                if (!codigo) return;

                if (productosExistentesCodigos.has(codigo)) {
                    productosOmitidos.push(codigo);
                    return;
                }

                const stockActual = Number(row.stockActual) || 0;
                const costoUnitario = Number(row.costoUnitario) || 0;

                productosNuevos.push({
                    id: `${Date.now()}-${index}`,
                    codigo: codigo,
                    nombre: String(row.nombre),
                    categoria: String(row.categoria) || 'General',
                    stockActual: stockActual,
                    stockMinimo: Number(row.stockMinimo) || 0,
                    stockMaximo: Number(row.stockMaximo) || 100,
                    costoUnitario: costoUnitario,
                    costoPromedioPonderado: costoUnitario,
                    precioVenta: Number(row.precioVenta) || 0,
                    ubicacion: String(row.ubicacion) || 'Almacén Principal',
                    fechaUltimoMovimiento: new Date().toISOString().slice(0, 10),
                    valorTotalInventario: stockActual * costoUnitario,
                });
                productosExistentesCodigos.add(codigo);
            });

            setProductos(prev => [...prev, ...productosNuevos]);

            let description = `${productosNuevos.length} productos nuevos importados.`;
            if (productosOmitidos.length > 0) {
                description += ` ${productosOmitidos.length} productos omitidos porque su código ya existía.`;
            }

            toast({
                title: "Importación completada",
                description: description,
            });

        } catch (error) {
            console.error("Error al importar el archivo:", error);
            toast({
                title: "Error de importación",
                description: "Hubo un problema al leer el archivo. Verifique el formato.",
                variant: "destructive",
            });
        } finally {
            if (event.target) {
                event.target.value = '';
            }
        }
    };
    reader.readAsArrayBuffer(file);
  };

  const productosConAlertas = productos.filter(p => getStockStatus(p) === "low").length;
  const valorTotalInventario = productos.reduce((total, p) => total + p.valorTotalInventario, 0);
  const movimientosHoy = movimientos.filter(m => m.fecha === new Date().toISOString().slice(0, 10)).length;

  return (
    <div className="space-y-6">
      <InventoryHeader 
        onDownloadFormat={handleDownloadFormat}
        onImportClick={handleImportClick}
        onShowMovementDialog={(tipo) => setShowMovementDialog({ open: true, tipo })}
      />

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileImport}
        accept=".xlsx, .xls"
        style={{ display: 'none' }}
      />

      <InventoryMetrics 
        productCount={productos.length}
        totalInventoryValue={valorTotalInventario}
        alertCount={productosConAlertas}
        movementsTodayCount={movimientosHoy}
      />

      <Tabs defaultValue="productos" className="w-full">
        <TabsList>
          <TabsTrigger value="productos">Productos</TabsTrigger>
          <TabsTrigger value="movimientos">Movimientos</TabsTrigger>
          <TabsTrigger value="alertas">Alertas</TabsTrigger>
          <TabsTrigger value="metodologia">Metodología</TabsTrigger>
        </TabsList>

        <TabsContent value="productos" className="space-y-4">
          <ProductListTab 
            productos={productos}
            busqueda={busqueda}
            setBusqueda={setBusqueda}
            filtroCategoria={filtroCategoria}
            setFiltroCategoria={setFiltroCategoria}
          />
        </TabsContent>

        <TabsContent value="movimientos" className="space-y-4">
          <MovementListTab movimientos={movimientos} />
        </TabsContent>

        <TabsContent value="alertas" className="space-y-4">
          <AlertsTab 
            productos={productos}
            onShowMovementDialog={(tipo) => setShowMovementDialog({ open: true, tipo })}
          />
        </TabsContent>

        <TabsContent value="metodologia" className="space-y-4">
          <MethodologyTab />
        </TabsContent>
      </Tabs>

      <InventoryMovementDialog
        open={showMovementDialog.open}
        onOpenChange={(open) => setShowMovementDialog(prev => ({ ...prev, open }))}
        tipo={showMovementDialog.tipo}
        productos={productos}
        onMovimiento={handleMovimiento}
      />
    </div>
  );
};

export default InventarioModule;
