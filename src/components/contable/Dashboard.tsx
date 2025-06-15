
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  DollarSign, 
  TrendingUp, 
  FileText, 
  Users,
  AlertTriangle,
  CheckCircle,
  Clock
} from "lucide-react";

const Dashboard = () => {
  const metrics = [
    {
      title: "Ingresos del Mes",
      value: "Bs. 45,230",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      color: "text-green-600"
    },
    {
      title: "Facturas Emitidas",
      value: "127",
      change: "+8",
      trend: "up",
      icon: FileText,
      color: "text-blue-600"
    },
    {
      title: "Clientes Activos",
      value: "89",
      change: "+5",
      trend: "up",
      icon: Users,
      color: "text-purple-600"
    },
    {
      title: "Pendientes SIN",
      value: "3",
      change: "-2",
      trend: "down",
      icon: Clock,
      color: "text-orange-600"
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: "factura",
      description: "Factura #001234 emitida a Cliente ABC",
      amount: "Bs. 1,250",
      time: "hace 2 horas",
      status: "enviado"
    },
    {
      id: 2,
      type: "pago",
      description: "Pago recibido de Cliente XYZ",
      amount: "Bs. 2,500",
      time: "hace 4 horas",
      status: "completado"
    },
    {
      id: 3,
      type: "sin",
      description: "Sincronización con SIN completada",
      amount: "",
      time: "hace 6 horas",
      status: "exitoso"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">
                  {metric.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${metric.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <p className="text-xs text-slate-600 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  {metric.change} desde el mes pasado
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Estado de integración SIN */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Estado SIN
            </CardTitle>
            <CardDescription>
              Integración con Servicio de Impuestos Nacionales
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Conexión</span>
                <Badge variant="default" className="bg-green-100 text-green-800">
                  Activo
                </Badge>
              </div>
              <Progress value={100} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Último CUFD</span>
                <Badge variant="outline">Hoy 08:00</Badge>
              </div>
              <Progress value={85} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Facturas Pendientes</span>
                <Badge variant="secondary">3 pendientes</Badge>
              </div>
              <Progress value={25} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Actividad reciente */}
        <Card>
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
            <CardDescription>
              Últimas transacciones y eventos del sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{activity.description}</p>
                    <p className="text-xs text-slate-500">{activity.time}</p>
                  </div>
                  {activity.amount && (
                    <div className="text-sm font-medium text-green-600">
                      {activity.amount}
                    </div>
                  )}
                  <Badge 
                    variant={activity.status === 'completado' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {activity.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resumen contable */}
      <Card>
        <CardHeader>
          <CardTitle>Resumen Contable del Mes</CardTitle>
          <CardDescription>
            Balance general y estado de resultados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h4 className="font-medium text-slate-700">Activos</h4>
              <p className="text-2xl font-bold text-green-600">Bs. 125,430</p>
              <p className="text-sm text-slate-500">+5.2% vs mes anterior</p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-slate-700">Pasivos</h4>
              <p className="text-2xl font-bold text-red-600">Bs. 45,230</p>
              <p className="text-sm text-slate-500">-2.1% vs mes anterior</p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-slate-700">Patrimonio</h4>
              <p className="text-2xl font-bold text-blue-600">Bs. 80,200</p>
              <p className="text-sm text-slate-500">+8.7% vs mes anterior</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
