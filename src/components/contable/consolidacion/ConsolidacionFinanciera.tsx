import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Building2, 
  TrendingUp, 
  Calculator, 
  FileText, 
  Download,
  Plus,
  Layers,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { useContabilidadIntegration } from '@/hooks/useContabilidadIntegration';
import { useToast } from '@/hooks/use-toast';

interface Empresa {
  id: string;
  nombre: string;
  nit: string;
  participacion: number; // Porcentaje de participación
  tipo: 'matriz' | 'subsidiaria' | 'asociada';
  moneda: 'BOB' | 'USD' | 'EUR';
  tasaCambio: number;
  activa: boolean;
  ultimaConsolidacion?: string;
}

interface CuentaConsolidacion {
  codigo: string;
  nombre: string;
  saldos: { [empresaId: string]: number };
  eliminaciones: number;
  saldoConsolidado: number;
  tipo: 'activo' | 'pasivo' | 'patrimonio' | 'ingreso' | 'gasto';
}

interface TransaccionIntercompania {
  id: string;
  fecha: string;
  empresaOrigen: string;
  empresaDestino: string;
  cuenta: string;
  monto: number;
  descripcion: string;
  eliminada: boolean;
}

interface EstadoConsolidado {
  id: string;
  periodo: string;
  fecha: string;
  empresas: string[];
  balanceGeneral: CuentaConsolidacion[];
  estadoResultados: CuentaConsolidacion[];
  eliminaciones: TransaccionIntercompania[];
  observaciones: string;
}

const ConsolidacionFinanciera = () => {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [transaccionesIntercompania, setTransaccionesIntercompania] = useState<TransaccionIntercompania[]>([]);
  const [estadosConsolidados, setEstadosConsolidados] = useState<EstadoConsolidado[]>([]);
  const [consolidandoPeriodo, setConsolidandoPeriodo] = useState<string | null>(null);
  const [periodoConsolidacion, setPeriodoConsolidacion] = useState(new Date().toISOString().slice(0, 7));
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState<string>('');
  
  const { getBalanceSheetData, getIncomeStatementData } = useContabilidadIntegration();
  const { toast } = useToast();

  useEffect(() => {
    cargarDatos();
    inicializarEmpresaMatriz();
  }, []);

  const cargarDatos = () => {
    const empresasGuardadas = localStorage.getItem('empresasGrupo');
    if (empresasGuardadas) {
      setEmpresas(JSON.parse(empresasGuardadas));
    }

    const transaccionesGuardadas = localStorage.getItem('transaccionesIntercompania');
    if (transaccionesGuardadas) {
      setTransaccionesIntercompania(JSON.parse(transaccionesGuardadas));
    }

    const consolidacionesGuardadas = localStorage.getItem('estadosConsolidados');
    if (consolidacionesGuardadas) {
      setEstadosConsolidados(JSON.parse(consolidacionesGuardadas));
    }
  };

  const inicializarEmpresaMatriz = () => {
    const empresasExistentes = JSON.parse(localStorage.getItem('empresasGrupo') || '[]');
    
    if (empresasExistentes.length === 0) {
      const empresaMatriz: Empresa = {
        id: 'matriz_principal',
        nombre: 'Empresa Matriz',
        nit: '1234567890',
        participacion: 100,
        tipo: 'matriz',
        moneda: 'BOB',
        tasaCambio: 1,
        activa: true
      };

      const nuevasEmpresas = [empresaMatriz];
      setEmpresas(nuevasEmpresas);
      localStorage.setItem('empresasGrupo', JSON.stringify(nuevasEmpresas));
    }
  };

  const agregarEmpresa = (datosEmpresa: Omit<Empresa, 'id'>) => {
    const nuevaEmpresa: Empresa = {
      ...datosEmpresa,
      id: `empresa_${Date.now()}`
    };

    const empresasActualizadas = [...empresas, nuevaEmpresa];
    setEmpresas(empresasActualizadas);
    localStorage.setItem('empresasGrupo', JSON.stringify(empresasActualizadas));

    toast({
      title: "Empresa agregada",
      description: `${nuevaEmpresa.nombre} agregada al grupo`,
    });
  };

  const ejecutarConsolidacion = async () => {
    if (empresas.length < 2) {
      toast({
        title: "Error",
        description: "Se necesitan al menos 2 empresas para consolidar",
        variant: "destructive"
      });
      return;
    }

    setConsolidandoPeriodo(periodoConsolidacion);
    
    toast({
      title: "Iniciando consolidación",
      description: `Consolidando estados financieros para ${periodoConsolidacion}...`,
    });

    try {
      // 1. Obtener estados financieros de cada empresa
      const balancesEmpresa: { [empresaId: string]: any } = {};
      const resultadosEmpresa: { [empresaId: string]: any } = {};

      for (const empresa of empresas.filter(e => e.activa)) {
        // Simular datos de subsidiarias (en producción vendría de APIs)
        if (empresa.tipo === 'matriz') {
          balancesEmpresa[empresa.id] = getBalanceSheetData();
          resultadosEmpresa[empresa.id] = getIncomeStatementData();
        } else {
          // Generar datos simulados para subsidiarias
          balancesEmpresa[empresa.id] = generarDatosSimuladosBalance(empresa);
          resultadosEmpresa[empresa.id] = generarDatosSimuladosResultados(empresa);
        }
      }

      // 2. Convertir monedas a moneda de consolidación (BOB)
      const balancesConvertidos = convertirMonedasBalance(balancesEmpresa);
      const resultadosConvertidos = convertirMonedasResultados(resultadosEmpresa);

      // 3. Consolidar cuentas
      const balanceConsolidado = consolidarBalance(balancesConvertidos);
      const resultadosConsolidados = consolidarResultados(resultadosConvertidos);

      // 4. Aplicar eliminaciones intercompañía
      aplicarEliminaciones(balanceConsolidado, resultadosConsolidados);

      // 5. Crear estado consolidado
      const estadoConsolidado: EstadoConsolidado = {
        id: `consolidacion_${Date.now()}`,
        periodo: periodoConsolidacion,
        fecha: new Date().toISOString().slice(0, 10),
        empresas: empresas.filter(e => e.activa).map(e => e.id),
        balanceGeneral: balanceConsolidado,
        estadoResultados: resultadosConsolidados,
        eliminaciones: transaccionesIntercompania.filter(t => 
          t.fecha.startsWith(periodoConsolidacion) && t.eliminada
        ),
        observaciones: `Consolidación automática - ${empresas.filter(e => e.activa).length} empresas`
      };

      const nuevosEstados = [estadoConsolidado, ...estadosConsolidados];
      setEstadosConsolidados(nuevosEstados);
      localStorage.setItem('estadosConsolidados', JSON.stringify(nuevosEstados));

      toast({
        title: "Consolidación completada",
        description: "Estados financieros consolidados generados exitosamente",
      });

    } catch (error) {
      console.error('Error en consolidación:', error);
      toast({
        title: "Error en consolidación",
        description: "No se pudo completar la consolidación",
        variant: "destructive"
      });
    } finally {
      setConsolidandoPeriodo(null);
    }
  };

  const generarDatosSimuladosBalance = (empresa: Empresa) => {
    const factor = empresa.participacion / 100;
    return {
      activos: {
        cuentas: [
          { codigo: '1111', nombre: 'Caja y Bancos', saldo: 50000 * factor },
          { codigo: '1121', nombre: 'Cuentas por Cobrar', saldo: 80000 * factor },
          { codigo: '1141', nombre: 'Inventarios', saldo: 120000 * factor },
          { codigo: '1511', nombre: 'Activos Fijos', saldo: 200000 * factor }
        ],
        total: 450000 * factor
      },
      pasivos: {
        cuentas: [
          { codigo: '2111', nombre: 'Cuentas por Pagar', saldo: 60000 * factor },
          { codigo: '2211', nombre: 'Préstamos por Pagar', saldo: 100000 * factor }
        ],
        total: 160000 * factor
      },
      patrimonio: {
        cuentas: [
          { codigo: '3111', nombre: 'Capital Social', saldo: 250000 * factor },
          { codigo: '3211', nombre: 'Utilidades Retenidas', saldo: 40000 * factor }
        ],
        total: 290000 * factor
      }
    };
  };

  const generarDatosSimuladosResultados = (empresa: Empresa) => {
    const factor = empresa.participacion / 100;
    return {
      ingresos: {
        cuentas: [
          { codigo: '4111', nombre: 'Ventas', saldo: 300000 * factor },
          { codigo: '4121', nombre: 'Otros Ingresos', saldo: 20000 * factor }
        ],
        total: 320000 * factor
      },
      gastos: {
        cuentas: [
          { codigo: '5111', nombre: 'Costo de Ventas', saldo: 180000 * factor },
          { codigo: '5211', nombre: 'Gastos Operativos', saldo: 90000 * factor }
        ],
        total: 270000 * factor
      },
      utilidadNeta: 50000 * factor
    };
  };

  const convertirMonedasBalance = (balances: any) => {
    const balancesConvertidos: any = {};
    
    for (const [empresaId, balance] of Object.entries(balances)) {
      const empresa = empresas.find(e => e.id === empresaId);
      const tasa = empresa?.tasaCambio || 1;
      
      balancesConvertidos[empresaId] = {
        activos: {
          cuentas: (balance as any).activos.cuentas.map((cuenta: any) => ({
            ...cuenta,
            saldo: cuenta.saldo * tasa
          })),
          total: (balance as any).activos.total * tasa
        },
        pasivos: {
          cuentas: (balance as any).pasivos.cuentas.map((cuenta: any) => ({
            ...cuenta,
            saldo: cuenta.saldo * tasa
          })),
          total: (balance as any).pasivos.total * tasa
        },
        patrimonio: {
          cuentas: (balance as any).patrimonio.cuentas.map((cuenta: any) => ({
            ...cuenta,
            saldo: cuenta.saldo * tasa
          })),
          total: (balance as any).patrimonio.total * tasa
        }
      };
    }
    
    return balancesConvertidos;
  };

  const convertirMonedasResultados = (resultados: any) => {
    const resultadosConvertidos: any = {};
    
    for (const [empresaId, resultado] of Object.entries(resultados)) {
      const empresa = empresas.find(e => e.id === empresaId);
      const tasa = empresa?.tasaCambio || 1;
      
      resultadosConvertidos[empresaId] = {
        ingresos: {
          cuentas: (resultado as any).ingresos.cuentas.map((cuenta: any) => ({
            ...cuenta,
            saldo: cuenta.saldo * tasa
          })),
          total: (resultado as any).ingresos.total * tasa
        },
        gastos: {
          cuentas: (resultado as any).gastos.cuentas.map((cuenta: any) => ({
            ...cuenta,
            saldo: cuenta.saldo * tasa
          })),
          total: (resultado as any).gastos.total * tasa
        },
        utilidadNeta: (resultado as any).utilidadNeta * tasa
      };
    }
    
    return resultadosConvertidos;
  };

  const consolidarBalance = (balances: any): CuentaConsolidacion[] => {
    const cuentasConsolidadas = new Map<string, CuentaConsolidacion>();
    
    for (const [empresaId, balance] of Object.entries(balances)) {
      ['activos', 'pasivos', 'patrimonio'].forEach(seccion => {
        (balance as any)[seccion].cuentas.forEach((cuenta: any) => {
          const key = cuenta.codigo;
          
          if (!cuentasConsolidadas.has(key)) {
            cuentasConsolidadas.set(key, {
              codigo: cuenta.codigo,
              nombre: cuenta.nombre,
              saldos: {},
              eliminaciones: 0,
              saldoConsolidado: 0,
              tipo: seccion.slice(0, -1) as any // 'activos' -> 'activo'
            });
          }
          
          const cuentaConsolidada = cuentasConsolidadas.get(key)!;
          cuentaConsolidada.saldos[empresaId] = cuenta.saldo;
          cuentaConsolidada.saldoConsolidado += cuenta.saldo;
        });
      });
    }
    
    return Array.from(cuentasConsolidadas.values());
  };

  const consolidarResultados = (resultados: any): CuentaConsolidacion[] => {
    const cuentasConsolidadas = new Map<string, CuentaConsolidacion>();
    
    for (const [empresaId, resultado] of Object.entries(resultados)) {
      ['ingresos', 'gastos'].forEach(seccion => {
        (resultado as any)[seccion].cuentas.forEach((cuenta: any) => {
          const key = cuenta.codigo;
          
          if (!cuentasConsolidadas.has(key)) {
            cuentasConsolidadas.set(key, {
              codigo: cuenta.codigo,
              nombre: cuenta.nombre,
              saldos: {},
              eliminaciones: 0,
              saldoConsolidado: 0,
              tipo: seccion.slice(0, -1) as any // 'ingresos' -> 'ingreso'
            });
          }
          
          const cuentaConsolidada = cuentasConsolidadas.get(key)!;
          cuentaConsolidada.saldos[empresaId] = cuenta.saldo;
          cuentaConsolidada.saldoConsolidado += cuenta.saldo;
        });
      });
    }
    
    return Array.from(cuentasConsolidadas.values());
  };

  const aplicarEliminaciones = (balance: CuentaConsolidacion[], resultados: CuentaConsolidacion[]) => {
    const eliminacionesDelPeriodo = transaccionesIntercompania.filter(t => 
      t.fecha.startsWith(periodoConsolidacion)
    );
    
    eliminacionesDelPeriodo.forEach(transaccion => {
      // Eliminar de balance
      const cuentaBalance = balance.find(c => c.codigo === transaccion.cuenta);
      if (cuentaBalance) {
        cuentaBalance.eliminaciones += transaccion.monto;
        cuentaBalance.saldoConsolidado -= transaccion.monto;
        transaccion.eliminada = true;
      }
      
      // Eliminar de resultados
      const cuentaResultados = resultados.find(c => c.codigo === transaccion.cuenta);
      if (cuentaResultados) {
        cuentaResultados.eliminaciones += transaccion.monto;
        cuentaResultados.saldoConsolidado -= transaccion.monto;
        transaccion.eliminada = true;
      }
    });
    
    // Guardar transacciones actualizadas
    localStorage.setItem('transaccionesIntercompania', JSON.stringify(transaccionesIntercompania));
  };

  const registrarTransaccionIntercompania = (transaccion: Omit<TransaccionIntercompania, 'id' | 'eliminada'>) => {
    const nuevaTransaccion: TransaccionIntercompania = {
      ...transaccion,
      id: `trans_${Date.now()}`,
      eliminada: false
    };

    const transaccionesActualizadas = [...transaccionesIntercompania, nuevaTransaccion];
    setTransaccionesIntercompania(transaccionesActualizadas);
    localStorage.setItem('transaccionesIntercompania', JSON.stringify(transaccionesActualizadas));

    toast({
      title: "Transacción registrada",
      description: "Transacción intercompañía registrada para eliminación",
    });
  };

  const exportarEstadoConsolidado = (estado: EstadoConsolidado) => {
    let contenido = `ESTADOS FINANCIEROS CONSOLIDADOS\n`;
    contenido += `Período: ${estado.periodo}\n`;
    contenido += `Fecha: ${new Date(estado.fecha).toLocaleDateString('es-BO')}\n\n`;
    
    contenido += `BALANCE GENERAL CONSOLIDADO\n`;
    contenido += `===========================\n`;
    
    ['activo', 'pasivo', 'patrimonio'].forEach(tipo => {
      const cuentasTipo = estado.balanceGeneral.filter(c => c.tipo === tipo);
      contenido += `\n${tipo.toUpperCase()}S\n`;
      cuentasTipo.forEach(cuenta => {
        contenido += `${cuenta.codigo} - ${cuenta.nombre}: Bs. ${cuenta.saldoConsolidado.toFixed(2)}\n`;
        if (cuenta.eliminaciones !== 0) {
          contenido += `  (Eliminaciones: Bs. ${cuenta.eliminaciones.toFixed(2)})\n`;
        }
      });
    });
    
    contenido += `\n\nESTADO DE RESULTADOS CONSOLIDADO\n`;
    contenido += `================================\n`;
    
    ['ingreso', 'gasto'].forEach(tipo => {
      const cuentasTipo = estado.estadoResultados.filter(c => c.tipo === tipo);
      contenido += `\n${tipo.toUpperCase()}S\n`;
      cuentasTipo.forEach(cuenta => {
        contenido += `${cuenta.codigo} - ${cuenta.nombre}: Bs. ${cuenta.saldoConsolidado.toFixed(2)}\n`;
        if (cuenta.eliminaciones !== 0) {
          contenido += `  (Eliminaciones: Bs. ${cuenta.eliminaciones.toFixed(2)})\n`;
        }
      });
    });

    const blob = new Blob([contenido], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `estados_consolidados_${estado.periodo}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Building2 className="w-6 h-6 text-primary" />
          <div>
            <h2 className="text-2xl font-bold">Consolidación Financiera</h2>
            <p className="text-slate-600">
              Consolidación automática de estados financieros del grupo empresarial
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="periodo">Período:</Label>
            <Input
              id="periodo"
              type="month"
              value={periodoConsolidacion}
              onChange={(e) => setPeriodoConsolidacion(e.target.value)}
              className="w-40"
            />
          </div>
          <Button 
            onClick={ejecutarConsolidacion} 
            disabled={consolidandoPeriodo !== null}
          >
            <Calculator className="w-4 h-4 mr-2" />
            {consolidandoPeriodo ? 'Consolidando...' : 'Consolidar'}
          </Button>
        </div>
      </div>

      {/* Métricas del grupo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Empresas del Grupo</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{empresas.filter(e => e.activa).length}</div>
            <p className="text-xs text-muted-foreground">Activas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Consolidaciones</CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estadosConsolidados.length}</div>
            <p className="text-xs text-muted-foreground">Generadas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Eliminaciones</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {transaccionesIntercompania.filter(t => t.eliminada).length}
            </div>
            <p className="text-xs text-muted-foreground">Aplicadas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Última Consolidación</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {estadosConsolidados.length > 0 
                ? new Date(estadosConsolidados[0].fecha).toLocaleDateString('es-BO')
                : '-'
              }
            </div>
            <p className="text-xs text-muted-foreground">
              {estadosConsolidados.length > 0 ? estadosConsolidados[0].periodo : 'Ninguna'}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="empresas" className="w-full">
        <TabsList>
          <TabsTrigger value="empresas">Empresas del Grupo</TabsTrigger>
          <TabsTrigger value="eliminaciones">Eliminaciones</TabsTrigger>
          <TabsTrigger value="consolidados">Estados Consolidados</TabsTrigger>
        </TabsList>

        <TabsContent value="empresas">
          <Card>
            <CardHeader>
              <CardTitle>Empresas del Grupo</CardTitle>
              <CardDescription>
                Gestión de empresas para consolidación financiera
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>NIT</TableHead>
                    <TableHead>Participación</TableHead>
                    <TableHead>Moneda</TableHead>
                    <TableHead>Tasa Cambio</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {empresas.map((empresa) => (
                    <TableRow key={empresa.id}>
                      <TableCell>
                        <Badge variant={empresa.tipo === 'matriz' ? 'default' : 'secondary'}>
                          {empresa.tipo}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{empresa.nombre}</TableCell>
                      <TableCell>{empresa.nit}</TableCell>
                      <TableCell>{empresa.participacion}%</TableCell>
                      <TableCell>{empresa.moneda}</TableCell>
                      <TableCell>{empresa.tasaCambio}</TableCell>
                      <TableCell>
                        <Badge variant={empresa.activa ? 'default' : 'secondary'}>
                          {empresa.activa ? 'Activa' : 'Inactiva'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="eliminaciones">
          <Card>
            <CardHeader>
              <CardTitle>Transacciones Intercompañía</CardTitle>
              <CardDescription>
                Registro de transacciones para eliminación en consolidación
              </CardDescription>
            </CardHeader>
            <CardContent>
              {transaccionesIntercompania.length === 0 ? (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertTitle>No hay transacciones registradas</AlertTitle>
                  <AlertDescription>
                    Las transacciones intercompañía se eliminan automáticamente durante la consolidación.
                  </AlertDescription>
                </Alert>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Origen</TableHead>
                      <TableHead>Destino</TableHead>
                      <TableHead>Cuenta</TableHead>
                      <TableHead>Monto</TableHead>
                      <TableHead>Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transaccionesIntercompania.map((transaccion) => (
                      <TableRow key={transaccion.id}>
                        <TableCell>{transaccion.fecha}</TableCell>
                        <TableCell>
                          {empresas.find(e => e.id === transaccion.empresaOrigen)?.nombre}
                        </TableCell>
                        <TableCell>
                          {empresas.find(e => e.id === transaccion.empresaDestino)?.nombre}
                        </TableCell>
                        <TableCell>{transaccion.cuenta}</TableCell>
                        <TableCell>Bs. {transaccion.monto.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge variant={transaccion.eliminada ? 'default' : 'secondary'}>
                            {transaccion.eliminada ? 'Eliminada' : 'Pendiente'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="consolidados">
          <Card>
            <CardHeader>
              <CardTitle>Estados Financieros Consolidados</CardTitle>
              <CardDescription>
                Historial de consolidaciones generadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              {estadosConsolidados.length === 0 ? (
                <Alert>
                  <FileText className="h-4 w-4" />
                  <AlertTitle>No hay consolidaciones generadas</AlertTitle>
                  <AlertDescription>
                    Ejecute una consolidación para generar estados financieros consolidados.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-4">
                  {estadosConsolidados.map((estado) => (
                    <Card key={estado.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">
                              Estados Consolidados {estado.periodo}
                            </CardTitle>
                            <CardDescription>
                              Generado el {new Date(estado.fecha).toLocaleDateString('es-BO')} 
                              • {estado.empresas.length} empresas
                            </CardDescription>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => exportarEstadoConsolidado(estado)}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Exportar
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium mb-2">Balance General</h4>
                            <p className="text-sm text-muted-foreground">
                              {estado.balanceGeneral.length} cuentas consolidadas
                            </p>
                          </div>
                          <div>
                            <h4 className="font-medium mb-2">Estado de Resultados</h4>
                            <p className="text-sm text-muted-foreground">
                              {estado.estadoResultados.length} cuentas consolidadas
                            </p>
                          </div>
                        </div>
                        {estado.observaciones && (
                          <div className="mt-4">
                            <p className="text-sm text-muted-foreground">
                              <strong>Observaciones:</strong> {estado.observaciones}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ConsolidacionFinanciera;