import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useContabilidadIntegration } from '@/hooks/useContabilidadIntegration';
import { 
  CheckCircle, 
  ArrowRightLeft, 
  TrendingUp, 
  Scale, 
  AlertCircle,
  FileText,
  BarChart3,
  DollarSign,
  RefreshCw
} from 'lucide-react';

const IntegracionContableDemo = () => {
  const [datosIntegracion, setDatosIntegracion] = useState({
    comprobantesIntegrados: 0,
    asientosGenerados: 0,
    impactoBalance: 0,
    impactoResultados: 0,
    ecuacionBalanceada: false
  });

  const { getBalanceSheetData, getIncomeStatementData, getAsientos } = useContabilidadIntegration();

  useEffect(() => {
    calcularDatosIntegracion();
  }, []);

  const calcularDatosIntegracion = () => {
    try {
      // Obtener comprobantes integrados
      const comprobantes = JSON.parse(localStorage.getItem('comprobantes_integrados') || '[]');
      const comprobantesIntegrados = comprobantes.filter((c: any) => c.asientoGenerado && c.estado === 'autorizado');
      
      // Obtener asientos contables
      const asientos = getAsientos();
      const asientosDeComprobantes = asientos.filter(a => a.referencia && a.referencia.includes('COMP-'));
      
      // Obtener datos de balance y resultados
      const balanceData = getBalanceSheetData();
      const resultadosData = getIncomeStatementData();
      
      // Calcular impactos
      const impactoBalance = comprobantesIntegrados
        .filter((c: any) => c.tipo === 'traspaso')
        .reduce((sum: number, c: any) => sum + c.monto, 0);
      
      const impactoResultados = comprobantesIntegrados
        .reduce((sum: number, c: any) => {
          if (c.tipo === 'ingreso') return sum + c.monto;
          if (c.tipo === 'egreso') return sum - c.monto;
          return sum;
        }, 0);

      setDatosIntegracion({
        comprobantesIntegrados: comprobantesIntegrados.length,
        asientosGenerados: asientosDeComprobantes.length,
        impactoBalance,
        impactoResultados,
        ecuacionBalanceada: balanceData.ecuacionCuadrada
      });
    } catch (error) {
      console.error('Error calculando datos de integración:', error);
    }
  };

  const demostrarIntegracion = () => {
    // Crear un comprobante de ejemplo para demostrar la integración
    const comprobanteDemo = {
      id: `demo-${Date.now()}`,
      tipo: 'ingreso',
      numero: `DEMO-${Math.floor(Math.random() * 1000)}`,
      fecha: new Date().toISOString().split('T')[0],
      concepto: 'Venta de demostración - Integración automática',
      beneficiario: 'Cliente Demo S.R.L.',
      monto: 2300.00,
      metodoPago: '1112',
      referencia: 'DEMO-FAC-001',
      observaciones: 'Comprobante de demostración para mostrar integración',
      estado: 'autorizado',
      creadoPor: 'Sistema Demo',
      fechaCreacion: new Date().toISOString(),
      cuentas: [
        { codigo: '1112', nombre: 'Banco Nacional de Bolivia', debe: 2300.00, haber: 0 },
        { codigo: '4111', nombre: 'Ventas de Mercaderías', debe: 0, haber: 2000.00 },
        { codigo: '2141', nombre: 'IVA por Pagar', debe: 0, haber: 300.00 }
      ],
      asientoGenerado: true,
      asientoId: `ASI-DEMO-${Date.now()}`
    };

    // Guardar el comprobante demo
    const comprobantes = JSON.parse(localStorage.getItem('comprobantes_integrados') || '[]');
    comprobantes.unshift(comprobanteDemo);
    localStorage.setItem('comprobantes_integrados', JSON.stringify(comprobantes));

    // Generar el asiento contable correspondiente
    const asientoDemo = {
      id: comprobanteDemo.asientoId,
      numero: `DEMO-${comprobanteDemo.numero}`,
      fecha: comprobanteDemo.fecha,
      concepto: comprobanteDemo.concepto,
      referencia: comprobanteDemo.numero,
      debe: 2300,
      haber: 2300,
      estado: 'registrado' as const,
      cuentas: comprobanteDemo.cuentas.map(cuenta => ({
        ...cuenta,
        descripcion: cuenta.nombre
      })),
      origen: 'comprobante',
      comprobanteId: comprobanteDemo.id
    };

    // Guardar el asiento
    const asientos = JSON.parse(localStorage.getItem('asientosContables') || '[]');
    asientos.unshift(asientoDemo);
    localStorage.setItem('asientosContables', JSON.stringify(asientos));

    // Actualizar estadísticas
    calcularDatosIntegracion();
  };

  const limpiarDemostracion = () => {
    // Remover comprobantes y asientos de demostración
    let comprobantes = JSON.parse(localStorage.getItem('comprobantes_integrados') || '[]');
    comprobantes = comprobantes.filter((c: any) => !c.id.startsWith('demo-'));
    localStorage.setItem('comprobantes_integrados', JSON.stringify(comprobantes));

    let asientos = JSON.parse(localStorage.getItem('asientosContables') || '[]');
    asientos = asientos.filter((a: any) => !a.id.startsWith('ASI-DEMO-'));
    localStorage.setItem('asientosContables', JSON.stringify(asientos));

    calcularDatosIntegracion();
  };

  const FlujoDatos = () => {
    const balanceData = getBalanceSheetData();
    const resultadosData = getIncomeStatementData();

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowRightLeft className="w-5 h-5 text-blue-600" />
              Flujo de Integración Contable
            </CardTitle>
            <CardDescription>
              Cómo los comprobantes se integran automáticamente al sistema contable
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                <FileText className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <div className="font-semibold text-blue-800">1. Comprobante</div>
                <div className="text-sm text-blue-600">Ingreso/Egreso/Traspaso</div>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg border-2 border-green-200">
                <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-600" />
                <div className="font-semibold text-green-800">2. Autorización</div>
                <div className="text-sm text-green-600">Validación automática</div>
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
                <BarChart3 className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                <div className="font-semibold text-purple-800">3. Asiento</div>
                <div className="text-sm text-purple-600">Partida doble automática</div>
              </div>
              
              <div className="text-center p-4 bg-orange-50 rounded-lg border-2 border-orange-200">
                <TrendingUp className="w-8 h-8 mx-auto mb-2 text-orange-600" />
                <div className="font-semibold text-orange-800">4. Estados</div>
                <div className="text-sm text-orange-600">Balance y Resultados</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-green-600" />
                Impacto en Balance General
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Total Activos:</span>
                  <span className="font-bold text-green-600">
                    Bs. {balanceData.activos.total.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Total Pasivos:</span>
                  <span className="font-bold text-red-600">
                    Bs. {balanceData.pasivos.total.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Total Patrimonio:</span>
                  <span className="font-bold text-blue-600">
                    Bs. {balanceData.patrimonio.total.toLocaleString()}
                  </span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between items-center">
                    <span>Ecuación Contable:</span>
                    <Badge variant={balanceData.ecuacionCuadrada ? "default" : "destructive"}>
                      {balanceData.ecuacionCuadrada ? "Balanceada" : "Desbalanceada"}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                Impacto en Estado de Resultados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Total Ingresos:</span>
                  <span className="font-bold text-green-600">
                    Bs. {resultadosData.ingresos.total.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Total Gastos:</span>
                  <span className="font-bold text-red-600">
                    Bs. {resultadosData.gastos.total.toLocaleString()}
                  </span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between items-center">
                    <span>Utilidad Neta:</span>
                    <span className={`font-bold ${resultadosData.utilidadNeta >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      Bs. {resultadosData.utilidadNeta.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Integración Contable</h2>
          <p className="text-muted-foreground">
            Demostración de la integración automática entre comprobantes, balance y estado de resultados
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={calcularDatosIntegracion} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualizar
          </Button>
          <Button onClick={demostrarIntegracion} className="bg-blue-600 hover:bg-blue-700">
            <CheckCircle className="w-4 h-4 mr-2" />
            Demostrar Integración
          </Button>
          <Button onClick={limpiarDemostracion} variant="outline">
            Limpiar Demo
          </Button>
        </div>
      </div>

      {/* Métricas de Integración */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Comprobantes</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{datosIntegracion.comprobantesIntegrados}</div>
            <p className="text-xs text-muted-foreground">Integrados al sistema</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Asientos</CardTitle>
            <BarChart3 className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{datosIntegracion.asientosGenerados}</div>
            <p className="text-xs text-muted-foreground">Generados automáticamente</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Impacto Balance</CardTitle>
            <Scale className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              Bs. {Math.abs(datosIntegracion.impactoBalance).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">En traspasos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Impacto Resultados</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              Bs. {Math.abs(datosIntegracion.impactoResultados).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">En ingresos/gastos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estado</CardTitle>
            {datosIntegracion.ecuacionBalanceada ? 
              <CheckCircle className="h-4 w-4 text-green-600" /> : 
              <AlertCircle className="h-4 w-4 text-red-600" />
            }
          </CardHeader>
          <CardContent>
            <div className={`text-lg font-bold ${datosIntegracion.ecuacionBalanceada ? 'text-green-600' : 'text-red-600'}`}>
              {datosIntegracion.ecuacionBalanceada ? 'Balanceado' : 'Desbalanceado'}
            </div>
            <p className="text-xs text-muted-foreground">Ecuación contable</p>
          </CardContent>
        </Card>
      </div>

      {/* Estado de la Integración */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Estado de la Integración Contable
          </CardTitle>
          <CardDescription>
            Validación de la integridad y consistencia del sistema contable integrado
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`p-4 rounded-lg ${datosIntegracion.ecuacionBalanceada ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <div className="flex items-center gap-2 mb-2">
                {datosIntegracion.ecuacionBalanceada ? 
                  <CheckCircle className="w-5 h-5 text-green-600" /> : 
                  <AlertCircle className="w-5 h-5 text-red-600" />
                }
                <span className={`font-semibold ${datosIntegracion.ecuacionBalanceada ? 'text-green-800' : 'text-red-800'}`}>
                  Ecuación Contable
                </span>
              </div>
              <p className={`text-sm ${datosIntegracion.ecuacionBalanceada ? 'text-green-700' : 'text-red-700'}`}>
                {datosIntegracion.ecuacionBalanceada ? 
                  'Activos = Pasivos + Patrimonio' : 
                  'La ecuación contable no está balanceada'
                }
              </p>
            </div>

            <div className={`p-4 rounded-lg ${datosIntegracion.comprobantesIntegrados > 0 ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50 border border-gray-200'}`}>
              <div className="flex items-center gap-2 mb-2">
                <FileText className={`w-5 h-5 ${datosIntegracion.comprobantesIntegrados > 0 ? 'text-blue-600' : 'text-gray-400'}`} />
                <span className={`font-semibold ${datosIntegracion.comprobantesIntegrados > 0 ? 'text-blue-800' : 'text-gray-600'}`}>
                  Comprobantes Integrados
                </span>
              </div>
              <p className={`text-sm ${datosIntegracion.comprobantesIntegrados > 0 ? 'text-blue-700' : 'text-gray-600'}`}>
                {datosIntegracion.comprobantesIntegrados} comprobantes generando asientos automáticamente
              </p>
            </div>

            <div className={`p-4 rounded-lg ${datosIntegracion.asientosGenerados > 0 ? 'bg-purple-50 border border-purple-200' : 'bg-gray-50 border border-gray-200'}`}>
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className={`w-5 h-5 ${datosIntegracion.asientosGenerados > 0 ? 'text-purple-600' : 'text-gray-400'}`} />
                <span className={`font-semibold ${datosIntegracion.asientosGenerados > 0 ? 'text-purple-800' : 'text-gray-600'}`}>
                  Asientos Automáticos
                </span>
              </div>
              <p className={`text-sm ${datosIntegracion.asientosGenerados > 0 ? 'text-purple-700' : 'text-gray-600'}`}>
                {datosIntegracion.asientosGenerados} asientos contables generados automáticamente
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="flujo" className="space-y-4">
        <TabsList>
          <TabsTrigger value="flujo">Flujo de Datos</TabsTrigger>
          <TabsTrigger value="validacion">Validaciones</TabsTrigger>
          <TabsTrigger value="beneficios">Beneficios</TabsTrigger>
        </TabsList>

        <TabsContent value="flujo">
          <FlujoDatos />
        </TabsContent>

        <TabsContent value="validacion">
          <Card>
            <CardHeader>
              <CardTitle>Validaciones del Sistema Integrado</CardTitle>
              <CardDescription>
                Controles automáticos que aseguran la integridad contable
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <div className="font-semibold text-green-800">Partida Doble</div>
                    <div className="text-sm text-green-700">
                      Cada comprobante valida que la suma del debe sea igual a la suma del haber
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <div className="font-semibold text-blue-800">Plan de Cuentas</div>
                    <div className="text-sm text-blue-700">
                      Verifica que todas las cuentas utilizadas existan en el plan de cuentas
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-purple-600 mt-0.5" />
                  <div>
                    <div className="font-semibold text-purple-800">Ecuación Contable</div>
                    <div className="text-sm text-purple-700">
                      Mantiene balanceada la ecuación fundamental: Activos = Pasivos + Patrimonio
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-orange-600 mt-0.5" />
                  <div>
                    <div className="font-semibold text-orange-800">Trazabilidad</div>
                    <div className="text-sm text-orange-700">
                      Cada asiento mantiene referencia al comprobante que lo originó
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="beneficios">
          <Card>
            <CardHeader>
              <CardTitle>Beneficios de la Integración</CardTitle>
              <CardDescription>
                Ventajas del sistema contable integrado según normativa boliviana
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">Operacionales</h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-1" />
                      <span className="text-sm">Eliminación de doble digitación</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-1" />
                      <span className="text-sm">Reducción de errores humanos</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-1" />
                      <span className="text-sm">Actualización en tiempo real</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-1" />
                      <span className="text-sm">Generación automática de asientos</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">Cumplimiento</h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-600 mt-1" />
                      <span className="text-sm">Cumplimiento normativa boliviana</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-600 mt-1" />
                      <span className="text-sm">Trazabilidad completa de transacciones</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-600 mt-1" />
                      <span className="text-sm">Estados financieros consistentes</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-600 mt-1" />
                      <span className="text-sm">Facilita auditorías</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IntegracionContableDemo;