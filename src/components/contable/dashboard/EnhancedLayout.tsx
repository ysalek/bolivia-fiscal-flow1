
import { ReactNode } from "react";
import { usePWA } from "@/hooks/usePWA";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Wifi, WifiOff, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EnhancedLayoutProps {
  children: ReactNode;
}

const EnhancedLayout = ({ children }: EnhancedLayoutProps) => {
  const { isOnline, isInstallable, installApp } = usePWA();
  const { toast } = useToast();

  const handleInstallClick = async () => {
    try {
      await installApp();
    } catch (error) {
      toast({
        title: "Error de instalación",
        description: "No se pudo instalar la aplicación. Intente desde el menú del navegador.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Barra de estado PWA - z-index reducido */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-sm border-b border-slate-200 dark:bg-slate-900/80 dark:border-slate-700">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Estado de conexión */}
              <div className="flex items-center gap-2">
                {isOnline ? (
                  <>
                    <Wifi className="w-4 h-4 text-green-600" />
                    <Badge variant="outline" className="text-green-700 border-green-200">
                      En línea
                    </Badge>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-4 h-4 text-red-600" />
                    <Badge variant="destructive" className="text-red-700">
                      Sin conexión
                    </Badge>
                  </>
                )}
              </div>

              {/* Indicador PWA */}
              <Badge variant="secondary" className="text-xs">
                PWA Activa
              </Badge>
            </div>

            {/* Botón de instalación */}
            {isInstallable && (
              <Button 
                onClick={handleInstallClick}
                size="sm" 
                variant="outline"
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Instalar App
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="relative">
        {children}
      </div>

      {/* Indicador de modo offline - z-index alto para que sea visible */}
      {!isOnline && (
        <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-auto">
          <div className="bg-orange-100 border border-orange-300 rounded-lg p-3 shadow-lg">
            <div className="flex items-center gap-2 text-orange-800">
              <WifiOff className="w-5 h-5" />
              <div>
                <div className="font-semibold text-sm">Modo Sin Conexión</div>
                <div className="text-xs">Los datos se guardan localmente y se sincronizarán cuando regrese la conexión</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedLayout;
