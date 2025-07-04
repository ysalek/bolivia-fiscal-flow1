
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, AlertTriangle, CheckCircle, Info, X, Clock, Package, Receipt } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';

interface Notification {
  id: string;
  tipo: 'info' | 'warning' | 'success' | 'error';
  titulo: string;
  descripcion: string;
  fecha: string;
  leida: boolean;
  accion?: {
    texto: string;
    callback: () => void;
  };
  modulo: string;
}

const NotificationsCenter = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Generar notificaciones de ejemplo
    const notificacionesEjemplo: Notification[] = [
      {
        id: '1',
        tipo: 'warning',
        titulo: 'Stock bajo detectado',
        descripcion: 'El producto "Laptop HP" tiene solo 3 unidades en stock',
        fecha: new Date().toISOString(),
        leida: false,
        modulo: 'Inventario',
        accion: {
          texto: 'Ver producto',
          callback: () => console.log('Navegar a inventario')
        }
      },
      {
        id: '2',
        tipo: 'error',
        titulo: 'Factura rechazada por SIAT',
        descripcion: 'La factura #00001 fue rechazada. Error: NIT inválido',
        fecha: new Date(Date.now() - 3600000).toISOString(),
        leida: false,
        modulo: 'Facturación'
      },
      {
        id: '3',
        tipo: 'info',
        titulo: 'Backup completado',
        descripcion: 'El respaldo de datos se completó exitosamente',
        fecha: new Date(Date.now() - 7200000).toISOString(),
        leida: true,
        modulo: 'Sistema'
      },
      {
        id: '4',
        tipo: 'success',
        titulo: 'Factura enviada exitosamente',
        descripcion: 'La factura #00002 fue procesada y enviada al SIAT',
        fecha: new Date(Date.now() - 10800000).toISOString(),
        leida: true,
        modulo: 'Facturación'
      }
    ];

    setNotifications(notificacionesEjemplo);
  }, []);

  const unreadCount = notifications.filter(n => !n.leida).length;

  const getIcon = (tipo: Notification['tipo']) => {
    switch (tipo) {
      case 'warning': return <AlertTriangle className="w-4 h-4 text-warning" />;
      case 'error': return <X className="w-4 h-4 text-destructive" />;
      case 'success': return <CheckCircle className="w-4 h-4 text-success" />;
      default: return <Info className="w-4 h-4 text-primary" />;
    }
  };

  const getVariant = (tipo: Notification['tipo']) => {
    switch (tipo) {
      case 'warning': return 'secondary';
      case 'error': return 'destructive';
      case 'success': return 'default';
      default: return 'outline';
    }
  };

  const marcarComoLeida = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, leida: true } : n)
    );
  };

  const marcarTodasComoLeidas = () => {
    setNotifications(prev => prev.map(n => ({ ...n, leida: true })));
    toast({
      title: "Notificaciones marcadas",
      description: "Todas las notificaciones fueron marcadas como leídas",
    });
  };

  const eliminarNotificacion = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const formatearFecha = (fecha: string) => {
    const ahora = new Date();
    const fechaNotif = new Date(fecha);
    const diff = ahora.getTime() - fechaNotif.getTime();
    const minutos = Math.floor(diff / 60000);
    const horas = Math.floor(diff / 3600000);
    const dias = Math.floor(diff / 86400000);

    if (minutos < 1) return 'Ahora mismo';
    if (minutos < 60) return `Hace ${minutos} min`;
    if (horas < 24) return `Hace ${horas} h`;
    return `Hace ${dias} días`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs bg-destructive">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Centro de Notificaciones
            </div>
            {unreadCount > 0 && (
              <Button variant="outline" size="sm" onClick={marcarTodasComoLeidas}>
                Marcar todas como leídas
              </Button>
            )}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-4">
            {notifications.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No hay notificaciones</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <Card 
                  key={notification.id} 
                  className={`transition-all ${!notification.leida ? 'border-primary/50 bg-primary/5' : ''}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        {getIcon(notification.tipo)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex-1">
                            <h4 className="font-medium text-sm leading-tight mb-1">
                              {notification.titulo}
                            </h4>
                            <p className="text-sm text-muted-foreground mb-2">
                              {notification.descripcion}
                            </p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="w-6 h-6 text-muted-foreground hover:text-destructive"
                            onClick={() => eliminarNotificacion(notification.id)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge variant={getVariant(notification.tipo)} className="text-xs">
                              {notification.modulo}
                            </Badge>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              {formatearFecha(notification.fecha)}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {notification.accion && (
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="text-xs h-7"
                                onClick={notification.accion.callback}
                              >
                                {notification.accion.texto}
                              </Button>
                            )}
                            {!notification.leida && (
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="text-xs h-7"
                                onClick={() => marcarComoLeida(notification.id)}
                              >
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
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationsCenter;
