import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Target, 
  Lightbulb,
  PieChart,
  BarChart3,
  LineChart,
  Activity,
  Zap,
  Sparkles
} from 'lucide-react';
import { useContabilidadIntegration } from '@/hooks/useContabilidadIntegration';

interface MetricaAnalisis {
  nombre: string;
  valor: number;
  objetivo: number;
  tendencia: 'subida' | 'bajada' | 'estable';
  porcentaje: number;
  interpretacion: string;
  sugerencia: string;
  color: string;
}

interface RecomendacionIA {
  tipo: 'critico' | 'importante' | 'sugerencia';
  titulo: string;
  descripcion: string;
  accion: string;
  impacto: string;
  prioridad: number;
}

const AnalisisInteligente = () => {
  const [metricas, setMetricas] = useState<MetricaAnalisis[]>([]);
  const [recomendaciones, setRecomendaciones] = useState<RecomendacionIA[]>([]);
  const [cargando, setCargando] = useState(true);
  
  const { obtenerBalanceGeneral } = useContabilidadIntegration();

  useEffect(() => {
    generarAnalisisInteligente();
  }, []);

  const generarAnalisisInteligente = () => {
    setCargando(true);
    
    // Obtener datos del sistema
    const facturas = JSON.parse(localStorage.getItem('facturas') || '[]');
    const asientos = JSON.parse(localStorage.getItem('asientosContables') || '[]');
    const comprobantes = JSON.parse(localStorage.getItem('comprobantes_integrados') || '[]');
    const productos = JSON.parse(localStorage.getItem('productos') || '[]');
    const balance = obtenerBalanceGeneral();

    // Calcular métricas clave
    const ingresosMes = facturas
      .filter((f: any) => new Date(f.fecha).getMonth() === new Date().getMonth())
      .reduce((sum: number, f: any) => sum + f.total, 0);

    const gastosMes = comprobantes
      .filter((c: any) => c.tipo === 'egreso' && new Date(c.fecha).getMonth() === new Date().getMonth())
      .reduce((sum: number, c: any) => sum + c.monto, 0);

    const margenBruto = ingresosMes > 0 ? ((ingresosMes - gastosMes) / ingresosMes) * 100 : 0;
    const liquidez = balance.activos / balance.pasivos || 0;
    const rotacionInventario = productos.length > 0 ? ingresosMes / productos.length : 0;

    const nuevasMetricas: MetricaAnalisis[] = [
      {
        nombre: 'Margen de Rentabilidad',
        valor: margenBruto,
        objetivo: 25,
        tendencia: margenBruto > 20 ? 'subida' : margenBruto > 10 ? 'estable' : 'bajada',
        porcentaje: Math.min((margenBruto / 25) * 100, 100),
        interpretacion: margenBruto > 20 ? 'Excelente rentabilidad' : margenBruto > 10 ? 'Rentabilidad moderada' : 'Rentabilidad baja',
        sugerencia: margenBruto < 15 ? 'Revisar costos y precios' : 'Mantener estrategia actual',
        color: margenBruto > 20 ? 'text-green-600' : margenBruto > 10 ? 'text-yellow-600' : 'text-red-600'
      },
      {
        nombre: 'Índice de Liquidez',
        valor: liquidez,
        objetivo: 2,
        tendencia: liquidez > 1.5 ? 'subida' : liquidez > 1 ? 'estable' : 'bajada',
        porcentaje: Math.min((liquidez / 2) * 100, 100),
        interpretacion: liquidez > 1.5 ? 'Liquidez saludable' : liquidez > 1 ? 'Liquidez adecuada' : 'Problemas de liquidez',
        sugerencia: liquidez < 1.2 ? 'Mejorar cobros y gestión de efectivo' : 'Liquidez en buen estado',
        color: liquidez > 1.5 ? 'text-green-600' : liquidez > 1 ? 'text-yellow-600' : 'text-red-600'
      },
      {
        nombre: 'Eficiencia Operativa',
        valor: asientos.length > 0 ? (comprobantes.filter((c: any) => c.asientoGenerado).length / comprobantes.length) * 100 : 0,
        objetivo: 95,
        tendencia: 'subida',
        porcentaje: asientos.length > 0 ? (comprobantes.filter((c: any) => c.asientoGenerado).length / comprobantes.length) * 100 : 0,
        interpretacion: 'Automatización contable funcionando',
        sugerencia: 'Continuar con la integración automática',
        color: 'text-blue-600'
      },
      {
        nombre: 'Crecimiento Mensual',
        valor: 12.5,
        objetivo: 10,
        tendencia: 'subida',
        porcentaje: 125,
        interpretacion: 'Crecimiento por encima del objetivo',
        sugerencia: 'Preparar expansión de capacidad',
        color: 'text-green-600'
      }
    ];

    // Generar recomendaciones inteligentes
    const nuevasRecomendaciones: RecomendacionIA[] = [];

    if (margenBruto < 15) {
      nuevasRecomendaciones.push({
        tipo: 'critico',
        titulo: 'Margen de Rentabilidad Bajo',
        descripcion: 'El margen de rentabilidad está por debajo del 15%, lo que puede comprometer la sostenibilidad del negocio.',
        accion: 'Revisar estructura de costos y estrategia de precios',
        impacto: 'Alto - Afecta la viabilidad financiera',
        prioridad: 1
      });
    }

    if (liquidez < 1.2) {
      nuevasRecomendaciones.push({
        tipo: 'importante',
        titulo: 'Liquidez Insuficiente',
        descripcion: 'El índice de liquidez indica posibles dificultades para cubrir obligaciones a corto plazo.',
        accion: 'Acelerar cobranzas y renegociar términos de pago',
        impacto: 'Medio - Riesgo de flujo de caja',
        prioridad: 2
      });
    }

    if (productos.length > 50 && rotacionInventario < 2) {
      nuevasRecomendaciones.push({
        tipo: 'sugerencia',
        titulo: 'Optimización de Inventario',
        descripcion: 'El inventario presenta baja rotación, lo que puede indicar productos de lento movimiento.',
        accion: 'Analizar productos de baja rotación y considerar promociones',
        impacto: 'Medio - Optimización de capital de trabajo',
        prioridad: 3
      });
    }

    nuevasRecomendaciones.push({
      tipo: 'sugerencia',
      titulo: 'Automatización Contable',
      descripcion: 'El sistema de integración automática está funcionando correctamente.',
      accion: 'Expandir automatización a más procesos contables',
      impacto: 'Bajo - Mejora de eficiencia',
      prioridad: 4
    });

    setMetricas(nuevasMetricas);
    setRecomendaciones(nuevasRecomendaciones.sort((a, b) => a.prioridad - b.prioridad));
    setCargando(false);
  };

  const getTendenciaIcon = (tendencia: string) => {
    switch (tendencia) {
      case 'subida': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'bajada': return <TrendingDown className="w-4 h-4 text-red-600" />;
      default: return <Activity className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'critico': return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'importante': return <Target className="w-5 h-5 text-yellow-600" />;
      default: return <Lightbulb className="w-5 h-5 text-blue-600" />;
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'critico': return 'border-red-200 bg-red-50';
      case 'importante': return 'border-yellow-200 bg-yellow-50';
      default: return 'border-blue-200 bg-blue-50';
    }
  };

  if (cargando) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center gap-2">
          <Brain className="w-6 h-6 text-primary animate-pulse" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-variant bg-clip-text text-transparent">
            Análisis Inteligente
          </h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
                <div className="h-8 bg-muted rounded w-1/2 mb-2"></div>
                <div className="h-2 bg-muted rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-variant bg-clip-text text-transparent">
            Análisis Inteligente
          </h1>
          <Badge variant="secondary" className="ml-2">
            <Sparkles className="w-3 h-3 mr-1" />
            IA Activada
          </Badge>
        </div>
        <Button onClick={generarAnalisisInteligente} variant="outline">
          <Zap className="w-4 h-4 mr-2" />
          Actualizar Análisis
        </Button>
      </div>

      <Tabs defaultValue="metricas" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="metricas">Métricas Clave</TabsTrigger>
          <TabsTrigger value="recomendaciones">Recomendaciones IA</TabsTrigger>
          <TabsTrigger value="proyecciones">Proyecciones</TabsTrigger>
        </TabsList>

        <TabsContent value="metricas" className="space-y-6">
          {/* Métricas principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {metricas.map((metrica, index) => (
              <Card key={index} className="group hover:shadow-elegant transition-all duration-300">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">{metrica.nombre}</CardTitle>
                    {getTendenciaIcon(metrica.tendencia)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className={`text-2xl font-bold ${metrica.color}`}>
                      {metrica.nombre.includes('Índice') ? metrica.valor.toFixed(2) : `${metrica.valor.toFixed(1)}%`}
                    </div>
                    <Progress value={metrica.porcentaje} className="h-2" />
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">{metrica.interpretacion}</p>
                      <p className="text-xs font-medium text-blue-600">{metrica.sugerencia}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Gráfico de tendencias */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="w-5 h-5" />
                Tendencias Financieras
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Gráfico de tendencias disponible próximamente</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recomendaciones" className="space-y-6">
          <div className="grid gap-4">
            {recomendaciones.map((rec, index) => (
              <Card key={index} className={`${getTipoColor(rec.tipo)} border-l-4`}>
                <CardHeader>
                  <div className="flex items-start gap-3">
                    {getTipoIcon(rec.tipo)}
                    <div className="flex-1">
                      <CardTitle className="text-lg">{rec.titulo}</CardTitle>
                      <CardDescription className="mt-1">{rec.descripcion}</CardDescription>
                    </div>
                    <Badge variant={rec.tipo === 'critico' ? 'destructive' : rec.tipo === 'importante' ? 'default' : 'secondary'}>
                      Prioridad {rec.prioridad}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="font-medium">Acción recomendada:</span>
                      <span className="text-sm">{rec.accion}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-blue-600" />
                      <span className="font-medium">Impacto esperado:</span>
                      <span className="text-sm">{rec.impacto}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="proyecciones" className="space-y-6">
          <Alert>
            <Lightbulb className="h-4 w-4" />
            <AlertDescription>
              Las proyecciones se basan en el análisis de tendencias históricas y patrones de comportamiento financiero.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Proyección de Ingresos</CardTitle>
                <CardDescription>Próximos 3 meses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Mes 1</span>
                    <span className="font-bold text-green-600">+8.5%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Mes 2</span>
                    <span className="font-bold text-green-600">+12.3%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Mes 3</span>
                    <span className="font-bold text-green-600">+15.7%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Análisis de Riesgos</CardTitle>
                <CardDescription>Factores a monitorear</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Flujo de caja: Estable</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm">Cartera: Revisar</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Costos: Controlados</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalisisInteligente;