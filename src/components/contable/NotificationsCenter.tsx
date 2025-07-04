
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, AlertTriangle, CheckCircle, Info, X, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Notification {
  id: string;
  tipo: 'info' | 'warning' | 'success' | 'error';
  titulo: string;
  mensaje: string;
  fecha: string;
  leida: boolean;
  accionable?: boolean;
}

const NotificationsCenter = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Cargar notificaciones del sistema
    loadSystemNotifications();
  }, []);

  const loadSystemNotifications = () => {
    const now = new Date();
    const systemNotifications: Notification[] = [
      {
        id: '1',
        tipo: 'warning',
        titulo: 'Stock Bajo',
        mensaje: 'Varios productos tienen stock por debajo del mínimo establecido.',
        fecha: now.toISOString(),
        leida: false,
        accionable: true
      },
      {
        id: '2',
        tipo: 'info',
        titulo: 'Cierre Mensual',
        mensaje: 'Recuerde realizar el cierre contable del mes anterior.',
        fecha: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(),
        leida: false,
        accionable: true
      },
      {
        id: '3',
        tipo: 'success',
        titulo: 'Backup Automático',
        mensaje: 'Se realizó un backup automático de sus datos exitosamente.',
        fecha: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        leida: true
      },
      {
        id: '4',
        tipo: 'error',
        titulo: 'Error de Sincronización',
        mensaje: 'Falló la sincronización con SIAT. Revise su conexión.',
        fecha: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        leida: false,
        accionable: true
      }
    ];

    setNotifications(systemNotifications);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, leida: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, leida: true }))
    );
    toast({
      title: "Notificaciones marcadas",
      description: "Todas las notificaciones han sido marcadas como leídas.",
    });
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
    toast({
      title: "Notificación eliminada",
      description: "La notificación ha sido eliminada.",
    });
  };

  const getIcon = (tipo: string) => {
    switch (tipo) {
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getBadgeVariant = (tipo: string) => {
    switch (tipo) {
      case 'warning':
        return 'destructive' as const;
      case 'success':
        return 'default' as const;
      case 'error':
        return 'destructive' as const;
      default:
        return 'secondary' as const;
    }
  };

  const unreadCount = notifications.filter(n => !n.leida).length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-6 h-6" />
              <CardTitle>Centro de Notificaciones</CardTitle>
              {unreadCount > 0 && (
                <Badge variant="destructive">{unreadCount} nuevas</Badge>
              )}
            </div>
            <Button onClick={markAllAsRead} variant="outline" size="sm">
              Marcar todas como leídas
            </Button>
          </div>
          <CardDescription>
            Mantenga el control de alertas, recordatorios y actualizaciones del sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {notifications.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="font-semibold">No hay notificaciones</p>
                <p className="text-sm">Todas las notificaciones aparecerán aquí</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <Card key={notification.id} className={`${!notification.leida ? 'border-primary/50 bg-primary/5' : ''}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {getIcon(notification.tipo)}
                      </div>
                      
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="font-semibold flex items-center gap-2">
                              {notification.titulo}
                              {!notification.leida && (
                                <Badge variant="secondary" className="text-xs">Nueva</Badge>
                              )}
                            </h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              {notification.mensaje}
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <Badge variant={getBadgeVariant(notification.tipo)} className="text-xs">
                              {notification.tipo}
                            </Badge>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => deleteNotification(notification.id)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            {new Date(notification.fecha).toLocaleString('es-BO')}
                          </span>
                          
                          <div className="flex gap-2">
                            {notification.accionable && (
                              <Button size="sm" variant="outline">
                                Ver detalles
                              </Button>
                            )}
                            {!notification.leida && (
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => markAsRead(notification.id)}
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                Marcar leída
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Configuración de Notificaciones */}
      <Card>
        <CardHeader>
          <CardTitle>Configuración de Notificaciones</CardTitle>
          <CardDescription>
            Configure qué tipos de notificaciones desea recibir
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <h4 className="font-semibold">Alertas del Sistema</h4>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm">Stock bajo</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm">Errores de sincronización</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm">Respaldos automáticos</span>
                </label>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold">Recordatorios</h4>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm">Cierre mensual</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm">Declaraciones de impuestos</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">Vencimiento de facturas</span>
                </label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationsCenter;
