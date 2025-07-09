
import { useState, useEffect } from "react";
import { Bell, AlertTriangle, Info, CheckCircle, X, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

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

const NotificationsIcon = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);

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

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold">Notificaciones</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={generateNotifications}
            className="text-xs"
          >
            Actualizar
          </Button>
        </div>
        
        <ScrollArea className="h-96">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-500" />
              <p className="text-sm">¡Todo en orden!</p>
              <p className="text-xs">No hay notificaciones pendientes</p>
            </div>
          ) : (
            <div className="p-2">
              {notifications.map((notification, index) => {
                const Icon = getIcon(notification.type);
                return (
                  <div key={notification.id}>
                    <Card className={`mb-2 ${!notification.read ? 'ring-1 ring-primary/20' : ''}`}>
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-2 flex-1">
                            <Icon className={`w-4 h-4 mt-0.5 ${getIconColor(notification.type)}`} />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1 mb-1">
                                <h4 className="text-sm font-medium">{notification.title}</h4>
                                {!notification.read && (
                                  <div className="w-2 h-2 bg-primary rounded-full" />
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground mb-2">{notification.message}</p>
                              <div className="flex items-center gap-2">
                                <Badge className={`text-xs ${getPriorityColor(notification.priority)}`}>
                                  {notification.priority === 'high' ? 'Alta' : 
                                   notification.priority === 'medium' ? 'Media' : 'Baja'}
                                </Badge>
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Calendar className="w-3 h-3" />
                                  {new Date(notification.date).toLocaleDateString('es-BO')}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col gap-1">
                            {!notification.read && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => markAsRead(notification.id)}
                                className="h-6 px-2 text-xs"
                              >
                                Marcar leído
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => dismissNotification(notification.id)}
                              className="h-6 w-6 p-0"
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    {index < notifications.length - 1 && <Separator />}
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationsIcon;
