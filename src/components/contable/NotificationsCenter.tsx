
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, AlertTriangle, Info, CheckCircle, X, Calendar, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Notification {
  id: string;
  type: 'warning' | 'info' | 'success' | 'error';
  title: string;
  message: string;
  date: string;
  read: boolean;
  priority: 'high' | 'medium' | 'low';
  category: 'fiscal' | 'inventory' | 'finance' | 'system';
}

const NotificationsCenter = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    generateNotifications();
  }, []);

  const generateNotifications = () => {
    const today = new Date();
    const currentNotifications: Notification[] = [];

    // Verificar productos con stock bajo
    const productos = JSON.parse(localStorage.getItem('productos') || '[]');
    const productosStockBajo = productos.filter((p: any) => p.stockActual <= p.stockMinimo && p.stockActual > 0);
    
    if (productosStockBajo.length > 0) {
      currentNotifications.push({
        id: 'stock-bajo',
        type: 'warning',
        title: 'Productos con Stock Bajo',
        message: `${productosStockBajo.length} productos necesitan reposición urgente`,
        date: today.toISOString(),
        read: false,
        priority: 'high',
        category: 'inventory'
      });
    }

    // Verificar facturas pendientes de cobro
    const facturas = JSON.parse(localStorage.getItem('facturas') || '[]');
    const facturasPendientes = facturas.filter((f: any) => f.estado === 'enviada');
    
    if (facturasPendientes.length > 0) {
      const totalPendiente = facturasPendientes.reduce((sum: number, f: any) => sum + f.total, 0);
      currentNotifications.push({
        id: 'facturas-pendientes',
        type: 'info',
        title: 'Facturas Pendientes de Cobro',
        message: `${facturasPendientes.length} facturas por Bs. ${totalPendiente.toFixed(2)}`,
        date: today.toISOString(),
        read: false,
        priority: 'medium',
        category: 'finance'
      });
    }

    // Verificar fechas de vencimiento de declaraciones
    const proximaDeclaracion = new Date();
    proximaDeclaracion.setDate(proximaDeclaracion.getDate() + 5);
    
    if (proximaDeclaracion.getDate() <= 15) {
      currentNotifications.push({
        id: 'declaracion-iva',
        type: 'warning',
        title: 'Próximo Vencimiento IVA',
        message: 'La declaración mensual de IVA vence en 5 días',
        date: today.toISOString(),
        read: false,
        priority: 'high',
        category: 'fiscal'
      });
    }

    // Verificar respaldos
    const ultimoBackup = localStorage.getItem('ultimo-backup');
    if (!ultimoBackup || (Date.now() - new Date(ultimoBackup).getTime()) > 7 * 24 * 60 * 60 * 1000) {
      currentNotifications.push({
        id: 'backup-requerido',
        type: 'info',
        title: 'Respaldo Recomendado',
        message: 'No se ha realizado un respaldo en los últimos 7 días',
        date: today.toISOString(),
        read: false,
        priority: 'medium',
        category: 'system'
      });
    }

    setNotifications(currentNotifications);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast({
      title: "Notificación eliminada",
      description: "La notificación ha sido removida del centro",
    });
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'warning': return AlertTriangle;
      case 'error': return AlertTriangle;
      case 'success': return CheckCircle;
      default: return Info;
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'warning': return 'text-orange-500';
      case 'error': return 'text-red-500';
      case 'success': return 'text-green-500';
      default: return 'text-blue-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  
  const notificationsByCategory = {
    fiscal: notifications.filter(n => n.category === 'fiscal'),
    inventory: notifications.filter(n => n.category === 'inventory'),
    finance: notifications.filter(n => n.category === 'finance'),
    system: notifications.filter(n => n.category === 'system'),
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bell className="w-6 h-6 text-primary" />
          <div>
            <h2 className="text-2xl font-bold">Centro de Notificaciones</h2>
            <p className="text-slate-600">
              Alertas y recordatorios del sistema contable
            </p>
          </div>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="ml-2">
              {unreadCount} sin leer
            </Badge>
          )}
        </div>
        <Button onClick={generateNotifications} variant="outline">
          Actualizar
        </Button>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">
            Todas ({notifications.length})
          </TabsTrigger>
          <TabsTrigger value="fiscal">
            Fiscal ({notificationsByCategory.fiscal.length})
          </TabsTrigger>
          <TabsTrigger value="inventory">
            Inventario ({notificationsByCategory.inventory.length})
          </TabsTrigger>
          <TabsTrigger value="finance">
            Finanzas ({notificationsByCategory.finance.length})
          </TabsTrigger>
          <TabsTrigger value="system">
            Sistema ({notificationsByCategory.system.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="space-y-4">
            {notifications.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">¡Todo en orden!</h3>
                  <p className="text-muted-foreground">No hay notificaciones pendientes</p>
                </CardContent>
              </Card>
            ) : (
              notifications.map(notification => {
                const Icon = getIcon(notification.type);
                return (
                  <Card key={notification.id} className={`${!notification.read ? 'ring-2 ring-primary/20' : ''}`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <Icon className={`w-5 h-5 mt-0.5 ${getIconColor(notification.type)}`} />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <CardTitle className="text-base">{notification.title}</CardTitle>
                              <Badge className={getPriorityColor(notification.priority)}>
                                {notification.priority === 'high' ? 'Alta' : 
                                 notification.priority === 'medium' ? 'Media' : 'Baja'}
                              </Badge>
                              {!notification.read && (
                                <Badge variant="secondary">Nuevo</Badge>
                              )}
                            </div>
                            <CardDescription>{notification.message}</CardDescription>
                            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                              <Calendar className="w-3 h-3" />
                              {new Date(notification.date).toLocaleString('es-BO')}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          {!notification.read && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => markAsRead(notification.id)}
                            >
                              Marcar leído
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => dismissNotification(notification.id)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                );
              })
            )}
          </div>
        </TabsContent>

        {Object.entries(notificationsByCategory).map(([category, categoryNotifications]) => (
          <TabsContent key={category} value={category}>
            <div className="space-y-4">
              {categoryNotifications.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Sin notificaciones</h3>
                    <p className="text-muted-foreground">
                      No hay alertas en esta categoría
                    </p>
                  </CardContent>
                </Card>
              ) : (
                categoryNotifications.map(notification => {
                  const Icon = getIcon(notification.type);
                  return (
                    <Card key={notification.id} className={`${!notification.read ? 'ring-2 ring-primary/20' : ''}`}>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <Icon className={`w-5 h-5 mt-0.5 ${getIconColor(notification.type)}`} />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <CardTitle className="text-base">{notification.title}</CardTitle>
                                <Badge className={getPriorityColor(notification.priority)}>
                                  {notification.priority === 'high' ? 'Alta' : 
                                   notification.priority === 'medium' ? 'Media' : 'Baja'}
                                </Badge>
                                {!notification.read && (
                                  <Badge variant="secondary">Nuevo</Badge>
                                )}
                              </div>
                              <CardDescription>{notification.message}</CardDescription>
                              <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                                <Calendar className="w-3 h-3" />
                                {new Date(notification.date).toLocaleString('es-BO')}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            {!notification.read && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => markAsRead(notification.id)}
                              >
                                Marcar leído
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => dismissNotification(notification.id)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  );
                })
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default NotificationsCenter;
