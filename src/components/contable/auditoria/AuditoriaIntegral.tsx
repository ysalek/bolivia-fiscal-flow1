import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Download,
  FileText,
  TrendingDown,
  Calculator
} from 'lucide-react';
import { useContabilidadIntegration } from '@/hooks/useContabilidadIntegration';
import { useToast } from '@/hooks/use-toast';

interface HallazgoAuditoria {
  id: string;
  tipo: 'critico' | 'alto' | 'medio' | 'bajo';
  categoria: 'contable' | 'tributario' | 'inventario' | 'facturacion' | 'nomina';
  titulo: string;
  descripcion: string;
  impacto: string;
  recomendacion: string;
  fecha: string;
  estado: 'pendiente' | 'en_proceso' | 'resuelto';
  responsable?: string;
}

interface PruebaAuditoria {
  id: string;
  nombre: string;
  descripcion: string;
  resultado: 'exitoso' | 'fallido' | 'pendiente';
  valorEsperado: any;
  valorObtenido: any;
  observaciones: string;
}

const AuditoriaIntegral = () => {
  const [hallazgos, setHallazgos] = useState<HallazgoAuditoria[]>([]);
  const [pruebas, setPruebas] = useState<PruebaAuditoria[]>([]);
  const [auditandoModulo, setAuditandoModulo] = useState<string | null>(null);
  const [reporteGenerado, setReporteGenerado] = useState<any>(null);
  
  const { 
    getAsientos, 
    getTrialBalanceData, 
    getBalanceSheetData,
    obtenerProductos,
    getDeclaracionIVAData
  } = useContabilidadIntegration();
  const { toast } = useToast();

  useEffect(() => {
    cargarDatosAuditoria();
  }, []);

  const cargarDatosAuditoria = () => {
    const hallazgosGuardados = localStorage.getItem('hallazgosAuditoria');
    if (hallazgosGuardados) {
      setHallazgos(JSON.parse(hallazgosGuardados));
    }
  };

  const ejecutarAuditoriaCompleta = async () => {
    toast({
      title: "Iniciando auditoría integral",
      description: "Verificando todos los módulos del sistema...",
    });

    const nuevosHallazgos: HallazgoAuditoria[] = [];
    const nuevasPruebas: PruebaAuditoria[] = [];

    // 1. Auditoría de Balance de Comprobación
    setAuditandoModulo('balance');
    const resultadosBalance = auditarBalanceComprobacion();
    nuevosHallazgos.push(...resultadosBalance.hallazgos);
    nuevasPruebas.push(...resultadosBalance.pruebas);

    // 2. Auditoría de Inventarios
    setAuditandoModulo('inventario');
    const resultadosInventario = auditarInventarios();
    nuevosHallazgos.push(...resultadosInventario.hallazgos);
    nuevasPruebas.push(...resultadosInventario.pruebas);

    // 3. Auditoría de Facturación
    setAuditandoModulo('facturacion');
    const resultadosFacturacion = auditarFacturacion();
    nuevosHallazgos.push(...resultadosFacturacion.hallazgos);
    nuevasPruebas.push(...resultadosFacturacion.pruebas);

    // 4. Auditoría Tributaria
    setAuditandoModulo('tributario');
    const resultadosTributarios = auditarAspectosTributarios();
    nuevosHallazgos.push(...resultadosTributarios.hallazgos);
    nuevasPruebas.push(...resultadosTributarios.pruebas);

    // 5. Auditoría de Nómina
    setAuditandoModulo('nomina');
    const resultadosNomina = auditarNomina();
    nuevosHallazgos.push(...resultadosNomina.hallazgos);
    nuevasPruebas.push(...resultadosNomina.pruebas);

    setHallazgos(nuevosHallazgos);
    setPruebas(nuevasPruebas);
    setAuditandoModulo(null);
    
    // Guardar resultados
    localStorage.setItem('hallazgosAuditoria', JSON.stringify(nuevosHallazgos));
    
    // Generar reporte automático
    generarReporteAuditoria(nuevosHallazgos, nuevasPruebas);

    toast({
      title: "Auditoría completada",
      description: `Se encontraron ${nuevosHallazgos.length} hallazgos`,
      variant: nuevosHallazgos.filter(h => h.tipo === 'critico').length > 0 ? "destructive" : "default"
    });
  };

  const auditarBalanceComprobacion = () => {
    const { details, totals } = getTrialBalanceData();
    const hallazgos: HallazgoAuditoria[] = [];
    const pruebas: PruebaAuditoria[] = [];

    // Prueba 1: Verificar cuadratura del balance
    const diferencia = Math.abs(totals.sumaDebe - totals.sumaHaber);
    pruebas.push({
      id: `bc_cuadratura_${Date.now()}`,
      nombre: "Cuadratura Balance de Comprobación",
      descripcion: "Verificar que debe = haber",
      resultado: diferencia < 0.01 ? 'exitoso' : 'fallido',
      valorEsperado: 0,
      valorObtenido: diferencia,
      observaciones: diferencia > 0.01 ? `Diferencia de Bs. ${diferencia.toFixed(2)}` : "Balance cuadrado"
    });

    if (diferencia > 0.01) {
      hallazgos.push({
        id: `hal_balance_${Date.now()}`,
        tipo: 'critico',
        categoria: 'contable',
        titulo: "Balance de Comprobación Descuadrado",
        descripcion: `Existe una diferencia de Bs. ${diferencia.toFixed(2)} entre debe y haber`,
        impacto: "Estados financieros incorrectos",
        recomendacion: "Revisar y corregir asientos contables",
        fecha: new Date().toISOString().slice(0, 10),
        estado: 'pendiente'
      });
    }

    // Prueba 2: Verificar saldos negativos en activos
    const activosNegativos = details.filter(cuenta => 
      cuenta.codigo.startsWith('1') && (cuenta.saldoDeudor - cuenta.saldoAcreedor) < 0
    );

    if (activosNegativos.length > 0) {
      hallazgos.push({
        id: `hal_activos_neg_${Date.now()}`,
        tipo: 'alto',
        categoria: 'contable',
        titulo: "Activos con Saldos Negativos",
        descripcion: `Se encontraron ${activosNegativos.length} cuentas de activo con saldos negativos`,
        impacto: "Balance General incorrecto",
        recomendacion: "Revisar y reclasificar cuentas de activo",
        fecha: new Date().toISOString().slice(0, 10),
        estado: 'pendiente'
      });
    }

    return { hallazgos, pruebas };
  };

  const auditarInventarios = () => {
    const productos = obtenerProductos();
    const hallazgos: HallazgoAuditoria[] = [];
    const pruebas: PruebaAuditoria[] = [];

    // Prueba: Stock negativo
    const stocksNegativos = productos.filter(p => p.stockActual < 0);
    pruebas.push({
      id: `inv_stock_neg_${Date.now()}`,
      nombre: "Stocks Negativos",
      descripcion: "Verificar que no existan stocks negativos",
      resultado: stocksNegativos.length === 0 ? 'exitoso' : 'fallido',
      valorEsperado: 0,
      valorObtenido: stocksNegativos.length,
      observaciones: stocksNegativos.length > 0 ? `${stocksNegativos.length} productos con stock negativo` : "Todos los stocks son positivos"
    });

    if (stocksNegativos.length > 0) {
      hallazgos.push({
        id: `hal_stock_neg_${Date.now()}`,
        tipo: 'alto',
        categoria: 'inventario',
        titulo: "Productos con Stock Negativo",
        descripcion: `${stocksNegativos.length} productos tienen stock negativo`,
        impacto: "Inventario sobrevendido, problemas de valorización",
        recomendacion: "Realizar ajuste de inventario y revisar proceso de ventas",
        fecha: new Date().toISOString().slice(0, 10),
        estado: 'pendiente'
      });
    }

    // Prueba: Productos sin costo
    const productosSinCosto = productos.filter(p => p.costoUnitario <= 0);
    if (productosSinCosto.length > 0) {
      hallazgos.push({
        id: `hal_sin_costo_${Date.now()}`,
        tipo: 'medio',
        categoria: 'inventario',
        titulo: "Productos sin Costo Unitario",
        descripcion: `${productosSinCosto.length} productos no tienen costo unitario definido`,
        impacto: "Cálculo incorrecto del costo de ventas",
        recomendacion: "Actualizar costos unitarios de todos los productos",
        fecha: new Date().toISOString().slice(0, 10),
        estado: 'pendiente'
      });
    }

    return { hallazgos, pruebas };
  };

  const auditarFacturacion = () => {
    const facturas = JSON.parse(localStorage.getItem('facturas') || '[]');
    const hallazgos: HallazgoAuditoria[] = [];
    const pruebas: PruebaAuditoria[] = [];

    // Prueba: Facturas sin CUF
    const facturasSinCUF = facturas.filter((f: any) => !f.cuf || f.cuf.length === 0);
    pruebas.push({
      id: `fact_cuf_${Date.now()}`,
      nombre: "Facturas con CUF",
      descripcion: "Verificar que todas las facturas tengan CUF válido",
      resultado: facturasSinCUF.length === 0 ? 'exitoso' : 'fallido',
      valorEsperado: 0,
      valorObtenido: facturasSinCUF.length,
      observaciones: facturasSinCUF.length > 0 ? `${facturasSinCUF.length} facturas sin CUF` : "Todas las facturas tienen CUF"
    });

    if (facturasSinCUF.length > 0) {
      hallazgos.push({
        id: `hal_cuf_${Date.now()}`,
        tipo: 'critico',
        categoria: 'tributario',
        titulo: "Facturas sin CUF",
        descripcion: `${facturasSinCUF.length} facturas no tienen Código Único de Facturación`,
        impacto: "Facturas no válidas tributariamente",
        recomendacion: "Generar CUF para todas las facturas",
        fecha: new Date().toISOString().slice(0, 10),
        estado: 'pendiente'
      });
    }

    return { hallazgos, pruebas };
  };

  const auditarAspectosTributarios = () => {
    const hallazgos: HallazgoAuditoria[] = [];
    const pruebas: PruebaAuditoria[] = [];

    try {
      const fechas = {
        fechaInicio: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0, 10),
        fechaFin: new Date().toISOString().slice(0, 10)
      };
      
      const declaracionIVA = getDeclaracionIVAData(fechas);
      
      // Verificar coherencia IVA
      const diferenciaIVA = Math.abs(declaracionIVA.saldo.aFavorFisco + declaracionIVA.saldo.aFavorContribuyente);
      
      if (diferenciaIVA > 1000) {
        hallazgos.push({
          id: `hal_iva_${Date.now()}`,
          tipo: 'alto',
          categoria: 'tributario',
          titulo: "Diferencia Significativa en IVA",
          descripcion: `Saldo IVA de Bs. ${diferenciaIVA.toFixed(2)} requiere revisión`,
          impacto: "Posible error en declaración de IVA",
          recomendacion: "Verificar cálculos de débito y crédito fiscal",
          fecha: new Date().toISOString().slice(0, 10),
          estado: 'pendiente'
        });
      }
    } catch (error) {
      console.error('Error en auditoría tributaria:', error);
    }

    return { hallazgos, pruebas };
  };

  const auditarNomina = () => {
    const planillas = JSON.parse(localStorage.getItem('planillasNomina') || '[]');
    const hallazgos: HallazgoAuditoria[] = [];
    const pruebas: PruebaAuditoria[] = [];

    // Verificar planillas sin contabilizar
    const planillasSinContabilizar = planillas.filter((p: any) => p.estado === 'pagada' && !p.contabilizada);
    
    if (planillasSinContabilizar.length > 0) {
      hallazgos.push({
        id: `hal_nom_cont_${Date.now()}`,
        tipo: 'medio',
        categoria: 'nomina',
        titulo: "Planillas sin Contabilizar",
        descripcion: `${planillasSinContabilizar.length} planillas pagadas no están contabilizadas`,
        impacto: "Estados financieros incompletos",
        recomendacion: "Generar asientos contables para planillas pagadas",
        fecha: new Date().toISOString().slice(0, 10),
        estado: 'pendiente'
      });
    }

    return { hallazgos, pruebas };
  };

  const generarReporteAuditoria = (hallazgos: HallazgoAuditoria[], pruebas: PruebaAuditoria[]) => {
    const reporte = {
      fecha: new Date().toISOString(),
      resumenEjecutivo: {
        totalHallazgos: hallazgos.length,
        criticos: hallazgos.filter(h => h.tipo === 'critico').length,
        altos: hallazgos.filter(h => h.tipo === 'alto').length,
        medios: hallazgos.filter(h => h.tipo === 'medio').length,
        bajos: hallazgos.filter(h => h.tipo === 'bajo').length,
        totalPruebas: pruebas.length,
        pruebasExitosas: pruebas.filter(p => p.resultado === 'exitoso').length,
        pruebasFallidas: pruebas.filter(p => p.resultado === 'fallido').length
      },
      hallazgosPorCategoria: {
        contable: hallazgos.filter(h => h.categoria === 'contable').length,
        tributario: hallazgos.filter(h => h.categoria === 'tributario').length,
        inventario: hallazgos.filter(h => h.categoria === 'inventario').length,
        facturacion: hallazgos.filter(h => h.categoria === 'facturacion').length,
        nomina: hallazgos.filter(h => h.categoria === 'nomina').length
      },
      hallazgos,
      pruebas
    };

    setReporteGenerado(reporte);
  };

  const exportarReporte = () => {
    if (!reporteGenerado) return;

    let contenido = `REPORTE DE AUDITORÍA INTEGRAL\n`;
    contenido += `Fecha: ${new Date(reporteGenerado.fecha).toLocaleString('es-BO')}\n\n`;
    
    contenido += `RESUMEN EJECUTIVO\n`;
    contenido += `================\n`;
    contenido += `Total Hallazgos: ${reporteGenerado.resumenEjecutivo.totalHallazgos}\n`;
    contenido += `Críticos: ${reporteGenerado.resumenEjecutivo.criticos}\n`;
    contenido += `Altos: ${reporteGenerado.resumenEjecutivo.altos}\n`;
    contenido += `Medios: ${reporteGenerado.resumenEjecutivo.medios}\n`;
    contenido += `Bajos: ${reporteGenerado.resumenEjecutivo.bajos}\n\n`;
    
    contenido += `HALLAZGOS DETALLADOS\n`;
    contenido += `===================\n`;
    reporteGenerado.hallazgos.forEach((hallazgo: HallazgoAuditoria, index: number) => {
      contenido += `${index + 1}. ${hallazgo.titulo} (${hallazgo.tipo.toUpperCase()})\n`;
      contenido += `   Categoría: ${hallazgo.categoria}\n`;
      contenido += `   Descripción: ${hallazgo.descripcion}\n`;
      contenido += `   Impacto: ${hallazgo.impacto}\n`;
      contenido += `   Recomendación: ${hallazgo.recomendacion}\n`;
      contenido += `   Estado: ${hallazgo.estado}\n\n`;
    });

    const blob = new Blob([contenido], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reporte_auditoria_${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const resolverHallazgo = (hallazgoId: string) => {
    const nuevosHallazgos = hallazgos.map(h => 
      h.id === hallazgoId ? { ...h, estado: 'resuelto' as const } : h
    );
    setHallazgos(nuevosHallazgos);
    localStorage.setItem('hallazgosAuditoria', JSON.stringify(nuevosHallazgos));
    
    toast({
      title: "Hallazgo marcado como resuelto",
      description: "El hallazgo ha sido actualizado",
    });
  };

  const getIconoSeveridad = (tipo: string) => {
    switch (tipo) {
      case 'critico': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'alto': return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case 'medio': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'bajo': return <CheckCircle className="w-4 h-4 text-blue-500" />;
      default: return <Shield className="w-4 h-4" />;
    }
  };

  const getColorSeveridad = (tipo: string) => {
    switch (tipo) {
      case 'critico': return 'bg-red-100 text-red-800';
      case 'alto': return 'bg-orange-100 text-orange-800';
      case 'medio': return 'bg-yellow-100 text-yellow-800';
      case 'bajo': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-primary" />
          <div>
            <h2 className="text-2xl font-bold">Auditoría Integral</h2>
            <p className="text-slate-600">
              Verificación automática de controles y procesos contables
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {reporteGenerado && (
            <Button variant="outline" onClick={exportarReporte}>
              <Download className="w-4 h-4 mr-2" />
              Exportar Reporte
            </Button>
          )}
          <Button onClick={ejecutarAuditoriaCompleta} disabled={auditandoModulo !== null}>
            <Calculator className="w-4 h-4 mr-2" />
            {auditandoModulo ? `Auditando ${auditandoModulo}...` : 'Ejecutar Auditoría'}
          </Button>
        </div>
      </div>

      {reporteGenerado && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Hallazgos</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reporteGenerado.resumenEjecutivo.totalHallazgos}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Críticos</CardTitle>
              <XCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{reporteGenerado.resumenEjecutivo.criticos}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Altos</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{reporteGenerado.resumenEjecutivo.altos}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pruebas Exitosas</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{reporteGenerado.resumenEjecutivo.pruebasExitosas}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pruebas Fallidas</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{reporteGenerado.resumenEjecutivo.pruebasFallidas}</div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="hallazgos" className="w-full">
        <TabsList>
          <TabsTrigger value="hallazgos">Hallazgos</TabsTrigger>
          <TabsTrigger value="pruebas">Pruebas de Auditoría</TabsTrigger>
          <TabsTrigger value="recomendaciones">Recomendaciones</TabsTrigger>
        </TabsList>

        <TabsContent value="hallazgos">
          <Card>
            <CardHeader>
              <CardTitle>Hallazgos de Auditoría</CardTitle>
              <CardDescription>
                Problemas identificados en el sistema contable
              </CardDescription>
            </CardHeader>
            <CardContent>
              {hallazgos.length === 0 ? (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertTitle>No hay hallazgos</AlertTitle>
                  <AlertDescription>
                    No se han ejecutado auditorías o no se encontraron problemas.
                  </AlertDescription>
                </Alert>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Severidad</TableHead>
                      <TableHead>Categoría</TableHead>
                      <TableHead>Título</TableHead>
                      <TableHead>Descripción</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {hallazgos.map((hallazgo) => (
                      <TableRow key={hallazgo.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getIconoSeveridad(hallazgo.tipo)}
                            <Badge className={getColorSeveridad(hallazgo.tipo)}>
                              {hallazgo.tipo}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>{hallazgo.categoria}</TableCell>
                        <TableCell className="font-medium">{hallazgo.titulo}</TableCell>
                        <TableCell>{hallazgo.descripcion}</TableCell>
                        <TableCell>
                          <Badge variant={hallazgo.estado === 'resuelto' ? 'default' : 'secondary'}>
                            {hallazgo.estado}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {hallazgo.estado !== 'resuelto' && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => resolverHallazgo(hallazgo.id)}
                            >
                              Resolver
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pruebas">
          <Card>
            <CardHeader>
              <CardTitle>Pruebas de Auditoría</CardTitle>
              <CardDescription>
                Resultados de las verificaciones automáticas
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pruebas.length === 0 ? (
                <Alert>
                  <Clock className="h-4 w-4" />
                  <AlertTitle>No hay pruebas ejecutadas</AlertTitle>
                  <AlertDescription>
                    Ejecute una auditoría para ver las pruebas realizadas.
                  </AlertDescription>
                </Alert>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Resultado</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Descripción</TableHead>
                      <TableHead>Esperado</TableHead>
                      <TableHead>Obtenido</TableHead>
                      <TableHead>Observaciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pruebas.map((prueba) => (
                      <TableRow key={prueba.id}>
                        <TableCell>
                          <Badge variant={prueba.resultado === 'exitoso' ? 'default' : 'destructive'}>
                            {prueba.resultado === 'exitoso' ? (
                              <CheckCircle className="w-3 h-3 mr-1" />
                            ) : (
                              <XCircle className="w-3 h-3 mr-1" />
                            )}
                            {prueba.resultado}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">{prueba.nombre}</TableCell>
                        <TableCell>{prueba.descripcion}</TableCell>
                        <TableCell>{String(prueba.valorEsperado)}</TableCell>
                        <TableCell>{String(prueba.valorObtenido)}</TableCell>
                        <TableCell>{prueba.observaciones}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recomendaciones">
          <Card>
            <CardHeader>
              <CardTitle>Recomendaciones</CardTitle>
              <CardDescription>
                Acciones sugeridas para mejorar el sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {hallazgos.filter(h => h.estado !== 'resuelto').map((hallazgo) => (
                  <Alert key={hallazgo.id}>
                    {getIconoSeveridad(hallazgo.tipo)}
                    <AlertTitle>{hallazgo.titulo}</AlertTitle>
                    <AlertDescription>
                      <strong>Impacto:</strong> {hallazgo.impacto}<br />
                      <strong>Recomendación:</strong> {hallazgo.recomendacion}
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AuditoriaIntegral;