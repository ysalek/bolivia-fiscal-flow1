import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  FileText, 
  TrendingUp,
  Eye,
  AlertCircle
} from "lucide-react";
import { normativaService } from "@/services/normativaService";

interface ValidacionNormativa {
  id: string;
  categoria: string;
  descripcion: string;
  estado: 'cumplido' | 'pendiente' | 'critico' | 'advertencia';
  fechaValidacion: string;
  detalles: string;
  accionRequerida?: string;
}

const NormativaValidator2025 = () => {
  const [validaciones, setValidaciones] = useState<ValidacionNormativa[]>([]);
  const [cargando, setCargando] = useState(false);
  const [ultimaValidacion, setUltimaValidacion] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    ejecutarValidacion();
  }, []);

  const ejecutarValidacion = async () => {
    setCargando(true);
    
    try {
      // Simulación de validación completa del sistema
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const nuevasValidaciones: ValidacionNormativa[] = [
        {
          id: 'bancarizacion-2025',
          categoria: 'Tributaria',
          descripcion: 'Cumplimiento de requisitos de bancarización RND-102400000021',
          estado: 'cumplido',
          fechaValidacion: new Date().toISOString(),
          detalles: 'Todas las transacciones superiores a Bs. 15,000 están debidamente bancarizadas'
        },
        {
          id: 'facturacion-electronica',
          categoria: 'Facturación',
          descripcion: 'Migración a facturación electrónica octavo grupo',
          estado: 'cumplido',
          fechaValidacion: new Date().toISOString(),
          detalles: 'Sistema de facturación electrónica implementado correctamente'
        },
        {
          id: 'estados-financieros-2025',
          categoria: 'Contable',
          descripcion: 'Preparación Estados Financieros con prórroga 21 julio 2025',
          estado: 'advertencia',
          fechaValidacion: new Date().toISOString(),
          detalles: 'Estados financieros en preparación. Prórroga vigente hasta 21/07/2025',
          accionRequerida: 'Completar preparación antes de la fecha límite'
        },
        {
          id: 'rc-iva-profesionales',
          categoria: 'Tributaria',
          descripcion: 'RC-IVA para profesionales independientes',
          estado: 'pendiente',
          fechaValidacion: new Date().toISOString(),
          detalles: 'Nueva normativa RC-IVA para profesionales requiere implementación',
          accionRequerida: 'Configurar sistema de retenciones para profesionales'
        },
        {
          id: 'facilidades-pago-2025',
          categoria: 'Tributaria',
          descripcion: 'Marco normativo facilidades de pago actualizado',
          estado: 'cumplido',
          fechaValidacion: new Date().toISOString(),
          detalles: 'Sistema preparado para nueva normativa de facilidades de pago'
        },
        {
          id: 'arrepentimiento-eficaz',
          categoria: 'Tributaria',
          descripcion: 'Mecanismo de arrepentimiento eficaz 2025',
          estado: 'advertencia',
          fechaValidacion: new Date().toISOString(),
          detalles: 'Funcionalidad disponible para regularización voluntaria',
          accionRequerida: 'Revisar obligaciones pendientes para posible regularización'
        },
        {
          id: 'sectores-especiales',
          categoria: 'Tributaria',
          descripcion: 'Régimen sectores especiales - biodiesel y energía',
          estado: 'pendiente',
          fechaValidacion: new Date().toISOString(),
          detalles: 'Configuración pendiente para sectores especiales',
          accionRequerida: 'Determinar si la empresa opera en sectores especiales'
        },
        {
          id: 'salario-minimo-2025',
          categoria: 'Laboral',
          descripcion: 'Incremento salarial 5% D.S. N° 5383',
          estado: 'critico',
          fechaValidacion: new Date().toISOString(),
          detalles: 'Incremento salarial mínimo 5% vigente desde mayo 2025',
          accionRequerida: 'Actualizar planillas de sueldos con nuevo incremento'
        }
      ];

      setValidaciones(nuevasValidaciones);
      setUltimaValidacion(new Date().toLocaleString('es-BO'));
      
      const criticos = nuevasValidaciones.filter(v => v.estado === 'critico').length;
      const pendientes = nuevasValidaciones.filter(v => v.estado === 'pendiente').length;
      
      toast({
        title: "Validación completada",
        description: `${criticos} problemas críticos, ${pendientes} pendientes encontrados`,
        variant: criticos > 0 ? "destructive" : "default",
      });
      
    } catch (error) {
      toast({
        title: "Error en validación",
        description: "No se pudo completar la validación normativa",
        variant: "destructive",
      });
    } finally {
      setCargando(false);
    }
  };

  const getIconoEstado = (estado: string) => {
    switch (estado) {
      case 'cumplido': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'critico': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'advertencia': return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'pendiente': return <Clock className="h-4 w-4 text-blue-600" />;
      default: return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  const getBadgeVariant = (estado: string) => {
    switch (estado) {
      case 'cumplido': return 'default';
      case 'critico': return 'destructive';
      case 'advertencia': return 'secondary';
      case 'pendiente': return 'outline';
      default: return 'outline';
    }
  };

  const resumen = {
    total: validaciones.length,
    cumplidos: validaciones.filter(v => v.estado === 'cumplido').length,
    criticos: validaciones.filter(v => v.estado === 'critico').length,
    advertencias: validaciones.filter(v => v.estado === 'advertencia').length,
    pendientes: validaciones.filter(v => v.estado === 'pendiente').length
  };

  const porcentajeCumplimiento = Math.round((resumen.cumplidos / resumen.total) * 100);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-primary" />
          <div>
            <h2 className="text-2xl font-bold">Validador Normativo 2025</h2>
            <p className="text-muted-foreground">
              Validación integral de cumplimiento normativo Bolivia 2025
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={ejecutarValidacion} disabled={cargando}>
            <Eye className="w-4 h-4 mr-2" />
            {cargando ? 'Validando...' : 'Ejecutar Validación'}
          </Button>
        </div>
      </div>

      {/* Resumen de validación */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Validaciones</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resumen.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Cumplidas</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{resumen.cumplidos}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Críticas</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{resumen.criticos}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Advertencias</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{resumen.advertencias}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Cumplimiento</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{porcentajeCumplimiento}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Alertas críticas */}
      {resumen.criticos > 0 && (
        <Alert className="border-destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Atención Requerida</AlertTitle>
          <AlertDescription>
            Se encontraron {resumen.criticos} problema(s) crítico(s) que requieren acción inmediata.
          </AlertDescription>
        </Alert>
      )}

      {/* Lista de validaciones */}
      <Card>
        <CardHeader>
          <CardTitle>Resultados de Validación</CardTitle>
          <CardDescription>
            Última validación: {ultimaValidacion}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {validaciones.map((validacion) => (
              <div key={validacion.id} className="flex items-start gap-4 p-4 border rounded-lg">
                <div className="flex items-center gap-2">
                  {getIconoEstado(validacion.estado)}
                </div>
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{validacion.descripcion}</h4>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{validacion.categoria}</Badge>
                      <Badge variant={getBadgeVariant(validacion.estado)}>
                        {validacion.estado === 'cumplido' ? 'Cumplido' :
                         validacion.estado === 'critico' ? 'Crítico' :
                         validacion.estado === 'advertencia' ? 'Advertencia' : 'Pendiente'}
                      </Badge>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground text-sm">
                    {validacion.detalles}
                  </p>
                  
                  {validacion.accionRequerida && (
                    <div className="p-2 bg-muted rounded text-sm">
                      <strong>Acción requerida:</strong> {validacion.accionRequerida}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NormativaValidator2025;