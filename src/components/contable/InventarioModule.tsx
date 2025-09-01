import { useState, useRef, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  ProductoInventario, 
  MovimientoInventario, 
  productosIniciales, 
  movimientosIniciales 
} from "./inventory/InventoryData";
import InventoryMovementDialog from "./inventory/InventoryMovementDialog";
import { useContabilidadIntegration } from "@/hooks/useContabilidadIntegration";
import { useInventarioBolivia } from "@/hooks/useInventarioBolivia";
import { useSupabaseProductos } from "@/hooks/useSupabaseProductos";
import { useToast } from "@/hooks/use-toast";
import * as XLSX from 'xlsx';
import { EnhancedHeader, MetricGrid, EnhancedMetricCard, Section, ChartContainer } from "./dashboard/EnhancedLayout";
import ProductListTab from "./inventory/ProductListTab";
import MovementListTab from "./inventory/MovementListTab";
import AlertsTab from "./inventory/AlertsTab";
import MethodologyTab from "./inventory/MethodologyTab";
import { getStockStatus } from "./inventory/inventoryUtils";
import { Producto } from "./products/ProductsData";
import { FileDown, FileUp, Package, TrendingUp, AlertTriangle, BarChart3, Activity, Zap } from "lucide-react";

const InventarioModule = () => {
  const [movimientos, setMovimientos] = useState<MovimientoInventario[]>(movimientosIniciales);
  const [filtroCategoria, setFiltroCategoria] = useState("all");
  const [busqueda, setBusqueda] = useState("");
  const [showMovementDialog, setShowMovementDialog] = useState<{ open: boolean; tipo: 'entrada' | 'salida' }>({
    open: false,
    tipo: 'entrada'
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { generarAsientoInventario } = useContabilidadIntegration();
  const { procesarMovimientoInventario, validarIntegridadContable } = useInventarioBolivia();
  const { productos, loading, crearProducto, actualizarStockProducto, refetch } = useSupabaseProductos();
  const { toast } = useToast();

  // Convertir productos de Supabase a formato de inventario
  const productosInventario: ProductoInventario[] = productos.map(producto => ({
    id: producto.id,
    codigo: producto.codigo,
    nombre: producto.nombre,
    categoria: producto.categoria_id || 'General',
    stockActual: producto.stock_actual || 0,
    stockMinimo: producto.stock_minimo || 5,
    stockMaximo: (producto.stock_minimo || 5) * 10,
    costoUnitario: producto.costo_unitario || 0,
    costoPromedioPonderado: producto.costo_unitario || 0,
    precioVenta: producto.precio_venta || 0,
    ubicacion: 'Almacén Principal',
    fechaUltimoMovimiento: producto.updated_at?.split('T')[0] || new Date().toISOString().slice(0, 10),
    valorTotalInventario: (producto.stock_actual || 0) * (producto.costo_unitario || 0)
  }));

  const handleMovimiento = async (nuevoMovimiento: MovimientoInventario, productoOriginal: ProductoInventario) => {
    try {
      console.log("🇧🇴 Procesando movimiento según normativa boliviana:", nuevoMovimiento);
      
      // Usar el hook especializado para Bolivia que incluye todas las validaciones normativas
      const resultado = procesarMovimientoInventario(nuevoMovimiento, productoOriginal);
      
      if (!resultado.exito) {
        console.error("❌ Movimiento rechazado:", resultado.mensaje);
        return;
      }

      const { productoActualizado, asientoGenerado } = resultado;
      
      if (!productoActualizado || !asientoGenerado) {
        toast({
          title: "Error interno",
          description: "No se pudo completar el procesamiento del movimiento",
          variant: "destructive"
        });
        return;
      }

      // Excluir tipos 'ajuste' para actualizarStockProducto
      if (nuevoMovimiento.tipo !== 'ajuste') {
        const stockExitoso = await actualizarStockProducto(
          productoOriginal.id, 
          nuevoMovimiento.cantidad, 
          nuevoMovimiento.tipo
        );

        if (!stockExitoso) {
          return; // El error ya se maneja en actualizarStockProducto
        }
      }

      // Actualizar lista de movimientos
      setMovimientos(prev => {
        const nuevosMovimientos = [nuevoMovimiento, ...prev];
        console.log("📝 Movimientos actualizados:", nuevosMovimientos.length);
        return nuevosMovimientos;
      });

      // Validar integridad contable después del movimiento
      const integridad = validarIntegridadContable();
      if (integridad && !integridad.cumpleNormativa) {
        console.warn("⚠️ Alerta de integridad contable detectada");
      }

      toast({
        title: "✅ Movimiento Registrado",
        description: `${nuevoMovimiento.tipo === 'entrada' ? 'Entrada' : 'Salida'} procesada según normativa boliviana. Asiento: ${asientoGenerado.numero}`,
      });

      console.log("✅ Movimiento completado exitosamente:", {
        movimiento: nuevoMovimiento.id,
        asiento: asientoGenerado.numero,
        nuevoStock: productoActualizado.stockActual,
        nuevoCosto: productoActualizado.costoPromedioPonderado
      });

    } catch (error) {
      console.error("💥 Error crítico al procesar movimiento:", error);
      toast({
        title: "Error Crítico",
        description: "Error grave en el procesamiento. Contacte al administrador.",
        variant: "destructive"
      });
    }
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

  const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
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

            // Crear productos en Supabase
            const productosCreados = await Promise.all(
                productosNuevos.map(async (productoInventario) => {
                    try {
                        return await crearProducto({
                            codigo: productoInventario.codigo,
                            nombre: productoInventario.nombre,
                            descripcion: `Producto importado desde Excel - ${productoInventario.nombre}`,
                            categoria_id: productoInventario.categoria,
                            unidad_medida: 'PZA',
                            precio_venta: productoInventario.precioVenta,
                            precio_compra: productoInventario.costoUnitario,
                            costo_unitario: productoInventario.costoUnitario,
                            stock_actual: productoInventario.stockActual,
                            stock_minimo: productoInventario.stockMinimo,
                            codigo_sin: '00000000',
                            activo: true,
                            imagen_url: undefined
                        });
                    } catch (error) {
                        console.error(`Error creando producto ${productoInventario.codigo}:`, error);
                        return null;
                    }
                })
            );

            const productosExitosos = productosCreados.filter(p => p !== null);

            let description = `${productosExitosos.length} productos nuevos importados y guardados en la base de datos.`;
            if (productosOmitidos.length > 0) {
                description += ` ${productosOmitidos.length} productos omitidos porque su código ya existía.`;
            }
            if (productosCreados.length !== productosExitosos.length) {
                description += ` ${productosCreados.length - productosExitosos.length} productos fallaron al importar.`;
            }

            toast({
                title: "Importación completada",
                description: description,
            });

            // Recargar datos de Supabase
            await refetch();

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

  const productosConAlertas = productosInventario.filter(p => getStockStatus(p) === "low").length;
  const valorTotalInventario = productosInventario.reduce((total, p) => total + p.valorTotalInventario, 0);
  const movimientosHoy = movimientos.filter(m => m.fecha === new Date().toISOString().slice(0, 10)).length;

  return (
    <div className="space-y-8">
      {/* Enhanced Header */}
      <EnhancedHeader
        title="Control de Inventario Avanzado"
        subtitle="Sistema integrado de gestión de inventario con valuación por promedio ponderado e integración contable automática"
        badge={{
          text: `${productosInventario.length} Productos Activos`,
          variant: "default"
        }}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleDownloadFormat}>
              <FileDown className="w-4 h-4 mr-2" />
              Formato Excel
            </Button>
            <Button variant="outline" onClick={handleImportClick}>
              <FileUp className="w-4 h-4 mr-2" />
              Importar Datos
            </Button>
            <Button
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg"
              onClick={() => setShowMovementDialog({ open: true, tipo: 'entrada' })}
            >
              <Package className="w-4 h-4 mr-2" />
              Entrada Stock
            </Button>
            <Button
              className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 shadow-lg"
              onClick={() => setShowMovementDialog({ open: true, tipo: 'salida' })}
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Salida Stock
            </Button>
          </div>
        }
      />

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileImport}
        accept=".xlsx, .xls"
        style={{ display: 'none' }}
      />

      {/* Enhanced Metrics Grid */}
      <Section 
        title="Métricas de Inventario" 
        subtitle="Indicadores clave del estado actual del inventario"
      >
        <MetricGrid columns={4}>
          <EnhancedMetricCard
            title="Productos en Stock"
            value={productosInventario.length}
            subtitle="Total productos activos"
            icon={Package}
            variant="default"
            trend="up"
            trendValue="Inventario completo"
          />
          <EnhancedMetricCard
            title="Valor Total Inventario"
            value={`Bs. ${valorTotalInventario.toLocaleString()}`}
            subtitle="Valor contable total"
            icon={BarChart3}
            variant={valorTotalInventario > 50000 ? "success" : "warning"}
            trend={valorTotalInventario > 50000 ? "up" : "neutral"}
            trendValue={`${productosInventario.filter(p => p.stockActual > 0).length} con stock`}
          />
          <EnhancedMetricCard
            title="Alertas de Stock"
            value={productosConAlertas}
            subtitle="Productos stock bajo"
            icon={AlertTriangle}
            variant={productosConAlertas > 0 ? "warning" : "success"}
            trend={productosConAlertas > 0 ? "down" : "up"}
            trendValue={productosConAlertas > 0 ? "Requieren reposición" : "Stock óptimo"}
          />
          <EnhancedMetricCard
            title="Movimientos Hoy"
            value={movimientosHoy}
            subtitle="Transacciones del día"
            icon={Activity}
            variant="default"
            trend={movimientosHoy > 0 ? "up" : "neutral"}
            trendValue={movimientosHoy > 0 ? "Sistema activo" : "Sin actividad"}
          />
        </MetricGrid>
      </Section>

      {/* Enhanced Tabs Section */}
      <Section 
        title="Gestión Detallada de Inventario"
        subtitle="Control completo de productos, movimientos y análisis de stock"
      >
        <ChartContainer
          title="Panel de Control de Inventario"
          subtitle="Administración integral con análisis y alertas automáticas"
        >
          <Tabs defaultValue="productos" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="productos" className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                Productos
              </TabsTrigger>
              <TabsTrigger value="movimientos" className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Movimientos
              </TabsTrigger>
              <TabsTrigger value="alertas" className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Alertas ({productosConAlertas})
              </TabsTrigger>
              <TabsTrigger value="metodologia" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Metodología
              </TabsTrigger>
            </TabsList>

        <TabsContent value="productos" className="space-y-4">
          <ProductListTab 
            productos={productosInventario}
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
            productos={productosInventario}
            onShowMovementDialog={(tipo) => setShowMovementDialog({ open: true, tipo })}
          />
        </TabsContent>

            <TabsContent value="metodologia" className="space-y-4">
              <MethodologyTab />
            </TabsContent>
          </Tabs>
        </ChartContainer>
      </Section>

      <InventoryMovementDialog
        open={showMovementDialog.open}
        onOpenChange={(open) => setShowMovementDialog(prev => ({ ...prev, open }))}
        tipo={showMovementDialog.tipo}
        productos={productosInventario}
        onMovimiento={handleMovimiento}
      />
    </div>
  );
};

export default InventarioModule;
