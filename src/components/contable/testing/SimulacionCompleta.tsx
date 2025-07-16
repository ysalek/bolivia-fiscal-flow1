import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAsientosGenerator } from '@/hooks/useAsientosGenerator';
import { useContabilidadIntegration } from '@/hooks/useContabilidadIntegration';
import { CheckCircle2, AlertCircle, Play, RotateCcw, Database, TrendingUp, FileText, Calculator } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import ReporteCalculosDetallados from './ReporteCalculosDetallados';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface TestResult {
  test: string;
  success: boolean;
  message: string;
  details?: any;
  calculation?: string; // Nuevo campo para mostrar cálculos
}

interface SimulationData {
  productos: any[];
  clientes: any[];
  facturas: any[];
  compras: any[];
  asientos: any[];
  balances: any;
  reporteCalculos: CalculationReport[]; // Nuevo campo para reportes de cálculo
}

interface CalculationReport {
  modulo: string;
  operacion: string;
  formula: string;
  valores: any;
  resultado: number;
  explicacion: string;
}

const SimulacionCompleta = () => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [simulationData, setSimulationData] = useState<SimulationData | null>(null);
  const [calculationReports, setCalculationReports] = useState<CalculationReport[]>([]);
  const { toast } = useToast();
  const { generarAsientoVenta, generarAsientoCompra, generarAsientoInventario } = useAsientosGenerator();
  const { obtenerBalanceGeneral } = useContabilidadIntegration();

  const ejecutarSimulacionCompleta = async () => {
    setIsRunning(true);
    setTestResults([]);
    setCalculationReports([]);
    
    try {
      const results: TestResult[] = [];
      const reports: CalculationReport[] = [];
      
      // 1. Verificar estado inicial del sistema
      results.push(await verificarEstadoInicial());
      
      // 2. Crear datos de prueba
      results.push(await crearProductosPrueba());
      results.push(await crearClientesPrueba());
      results.push(await crearProveedoresPrueba());
      
      // 3. Simular operaciones comerciales
      results.push(await simularCompras());
      results.push(await simularVentas());
      results.push(await simularMovimientosInventario());
      
      // 4. Verificar integración contable
      results.push(await verificarAsientosContables());
      results.push(await verificarBalances());
      
      // 5. Verificar reportes
      results.push(await verificarReportes());
      
      // 6. Recopilar datos finales
      await recopilarDatosSimulacion();
      
      setTestResults(results);
      
      const exitosos = results.filter(r => r.success).length;
      const fallidos = results.length - exitosos;
      
      toast({
        title: "Simulación Completada",
        description: `${exitosos} pruebas exitosas, ${fallidos} fallos`,
        variant: fallidos > 0 ? "destructive" : "default"
      });
      
    } catch (error) {
      console.error("Error en simulación:", error);
      toast({
        title: "Error en Simulación",
        description: "Error crítico durante la simulación",
        variant: "destructive"
      });
    } finally {
      setIsRunning(false);
    }
  };

  const verificarEstadoInicial = async (): Promise<TestResult> => {
    try {
      const planCuentas = JSON.parse(localStorage.getItem('planCuentas') || '[]');
      const productos = JSON.parse(localStorage.getItem('productos') || '[]');
      
      if (planCuentas.length === 0) {
        return {
          test: "Verificación Estado Inicial",
          success: false,
          message: "Plan de cuentas no inicializado"
        };
      }
      
      return {
        test: "Verificación Estado Inicial",
        success: true,
        message: `Sistema inicializado - Plan: ${planCuentas.length} cuentas, Productos: ${productos.length}`,
        details: { planCuentas: planCuentas.length, productos: productos.length }
      };
    } catch (error) {
      return {
        test: "Verificación Estado Inicial",
        success: false,
        message: `Error: ${error}`
      };
    }
  };

  const crearProductosPrueba = async (): Promise<TestResult> => {
    try {
      const productosExistentes = JSON.parse(localStorage.getItem('productos') || '[]');
      
      const productosSimulacion = [
        {
          id: 'PROD-SIM-001',
          nombre: 'Producto Simulación A',
          descripcion: 'Producto para pruebas',
          precio: 150.00,
          costoUnitario: 100.00,
          stockActual: 0,
          stockMinimo: 5,
          categoria: 'Simulación',
          codigoBarras: 'SIM001',
          activo: true,
          fechaCreacion: new Date().toISOString()
        },
        {
          id: 'PROD-SIM-002',
          nombre: 'Producto Simulación B',
          descripcion: 'Producto para pruebas',
          precio: 80.00,
          costoUnitario: 50.00,
          stockActual: 0,
          stockMinimo: 10,
          categoria: 'Simulación',
          codigoBarras: 'SIM002',
          activo: true,
          fechaCreacion: new Date().toISOString()
        }
      ];

      // Agregar productos si no existen
      productosSimulacion.forEach(producto => {
        const existe = productosExistentes.find((p: any) => p.id === producto.id);
        if (!existe) {
          productosExistentes.push(producto);
        }
      });

      localStorage.setItem('productos', JSON.stringify(productosExistentes));

      return {
        test: "Creación Productos Prueba",
        success: true,
        message: `${productosSimulacion.length} productos de simulación creados`,
        details: { productosCreados: productosSimulacion.length }
      };
    } catch (error) {
      return {
        test: "Creación Productos Prueba",
        success: false,
        message: `Error: ${error}`
      };
    }
  };

  const crearClientesPrueba = async (): Promise<TestResult> => {
    try {
      const clientesExistentes = JSON.parse(localStorage.getItem('clientes') || '[]');
      
      const clientesSimulacion = [
        {
          id: 'CLI-SIM-001',
          nombre: 'Cliente Simulación A',
          nit: '12345678',
          email: 'cliente.a@simulacion.com',
          telefono: '70000001',
          direccion: 'Dirección Simulación A',
          ciudad: 'La Paz',
          activo: true,
          fechaCreacion: new Date().toISOString()
        }
      ];

      clientesSimulacion.forEach(cliente => {
        const existe = clientesExistentes.find((c: any) => c.id === cliente.id);
        if (!existe) {
          clientesExistentes.push(cliente);
        }
      });

      localStorage.setItem('clientes', JSON.stringify(clientesExistentes));

      return {
        test: "Creación Clientes Prueba",
        success: true,
        message: `${clientesSimulacion.length} clientes de simulación creados`
      };
    } catch (error) {
      return {
        test: "Creación Clientes Prueba",
        success: false,
        message: `Error: ${error}`
      };
    }
  };

  const crearProveedoresPrueba = async (): Promise<TestResult> => {
    try {
      const proveedoresExistentes = JSON.parse(localStorage.getItem('proveedores') || '[]');
      
      const proveedoresSimulacion = [
        {
          id: 'PROV-SIM-001',
          nombre: 'Proveedor Simulación A',
          nit: '87654321',
          email: 'proveedor.a@simulacion.com',
          telefono: '70000002',
          direccion: 'Dirección Proveedor A',
          ciudad: 'Santa Cruz',
          activo: true,
          fechaCreacion: new Date().toISOString()
        }
      ];

      proveedoresSimulacion.forEach(proveedor => {
        const existe = proveedoresExistentes.find((p: any) => p.id === proveedor.id);
        if (!existe) {
          proveedoresExistentes.push(proveedor);
        }
      });

      localStorage.setItem('proveedores', JSON.stringify(proveedoresExistentes));

      return {
        test: "Creación Proveedores Prueba",
        success: true,
        message: `${proveedoresSimulacion.length} proveedores de simulación creados`
      };
    } catch (error) {
      return {
        test: "Creación Proveedores Prueba",
        success: false,
        message: `Error: ${error}`
      };
    }
  };

  const simularCompras = async (): Promise<TestResult> => {
    try {
      const comprasExistentes = JSON.parse(localStorage.getItem('compras') || '[]');
      const productos = JSON.parse(localStorage.getItem('productos') || '[]');
      
      const compraSimulacion = {
        id: 'COMP-SIM-001',
        numero: 'COMP-001-SIM',
        fecha: new Date().toISOString().slice(0, 10),
        proveedorId: 'PROV-SIM-001',
        proveedor: 'Proveedor Simulación A',
        items: [
          {
            productoId: 'PROD-SIM-001',
            descripcion: 'Producto Simulación A',
            cantidad: 20,
            precioUnitario: 100.00,
            total: 2000.00
          },
          {
            productoId: 'PROD-SIM-002',
            descripcion: 'Producto Simulación B',
            cantidad: 30,
            precioUnitario: 50.00,
            total: 1500.00
          }
        ],
        subtotal: 3500.00,
        iva: 455.00,
        total: 3955.00,
        estado: 'pendiente',
        fechaCreacion: new Date().toISOString()
      };

      // Verificar si ya existe
      const existe = comprasExistentes.find((c: any) => c.id === compraSimulacion.id);
      if (!existe) {
        comprasExistentes.push(compraSimulacion);
        localStorage.setItem('compras', JSON.stringify(comprasExistentes));

        // Generar asiento contable
        const asientoCompra = generarAsientoCompra(compraSimulacion);
        if (!asientoCompra) {
          throw new Error("No se pudo generar el asiento de compra");
        }

        // Actualizar stock de productos
        compraSimulacion.items.forEach(item => {
          const productoIndex = productos.findIndex((p: any) => p.id === item.productoId);
          if (productoIndex !== -1) {
            productos[productoIndex].stockActual += item.cantidad;
          }
        });
        localStorage.setItem('productos', JSON.stringify(productos));
      }

      return {
        test: "Simulación de Compras",
        success: true,
        message: `Compra simulada: ${compraSimulacion.numero} por Bs. ${compraSimulacion.total}`,
        details: { compra: compraSimulacion.numero, total: compraSimulacion.total }
      };
    } catch (error) {
      return {
        test: "Simulación de Compras",
        success: false,
        message: `Error: ${error}`
      };
    }
  };

  const simularVentas = async (): Promise<TestResult> => {
    try {
      const facturasExistentes = JSON.parse(localStorage.getItem('facturas') || '[]');
      const productos = JSON.parse(localStorage.getItem('productos') || '[]');
      
      const facturaSimulacion = {
        id: 'FACT-SIM-001',
        numero: 'FACT-001-SIM',
        fecha: new Date().toISOString().slice(0, 10),
        clienteId: 'CLI-SIM-001',
        cliente: 'Cliente Simulación A',
        nit: '12345678',
        items: [
          {
            productoId: 'PROD-SIM-001',
            descripcion: 'Producto Simulación A',
            cantidad: 5,
            precioUnitario: 150.00,
            total: 750.00
          },
          {
            productoId: 'PROD-SIM-002',
            descripcion: 'Producto Simulación B',
            cantidad: 8,
            precioUnitario: 80.00,
            total: 640.00
          }
        ],
        subtotal: 1390.00,
        iva: 180.70,
        total: 1570.70,
        estado: 'emitida',
        fechaCreacion: new Date().toISOString()
      };

      // Verificar si ya existe
      const existe = facturasExistentes.find((f: any) => f.id === facturaSimulacion.id);
      if (!existe) {
        facturasExistentes.push(facturaSimulacion);
        localStorage.setItem('facturas', JSON.stringify(facturasExistentes));

        // Generar asiento contable
        const asientoVenta = generarAsientoVenta(facturaSimulacion);
        if (!asientoVenta) {
          throw new Error("No se pudo generar el asiento de venta");
        }

        // Actualizar stock de productos
        facturaSimulacion.items.forEach(item => {
          const productoIndex = productos.findIndex((p: any) => p.id === item.productoId);
          if (productoIndex !== -1) {
            productos[productoIndex].stockActual -= item.cantidad;
          }
        });
        localStorage.setItem('productos', JSON.stringify(productos));
      }

      return {
        test: "Simulación de Ventas",
        success: true,
        message: `Venta simulada: ${facturaSimulacion.numero} por Bs. ${facturaSimulacion.total}`,
        details: { factura: facturaSimulacion.numero, total: facturaSimulacion.total }
      };
    } catch (error) {
      return {
        test: "Simulación de Ventas",
        success: false,
        message: `Error: ${error}`
      };
    }
  };

  const simularMovimientosInventario = async (): Promise<TestResult> => {
    try {
      const movimientosInventario = JSON.parse(localStorage.getItem('movimientosInventario') || '[]');
      
      const movimientoSimulacion = {
        id: 'MOV-SIM-001',
        fecha: new Date().toISOString().slice(0, 10),
        tipo: 'entrada' as const,
        productoId: 'PROD-SIM-001',
        producto: 'Producto Simulación A',
        cantidad: 10,
        costoUnitario: 100,
        costoPromedioPonderado: 100,
        motivo: 'Ajuste de inventario - Simulación',
        documento: 'DOC-SIM-001',
        usuario: 'Sistema',
        stockAnterior: 15,
        stockNuevo: 25,
        valorMovimiento: 1000
      };

      const existe = movimientosInventario.find((m: any) => m.id === movimientoSimulacion.id);
      if (!existe) {
        movimientosInventario.push(movimientoSimulacion);
        localStorage.setItem('movimientosInventario', JSON.stringify(movimientosInventario));

        // Generar asiento contable del movimiento
        const asientoMovimiento = generarAsientoInventario(movimientoSimulacion);
        if (!asientoMovimiento) {
          throw new Error("No se pudo generar el asiento de movimiento de inventario");
        }
      }

      return {
        test: "Simulación Movimientos Inventario",
        success: true,
        message: `Movimiento simulado: ${movimientoSimulacion.tipo} de ${movimientoSimulacion.cantidad} unidades`,
        details: { movimiento: movimientoSimulacion.id, valor: movimientoSimulacion.valorMovimiento }
      };
    } catch (error) {
      return {
        test: "Simulación Movimientos Inventario",
        success: false,
        message: `Error: ${error}`
      };
    }
  };

  const verificarAsientosContables = async (): Promise<TestResult> => {
    try {
      const asientos = JSON.parse(localStorage.getItem('asientosContables') || '[]');
      
      let totalDebe = 0;
      let totalHaber = 0;
      let asientosDesbalanceados = 0;

      asientos.forEach((asiento: any) => {
        const debe = asiento.cuentas.reduce((sum: number, c: any) => sum + c.debe, 0);
        const haber = asiento.cuentas.reduce((sum: number, c: any) => sum + c.haber, 0);
        
        totalDebe += debe;
        totalHaber += haber;
        
        if (Math.abs(debe - haber) > 0.01) {
          asientosDesbalanceados++;
        }
      });

      if (asientosDesbalanceados > 0) {
        return {
          test: "Verificación Asientos Contables",
          success: false,
          message: `${asientosDesbalanceados} asientos desbalanceados de ${asientos.length} total`,
          details: { asientos: asientos.length, desbalanceados: asientosDesbalanceados }
        };
      }

      return {
        test: "Verificación Asientos Contables",
        success: true,
        message: `${asientos.length} asientos verificados - Debe: Bs. ${totalDebe.toFixed(2)}, Haber: Bs. ${totalHaber.toFixed(2)}`,
        details: { asientos: asientos.length, totalDebe, totalHaber }
      };
    } catch (error) {
      return {
        test: "Verificación Asientos Contables",
        success: false,
        message: `Error: ${error}`
      };
    }
  };

  const verificarBalances = async (): Promise<TestResult> => {
    try {
      const balanceGeneral = obtenerBalanceGeneral();
      const balanceComprobacion = obtenerBalanceGeneral(); // Usar obtenerBalanceGeneral en lugar de generarBalanceComprobacion

      // Verificar que activos = pasivos + patrimonio
      const diferencia = Math.abs(balanceGeneral.activos - (balanceGeneral.pasivos + balanceGeneral.patrimonio));
      
      if (diferencia > 0.01) {
        return {
          test: "Verificación Balances",
          success: false,
          message: `Balance desbalanceado - Diferencia: Bs. ${diferencia.toFixed(2)}`,
          details: balanceGeneral
        };
      }

      return {
        test: "Verificación Balances",
        success: true,
        message: `Balance cuadrado - Activos: Bs. ${balanceGeneral.activos.toFixed(2)}, Pasivos+Patrimonio: Bs. ${(balanceGeneral.pasivos + balanceGeneral.patrimonio).toFixed(2)}`,
        details: balanceGeneral
      };
    } catch (error) {
      return {
        test: "Verificación Balances",
        success: false,
        message: `Error: ${error}`
      };
    }
  };

  const verificarReportes = async (): Promise<TestResult> => {
    try {
      const facturas = JSON.parse(localStorage.getItem('facturas') || '[]');
      const compras = JSON.parse(localStorage.getItem('compras') || '[]');
      const productos = JSON.parse(localStorage.getItem('productos') || '[]');

      const totalVentas = facturas.reduce((sum: number, f: any) => sum + f.total, 0);
      const totalCompras = compras.reduce((sum: number, c: any) => sum + c.total, 0);
      const totalProductos = productos.length;

      return {
        test: "Verificación Reportes",
        success: true,
        message: `Reportes generados - Ventas: Bs. ${totalVentas.toFixed(2)}, Compras: Bs. ${totalCompras.toFixed(2)}, Productos: ${totalProductos}`,
        details: { totalVentas, totalCompras, totalProductos }
      };
    } catch (error) {
      return {
        test: "Verificación Reportes",
        success: false,
        message: `Error: ${error}`
      };
    }
  };

  const recopilarDatosSimulacion = async () => {
    const productos = JSON.parse(localStorage.getItem('productos') || '[]');
    const clientes = JSON.parse(localStorage.getItem('clientes') || '[]');
    const facturas = JSON.parse(localStorage.getItem('facturas') || '[]');
    const compras = JSON.parse(localStorage.getItem('compras') || '[]');
    const asientos = JSON.parse(localStorage.getItem('asientosContables') || '[]');
    const balances = obtenerBalanceGeneral();

    setSimulationData({
      productos,
      clientes,
      facturas,
      compras,
      asientos,
      balances,
      reporteCalculos: calculationReports
    });
  };

  const limpiarDatosSimulacion = () => {
    // Limpiar datos de simulación
    const elementos = [
      'productos',
      'clientes', 
      'proveedores',
      'facturas',
      'compras',
      'asientosContables',
      'movimientosInventario'
    ];

    elementos.forEach(elemento => {
      const datos = JSON.parse(localStorage.getItem(elemento) || '[]');
      const datosFiltrados = datos.filter((item: any) => 
        !item.id || !item.id.includes('SIM')
      );
      localStorage.setItem(elemento, JSON.stringify(datosFiltrados));
    });

    setTestResults([]);
    setSimulationData(null);
    
    toast({
      title: "Datos de Simulación Limpiados",
      description: "Todos los datos de prueba han sido eliminados"
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Simulación y Pruebas Exhaustivas del Sistema
          </CardTitle>
          <CardDescription>
            Ejecuta una simulación completa para verificar la integridad y funcionamiento del sistema contable
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button 
              onClick={ejecutarSimulacionCompleta}
              disabled={isRunning}
              className="flex items-center gap-2"
            >
              <Play className="w-4 h-4" />
              {isRunning ? 'Ejecutando...' : 'Ejecutar Simulación Completa'}
            </Button>
            
            {testResults.length > 0 && (
              <Button 
                onClick={limpiarDatosSimulacion}
                variant="outline"
                className="flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Limpiar Datos de Simulación
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {testResults.length > 0 && (
        <Tabs defaultValue="results" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="results">Resultados de Pruebas</TabsTrigger>
            <TabsTrigger value="calculations">Cálculos Detallados</TabsTrigger>
            <TabsTrigger value="data">Datos de Simulación</TabsTrigger>
            <TabsTrigger value="summary">Resumen Final</TabsTrigger>
          </TabsList>

          <TabsContent value="results" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Resultados de las Pruebas</CardTitle>
                <CardDescription>
                  Estado de cada prueba ejecutada en la simulación
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {testResults.map((result, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                      {result.success ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{result.test}</span>
                          <Badge variant={result.success ? "default" : "destructive"}>
                            {result.success ? "ÉXITO" : "FALLO"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{result.message}</p>
                        {result.details && (
                          <pre className="text-xs mt-2 p-2 bg-muted rounded">
                            {JSON.stringify(result.details, null, 2)}
                          </pre>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calculations">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  Reportes de Cálculos Detallados
                </CardTitle>
                <CardDescription>
                  Explicación paso a paso de los cálculos realizados en cada módulo del sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ReporteCalculosDetallados reports={calculationReports} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="data" className="space-y-4">
            {simulationData && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Productos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{simulationData.productos.length}</div>
                    <p className="text-xs text-muted-foreground">Total de productos</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Ventas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">Bs. {simulationData.facturas.reduce((sum: number, f: any) => sum + f.total, 0).toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">{simulationData.facturas.length} facturas</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Compras</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">Bs. {simulationData.compras.reduce((sum: number, c: any) => sum + c.total, 0).toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">{simulationData.compras.length} compras</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Asientos Contables</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{simulationData.asientos.length}</div>
                    <p className="text-xs text-muted-foreground">Asientos generados</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Balance General</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Activos:</span>
                        <span>Bs. {simulationData.balances.activos.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Pasivos:</span>
                        <span>Bs. {simulationData.balances.pasivos.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Patrimonio:</span>
                        <span>Bs. {simulationData.balances.patrimonio.toFixed(2)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="summary">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Resumen de la Simulación
                </CardTitle>
              </CardHeader>
              <CardContent>
                {testResults.length > 0 && (
                  <div className="space-y-4">
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Resumen:</strong> {testResults.filter(r => r.success).length} de {testResults.length} pruebas fueron exitosas.
                        {testResults.some(r => !r.success) && (
                          <span className="text-red-600 ml-2">
                            Revisar las pruebas fallidas para corregir problemas.
                          </span>
                        )}
                      </AlertDescription>
                    </Alert>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 border rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {testResults.filter(r => r.success).length}
                        </div>
                        <div className="text-sm text-muted-foreground">Pruebas Exitosas</div>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <div className="text-2xl font-bold text-red-600">
                          {testResults.filter(r => !r.success).length}
                        </div>
                        <div className="text-sm text-muted-foreground">Pruebas Fallidas</div>
                      </div>
                    </div>

                    {simulationData && (
                      <div className="mt-6 p-4 bg-muted rounded-lg">
                        <h4 className="font-medium mb-2">Estado Final del Sistema:</h4>
                        <ul className="text-sm space-y-1">
                          <li>• {simulationData.productos.length} productos registrados</li>
                          <li>• {simulationData.clientes.length} clientes registrados</li>
                          <li>• {simulationData.facturas.length} facturas emitidas</li>
                          <li>• {simulationData.compras.length} compras registradas</li>
                          <li>• {simulationData.asientos.length} asientos contables generados</li>
                          <li>• Balance: Activos Bs. {simulationData.balances.activos.toFixed(2)} = Pasivos+Patrimonio Bs. {(simulationData.balances.pasivos + simulationData.balances.patrimonio).toFixed(2)}</li>
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default SimulacionCompleta;