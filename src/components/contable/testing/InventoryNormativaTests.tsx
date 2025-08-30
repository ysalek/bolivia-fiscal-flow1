import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TestTube, PlayCircle, CheckCircle, XCircle, Calculator, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAsientosGenerator } from "@/hooks/useAsientosGenerator";
import { useAsientos } from "@/hooks/useAsientos";
import { MovimientoInventario, ProductoInventario } from "../inventory/InventoryData";

interface TestResult {
  testName: string;
  passed: boolean;
  expected: any;
  actual: any;
  description: string;
  normativa: string;
}

const InventoryNormativaTests = () => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const { generarAsientoInventario } = useAsientosGenerator();
  const { getAsientos } = useAsientos();
  const { toast } = useToast();

  const productoTest: ProductoInventario = {
    id: "TEST001",
    codigo: "TEST001",
    nombre: "Producto Normativa Test",
    categoria: "Test",
    stockActual: 100,
    stockMinimo: 10,
    stockMaximo: 500,
    costoUnitario: 50,
    costoPromedioPonderado: 50,
    precioVenta: 75,
    ubicacion: "Almacén Test",
    fechaUltimoMovimiento: new Date().toISOString().slice(0, 10),
    valorTotalInventario: 5000
  };

  const runNormativaTests = async () => {
    setIsRunningTests(true);
    const results: TestResult[] = [];

    try {
      // TEST 1: Compra para inventario debe ir a activo (1141)
      const compraInventario: MovimientoInventario = {
        id: "TEST_COMPRA_001",
        fecha: new Date().toISOString().slice(0, 10),
        tipo: "entrada",
        productoId: productoTest.id,
        producto: productoTest.nombre,
        cantidad: 20,
        costoUnitario: 50,
        costoPromedioPonderado: 50,
        motivo: "Compra a proveedor para stock",
        documento: "FC-PROV-001",
        usuario: "Test User",
        stockAnterior: 100,
        stockNuevo: 120,
        valorMovimiento: 1000
      };

      const asientoCompra = generarAsientoInventario(compraInventario);
      
      if (asientoCompra) {
        const inventarioDebe = asientoCompra.cuentas.find(c => c.codigo === "1141")?.debe || 0;
        const cuentasPorPagarHaber = asientoCompra.cuentas.find(c => c.codigo === "2111")?.haber || 0;

        results.push({
          testName: "Compra para Inventario - Va a Activo",
          passed: inventarioDebe === 1000,
          expected: 1000,
          actual: inventarioDebe,
          description: "Las compras DEBEN capitalizarse en inventarios (1141), no en gastos",
          normativa: "Principio de capitalización de inventarios"
        });

        results.push({
          testName: "Compra para Inventario - Pasivo Correcto",
          passed: cuentasPorPagarHaber === 1000,
          expected: 1000,
          actual: cuentasPorPagarHaber,
          description: "La compra genera una obligación en cuentas por pagar",
          normativa: "Principio de partida doble"
        });
      }

      // TEST 2: Venta real debe ir SOLO a costo de ventas (5111)
      const ventaReal: MovimientoInventario = {
        id: "TEST_VENTA_001",
        fecha: new Date().toISOString().slice(0, 10),
        tipo: "salida",
        productoId: productoTest.id,
        producto: productoTest.nombre,
        cantidad: 10,
        costoUnitario: 50,
        costoPromedioPonderado: 50,
        motivo: "Venta según factura FV-001",
        documento: "FV-001",
        usuario: "Test User",
        stockAnterior: 120,
        stockNuevo: 110,
        valorMovimiento: 500
      };

      const asientoVenta = generarAsientoInventario(ventaReal);
      
      if (asientoVenta) {
        const costoVentasDebe = asientoVenta.cuentas.find(c => c.codigo === "5111")?.debe || 0;
        const inventarioHaber = asientoVenta.cuentas.find(c => c.codigo === "1141")?.haber || 0;
        const perdidasDebe = asientoVenta.cuentas.find(c => c.codigo === "5322")?.debe || 0;

        results.push({
          testName: "Venta Real - Va SOLO a Costo de Ventas",
          passed: costoVentasDebe === 500 && perdidasDebe === 0,
          expected: "Costo Ventas: 500, Pérdidas: 0",
          actual: `Costo Ventas: ${costoVentasDebe}, Pérdidas: ${perdidasDebe}`,
          description: "Las ventas reales DEBEN ir al costo de ventas para calcular utilidad bruta",
          normativa: "Normativa SIN - Determinación correcta de utilidad bruta"
        });

        results.push({
          testName: "Venta Real - Reduce Inventario Correctamente",
          passed: inventarioHaber === 500,
          expected: 500,
          actual: inventarioHaber,
          description: "La venta reduce el inventario por el costo, no por precio de venta",
          normativa: "Principio de valuación al costo histórico"
        });
      }

      // TEST 3: Pérdida NO debe ir a costo de ventas
      const perdidaProducto: MovimientoInventario = {
        id: "TEST_PERDIDA_001",
        fecha: new Date().toISOString().slice(0, 10),
        tipo: "salida",
        productoId: productoTest.id,
        producto: productoTest.nombre,
        cantidad: 5,
        costoUnitario: 50,
        costoPromedioPonderado: 50,
        motivo: "Pérdida por deterioro",
        documento: "AJUSTE-PERDIDA-001",
        usuario: "Test User",
        stockAnterior: 110,
        stockNuevo: 105,
        valorMovimiento: 250
      };

      const asientoPerdida = generarAsientoInventario(perdidaProducto);
      
      if (asientoPerdida) {
        const costoVentasDebe = asientoPerdida.cuentas.find(c => c.codigo === "5111")?.debe || 0;
        const perdidasDebe = asientoPerdida.cuentas.find(c => c.codigo === "5322")?.debe || 0;

        results.push({
          testName: "Pérdida - NO va a Costo de Ventas",
          passed: costoVentasDebe === 0,
          expected: 0,
          actual: costoVentasDebe,
          description: "Las pérdidas NO son ventas, no deben distorsionar la utilidad bruta",
          normativa: "Normativa SIN - Separación de gastos operativos y costo de ventas"
        });

        results.push({
          testName: "Pérdida - Va a Cuenta Específica",
          passed: perdidasDebe === 250,
          expected: 250,
          actual: perdidasDebe,
          description: "Las pérdidas van a cuenta específica (5322) para control fiscal",
          normativa: "Plan de Cuentas Boliviano 2025 - Cuenta 5322"
        });
      }

      // TEST 4: Inventario nunca debe ser negativo
      const todoAsientos = getAsientos().filter(a => a.estado === 'registrado');
      let saldoInventario = 0;
      
      todoAsientos.forEach(asiento => {
        asiento.cuentas.forEach(cuenta => {
          if (cuenta.codigo === "1141") {
            saldoInventario += cuenta.debe - cuenta.haber;
          }
        });
      });

      results.push({
        testName: "Saldo Inventario - Nunca Negativo",
        passed: saldoInventario >= 0,
        expected: "≥ 0",
        actual: saldoInventario.toFixed(2),
        description: "El inventario representa activos reales, no puede ser negativo",
        normativa: "Principio de realidad económica"
      });

      // TEST 5: Ecuación fundamental de inventarios
      let totalCompras = 0;
      let totalCostoVentas = 0;
      
      todoAsientos.forEach(asiento => {
        asiento.cuentas.forEach(cuenta => {
          if (cuenta.codigo === "1141" && cuenta.debe > 0) {
            totalCompras += cuenta.debe;
          }
          if (cuenta.codigo === "5111" && cuenta.debe > 0) {
            totalCostoVentas += cuenta.debe;
          }
        });
      });

      const inventarioCalculado = totalCompras - totalCostoVentas;
      const diferenciaEcuacion = Math.abs(saldoInventario - inventarioCalculado);

      results.push({
        testName: "Ecuación de Inventarios",
        passed: diferenciaEcuacion < 1,
        expected: "Inventario = Compras - Costo Ventas",
        actual: `Saldo: ${saldoInventario.toFixed(2)}, Calculado: ${inventarioCalculado.toFixed(2)}`,
        description: "Se cumple la ecuación fundamental: Inv.Final = Inv.Inicial + Compras - Costo Ventas",
        normativa: "Ecuación fundamental de inventarios - Normativa contable boliviana"
      });

    } catch (error) {
      results.push({
        testName: "Ejecución de Tests",
        passed: false,
        expected: "Ejecución exitosa",
        actual: error instanceof Error ? error.message : "Error desconocido",
        description: "Los tests deben ejecutarse sin errores",
        normativa: "Funcionamiento básico del sistema"
      });
    }

    setTestResults(results);
    setIsRunningTests(false);

    const passedTests = results.filter(r => r.passed).length;
    const totalTests = results.length;

    toast({
      title: "Tests de Normativa Completados",
      description: `${passedTests}/${totalTests} tests cumplen normativa boliviana`,
      variant: passedTests === totalTests ? "default" : "destructive"
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="w-6 h-6" />
            Tests de Cumplimiento Normativo - Inventarios Bolivia
          </CardTitle>
          <CardDescription>
            Verificación automática del cumplimiento de la normativa contable boliviana para inventarios
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button 
              onClick={runNormativaTests}
              disabled={isRunningTests}
              className="w-full"
            >
              <PlayCircle className="w-4 h-4 mr-2" />
              {isRunningTests ? 'Ejecutando Tests Normativos...' : 'Ejecutar Tests de Normativa Boliviana'}
            </Button>

            {testResults.length > 0 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {testResults.filter(r => r.passed).length}
                      </div>
                      <div className="text-sm text-muted-foreground">Cumplen Normativa</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-red-600">
                        {testResults.filter(r => !r.passed).length}
                      </div>
                      <div className="text-sm text-muted-foreground">Incumplen Normativa</div>
                    </CardContent>
                  </Card>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Estado</TableHead>
                      <TableHead>Test</TableHead>
                      <TableHead>Esperado</TableHead>
                      <TableHead>Actual</TableHead>
                      <TableHead>Descripción</TableHead>
                      <TableHead>Base Normativa</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {testResults.map((result, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {result.passed ? 
                              <CheckCircle className="w-5 h-5 text-green-500" /> : 
                              <XCircle className="w-5 h-5 text-red-500" />
                            }
                            <Badge variant={result.passed ? "default" : "destructive"}>
                              {result.passed ? "CUMPLE" : "INCUMPLE"}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{result.testName}</TableCell>
                        <TableCell>{String(result.expected)}</TableCell>
                        <TableCell>{String(result.actual)}</TableCell>
                        <TableCell className="text-sm text-muted-foreground max-w-md">
                          {result.description}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground max-w-md">
                          {result.normativa}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Normativa Contable Boliviana para Inventarios:</strong>
          <div className="mt-2 space-y-2">
            <div className="font-medium">Principios Fundamentales:</div>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li><strong>Capitalización:</strong> Las compras van al activo inventario (1141), no a gastos</li>
              <li><strong>Costo de Ventas:</strong> Solo incluye productos efectivamente vendidos</li>
              <li><strong>Separación:</strong> Pérdidas y faltantes van a cuentas específicas (5322)</li>
              <li><strong>Ecuación:</strong> Inventario Final = Inventario Inicial + Compras - Costo de Ventas</li>
              <li><strong>Realidad:</strong> El inventario nunca puede ser negativo</li>
            </ul>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default InventoryNormativaTests;