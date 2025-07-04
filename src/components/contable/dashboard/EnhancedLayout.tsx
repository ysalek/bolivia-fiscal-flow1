
import { usePWA } from '@/hooks/usePWA';
import NotificationsCenter from '@/components/contable/NotificationsCenter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff, Download } from 'lucide-react';

interface EnhancedLayoutProps {
  children: React.ReactNode;
}

const EnhancedLayout = ({ children }: EnhancedLayoutProps) => {
  const { isOnline, isInstallable, installApp } = usePWA();

  return (
    <div className="min-h-screen bg-gradient-card/30">
      {/* Status Bar */}
      <div className="bg-gradient-primary/10 border-b px-4 py-2">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Badge variant={isOnline ? "default" : "destructive"} className="flex items-center gap-1">
              {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
              {isOnline ? 'En línea' : 'Sin conexión'}
            </Badge>
            {!isOnline && (
              <span className="text-xs text-muted-foreground">
                Los datos se guardan localmente
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {isInstallable && (
              <Button size="sm" variant="outline" onClick={installApp}>
                <Download className="w-4 h-4 mr-2" />
                Instalar App
              </Button>
            )}
            <NotificationsCenter />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 max-w-7xl mx-auto">
        {children}
      </div>
    </div>
  );
};

export default EnhancedLayout;
