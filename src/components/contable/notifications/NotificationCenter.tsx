import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, AlertTriangle, CheckCircle, Info, X, Archive } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Notification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
  module?: string;
}

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'warnings'>('all');
  const { toast } = useToast();

  useEffect(() => {
    generateSystemNotifications();
    
    // Actualizar notificaciones cada 5 minutos
    const interval = setInterval(generateSystemNotifications, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const generateSystemNotifications = () => {
    const newNotifications: Notification[] = [];

    try {
      // Verificar productos con stock bajo
      const productos = JSON.parse(localStorage.getItem('productos') || '[]');
      const productosStockBajo = productos.filter((p: any) => 
        p.stockActual <= p.stockMinimo && p.activo
      );

      if (productosStockBajo.length > 0) {
        newNotifications.push({
          id: 'stock-bajo-' + Date.now(),
          type: 'warning',
          title: 'Stock Bajo',
          message: `${productosStockBajo.length} productos con stock bajo o agotado`,
          timestamp: new Date(),
          read: false,
          action: {
            label: 'Ver Productos',
            onClick: () => {
              // Navegar a inventario donde están los productos
              const event = new CustomEvent('navigate-to-module', { detail: 'inventario' });
              window.dispatchEvent(event);
            }
          },
          module: 'inventario'
        });
      }

      // Verificar facturas pendientes
      const facturas = JSON.parse(localStorage.getItem('facturas') || '[]');
      const facturasPendientes = facturas.filter((f: any) => f.estado === 'enviada');

      if (facturasPendientes.length > 0) {
        newNotifications.push({
          id: 'facturas-pendientes-' + Date.now(),
          type: 'info',
          title: 'Facturas Pendientes',
          message: `${facturasPendientes.length} facturas esperando pago`,
          timestamp: new Date(),
          read: false,
          action: {
            label: 'Ver Facturas',
            onClick: () => {
              const event = new CustomEvent('navigate-to-module', { detail: 'facturacion' });
              window.dispatchEvent(event);
            }
          },
          module: 'facturacion'
        });
      }

      // Verificar cuentas por cobrar vencidas
      const cuentasPorCobrar = JSON.parse(localStorage.getItem('cuentasPorCobrar') || '[]');
      const cuentasVencidas = cuentasPorCobrar.filter((c: any) => {
        const fechaVencimiento = new Date(c.fechaVencimiento);
        return fechaVencimiento < new Date() && c.estado === 'pendiente';
      });

      if (cuentasVencidas.length > 0) {
        newNotifications.push({
          id: 'cuentas-vencidas-' + Date.now(),
          type: 'error',
          title: 'Cuentas Vencidas',
          message: `${cuentasVencidas.length} cuentas por cobrar vencidas`,
          timestamp: new Date(),
          read: false,
          action: {
            label: 'Ver Cuentas',
            onClick: () => {
              const event = new CustomEvent('navigate-to-module', { detail: 'cuentas-cobrar-pagar' });
              window.dispatchEvent(event);
            }
          },
          module: 'cobranzas'
        });
      }

      // Verificar balance contable
      const asientos = JSON.parse(localStorage.getItem('asientosContables') || '[]');
      const asientosRegistrados = asientos.filter((a: any) => a.estado === 'registrado');
      
      if (asientosRegistrados.length > 0) {
        let totalDebe = 0;
        let totalHaber = 0;
        
        asientosRegistrados.forEach((asiento: any) => {
          asiento.cuentas.forEach((cuenta: any) => {
            totalDebe += cuenta.debe;
            totalHaber += cuenta.haber;
          });
        });

        const diferencia = Math.abs(totalDebe - totalHaber);
        
        if (diferencia > 0.01) {
          newNotifications.push({
            id: 'balance-desbalanceado-' + Date.now(),
            type: 'error',
            title: 'Balance Desbalanceado',
            message: `Diferencia de Bs. ${diferencia.toFixed(2)} en el balance contable`,
            timestamp: new Date(),
            read: false,
          action: {
            label: 'Ver Balance',
            onClick: () => {
              const event = new CustomEvent('navigate-to-module', { detail: 'balance-comprobacion' });
              window.dispatchEvent(event);
            }
          },
            module: 'contabilidad'
          });
        } else {
          newNotifications.push({
            id: 'balance-ok-' + Date.now(),
            type: 'success',
            title: 'Balance Correcto',
            message: 'El balance contable está cuadrado correctamente',
            timestamp: new Date(),
            read: false,
            module: 'contabilidad'
          });
        }
      }

      // Recordatorio de backup
      const ultimoBackup = localStorage.getItem('ultimo-backup');
      if (!ultimoBackup) {
        newNotifications.push({
          id: 'backup-reminder-' + Date.now(),
          type: 'warning',
          title: 'Realizar Backup',
          message: 'No se ha realizado ningún respaldo del sistema',
          timestamp: new Date(),
          read: false,
          action: {
            label: 'Crear Backup',
            onClick: () => {
              const event = new CustomEvent('navigate-to-module', { detail: 'backup' });
              window.dispatchEvent(event);
            }
          },
          module: 'backup'
        });
      } else {
        const fechaUltimoBackup = new Date(ultimoBackup);
        const diasSinBackup = Math.floor((new Date().getTime() - fechaUltimoBackup.getTime()) / (1000 * 60 * 60 * 24));
        
        if (diasSinBackup > 7) {
          newNotifications.push({
            id: 'backup-old-' + Date.now(),
            type: 'warning',
            title: 'Backup Desactualizado',
            message: `Último respaldo hace ${diasSinBackup} días`,
            timestamp: new Date(),
            read: false,
            action: {
              label: 'Crear Backup',
              onClick: () => {
                const event = new CustomEvent('navigate-to-module', { detail: 'backup' });
                window.dispatchEvent(event);
              }
            },
            module: 'backup'
          });
        }
      }

      // Actualizar notificaciones manteniendo las existentes no leídas
      setNotifications(prev => {
        const existingUnread = prev.filter(n => !n.read);
        return [...newNotifications, ...existingUnread].slice(0, 20); // Máximo 20 notificaciones
      });

    } catch (error) {
      console.error('Error generando notificaciones:', error);
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'error': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
      default: return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'warning': return 'border-l-yellow-500 bg-yellow-50';
      case 'error': return 'border-l-red-500 bg-red-50';
      case 'success': return 'border-l-green-500 bg-green-50';
      default: return 'border-l-blue-500 bg-blue-50';
    }
  };

  const filteredNotifications = notifications.filter(n => {
    switch (filter) {
      case 'unread': return !n.read;
      case 'warnings': return n.type === 'warning' || n.type === 'error';
      default: return true;
    }
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bell className="w-6 h-6 text-primary" />
          <div>
            <h2 className="text-2xl font-bold">Centro de Notificaciones</h2>
            <p className="text-muted-foreground">
              Alertas y notificaciones del sistema
            </p>
          </div>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="ml-2">
              {unreadCount}
            </Badge>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
          >
            Marcar todas como leídas
          </Button>
          <Button onClick={generateSystemNotifications}>
            Actualizar
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex gap-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
          size="sm"
        >
          Todas ({notifications.length})
        </Button>
        <Button
          variant={filter === 'unread' ? 'default' : 'outline'}
          onClick={() => setFilter('unread')}
          size="sm"
        >
          No leídas ({unreadCount})
        </Button>
        <Button
          variant={filter === 'warnings' ? 'default' : 'outline'}
          onClick={() => setFilter('warnings')}
          size="sm"
        >
          Alertas ({notifications.filter(n => n.type === 'warning' || n.type === 'error').length})
        </Button>
      </div>

      {/* Lista de notificaciones */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Bell className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold mb-2">No hay notificaciones</h3>
              <p className="text-muted-foreground">
                Todas las notificaciones aparecerán aquí
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredNotifications.map((notification) => (
            <Card
              key={notification.id}
              className={`border-l-4 transition-all ${getTypeColor(notification.type)} ${
                !notification.read ? 'shadow-md' : 'opacity-75'
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  {getIcon(notification.type)}
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">{notification.title}</h4>
                      {!notification.read && (
                        <Badge variant="secondary" className="text-xs">
                          Nuevo
                        </Badge>
                      )}
                      {notification.module && (
                        <Badge variant="outline" className="text-xs">
                          {notification.module}
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-2">
                      {notification.message}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {notification.timestamp.toLocaleString('es-BO')}
                      </span>
                      
                      <div className="flex gap-2">
                        {notification.action && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              notification.action!.onClick();
                              markAsRead(notification.id);
                            }}
                          >
                            {notification.action.label}
                          </Button>
                        )}
                        
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                        )}
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteNotification(notification.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationCenter;