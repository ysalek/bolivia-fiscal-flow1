import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle2, AlertTriangle, XCircle, Shield, Database, TrendingUp } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ValidationResult {
  category: string;
  test: string;
  status: 'success' | 'warning' | 'error';
  message: string;
  details?: any;
  recommendation?: string;
}

const SistemaValidatorAvanzado = () => {
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([]);
  const [isValidating, setIsValidating] = useState(false);
  const { toast } = useToast();

  const ejecutarValidacionCompleta = async () => {
    setIsValidating(true);
    setValidationResults([]);

    try {
      const results: ValidationResult[] = [];

      // 1. Validaciones de Integridad Contable
      results.push(...await validarIntegridadContable());
      
      // 2. Validaciones de Normativa Boliviana
      results.push(...await validarNormativaBoliviana());
      
      // 3. Validaciones de Rendimiento
      results.push(...await validarRendimientoSistema());
      
      // 4. Validaciones de Seguridad de Datos
      results.push(...await validarSeguridadDatos());
      
      // 5. Validaciones de Coherencia de Datos
      results.push(...await validarCoherenciaDatos());

      setValidationResults(results);

      const errores = results.filter(r => r.status === 'error').length;
      const advertencias = results.filter(r => r.status === 'warning').length;
      const exitosos = results.filter(r => r.status === 'success').length;

      toast({
        title: "Validación Completada",
        description: `${exitosos} éxitos, ${advertencias} advertencias, ${errores} errores`,
        variant: errores > 0 ? "destructive" : "default"
      });

    } catch (error) {
      console.error("Error en validación:", error);
      toast({
        title: "Error en Validación",
        description: "Error crítico durante la validación del sistema",
        variant: "destructive"
      });
    } finally {
      setIsValidating(false);
    }
  };

  const validarIntegridadContable = async (): Promise<ValidationResult[]> => {
    const results: ValidationResult[] = [];
    
    try {
      // Verificar balance de asientos
      const asientos = JSON.parse(localStorage.getItem('asientosContables') || '[]');
      let asientosDesbalanceados = 0;
      let totalDebe = 0;
      let totalHaber = 0;

      asientos.forEach((asiento: any) => {
        const debe = asiento.cuentas.reduce((sum: number, c: any) => sum + c.debe, 0);
        const haber = asiento.cuentas.reduce((sum: number, c: any) => sum + c.haber, 0);
        totalDebe += debe;
        totalHaber += haber;
        
        if (Math.abs(debe - haber) > 0.01) {
          asientosDesbalanceados++;
        }
      });

      if (asientosDesbalanceados === 0) {
        results.push({
          category: "Integridad Contable",
          test: "Balance de Asientos",
          status: "success",
          message: `Todos los ${asientos.length} asientos están balanceados`,
          details: { totalDebe, totalHaber, diferencia: Math.abs(totalDebe - totalHaber) }
        });
      } else {
        results.push({
          category: "Integridad Contable",
          test: "Balance de Asientos",
          status: "error",
          message: `${asientosDesbalanceados} asientos desbalanceados`,
          details: { asientosDesbalanceados, totalAsientos: asientos.length },
          recommendation: "Revisar y corregir los asientos contables desbalanceados"
        });
      }

      // Verificar secuencia de numeración
      const numerosAsientos = asientos.map((a: any) => a.numero).sort();
      const duplicados = numerosAsientos.filter((num: string, index: number) => 
        numerosAsientos.indexOf(num) !== index);

      if (duplicados.length === 0) {
        results.push({
          category: "Integridad Contable",
          test: "Numeración de Asientos",
          status: "success",
          message: "No hay números de asientos duplicados"
        });
      } else {
        results.push({
          category: "Integridad Contable",
          test: "Numeración de Asientos",
          status: "error",
          message: `${duplicados.length} números duplicados encontrados`,
          details: { duplicados },
          recommendation: "Renumerar asientos para eliminar duplicados"
        });
      }

      // Verificar existencia de plan de cuentas
      const planCuentas = JSON.parse(localStorage.getItem('planCuentas') || '[]');
      if (planCuentas.length > 0) {
        results.push({
          category: "Integridad Contable",
          test: "Plan de Cuentas",
          status: "success",
          message: `Plan de cuentas inicializado con ${planCuentas.length} cuentas`
        });
      } else {
        results.push({
          category: "Integridad Contable",
          test: "Plan de Cuentas",
          status: "error",
          message: "Plan de cuentas no inicializado",
          recommendation: "Ejecutar la inicialización del sistema"
        });
      }

    } catch (error) {
      results.push({
        category: "Integridad Contable",
        test: "Verificación General",
        status: "error",
        message: `Error en validación: ${error}`,
        recommendation: "Revisar la estructura de datos contables"
      });
    }

    return results;
  };

  const validarNormativaBoliviana = async (): Promise<ValidationResult[]> => {
    const results: ValidationResult[] = [];

    try {
      // Verificar cálculo correcto de IVA (13%)
      const facturas = JSON.parse(localStorage.getItem('facturas') || '[]');
      let erroresIVA = 0;

      facturas.forEach((factura: any) => {
        const ivaCalculado = factura.total - (factura.total / 1.13);
        const diferencia = Math.abs(factura.iva - ivaCalculado);
        if (diferencia > 0.01) {
          erroresIVA++;
        }
      });

      if (erroresIVA === 0 && facturas.length > 0) {
        results.push({
          category: "Normativa Boliviana",
          test: "Cálculo de IVA (13%)",
          status: "success",
          message: `IVA calculado correctamente en ${facturas.length} facturas`
        });
      } else if (erroresIVA > 0) {
        results.push({
          category: "Normativa Boliviana",
          test: "Cálculo de IVA (13%)",
          status: "error",
          message: `${erroresIVA} facturas con IVA mal calculado`,
          recommendation: "Recalcular IVA aplicando la tasa del 13%"
        });
      }

      // Verificar estructura del plan de cuentas según CTNAC
      const planCuentas = JSON.parse(localStorage.getItem('planCuentas') || '[]');
      const cuentasRequeridas = ['1111', '1131', '1141', '1142', '2111', '2131', '4111', '5111', '5121'];
      const cuentasFaltantes = cuentasRequeridas.filter(codigo => 
        !planCuentas.some((cuenta: any) => cuenta.codigo === codigo));

      if (cuentasFaltantes.length === 0) {
        results.push({
          category: "Normativa Boliviana",
          test: "Plan de Cuentas CTNAC",
          status: "success",
          message: "Cuentas principales del CTNAC presentes"
        });
      } else {
        results.push({
          category: "Normativa Boliviana",
          test: "Plan de Cuentas CTNAC",
          status: "warning",
          message: `${cuentasFaltantes.length} cuentas CTNAC faltantes`,
          details: { cuentasFaltantes },
          recommendation: "Agregar las cuentas faltantes según CTNAC"
        });
      }

      // Verificar formato de fechas
      const asientos = JSON.parse(localStorage.getItem('asientosContables') || '[]');
      const fechasInvalidas = asientos.filter((asiento: any) => {
        const fecha = new Date(asiento.fecha);
        return isNaN(fecha.getTime());
      });

      if (fechasInvalidas.length === 0) {
        results.push({
          category: "Normativa Boliviana",
          test: "Formato de Fechas",
          status: "success",
          message: "Todas las fechas tienen formato válido"
        });
      } else {
        results.push({
          category: "Normativa Boliviana",
          test: "Formato de Fechas",
          status: "error",
          message: `${fechasInvalidas.length} asientos con fechas inválidas`,
          recommendation: "Corregir formato de fechas a YYYY-MM-DD"
        });
      }

    } catch (error) {
      results.push({
        category: "Normativa Boliviana",
        test: "Verificación General",
        status: "error",
        message: `Error en validación: ${error}`,
        recommendation: "Revisar cumplimiento de normativa boliviana"
      });
    }

    return results;
  };

  const validarRendimientoSistema = async (): Promise<ValidationResult[]> => {
    const results: ValidationResult[] = [];

    try {
      // Verificar tamaño de almacenamiento
      const elementos = ['asientosContables', 'facturas', 'compras', 'productos', 'clientes', 'planCuentas'];
      let tamamoTotal = 0;

      elementos.forEach(elemento => {
        const data = localStorage.getItem(elemento) || '[]';
        tamamoTotal += data.length;
      });

      const tamamoMB = tamamoTotal / (1024 * 1024);
      
      if (tamamoMB < 5) {
        results.push({
          category: "Rendimiento",
          test: "Uso de Almacenamiento",
          status: "success",
          message: `Uso óptimo: ${tamamoMB.toFixed(2)} MB`,
          details: { tamamoBytes: tamamoTotal, tamamoMB }
        });
      } else if (tamamoMB < 10) {
        results.push({
          category: "Rendimiento",
          test: "Uso de Almacenamiento",
          status: "warning",
          message: `Uso moderado: ${tamamoMB.toFixed(2)} MB`,
          recommendation: "Considerar optimización de datos"
        });
      } else {
        results.push({
          category: "Rendimiento",
          test: "Uso de Almacenamiento",
          status: "error",
          message: `Uso alto: ${tamamoMB.toFixed(2)} MB`,
          recommendation: "Implementar limpieza de datos históricos"
        });
      }

      // Verificar cantidad de registros
      const totalRegistros = elementos.reduce((sum, elemento) => {
        const data = JSON.parse(localStorage.getItem(elemento) || '[]');
        return sum + (Array.isArray(data) ? data.length : 0);
      }, 0);

      if (totalRegistros < 10000) {
        results.push({
          category: "Rendimiento",
          test: "Cantidad de Registros",
          status: "success",
          message: `${totalRegistros} registros totales - rendimiento óptimo`
        });
      } else {
        results.push({
          category: "Rendimiento",
          test: "Cantidad de Registros",
          status: "warning",
          message: `${totalRegistros} registros - considerar paginación`,
          recommendation: "Implementar paginación para mejorar rendimiento"
        });
      }

    } catch (error) {
      results.push({
        category: "Rendimiento",
        test: "Verificación General",
        status: "error",
        message: `Error en validación: ${error}`
      });
    }

    return results;
  };

  const validarSeguridadDatos = async (): Promise<ValidationResult[]> => {
    const results: ValidationResult[] = [];

    try {
      // Verificar integridad de datos críticos
      const elementos = ['planCuentas', 'asientosContables'];
      let erroresIntegridad = 0;

      elementos.forEach(elemento => {
        try {
          const data = JSON.parse(localStorage.getItem(elemento) || '[]');
          if (!Array.isArray(data)) {
            erroresIntegridad++;
          }
        } catch (error) {
          erroresIntegridad++;
        }
      });

      if (erroresIntegridad === 0) {
        results.push({
          category: "Seguridad",
          test: "Integridad de Datos",
          status: "success",
          message: "Estructura de datos íntegra"
        });
      } else {
        results.push({
          category: "Seguridad",
          test: "Integridad de Datos",
          status: "error",
          message: `${erroresIntegridad} elementos con datos corruptos`,
          recommendation: "Restaurar desde respaldo o reinicializar sistema"
        });
      }

      // Verificar existencia de respaldos
      const backupData = localStorage.getItem('systemBackup');
      if (backupData) {
        results.push({
          category: "Seguridad",
          test: "Sistema de Respaldos",
          status: "success",
          message: "Respaldo del sistema disponible"
        });
      } else {
        results.push({
          category: "Seguridad",
          test: "Sistema de Respaldos",
          status: "warning",
          message: "No se encontró respaldo del sistema",
          recommendation: "Crear respaldo periódico de los datos"
        });
      }

    } catch (error) {
      results.push({
        category: "Seguridad",
        test: "Verificación General",
        status: "error",
        message: `Error en validación: ${error}`
      });
    }

    return results;
  };

  const validarCoherenciaDatos = async (): Promise<ValidationResult[]> => {
    const results: ValidationResult[] = [];

    try {
      // Verificar coherencia entre facturas y asientos
      const facturas = JSON.parse(localStorage.getItem('facturas') || '[]');
      const asientos = JSON.parse(localStorage.getItem('asientosContables') || '[]');
      
      let facturasConAsiento = 0;
      facturas.forEach((factura: any) => {
        const asientoRelacionado = asientos.find((a: any) => 
          a.referencia === factura.numero || a.concepto.includes(factura.numero));
        if (asientoRelacionado) {
          facturasConAsiento++;
        }
      });

      if (facturasConAsiento === facturas.length) {
        results.push({
          category: "Coherencia",
          test: "Facturas vs Asientos",
          status: "success",
          message: `${facturas.length} facturas con asientos contables generados`
        });
      } else {
        results.push({
          category: "Coherencia",
          test: "Facturas vs Asientos",
          status: "warning",
          message: `${facturas.length - facturasConAsiento} facturas sin asiento contable`,
          recommendation: "Regenerar asientos contables faltantes"
        });
      }

      // Verificar coherencia de inventario
      const productos = JSON.parse(localStorage.getItem('productos') || '[]');
      const movimientos = JSON.parse(localStorage.getItem('movimientosInventario') || '[]');
      
      let productosConMovimientos = 0;
      productos.forEach((producto: any) => {
        const tieneMovimientos = movimientos.some((m: any) => m.productoId === producto.id);
        if (tieneMovimientos || producto.stockActual === 0) {
          productosConMovimientos++;
        }
      });

      results.push({
        category: "Coherencia",
        test: "Inventario vs Movimientos",
        status: productosConMovimientos === productos.length ? "success" : "warning",
        message: `${productosConMovimientos} de ${productos.length} productos con coherencia de stock`,
        details: { productosTotal: productos.length, productosCoherentes: productosConMovimientos }
      });

    } catch (error) {
      results.push({
        category: "Coherencia",
        test: "Verificación General",
        status: "error",
        message: `Error en validación: ${error}`
      });
    }

    return results;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'error': return <XCircle className="w-5 h-5 text-red-500" />;
      default: return null;
    }
  };

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" => {
    switch (status) {
      case 'success': return 'default';
      case 'warning': return 'secondary';
      case 'error': return 'destructive';
      default: return 'default';
    }
  };

  const categorias = Array.from(new Set(validationResults.map(r => r.category)));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Validador Avanzado del Sistema
          </CardTitle>
          <CardDescription>
            Ejecuta validaciones exhaustivas de integridad, normativa y rendimiento del sistema contable
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={ejecutarValidacionCompleta}
            disabled={isValidating}
            className="flex items-center gap-2"
          >
            <Database className="w-4 h-4" />
            {isValidating ? 'Validando...' : 'Ejecutar Validación Completa'}
          </Button>
        </CardContent>
      </Card>

      {validationResults.length > 0 && (
        <Tabs defaultValue="resumen" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="resumen">Resumen</TabsTrigger>
            <TabsTrigger value="categoria">Por Categoría</TabsTrigger>
            <TabsTrigger value="detalles">Detalles Completos</TabsTrigger>
          </TabsList>

          <TabsContent value="resumen">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {validationResults.filter(r => r.status === 'success').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Validaciones Exitosas</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-yellow-600 mb-2">
                    {validationResults.filter(r => r.status === 'warning').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Advertencias</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-red-600 mb-2">
                    {validationResults.filter(r => r.status === 'error').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Errores Críticos</div>
                </CardContent>
              </Card>
            </div>

            <Alert>
              <TrendingUp className="h-4 w-4" />
              <AlertDescription>
                <strong>Estado del Sistema:</strong> {
                  validationResults.filter(r => r.status === 'error').length === 0 
                    ? 'Sistema en condiciones óptimas'
                    : `Se encontraron ${validationResults.filter(r => r.status === 'error').length} errores que requieren atención`
                }
              </AlertDescription>
            </Alert>
          </TabsContent>

          <TabsContent value="categoria">
            <div className="space-y-4">
              {categorias.map(categoria => {
                const resultadosCategoria = validationResults.filter(r => r.category === categoria);
                const errores = resultadosCategoria.filter(r => r.status === 'error').length;
                const advertencias = resultadosCategoria.filter(r => r.status === 'warning').length;
                const exitosos = resultadosCategoria.filter(r => r.status === 'success').length;

                return (
                  <Card key={categoria}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{categoria}</span>
                        <div className="flex gap-2">
                          <Badge variant="default">{exitosos} ✓</Badge>
                          {advertencias > 0 && <Badge variant="secondary">{advertencias} ⚠</Badge>}
                          {errores > 0 && <Badge variant="destructive">{errores} ✗</Badge>}
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {resultadosCategoria.map((result, index) => (
                          <div key={index} className="flex items-center gap-3 p-2 border rounded">
                            {getStatusIcon(result.status)}
                            <div className="flex-1">
                              <div className="font-medium">{result.test}</div>
                              <div className="text-sm text-muted-foreground">{result.message}</div>
                              {result.recommendation && (
                                <div className="text-xs text-blue-600 mt-1">
                                  Recomendación: {result.recommendation}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="detalles">
            <Card>
              <CardHeader>
                <CardTitle>Detalles Completos de Validación</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Estado</TableHead>
                      <TableHead>Categoría</TableHead>
                      <TableHead>Prueba</TableHead>
                      <TableHead>Resultado</TableHead>
                      <TableHead>Recomendación</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {validationResults.map((result, index) => (
                      <TableRow key={index}>
                        <TableCell>{getStatusIcon(result.status)}</TableCell>
                        <TableCell>{result.category}</TableCell>
                        <TableCell className="font-medium">{result.test}</TableCell>
                        <TableCell>{result.message}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {result.recommendation || '-'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default SistemaValidatorAvanzado;