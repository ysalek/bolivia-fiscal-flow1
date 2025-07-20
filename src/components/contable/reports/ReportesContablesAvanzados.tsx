import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Download, TrendingUp, BarChart3, PieChart, Calendar } from 'lucide-react';
import { useAsientos } from '@/hooks/useAsientos';
import { useContabilidadIntegration } from '@/hooks/useContabilidadIntegration';

interface ReporteFinanciero {
  id: string;
  titulo: string;
  fechaInicio: string;
  fechaFin: string;
  tipo: 'balance' | 'resultados' | 'flujo' | 'analisis';
  datos: any;
  generadoEn: string;
}

const ReportesContablesAvanzados = () => {
  const [fechaInicio, setFechaInicio] = useState(new Date(new Date().getFullYear(), 0, 1).toISOString().slice(0, 10));
  const [fechaFin, setFechaFin] = useState(new Date().toISOString().slice(0, 10));
  const [tipoReporte, setTipoReporte] = useState<string>('balance');
  const [reportesGenerados, setReportesGenerados] = useState<ReporteFinanciero[]>([]);
  const [reporteActual, setReporteActual] = useState<ReporteFinanciero | null>(null);

  const { getAsientos } = useAsientos();
  const { obtenerBalanceGeneral } = useContabilidadIntegration();

  const generarReporte = () => {
    let reporte: ReporteFinanciero;

    switch (tipoReporte) {
      case 'balance':
        reporte = generarBalanceGeneral();
        break;
      case 'resultados':
        reporte = generarEstadoResultados();
        break;
      case 'flujo':
        reporte = generarFlujoCaja();
        break;
      case 'analisis':
        reporte = generarAnalisisFinanciero();
        break;
      default:
        return;
    }

    setReportesGenerados(prev => [reporte, ...prev]);
    setReporteActual(reporte);
  };

  const generarBalanceGeneral = (): ReporteFinanciero => {
    const balanceData = obtenerBalanceGeneral();
    const asientos = getAsientos();
    
    // Calcular detalles por cuenta
    const cuentasDetalle = new Map<string, { nombre: string, saldo: number, tipo: string }>();
    
    asientos.forEach(asiento => {
      if (new Date(asiento.fecha) <= new Date(fechaFin)) {
        asiento.cuentas.forEach(cuenta => {
          const key = cuenta.codigo;
          const saldoActual = cuentasDetalle.get(key)?.saldo || 0;
          cuentasDetalle.set(key, {
            nombre: cuenta.nombre,
            saldo: saldoActual + cuenta.debe - cuenta.haber,
            tipo: determinarTipoCuenta(cuenta.codigo)
          });
        });
      }
    });

    const activos = Array.from(cuentasDetalle.entries())
      .filter(([_, data]) => data.tipo === 'activo' && data.saldo > 0)
      .map(([codigo, data]) => ({ codigo, ...data }));

    const pasivos = Array.from(cuentasDetalle.entries())
      .filter(([_, data]) => data.tipo === 'pasivo' && data.saldo > 0)
      .map(([codigo, data]) => ({ codigo, ...data }));

    const patrimonio = Array.from(cuentasDetalle.entries())
      .filter(([_, data]) => data.tipo === 'patrimonio' && data.saldo > 0)
      .map(([codigo, data]) => ({ codigo, ...data }));

    return {
      id: `BAL-${Date.now()}`,
      titulo: 'Balance General',
      fechaInicio,
      fechaFin,
      tipo: 'balance',
      datos: {
        activos,
        pasivos,
        patrimonio,
        totalActivos: balanceData.activos,
        totalPasivos: balanceData.pasivos,
        totalPatrimonio: balanceData.patrimonio,
        equilibrio: Math.abs(balanceData.activos - (balanceData.pasivos + balanceData.patrimonio)) < 0.01
      },
      generadoEn: new Date().toISOString()
    };
  };

  const generarEstadoResultados = (): ReporteFinanciero => {
    const asientos = getAsientos().filter(asiento => {
      const fecha = new Date(asiento.fecha);
      return fecha >= new Date(fechaInicio) && fecha <= new Date(fechaFin);
    });

    const cuentasResultado = new Map<string, { nombre: string, saldo: number, tipo: string }>();
    
    asientos.forEach(asiento => {
      asiento.cuentas.forEach(cuenta => {
        const tipo = determinarTipoCuenta(cuenta.codigo);
        if (tipo === 'ingreso' || tipo === 'gasto') {
          const key = cuenta.codigo;
          const saldoActual = cuentasResultado.get(key)?.saldo || 0;
          cuentasResultado.set(key, {
            nombre: cuenta.nombre,
            saldo: saldoActual + cuenta.debe - cuenta.haber,
            tipo
          });
        }
      });
    });

    const ingresos = Array.from(cuentasResultado.entries())
      .filter(([_, data]) => data.tipo === 'ingreso')
      .map(([codigo, data]) => ({ codigo, ...data, valor: Math.abs(data.saldo) }));

    const gastos = Array.from(cuentasResultado.entries())
      .filter(([_, data]) => data.tipo === 'gasto')
      .map(([codigo, data]) => ({ codigo, ...data, valor: Math.abs(data.saldo) }));

    const totalIngresos = ingresos.reduce((sum, item) => sum + item.valor, 0);
    const totalGastos = gastos.reduce((sum, item) => sum + item.valor, 0);
    const utilidadNeta = totalIngresos - totalGastos;

    return {
      id: `ER-${Date.now()}`,
      titulo: 'Estado de Resultados',
      fechaInicio,
      fechaFin,
      tipo: 'resultados',
      datos: {
        ingresos,
        gastos,
        totalIngresos,
        totalGastos,
        utilidadNeta,
        margenBruto: totalIngresos > 0 ? (utilidadNeta / totalIngresos) * 100 : 0
      },
      generadoEn: new Date().toISOString()
    };
  };

  const generarFlujoCaja = (): ReporteFinanciero => {
    const asientos = getAsientos().filter(asiento => {
      const fecha = new Date(asiento.fecha);
      return fecha >= new Date(fechaInicio) && fecha <= new Date(fechaFin);
    });

    let entradas = 0;
    let salidas = 0;
    const movimientos: { fecha: string, concepto: string, entrada: number, salida: number }[] = [];

    asientos.forEach(asiento => {
      asiento.cuentas.forEach(cuenta => {
        if (cuenta.codigo === '1111') { // Caja y Bancos
          const entrada = cuenta.debe;
          const salida = cuenta.haber;
          
          if (entrada > 0 || salida > 0) {
            movimientos.push({
              fecha: asiento.fecha,
              concepto: asiento.concepto,
              entrada,
              salida
            });
            
            entradas += entrada;
            salidas += salida;
          }
        }
      });
    });

    return {
      id: `FC-${Date.now()}`,
      titulo: 'Flujo de Caja',
      fechaInicio,
      fechaFin,
      tipo: 'flujo',
      datos: {
        movimientos,
        totalEntradas: entradas,
        totalSalidas: salidas,
        flujoNeto: entradas - salidas,
        saldoFinal: entradas - salidas
      },
      generadoEn: new Date().toISOString()
    };
  };

  const generarAnalisisFinanciero = (): ReporteFinanciero => {
    const balanceData = obtenerBalanceGeneral();
    const estadoResultados = generarEstadoResultados();
    
    // Calcular ratios financieros
    const liquidezCorriente = balanceData.pasivos > 0 ? 
      (balanceData.activos / balanceData.pasivos) : 0;
    
    const endeudamiento = balanceData.activos > 0 ? 
      (balanceData.pasivos / balanceData.activos) * 100 : 0;
    
    const rentabilidadActivos = balanceData.activos > 0 ? 
      (estadoResultados.datos.utilidadNeta / balanceData.activos) * 100 : 0;
    
    const rentabilidadPatrimonio = balanceData.patrimonio > 0 ? 
      (estadoResultados.datos.utilidadNeta / balanceData.patrimonio) * 100 : 0;

    // Análisis de tendencias
    const facturas = JSON.parse(localStorage.getItem('facturas') || '[]');
    const ventasDelPeriodo = facturas.filter((f: any) => {
      const fecha = new Date(f.fecha);
      return fecha >= new Date(fechaInicio) && fecha <= new Date(fechaFin);
    });

    const ventasPorMes = ventasDelPeriodo.reduce((acc: any, factura: any) => {
      const mes = new Date(factura.fecha).toISOString().slice(0, 7);
      acc[mes] = (acc[mes] || 0) + factura.total;
      return acc;
    }, {});

    return {
      id: `AF-${Date.now()}`,
      titulo: 'Análisis Financiero',
      fechaInicio,
      fechaFin,
      tipo: 'analisis',
      datos: {
        ratios: {
          liquidezCorriente,
          endeudamiento,
          rentabilidadActivos,
          rentabilidadPatrimonio
        },
        tendencias: {
          ventasPorMes,
          crecimientoVentas: calcularCrecimientoVentas(ventasPorMes)
        },
        indicadores: {
          totalFacturas: ventasDelPeriodo.length,
          promedioVentaPorFactura: ventasDelPeriodo.length > 0 ? 
            ventasDelPeriodo.reduce((sum: number, f: any) => sum + f.total, 0) / ventasDelPeriodo.length : 0
        }
      },
      generadoEn: new Date().toISOString()
    };
  };

  const determinarTipoCuenta = (codigo: string): string => {
    if (codigo.startsWith('1')) return 'activo';
    if (codigo.startsWith('2')) return 'pasivo';
    if (codigo.startsWith('3')) return 'patrimonio';
    if (codigo.startsWith('4')) return 'ingreso';
    if (codigo.startsWith('5')) return 'gasto';
    return 'otros';
  };

  const calcularCrecimientoVentas = (ventasPorMes: any): number => {
    const meses = Object.keys(ventasPorMes).sort();
    if (meses.length < 2) return 0;
    
    const primerMes = ventasPorMes[meses[0]];
    const ultimoMes = ventasPorMes[meses[meses.length - 1]];
    
    return primerMes > 0 ? ((ultimoMes - primerMes) / primerMes) * 100 : 0;
  };

  const exportarReporte = (reporte: ReporteFinanciero) => {
    let contenido = `${reporte.titulo.toUpperCase()}\n`;
    contenido += `Período: ${reporte.fechaInicio} al ${reporte.fechaFin}\n`;
    contenido += `Generado: ${new Date(reporte.generadoEn).toLocaleString('es-BO')}\n\n`;

    switch (reporte.tipo) {
      case 'balance':
        contenido += generarContenidoBalance(reporte.datos);
        break;
      case 'resultados':
        contenido += generarContenidoResultados(reporte.datos);
        break;
      case 'flujo':
        contenido += generarContenidoFlujo(reporte.datos);
        break;
      case 'analisis':
        contenido += generarContenidoAnalisis(reporte.datos);
        break;
    }

    const blob = new Blob([contenido], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reporte.titulo.toLowerCase().replace(/\s+/g, '_')}_${reporte.fechaFin}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const generarContenidoBalance = (datos: any): string => {
    let contenido = 'ACTIVOS\n';
    datos.activos.forEach((cuenta: any) => {
      contenido += `${cuenta.codigo} - ${cuenta.nombre}: Bs. ${cuenta.saldo.toFixed(2)}\n`;
    });
    contenido += `\nTOTAL ACTIVOS: Bs. ${datos.totalActivos.toFixed(2)}\n\n`;

    contenido += 'PASIVOS\n';
    datos.pasivos.forEach((cuenta: any) => {
      contenido += `${cuenta.codigo} - ${cuenta.nombre}: Bs. ${cuenta.saldo.toFixed(2)}\n`;
    });
    contenido += `\nTOTAL PASIVOS: Bs. ${datos.totalPasivos.toFixed(2)}\n\n`;

    contenido += 'PATRIMONIO\n';
    datos.patrimonio.forEach((cuenta: any) => {
      contenido += `${cuenta.codigo} - ${cuenta.nombre}: Bs. ${cuenta.saldo.toFixed(2)}\n`;
    });
    contenido += `\nTOTAL PATRIMONIO: Bs. ${datos.totalPatrimonio.toFixed(2)}\n`;

    return contenido;
  };

  const generarContenidoResultados = (datos: any): string => {
    let contenido = 'INGRESOS\n';
    datos.ingresos.forEach((cuenta: any) => {
      contenido += `${cuenta.codigo} - ${cuenta.nombre}: Bs. ${cuenta.valor.toFixed(2)}\n`;
    });
    contenido += `\nTOTAL INGRESOS: Bs. ${datos.totalIngresos.toFixed(2)}\n\n`;

    contenido += 'GASTOS\n';
    datos.gastos.forEach((cuenta: any) => {
      contenido += `${cuenta.codigo} - ${cuenta.nombre}: Bs. ${cuenta.valor.toFixed(2)}\n`;
    });
    contenido += `\nTOTAL GASTOS: Bs. ${datos.totalGastos.toFixed(2)}\n\n`;

    contenido += `UTILIDAD NETA: Bs. ${datos.utilidadNeta.toFixed(2)}\n`;
    contenido += `MARGEN BRUTO: ${datos.margenBruto.toFixed(2)}%\n`;

    return contenido;
  };

  const generarContenidoFlujo = (datos: any): string => {
    let contenido = 'MOVIMIENTOS DE CAJA\n\n';
    datos.movimientos.forEach((mov: any) => {
      contenido += `${mov.fecha} | ${mov.concepto} | Entrada: ${mov.entrada.toFixed(2)} | Salida: ${mov.salida.toFixed(2)}\n`;
    });
    
    contenido += `\nRESUMEN:\n`;
    contenido += `Total Entradas: Bs. ${datos.totalEntradas.toFixed(2)}\n`;
    contenido += `Total Salidas: Bs. ${datos.totalSalidas.toFixed(2)}\n`;
    contenido += `Flujo Neto: Bs. ${datos.flujoNeto.toFixed(2)}\n`;

    return contenido;
  };

  const generarContenidoAnalisis = (datos: any): string => {
    let contenido = 'RATIOS FINANCIEROS\n';
    contenido += `Liquidez Corriente: ${datos.ratios.liquidezCorriente.toFixed(2)}\n`;
    contenido += `Endeudamiento: ${datos.ratios.endeudamiento.toFixed(2)}%\n`;
    contenido += `Rentabilidad sobre Activos: ${datos.ratios.rentabilidadActivos.toFixed(2)}%\n`;
    contenido += `Rentabilidad sobre Patrimonio: ${datos.ratios.rentabilidadPatrimonio.toFixed(2)}%\n\n`;

    contenido += 'INDICADORES DE VENTAS\n';
    contenido += `Total Facturas: ${datos.indicadores.totalFacturas}\n`;
    contenido += `Promedio por Factura: Bs. ${datos.indicadores.promedioVentaPorFactura.toFixed(2)}\n`;
    contenido += `Crecimiento de Ventas: ${datos.tendencias.crecimientoVentas.toFixed(2)}%\n`;

    return contenido;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-6 h-6" />
            Reportes Contables Avanzados
          </CardTitle>
          <CardDescription>
            Genera reportes financieros detallados según normativa contable boliviana
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="space-y-2">
              <Label htmlFor="fecha-inicio">Fecha Inicio:</Label>
              <Input
                id="fecha-inicio"
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fecha-fin">Fecha Fin:</Label>
              <Input
                id="fecha-fin"
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Tipo de Reporte:</Label>
              <Select value={tipoReporte} onValueChange={setTipoReporte}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar reporte" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="balance">Balance General</SelectItem>
                  <SelectItem value="resultados">Estado de Resultados</SelectItem>
                  <SelectItem value="flujo">Flujo de Caja</SelectItem>
                  <SelectItem value="analisis">Análisis Financiero</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>&nbsp;</Label>
              <Button onClick={generarReporte} className="w-full flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Generar Reporte
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {reporteActual && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{reporteActual.titulo}</CardTitle>
                <CardDescription>
                  Período: {reporteActual.fechaInicio} al {reporteActual.fechaFin}
                </CardDescription>
              </div>
              <Button 
                onClick={() => exportarReporte(reporteActual)} 
                variant="outline" 
                size="sm"
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Exportar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {reporteActual.tipo === 'balance' && (
              <RenderBalance datos={reporteActual.datos} />
            )}
            {reporteActual.tipo === 'resultados' && (
              <RenderResultados datos={reporteActual.datos} />
            )}
            {reporteActual.tipo === 'flujo' && (
              <RenderFlujoCaja datos={reporteActual.datos} />
            )}
            {reporteActual.tipo === 'analisis' && (
              <RenderAnalisis datos={reporteActual.datos} />
            )}
          </CardContent>
        </Card>
      )}

      {reportesGenerados.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Historial de Reportes</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Período</TableHead>
                  <TableHead>Generado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportesGenerados.map((reporte) => (
                  <TableRow key={reporte.id}>
                    <TableCell>
                      <Badge variant="outline">{reporte.titulo}</Badge>
                    </TableCell>
                    <TableCell>{reporte.fechaInicio} - {reporte.fechaFin}</TableCell>
                    <TableCell>{new Date(reporte.generadoEn).toLocaleString('es-BO')}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setReporteActual(reporte)}
                        >
                          Ver
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => exportarReporte(reporte)}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Componentes de renderizado para cada tipo de reporte
const RenderBalance = ({ datos }: { datos: any }) => (
  <Tabs defaultValue="activos">
    <TabsList className="grid w-full grid-cols-3">
      <TabsTrigger value="activos">Activos</TabsTrigger>
      <TabsTrigger value="pasivos">Pasivos</TabsTrigger>
      <TabsTrigger value="patrimonio">Patrimonio</TabsTrigger>
    </TabsList>
    
    <TabsContent value="activos">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Código</TableHead>
            <TableHead>Cuenta</TableHead>
            <TableHead className="text-right">Saldo (Bs.)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {datos.activos.map((cuenta: any) => (
            <TableRow key={cuenta.codigo}>
              <TableCell className="font-mono">{cuenta.codigo}</TableCell>
              <TableCell>{cuenta.nombre}</TableCell>
              <TableCell className="text-right font-semibold">
                {cuenta.saldo.toFixed(2)}
              </TableCell>
            </TableRow>
          ))}
          <TableRow className="bg-primary/10 font-bold">
            <TableCell colSpan={2}>TOTAL ACTIVOS</TableCell>
            <TableCell className="text-right">{datos.totalActivos.toFixed(2)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TabsContent>
    
    <TabsContent value="pasivos">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Código</TableHead>
            <TableHead>Cuenta</TableHead>
            <TableHead className="text-right">Saldo (Bs.)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {datos.pasivos.map((cuenta: any) => (
            <TableRow key={cuenta.codigo}>
              <TableCell className="font-mono">{cuenta.codigo}</TableCell>
              <TableCell>{cuenta.nombre}</TableCell>
              <TableCell className="text-right font-semibold">
                {cuenta.saldo.toFixed(2)}
              </TableCell>
            </TableRow>
          ))}
          <TableRow className="bg-primary/10 font-bold">
            <TableCell colSpan={2}>TOTAL PASIVOS</TableCell>
            <TableCell className="text-right">{datos.totalPasivos.toFixed(2)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TabsContent>
    
    <TabsContent value="patrimonio">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Código</TableHead>
            <TableHead>Cuenta</TableHead>
            <TableHead className="text-right">Saldo (Bs.)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {datos.patrimonio.map((cuenta: any) => (
            <TableRow key={cuenta.codigo}>
              <TableCell className="font-mono">{cuenta.codigo}</TableCell>
              <TableCell>{cuenta.nombre}</TableCell>
              <TableCell className="text-right font-semibold">
                {cuenta.saldo.toFixed(2)}
              </TableCell>
            </TableRow>
          ))}
          <TableRow className="bg-primary/10 font-bold">
            <TableCell colSpan={2}>TOTAL PATRIMONIO</TableCell>
            <TableCell className="text-right">{datos.totalPatrimonio.toFixed(2)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TabsContent>
  </Tabs>
);

const RenderResultados = ({ datos }: { datos: any }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            Bs. {datos.totalIngresos.toFixed(2)}
          </div>
          <div className="text-sm text-muted-foreground">Total Ingresos</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-red-600">
            Bs. {datos.totalGastos.toFixed(2)}
          </div>
          <div className="text-sm text-muted-foreground">Total Gastos</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <div className={`text-2xl font-bold ${datos.utilidadNeta >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            Bs. {datos.utilidadNeta.toFixed(2)}
          </div>
          <div className="text-sm text-muted-foreground">Utilidad Neta</div>
        </CardContent>
      </Card>
    </div>

    <Tabs defaultValue="ingresos">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="ingresos">Ingresos</TabsTrigger>
        <TabsTrigger value="gastos">Gastos</TabsTrigger>
      </TabsList>
      
      <TabsContent value="ingresos">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Cuenta</TableHead>
              <TableHead className="text-right">Importe (Bs.)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {datos.ingresos.map((cuenta: any) => (
              <TableRow key={cuenta.codigo}>
                <TableCell className="font-mono">{cuenta.codigo}</TableCell>
                <TableCell>{cuenta.nombre}</TableCell>
                <TableCell className="text-right font-semibold text-green-600">
                  {cuenta.valor.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TabsContent>
      
      <TabsContent value="gastos">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Cuenta</TableHead>
              <TableHead className="text-right">Importe (Bs.)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {datos.gastos.map((cuenta: any) => (
              <TableRow key={cuenta.codigo}>
                <TableCell className="font-mono">{cuenta.codigo}</TableCell>
                <TableCell>{cuenta.nombre}</TableCell>
                <TableCell className="text-right font-semibold text-red-600">
                  {cuenta.valor.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TabsContent>
    </Tabs>
  </div>
);

const RenderFlujoCaja = ({ datos }: { datos: any }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            Bs. {datos.totalEntradas.toFixed(2)}
          </div>
          <div className="text-sm text-muted-foreground">Total Entradas</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-red-600">
            Bs. {datos.totalSalidas.toFixed(2)}
          </div>
          <div className="text-sm text-muted-foreground">Total Salidas</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <div className={`text-2xl font-bold ${datos.flujoNeto >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            Bs. {datos.flujoNeto.toFixed(2)}
          </div>
          <div className="text-sm text-muted-foreground">Flujo Neto</div>
        </CardContent>
      </Card>
    </div>

    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Fecha</TableHead>
          <TableHead>Concepto</TableHead>
          <TableHead className="text-right">Entrada (Bs.)</TableHead>
          <TableHead className="text-right">Salida (Bs.)</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {datos.movimientos.map((mov: any, index: number) => (
          <TableRow key={index}>
            <TableCell>{new Date(mov.fecha).toLocaleDateString('es-BO')}</TableCell>
            <TableCell>{mov.concepto}</TableCell>
            <TableCell className="text-right text-green-600">
              {mov.entrada > 0 ? mov.entrada.toFixed(2) : '-'}
            </TableCell>
            <TableCell className="text-right text-red-600">
              {mov.salida > 0 ? mov.salida.toFixed(2) : '-'}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);

const RenderAnalisis = ({ datos }: { datos: any }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Ratios Financieros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Liquidez Corriente:</span>
              <span className="font-semibold">{datos.ratios.liquidezCorriente.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Endeudamiento:</span>
              <span className="font-semibold">{datos.ratios.endeudamiento.toFixed(2)}%</span>
            </div>
            <div className="flex justify-between">
              <span>ROA:</span>
              <span className="font-semibold">{datos.ratios.rentabilidadActivos.toFixed(2)}%</span>
            </div>
            <div className="flex justify-between">
              <span>ROE:</span>
              <span className="font-semibold">{datos.ratios.rentabilidadPatrimonio.toFixed(2)}%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="w-5 h-5" />
            Indicadores de Ventas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Total Facturas:</span>
              <span className="font-semibold">{datos.indicadores.totalFacturas}</span>
            </div>
            <div className="flex justify-between">
              <span>Promedio por Factura:</span>
              <span className="font-semibold">Bs. {datos.indicadores.promedioVentaPorFactura.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Crecimiento:</span>
              <span className={`font-semibold ${datos.tendencias.crecimientoVentas >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {datos.tendencias.crecimientoVentas.toFixed(2)}%
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <Card>
      <CardHeader>
        <CardTitle>Ventas por Mes</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mes</TableHead>
              <TableHead className="text-right">Ventas (Bs.)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(datos.tendencias.ventasPorMes).map(([mes, ventas]) => (
              <TableRow key={mes}>
                <TableCell>{mes}</TableCell>
                <TableCell className="text-right font-semibold">
                  {(ventas as number).toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
);

export default ReportesContablesAvanzados;