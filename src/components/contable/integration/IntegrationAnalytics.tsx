import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Clock, 
  Zap,
  AlertCircle,
  CheckCircle,
  Calendar,
  Download
} from 'lucide-react';

interface AnalyticsData {
  integration: string;
  requests: number;
  errors: number;
  avgResponseTime: number;
  uptime: number;
  dataTransfer: number;
}

interface TimeSeriesData {
  timestamp: string;
  requests: number;
  errors: number;
  responseTime: number;
}

const IntegrationAnalytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedIntegration, setSelectedIntegration] = useState('all');

  const analyticsData: AnalyticsData[] = [
    {
      integration: 'SIN/SIAT',
      requests: 15420,
      errors: 78,
      avgResponseTime: 850,
      uptime: 99.2,
      dataTransfer: 245.6
    },
    {
      integration: 'Banco BCP',
      requests: 8760,
      errors: 184,
      avgResponseTime: 1200,
      uptime: 98.5,
      dataTransfer: 156.8
    },
    {
      integration: 'WhatsApp',
      requests: 12300,
      errors: 1020,
      avgResponseTime: 2500,
      uptime: 85.2,
      dataTransfer: 89.4
    }
  ];

  const timeSeriesData: TimeSeriesData[] = [
    { timestamp: '00:00', requests: 120, errors: 2, responseTime: 850 },
    { timestamp: '04:00', requests: 80, errors: 1, responseTime: 920 },
    { timestamp: '08:00', requests: 450, errors: 8, responseTime: 780 },
    { timestamp: '12:00', requests: 680, errors: 12, responseTime: 1200 },
    { timestamp: '16:00', requests: 720, errors: 15, responseTime: 1100 },
    { timestamp: '20:00', requests: 320, errors: 5, responseTime: 950 }
  ];

  const errorDistribution = [
    { name: 'Timeout', value: 45, color: '#ef4444' },
    { name: 'Auth Error', value: 25, color: '#f97316' },
    { name: 'Rate Limit', value: 20, color: '#eab308' },
    { name: 'Server Error', value: 10, color: '#8b5cf6' }
  ];

  const performanceData = [
    { name: 'SIN/SIAT', requests: 15420, responseTime: 850, errors: 78 },
    { name: 'BCP', requests: 8760, responseTime: 1200, errors: 184 },
    { name: 'WhatsApp', requests: 12300, responseTime: 2500, errors: 1020 }
  ];

  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (current < previous) return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Activity className="w-4 h-4 text-gray-600" />;
  };

  const calculateSuccessRate = (requests: number, errors: number) => {
    return ((requests - errors) / requests * 100).toFixed(1);
  };

  const exportReport = () => {
    const report = {
      timeRange,
      generatedAt: new Date().toISOString(),
      summary: {
        totalRequests: analyticsData.reduce((acc, item) => acc + item.requests, 0),
        totalErrors: analyticsData.reduce((acc, item) => acc + item.errors, 0),
        avgUptime: analyticsData.reduce((acc, item) => acc + item.uptime, 0) / analyticsData.length
      },
      integrations: analyticsData
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `integration-analytics-${timeRange}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Analytics de Integraciones</h3>
          <p className="text-sm text-muted-foreground">
            Análisis detallado de rendimiento y uso
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">Último día</SelectItem>
              <SelectItem value="7d">Última semana</SelectItem>
              <SelectItem value="30d">Último mes</SelectItem>
              <SelectItem value="90d">3 meses</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={exportReport} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Requests</p>
                <p className="text-2xl font-bold">
                  {analyticsData.reduce((acc, item) => acc + item.requests, 0).toLocaleString()}
                </p>
              </div>
              <Activity className="w-8 h-8 text-blue-600" />
            </div>
            <div className="flex items-center mt-2 text-xs">
              {getTrendIcon(36480, 32140)}
              <span className="ml-1 text-green-600">+13.5% vs anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tasa de Error</p>
                <p className="text-2xl font-bold">
                  {((analyticsData.reduce((acc, item) => acc + item.errors, 0) / 
                     analyticsData.reduce((acc, item) => acc + item.requests, 0)) * 100).toFixed(2)}%
                </p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <div className="flex items-center mt-2 text-xs">
              {getTrendIcon(1282, 1450)}
              <span className="ml-1 text-green-600">-11.6% vs anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tiempo Promedio</p>
                <p className="text-2xl font-bold">
                  {Math.round(analyticsData.reduce((acc, item) => acc + item.avgResponseTime, 0) / analyticsData.length)}ms
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
            <div className="flex items-center mt-2 text-xs">
              {getTrendIcon(1516, 1420)}
              <span className="ml-1 text-red-600">+6.8% vs anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Uptime Promedio</p>
                <p className="text-2xl font-bold">
                  {(analyticsData.reduce((acc, item) => acc + item.uptime, 0) / analyticsData.length).toFixed(1)}%
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <div className="flex items-center mt-2 text-xs">
              {getTrendIcon(94.3, 92.8)}
              <span className="ml-1 text-green-600">+1.6% vs anterior</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="performance" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="performance">Rendimiento</TabsTrigger>
          <TabsTrigger value="usage">Uso</TabsTrigger>
          <TabsTrigger value="errors">Errores</TabsTrigger>
          <TabsTrigger value="trends">Tendencias</TabsTrigger>
          <TabsTrigger value="reports">Reportes</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          {/* Response Time Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Tiempo de Respuesta por Integración</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="responseTime" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Performance Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {analyticsData.map((data, index) => (
              <Card key={index}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{data.integration}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <div className="flex justify-between items-center text-sm">
                      <span>Success Rate</span>
                      <span>{calculateSuccessRate(data.requests, data.errors)}%</span>
                    </div>
                    <Progress value={parseFloat(calculateSuccessRate(data.requests, data.errors))} className="h-2 mt-1" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Requests</span>
                      <div className="font-medium">{data.requests.toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Errors</span>
                      <div className="font-medium">{data.errors}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Avg Time</span>
                      <div className="font-medium">{data.avgResponseTime}ms</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Uptime</span>
                      <div className="font-medium">{data.uptime}%</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="usage" className="space-y-4">
          {/* Usage Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Patrones de Uso (24h)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={timeSeriesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="requests" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Data Transfer */}
          <Card>
            <CardHeader>
              <CardTitle>Transferencia de Datos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.map((data, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Activity className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium">{data.integration}</div>
                        <div className="text-sm text-muted-foreground">
                          {data.requests.toLocaleString()} requests
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{data.dataTransfer} MB</div>
                      <div className="text-sm text-muted-foreground">transferidos</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="errors" className="space-y-4">
          {/* Error Distribution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Distribución de Errores</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={errorDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                    >
                      {errorDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {errorDistribution.map((entry, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: entry.color }}
                        />
                        <span className="text-sm">{entry.name}</span>
                      </div>
                      <span className="text-sm font-medium">{entry.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Errores por Tiempo</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timestamp" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="errors" stroke="#ef4444" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Error Details */}
          <Card>
            <CardHeader>
              <CardTitle>Errores Recientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { 
                    integration: 'WhatsApp', 
                    error: 'Rate limit exceeded', 
                    count: 45, 
                    time: '2 min ago',
                    severity: 'high' 
                  },
                  { 
                    integration: 'BCP', 
                    error: 'Connection timeout', 
                    count: 12, 
                    time: '5 min ago',
                    severity: 'medium' 
                  },
                  { 
                    integration: 'SIN', 
                    error: 'Authentication failed', 
                    count: 3, 
                    time: '8 min ago',
                    severity: 'low' 
                  }
                ].map((error, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        error.severity === 'high' ? 'bg-red-500' :
                        error.severity === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                      }`} />
                      <div>
                        <div className="font-medium">{error.error}</div>
                        <div className="text-sm text-muted-foreground">
                          {error.integration} • {error.count} occurrences
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {error.time}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          {/* Trend Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Análisis de Tendencias</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Tendencias Positivas</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="text-sm">Reducción de errores en SIN (-15%)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="text-sm">Mejor tiempo de respuesta BCP (-8%)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="text-sm">Aumento en uptime general (+3%)</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">Áreas de Atención</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <TrendingDown className="w-4 h-4 text-red-600" />
                      <span className="text-sm">Aumento de errores WhatsApp (+25%)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <TrendingDown className="w-4 h-4 text-red-600" />
                      <span className="text-sm">Latencia alta en horas pico</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 text-yellow-600" />
                      <span className="text-sm">Rate limits frecuentes</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reportes Automatizados</CardTitle>
              <CardDescription>
                Configura reportes periódicos automáticos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'Reporte Diario', frequency: 'Todos los días a las 08:00', enabled: true },
                  { name: 'Reporte Semanal', frequency: 'Lunes a las 09:00', enabled: true },
                  { name: 'Reporte de Incidencias', frequency: 'Cuando hay errores críticos', enabled: true },
                  { name: 'Reporte Mensual', frequency: 'Primer día del mes', enabled: false }
                ].map((report, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5" />
                      <div>
                        <div className="font-medium">{report.name}</div>
                        <div className="text-sm text-muted-foreground">{report.frequency}</div>
                      </div>
                    </div>
                    <Badge variant={report.enabled ? 'default' : 'secondary'}>
                      {report.enabled ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IntegrationAnalytics;