import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Building2, Target, TrendingUp, Users, Calendar, FileBarChart, Zap, Globe } from 'lucide-react';
import PresupuestosEmpresariales from '../presupuestos/PresupuestosEmpresariales';
import CentrosCostoModule from '../costos/CentrosCostoModule';
import AnalisisRentabilidad from '../rentabilidad/AnalisisRentabilidad';
import FlujoCaja from '../finanzas/FlujoCaja';

const EnterpriseModule = () => {
  const [kpiPeriodo, setKpiPeriodo] = useState('mensual');

  // Simulación de KPIs empresariales
  const kpis = {
    ventasMensuales: 1250000,
    crecimiento: 15.3,
    margenBruto: 34.5,
    rotacionInventario: 8.2,
    liquidezCorriente: 2.1,
    rentabilidad: 12.8,
    empleados: 45,
    clientesActivos: 230
  };

  const objetivos = [
    {
      nombre: 'Incremento en Ventas',
      actual: 85,
      meta: 100,
      periodo: 'Trimestre Q4',
      estado: 'en_progreso'
    },
    {
      nombre: 'Reducción de Costos',
      actual: 92,
      meta: 100,
      periodo: 'Anual',
      estado: 'adelantado'
    },
    {
      nombre: 'Satisfacción Cliente',
      actual: 78,
      meta: 90,
      periodo: 'Mensual',
      estado: 'atrasado'
    },
    {
      nombre: 'Expansión de Mercado',
      actual: 45,
      meta: 100,
      periodo: 'Anual',
      estado: 'en_progreso'
    }
  ];

  const getColorEstado = (estado: string) => {
    switch (estado) {
      case 'adelantado': return 'bg-green-100 text-green-800';
      case 'en_progreso': return 'bg-blue-100 text-blue-800';
      case 'atrasado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Gestión Empresarial</h2>
          <p className="text-muted-foreground">Panel de control ejecutivo y análisis estratégico</p>
        </div>
        <Badge variant="outline" className="px-3 py-1">
          <Building2 className="w-4 h-4 mr-1" />
          Modo Empresarial
        </Badge>
      </div>

      {/* Dashboard Ejecutivo */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ventas Mensuales</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Bs. {kpis.ventasMensuales.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +{kpis.crecimiento}% desde el mes anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Margen Bruto</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.margenBruto}%</div>
            <p className="text-xs text-muted-foreground">
              Objetivo: 35%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Empleados</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.empleados}</div>
            <p className="text-xs text-muted-foreground">
              +3 nuevas contrataciones
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ROI</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.rentabilidad}%</div>
            <p className="text-xs text-muted-foreground">
              Retorno sobre inversión
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Objetivos Estratégicos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Objetivos Estratégicos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {objetivos.map((objetivo, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{objetivo.nombre}</span>
                    <Badge className={getColorEstado(objetivo.estado)}>
                      {objetivo.estado}
                    </Badge>
                  </div>
                  <span className="text-sm text-muted-foreground">{objetivo.periodo}</span>
                </div>
                <Progress value={objetivo.actual} className="h-2" />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{objetivo.actual}%</span>
                  <span>Meta: {objetivo.meta}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="presupuestos" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="presupuestos" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Presupuestos
          </TabsTrigger>
          <TabsTrigger value="costos" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            Centros de Costo
          </TabsTrigger>
          <TabsTrigger value="rentabilidad" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Rentabilidad
          </TabsTrigger>
          <TabsTrigger value="flujo" className="flex items-center gap-2">
            <FileBarChart className="w-4 h-4" />
            Flujo de Caja
          </TabsTrigger>
        </TabsList>

        <TabsContent value="presupuestos">
          <PresupuestosEmpresariales />
        </TabsContent>

        <TabsContent value="costos">
          <CentrosCostoModule />
        </TabsContent>

        <TabsContent value="rentabilidad">
          <AnalisisRentabilidad />
        </TabsContent>

        <TabsContent value="flujo">
          <FlujoCaja />
        </TabsContent>
      </Tabs>

      {/* Métricas Adicionales */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Presencia de Mercado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Participación Local</span>
                <span className="font-bold">24%</span>
              </div>
              <Progress value={24} className="h-2" />
              
              <div className="flex justify-between items-center">
                <span>Clientes Nuevos (Mes)</span>
                <span className="font-bold">18</span>
              </div>
              <Progress value={60} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Recursos Humanos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Satisfacción Empleados</span>
                <span className="font-bold">87%</span>
              </div>
              <Progress value={87} className="h-2" />
              
              <div className="flex justify-between items-center">
                <span>Retención de Talento</span>
                <span className="font-bold">92%</span>
              </div>
              <Progress value={92} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Eficiencia Operativa
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Automatización</span>
                <span className="font-bold">68%</span>
              </div>
              <Progress value={68} className="h-2" />
              
              <div className="flex justify-between items-center">
                <span>Tiempo de Respuesta</span>
                <span className="font-bold">94%</span>
              </div>
              <Progress value={94} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EnterpriseModule;