import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Activity, DollarSign, Percent } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { useContabilidadIntegration } from "@/hooks/useContabilidadIntegration";

interface RatioFinanciero {
  nombre: string;
  valor: number;
  optimo: { min: number; max: number };
  categoria: 'liquidez' | 'rentabilidad' | 'endeudamiento' | 'actividad';
  interpretacion: string;
  estado: 'bueno' | 'regular' | 'malo';
}

interface TendenciaFinanciera {
  periodo: string;
  ventas: number;
  utilidad: number;
  activos: number;
  patrimonio: number;
}

const AnalisisFinanciero = () => {
  const [ratios, setRatios] = useState<RatioFinanciero[]>([]);
  const [tendencias, setTendencias] = useState<TendenciaFinanciera[]>([]);
  const [alertas, setAlertas] = useState<string[]>([]);
  const { getBalanceSheetData, getIncomeStatementData } = useContabilidadIntegration();

  useEffect(() => {
    calcularRatiosFinancieros();
    generarTendencias();
    evaluarAlertas();
  }, []);

  const calcularRatiosFinancieros = () => {
    const balanceData = getBalanceSheetData();
    const estadoResultados = getIncomeStatementData();

    // Calcular activo corriente y pasivo corriente basado en códigos de cuenta
    const activoCorriente = balanceData.activos.cuentas
      .filter(cuenta => cuenta.codigo.startsWith('11')) // Activos corrientes
      .reduce((sum, cuenta) => sum + cuenta.saldo, 0);
    
    const pasivoCorriente = balanceData.pasivos.cuentas
      .filter(cuenta => cuenta.codigo.startsWith('21')) // Pasivos corrientes
      .reduce((sum, cuenta) => sum + cuenta.saldo, 0);

    const totalActivos = balanceData.activos.total;
    const totalPasivos = balanceData.pasivos.total;
    const patrimonio = balanceData.patrimonio.total;
    const ventas = estadoResultados.ingresos.total;
    const utilidadNeta = estadoResultados.utilidadNeta;

    const ratiosCalculados: RatioFinanciero[] = [
      // Ratios de Liquidez
      {
        nombre: "Razón Corriente",
        valor: pasivoCorriente > 0 ? activoCorriente / pasivoCorriente : 0,
        optimo: { min: 1.2, max: 2.0 },
        categoria: 'liquidez',
        interpretacion: "Capacidad para cubrir deudas a corto plazo",
        estado: 'bueno'
      },
      {
        nombre: "Prueba Ácida",
        valor: pasivoCorriente > 0 ? (activoCorriente * 0.8) / pasivoCorriente : 0,
        optimo: { min: 0.8, max: 1.5 },
        categoria: 'liquidez',
        interpretacion: "Liquidez inmediata sin inventarios",
        estado: 'bueno'
      },
      // Ratios de Rentabilidad
      {
        nombre: "ROA (Rentabilidad sobre Activos)",
        valor: totalActivos > 0 ? (utilidadNeta / totalActivos) * 100 : 0,
        optimo: { min: 5, max: 15 },
        categoria: 'rentabilidad',
        interpretacion: "Eficiencia en el uso de activos",
        estado: 'bueno'
      },
      {
        nombre: "ROE (Rentabilidad sobre Patrimonio)",
        valor: patrimonio > 0 ? (utilidadNeta / patrimonio) * 100 : 0,
        optimo: { min: 10, max: 25 },
        categoria: 'rentabilidad',
        interpretacion: "Rendimiento para los accionistas",
        estado: 'bueno'
      },
      {
        nombre: "Margen Neto",
        valor: ventas > 0 ? (utilidadNeta / ventas) * 100 : 0,
        optimo: { min: 3, max: 15 },
        categoria: 'rentabilidad',
        interpretacion: "Porcentaje de utilidad sobre ventas",
        estado: 'bueno'
      },
      // Ratios de Endeudamiento
      {
        nombre: "Razón de Endeudamiento",
        valor: totalActivos > 0 ? (totalPasivos / totalActivos) * 100 : 0,
        optimo: { min: 30, max: 60 },
        categoria: 'endeudamiento',
        interpretacion: "Porcentaje de activos financiados con deuda",
        estado: 'bueno'
      },
      {
        nombre: "Razón Deuda-Patrimonio",
        valor: patrimonio > 0 ? (totalPasivos / patrimonio) * 100 : 0,
        optimo: { min: 40, max: 100 },
        categoria: 'endeudamiento',
        interpretacion: "Proporción de deuda vs patrimonio",
        estado: 'bueno'
      },
      // Ratios de Actividad
      {
        nombre: "Rotación de Activos",
        valor: totalActivos > 0 ? ventas / totalActivos : 0,
        optimo: { min: 0.5, max: 2.0 },
        categoria: 'actividad',
        interpretacion: "Eficiencia en el uso de activos para generar ventas",
        estado: 'bueno'
      }
    ];

    // Evaluar estado de cada ratio
    const ratiosConEstado = ratiosCalculados.map(ratio => {
      let estado: 'bueno' | 'regular' | 'malo' = 'bueno';
      
      if (ratio.valor < ratio.optimo.min || ratio.valor > ratio.optimo.max) {
        if (Math.abs(ratio.valor - ratio.optimo.min) > (ratio.optimo.max - ratio.optimo.min) * 0.5) {
          estado = 'malo';
        } else {
          estado = 'regular';
        }
      }
      
      return { ...ratio, estado };
    });

    setRatios(ratiosConEstado);
  };

  const generarTendencias = () => {
    // Generar datos de tendencia simulados para los últimos 6 meses
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'];
    const tendenciasData: TendenciaFinanciera[] = meses.map((mes, index) => ({
      periodo: mes,
      ventas: 50000 + (index * 5000) + (Math.random() * 10000 - 5000),
      utilidad: 8000 + (index * 800) + (Math.random() * 2000 - 1000),
      activos: 200000 + (index * 10000),
      patrimonio: 120000 + (index * 6000)
    }));

    setTendencias(tendenciasData);
  };

  const evaluarAlertas = () => {
    const alertasGeneradas: string[] = [];
    
    ratios.forEach(ratio => {
      if (ratio.estado === 'malo') {
        alertasGeneradas.push(`${ratio.nombre} está fuera del rango óptimo (${ratio.valor.toFixed(2)})`);
      }
    });

    if (alertasGeneradas.length === 0) {
      alertasGeneradas.push("Todos los ratios financieros están dentro de rangos aceptables");
    }

    setAlertas(alertasGeneradas);
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'bueno': return 'text-green-600 bg-green-50 border-green-200';
      case 'regular': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'malo': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'bueno': return <CheckCircle className="w-4 h-4" />;
      case 'regular': return <AlertTriangle className="w-4 h-4" />;
      case 'malo': return <TrendingDown className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Resumen Ejecutivo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Ratios Buenos</p>
                <p className="text-2xl font-bold text-green-600">
                  {ratios.filter(r => r.estado === 'bueno').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Ratios Regulares</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {ratios.filter(r => r.estado === 'regular').length}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Ratios Críticos</p>
                <p className="text-2xl font-bold text-red-600">
                  {ratios.filter(r => r.estado === 'malo').length}
                </p>
              </div>
              <TrendingDown className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Score General</p>
                <p className="text-2xl font-bold">
                  {Math.round((ratios.filter(r => r.estado === 'bueno').length / ratios.length) * 100)}%
                </p>
              </div>
              <Percent className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="ratios" className="space-y-4">
        <TabsList>
          <TabsTrigger value="ratios">Ratios Financieros</TabsTrigger>
          <TabsTrigger value="tendencias">Análisis de Tendencias</TabsTrigger>
          <TabsTrigger value="alertas">Alertas y Recomendaciones</TabsTrigger>
        </TabsList>

        <TabsContent value="ratios">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {['liquidez', 'rentabilidad', 'endeudamiento', 'actividad'].map(categoria => (
              <Card key={categoria}>
                <CardHeader>
                  <CardTitle className="capitalize">Ratios de {categoria}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {ratios.filter(r => r.categoria === categoria).map(ratio => (
                      <div key={ratio.nombre} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{ratio.nombre}</span>
                          <Badge className={getEstadoColor(ratio.estado)}>
                            {getEstadoIcon(ratio.estado)}
                            <span className="ml-1">{ratio.estado}</span>
                          </Badge>
                        </div>
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Valor: {ratio.valor.toFixed(2)}{ratio.categoria === 'rentabilidad' || ratio.categoria === 'endeudamiento' ? '%' : ''}</span>
                          <span>Óptimo: {ratio.optimo.min} - {ratio.optimo.max}</span>
                        </div>
                        <Progress 
                          value={Math.min((ratio.valor / ratio.optimo.max) * 100, 100)} 
                          className="h-2"
                        />
                        <p className="text-xs text-muted-foreground">{ratio.interpretacion}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tendencias">
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Evolución de Ventas y Utilidad</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={tendencias}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="periodo" />
                      <YAxis />
                      <Tooltip formatter={(value: number) => [`Bs. ${value.toLocaleString()}`, ""]} />
                      <Line type="monotone" dataKey="ventas" stroke="#8884d8" name="Ventas" />
                      <Line type="monotone" dataKey="utilidad" stroke="#82ca9d" name="Utilidad" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Evolución de Activos y Patrimonio</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={tendencias}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="periodo" />
                      <YAxis />
                      <Tooltip formatter={(value: number) => [`Bs. ${value.toLocaleString()}`, ""]} />
                      <Bar dataKey="activos" fill="#8884d8" name="Activos" />
                      <Bar dataKey="patrimonio" fill="#82ca9d" name="Patrimonio" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="alertas">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Alertas Financieras</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {alertas.map((alerta, index) => (
                    <Alert key={index}>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>{alerta}</AlertDescription>
                    </Alert>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recomendaciones</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      Mantener un seguimiento mensual de los ratios de liquidez para asegurar la solvencia a corto plazo.
                    </AlertDescription>
                  </Alert>
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      Revisar la estructura de capital si los ratios de endeudamiento están fuera del rango óptimo.
                    </AlertDescription>
                  </Alert>
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      Implementar estrategias para mejorar la rentabilidad si los márgenes están por debajo del objetivo.
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalisisFinanciero;
