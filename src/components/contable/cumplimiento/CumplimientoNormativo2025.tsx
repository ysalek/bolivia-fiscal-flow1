import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  FileText, 
  Calendar,
  TrendingUp,
  BookOpen
} from "lucide-react";

interface CumplimientoRecord {
  id: string;
  norma_rnd: string;
  descripcion: string;
  estado: 'pendiente' | 'implementado' | 'verificado';
  fecha_vigencia: string;
  fecha_implementacion?: string;
  observaciones?: string;
}

const CumplimientoNormativo2025 = () => {
  const [registros, setRegistros] = useState<CumplimientoRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    cargarRegistrosIniciales();
  }, []);

  const cargarRegistrosIniciales = () => {
    // Datos iniciales de cumplimiento normativo 2025
    const registrosIniciales: CumplimientoRecord[] = [
      {
        id: '1',
        norma_rnd: 'RND-102400000021',
        descripcion: 'Bancarización de pagos superiores a Bs. 15,000',
        estado: 'implementado',
        fecha_vigencia: '2025-01-01',
        fecha_implementacion: '2025-02-15'
      },
      {
        id: '2',
        norma_rnd: 'RND-102400000018',
        descripcion: 'RC-IVA para profesionales independientes',
        estado: 'pendiente',
        fecha_vigencia: '2025-01-01'
      },
      {
        id: '3',
        norma_rnd: 'RND-102400000019',
        descripcion: 'Facilidades de pago actualizadas',
        estado: 'implementado',
        fecha_vigencia: '2025-01-01',
        fecha_implementacion: '2025-03-01'
      },
      {
        id: '4',
        norma_rnd: 'RND-102400000020',
        descripcion: 'Arrepentimiento eficaz 2025',
        estado: 'verificado',
        fecha_vigencia: '2025-01-01',
        fecha_implementacion: '2025-02-28'
      },
      {
        id: '5',
        norma_rnd: 'D.S. N° 5383',
        descripcion: 'Incremento salarial 5% vigente mayo 2025',
        estado: 'pendiente',
        fecha_vigencia: '2025-05-01'
      }
    ];

    setRegistros(registrosIniciales);
    setLoading(false);
  };

  const actualizarEstado = (id: string, nuevoEstado: string) => {
    setRegistros(prev => prev.map(registro => 
      registro.id === id 
        ? { 
            ...registro, 
            estado: nuevoEstado as 'pendiente' | 'implementado' | 'verificado',
            fecha_implementacion: nuevoEstado === 'implementado' ? new Date().toISOString().split('T')[0] : registro.fecha_implementacion
          }
        : registro
    ));
    
    toast({
      title: "Estado actualizado",
      description: "El estado del cumplimiento normativo ha sido actualizado",
    });
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'implementado': return 'text-green-600';
      case 'verificado': return 'text-blue-600';
      case 'pendiente': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'implementado': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'verificado': return <Shield className="h-4 w-4 text-blue-600" />;
      case 'pendiente': return <Clock className="h-4 w-4 text-yellow-600" />;
      default: return <AlertTriangle className="h-4 w-4 text-gray-600" />;
    }
  };

  const normativas2025 = [
    {
      categoria: "Tributaria",
      normas: [
        "RND-102400000021: Bancarización de pagos superiores a Bs. 15,000",
        "RND-102400000018: RC-IVA para profesionales independientes", 
        "RND-102400000019: Facilidades de pago actualizadas",
        "RND-102400000020: Arrepentimiento eficaz 2025",
        "RND-102400000022: Régimen sectores especiales biodiesel y energía"
      ]
    },
    {
      categoria: "Facturación Electrónica",
      normas: [
        "Migración obligatoria octavo grupo empresas",
        "Implementación CUFD diario automático",
        "Estados financieros digitales con prórroga 21 julio 2025"
      ]
    },
    {
      categoria: "Laboral",
      normas: [
        "D.S. N° 5383: Incremento salarial 5% vigente mayo 2025",
        "Actualización formularios declaración AFP",
        "Nuevas tasas aporte patronal CNS"
      ]
    }
  ];

  const resumen = {
    total: registros.length,
    implementado: registros.filter(r => r.estado === 'implementado').length,
    verificado: registros.filter(r => r.estado === 'verificado').length,
    pendiente: registros.filter(r => r.estado === 'pendiente').length
  };

  if (loading) {
    return <div className="flex justify-center p-8">Cargando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-primary" />
          <div>
            <h2 className="text-2xl font-bold">Cumplimiento Normativo 2025</h2>
            <p className="text-muted-foreground">
              Gestión integral de cumplimiento normativo boliviano actualizado
            </p>
          </div>
        </div>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Normas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resumen.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Implementadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{resumen.implementado}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Verificadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{resumen.verificado}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{resumen.pendiente}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="registros" className="w-full">
        <TabsList>
          <TabsTrigger value="registros">Registros de Cumplimiento</TabsTrigger>
          <TabsTrigger value="normativas">Normativas 2025</TabsTrigger>
        </TabsList>

        <TabsContent value="registros">
          <Card>
            <CardHeader>
              <CardTitle>Registros de Cumplimiento</CardTitle>
              <CardDescription>
                Estado actual de implementación de normativas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {registros.map((registro) => (
                  <div key={registro.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-start gap-4">
                      {getEstadoIcon(registro.estado)}
                      <div className="space-y-1">
                        <h4 className="font-medium">{registro.norma_rnd}</h4>
                        <p className="text-sm text-muted-foreground">{registro.descripcion}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          Vigencia: {new Date(registro.fecha_vigencia).toLocaleDateString()}
                          {registro.fecha_implementacion && (
                            <>
                              <span>•</span>
                              Implementada: {new Date(registro.fecha_implementacion).toLocaleDateString()}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={getEstadoColor(registro.estado)}>
                        {registro.estado}
                      </Badge>
                      {registro.estado === 'pendiente' && (
                        <Button 
                          size="sm" 
                          onClick={() => actualizarEstado(registro.id, 'implementado')}
                        >
                          Marcar Implementada
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="normativas">
          <div className="space-y-6">
            {normativas2025.map((categoria, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    {categoria.categoria}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {categoria.normas.map((norma, normaIndex) => (
                      <div key={normaIndex} className="flex items-center gap-2 p-2 border-l-2 border-primary/20 bg-muted/50 rounded-r">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{norma}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CumplimientoNormativo2025;