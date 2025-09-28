import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, CheckCircle, RefreshCw, FileX } from "lucide-react";

const AnnulmentValidator = () => {
  const [validationResults, setValidationResults] = useState<any>(null);
  const { toast } = useToast();

  const validateAnnulments = () => {
    const comprobantes = JSON.parse(localStorage.getItem('comprobantes_integrados') || '[]');
    const asientos = JSON.parse(localStorage.getItem('asientosContables') || '[]');

    // Encontrar comprobantes anulados
    const comprobantesAnulados = comprobantes.filter((c: any) => c.estado === 'anulado');
    
    // Verificar si hay asientos de comprobantes anulados que no deberían aparecer
    const asientosProblematicos = asientos.filter((a: any) => {
      if (a.comprobanteId && a.origen === 'comprobante') {
        const comprobante = comprobantes.find((c: any) => c.id === a.comprobanteId);
        return comprobante && comprobante.estado === 'anulado';
      }
      return false;
    });

    // Verificar si existen asientos de reversión para cada anulado
    const anulacionesSinReversion = comprobantesAnulados.filter((comp: any) => {
      const tieneReversion = asientos.some((a: any) => 
        a.comprobanteId === comp.id && a.origen === 'anulacion_comprobante'
      );
      return !tieneReversion;
    });

    setValidationResults({
      comprobantesAnulados: comprobantesAnulados.length,
      asientosProblematicos: asientosProblematicos.length,
      anulacionesSinReversion: anulacionesSinReversion.length,
      detalleProblemas: asientosProblematicos,
      anulacionesPendientes: anulacionesSinReversion
    });

    if (asientosProblematicos.length === 0 && anulacionesSinReversion.length === 0) {
      toast({
        title: "✅ Sistema de anulación correcto",
        description: "No se encontraron problemas con los comprobantes anulados",
      });
    } else {
      toast({
        title: "⚠️ Problemas detectados",
        description: `Se encontraron ${asientosProblematicos.length} asientos problemáticos`,
        variant: "destructive"
      });
    }
  };

  const cleanupAnnulledEntries = () => {
    const comprobantes = JSON.parse(localStorage.getItem('comprobantes_integrados') || '[]');
    const asientos = JSON.parse(localStorage.getItem('asientosContables') || '[]');

    // Filtrar asientos para remover los de comprobantes anulados (excepto reversiones)
    const asientosLimpios = asientos.filter((a: any) => {
      if (a.comprobanteId && a.origen === 'comprobante') {
        const comprobante = comprobantes.find((c: any) => c.id === a.comprobanteId);
        return !(comprobante && comprobante.estado === 'anulado');
      }
      return true; // Mantener asientos que no provienen de comprobantes
    });

    localStorage.setItem('asientosContables', JSON.stringify(asientosLimpios));
    
    toast({
      title: "🧹 Limpieza completada",
      description: `Se removieron ${asientos.length - asientosLimpios.length} asientos problemáticos`,
    });

    // Re-validar
    validateAnnulments();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileX className="w-5 h-5 text-red-600" />
          Validador de Anulaciones
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button onClick={validateAnnulments} variant="outline">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Validar Sistema
          </Button>
          {validationResults && validationResults.asientosProblematicos > 0 && (
            <Button onClick={cleanupAnnulledEntries} variant="destructive">
              <RefreshCw className="w-4 h-4 mr-2" />
              Limpiar Asientos
            </Button>
          )}
        </div>

        {validationResults && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-700">
                {validationResults.comprobantesAnulados}
              </div>
              <div className="text-sm text-gray-600">Comprobantes Anulados</div>
            </div>

            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {validationResults.asientosProblematicos}
              </div>
              <div className="text-sm text-red-700">Asientos Problemáticos</div>
            </div>

            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {validationResults.anulacionesSinReversion}
              </div>
              <div className="text-sm text-yellow-700">Sin Reversión</div>
            </div>
          </div>
        )}

        {validationResults && (
          <div className="mt-4">
            {validationResults.asientosProblematicos === 0 && 
             validationResults.anulacionesSinReversion === 0 ? (
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle className="w-4 h-4 mr-1" />
                Sistema de anulación funcionando correctamente
              </Badge>
            ) : (
              <div className="space-y-2">
                {validationResults.asientosProblematicos > 0 && (
                  <Badge className="bg-red-100 text-red-800">
                    <AlertTriangle className="w-4 h-4 mr-1" />
                    Asientos de comprobantes anulados detectados en reportes
                  </Badge>
                )}
                {validationResults.anulacionesSinReversion > 0 && (
                  <Badge className="bg-yellow-100 text-yellow-800">
                    <AlertTriangle className="w-4 h-4 mr-1" />
                    Comprobantes anulados sin asiento de reversión
                  </Badge>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AnnulmentValidator;