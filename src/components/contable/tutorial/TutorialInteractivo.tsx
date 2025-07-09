import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Play, 
  CheckCircle, 
  Clock, 
  BookOpen, 
  Video, 
  FileText,
  Users,
  Calculator,
  BarChart3,
  Settings,
  Lightbulb,
  Star,
  Trophy,
  Target
} from "lucide-react";

interface Leccion {
  id: string;
  titulo: string;
  descripcion: string;
  duracion: number; // en minutos
  tipo: 'basico' | 'intermedio' | 'avanzado';
  categoria: 'contabilidad' | 'facturacion' | 'inventario' | 'reportes' | 'configuracion';
  completada: boolean;
  contenido: string[];
  videoUrl?: string;
  ejercicios?: string[];
}

interface Modulo {
  id: string;
  nombre: string;
  descripcion: string;
  lecciones: Leccion[];
  progreso: number;
  completado: boolean;
}

const TutorialInteractivo = () => {
  const [modulos, setModulos] = useState<Modulo[]>([]);
  const [leccionActual, setLeccionActual] = useState<Leccion | null>(null);
  const [progresoGeneral, setProgresoGeneral] = useState(0);
  const [selectedTab, setSelectedTab] = useState("dashboard");

  useEffect(() => {
    initializeTutorials();
    loadProgress();
  }, []);

  const initializeTutorials = () => {
    const tutorialModules: Modulo[] = [
      {
        id: 'introduccion',
        nombre: 'Introducción al Sistema',
        descripcion: 'Conoce las funcionalidades básicas del sistema contable',
        completado: false,
        progreso: 0,
        lecciones: [
          {
            id: 'nav-basica',
            titulo: 'Navegación Básica',
            descripcion: 'Aprende a navegar por el sistema y usar el menú principal',
            duracion: 5,
            tipo: 'basico',
            categoria: 'configuracion',
            completada: false,
            contenido: [
              'El menú principal está organizado por categorías',
              'Usa la barra de búsqueda para encontrar funciones específicas',
              'Los módulos están agrupados por tipo de operación',
              'Puedes acceder rápidamente a funciones usando atajos de teclado'
            ]
          },
          {
            id: 'config-inicial',
            titulo: 'Configuración Inicial',
            descripcion: 'Configura tu empresa y datos básicos',
            duracion: 10,
            tipo: 'basico',
            categoria: 'configuracion',
            completada: false,
            contenido: [
              'Ve al módulo de Configuración',
              'Ingresa los datos de tu empresa',
              'Configura la información fiscal',
              'Establece las opciones de facturación'
            ]
          }
        ]
      },
      {
        id: 'contabilidad',
        nombre: 'Contabilidad Básica',
        descripcion: 'Aprende a usar los módulos contables fundamentales',
        completado: false,
        progreso: 0,
        lecciones: [
          {
            id: 'plan-cuentas',
            titulo: 'Plan de Cuentas',
            descripcion: 'Crea y gestiona tu plan de cuentas contables',
            duracion: 15,
            tipo: 'basico',
            categoria: 'contabilidad',
            completada: false,
            contenido: [
              'Accede al módulo Plan de Cuentas',
              'Crea nuevas cuentas contables',
              'Organiza las cuentas por categorías',
              'Configura los códigos contables según normativa boliviana'
            ]
          },
          {
            id: 'libro-diario',
            titulo: 'Libro Diario',
            descripcion: 'Registra asientos contables en el libro diario',
            duracion: 20,
            tipo: 'intermedio',
            categoria: 'contabilidad',
            completada: false,
            contenido: [
              'Crear nuevos asientos contables',
              'Usar el debe y haber correctamente',
              'Registrar diferentes tipos de transacciones',
              'Verificar que los asientos cuadren'
            ]
          },
          {
            id: 'balance-comprobacion',
            titulo: 'Balance de Comprobación',
            descripcion: 'Genera y verifica balances de comprobación',
            duracion: 15,
            tipo: 'intermedio',
            categoria: 'contabilidad',
            completada: false,
            contenido: [
              'Acceder al módulo de Balance de Comprobación',
              'Seleccionar período de análisis',
              'Verificar que el balance cuadre',
              'Exportar reportes para auditoría'
            ]
          }
        ]
      },
      {
        id: 'facturacion',
        nombre: 'Facturación y Ventas',
        descripcion: 'Gestiona clientes, productos y facturación',
        completado: false,
        progreso: 0,
        lecciones: [
          {
            id: 'clientes',
            titulo: 'Gestión de Clientes',
            descripcion: 'Registra y administra tu cartera de clientes',
            duracion: 10,
            tipo: 'basico',
            categoria: 'facturacion',
            completada: false,
            contenido: [
              'Crear nuevos clientes',
              'Registrar información fiscal completa',
              'Gestionar datos de contacto',
              'Organizar clientes por categorías'
            ]
          },
          {
            id: 'productos',
            titulo: 'Catálogo de Productos',
            descripcion: 'Administra tu inventario de productos y servicios',
            duracion: 15,
            tipo: 'basico',
            categoria: 'inventario',
            completada: false,
            contenido: [
              'Crear productos y servicios',
              'Configurar precios y categorías',
              'Gestionar códigos de productos',
              'Controlar niveles de stock'
            ]
          },
          {
            id: 'facturas',
            titulo: 'Emisión de Facturas',
            descripcion: 'Crea facturas completas con integración SIN',
            duracion: 25,
            tipo: 'intermedio',
            categoria: 'facturacion',
            completada: false,
            contenido: [
              'Crear una nueva factura',
              'Seleccionar cliente y productos',
              'Calcular impuestos automáticamente',
              'Generar factura conforme al SIN',
              'Imprimir y enviar la factura'
            ]
          }
        ]
      },
      {
        id: 'reportes',
        nombre: 'Reportes y Análisis',
        descripcion: 'Genera reportes financieros y analiza tu negocio',
        completado: false,
        progreso: 0,
        lecciones: [
          {
            id: 'estados-financieros',
            titulo: 'Estados Financieros',
            descripcion: 'Genera estados de resultados y balance general',
            duracion: 20,
            tipo: 'avanzado',
            categoria: 'reportes',
            completada: false,
            contenido: [
              'Acceder al módulo de Estados Financieros',
              'Generar Estado de Resultados',
              'Crear Balance General',
              'Analizar indicadores financieros'
            ]
          },
          {
            id: 'analisis-ventas',
            titulo: 'Análisis de Ventas',
            descripcion: 'Analiza el desempeño de ventas y productos',
            duracion: 15,
            tipo: 'intermedio',
            categoria: 'reportes',
            completada: false,
            contenido: [
              'Revisar dashboard de ventas',
              'Analizar productos más vendidos',
              'Evaluar tendencias de ventas',
              'Generar reportes personalizados'
            ]
          }
        ]
      }
    ];

    setModulos(tutorialModules);
  };

  const loadProgress = () => {
    const progress = JSON.parse(localStorage.getItem('tutorialProgress') || '{}');
    // Cargar progreso guardado
    setProgresoGeneral(progress.general || 0);
  };

  const saveProgress = (moduleId: string, lessonId: string, completed: boolean) => {
    const progress = JSON.parse(localStorage.getItem('tutorialProgress') || '{}');
    if (!progress[moduleId]) progress[moduleId] = {};
    progress[moduleId][lessonId] = completed;
    
    localStorage.setItem('tutorialProgress', JSON.stringify(progress));
    
    // Actualizar estado local
    const updatedModulos = modulos.map(modulo => {
      if (modulo.id === moduleId) {
        const updatedLecciones = modulo.lecciones.map(leccion => 
          leccion.id === lessonId ? { ...leccion, completada: completed } : leccion
        );
        const completedCount = updatedLecciones.filter(l => l.completada).length;
        const progreso = (completedCount / updatedLecciones.length) * 100;
        
        return {
          ...modulo,
          lecciones: updatedLecciones,
          progreso,
          completado: progreso === 100
        };
      }
      return modulo;
    });
    
    setModulos(updatedModulos);
    
    // Calcular progreso general
    const totalLecciones = updatedModulos.reduce((sum, m) => sum + m.lecciones.length, 0);
    const completedLecciones = updatedModulos.reduce((sum, m) => 
      sum + m.lecciones.filter(l => l.completada).length, 0
    );
    const generalProgress = totalLecciones > 0 ? (completedLecciones / totalLecciones) * 100 : 0;
    
    setProgresoGeneral(generalProgress);
    
    progress.general = generalProgress;
    localStorage.setItem('tutorialProgress', JSON.stringify(progress));
  };

  const startLesson = (leccion: Leccion) => {
    setLeccionActual(leccion);
    setSelectedTab("leccion");
  };

  const completeLesson = () => {
    if (leccionActual) {
      const modulo = modulos.find(m => m.lecciones.some(l => l.id === leccionActual.id));
      if (modulo) {
        saveProgress(modulo.id, leccionActual.id, true);
      }
      setLeccionActual(null);
      setSelectedTab("dashboard");
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'basico': return 'bg-green-100 text-green-800';
      case 'intermedio': return 'bg-yellow-100 text-yellow-800';
      case 'avanzado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoriaIcon = (categoria: string) => {
    switch (categoria) {
      case 'contabilidad': return <Calculator className="w-4 h-4" />;
      case 'facturacion': return <FileText className="w-4 h-4" />;
      case 'inventario': return <BarChart3 className="w-4 h-4" />;
      case 'reportes': return <Target className="w-4 h-4" />;
      case 'configuracion': return <Settings className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Tutorial Interactivo</h2>
          <p className="text-muted-foreground">Aprende a usar el sistema paso a paso</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-muted-foreground">Progreso General</div>
          <div className="flex items-center gap-2">
            <Progress value={progresoGeneral} className="w-32" />
            <span className="font-bold">{progresoGeneral.toFixed(0)}%</span>
          </div>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="modulos">Módulos</TabsTrigger>
          {leccionActual && <TabsTrigger value="leccion">Lección Actual</TabsTrigger>}
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Módulos</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{modulos.length}</div>
                <p className="text-xs text-muted-foreground">
                  {modulos.filter(m => m.completado).length} completados
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Lecciones</CardTitle>
                <Video className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {modulos.reduce((sum, m) => sum + m.lecciones.length, 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {modulos.reduce((sum, m) => sum + m.lecciones.filter(l => l.completada).length, 0)} completadas
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tiempo Total</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {modulos.reduce((sum, m) => sum + m.lecciones.reduce((s, l) => s + l.duracion, 0), 0)} min
                </div>
                <p className="text-xs text-muted-foreground">
                  Duración estimada
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Progreso</CardTitle>
                <Trophy className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{progresoGeneral.toFixed(0)}%</div>
                <p className="text-xs text-muted-foreground">
                  {progresoGeneral === 100 ? '¡Completado!' : 'En progreso'}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Módulos por Completar</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {modulos.filter(m => !m.completado).slice(0, 3).map((modulo) => (
                  <div key={modulo.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{modulo.nombre}</h4>
                      <p className="text-sm text-muted-foreground">{modulo.descripcion}</p>
                      <Progress value={modulo.progreso} className="w-full mt-2" />
                    </div>
                    <Button 
                      size="sm" 
                      onClick={() => setSelectedTab("modulos")}
                      className="ml-4"
                    >
                      <Play className="w-3 h-3 mr-1" />
                      Continuar
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Últimas Lecciones</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {modulos
                  .flatMap(m => m.lecciones.map(l => ({ ...l, moduloNombre: m.nombre })))
                  .filter(l => l.completada)
                  .slice(-3)
                  .map((leccion) => (
                    <div key={leccion.id} className="flex items-center gap-3 p-3 border rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <div className="flex-1">
                        <h4 className="font-medium">{leccion.titulo}</h4>
                        <p className="text-sm text-muted-foreground">{leccion.moduloNombre}</p>
                      </div>
                      <Badge className={getTipoColor(leccion.tipo)}>
                        {leccion.tipo}
                      </Badge>
                    </div>
                  ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="modulos" className="space-y-6">
          <div className="grid gap-6">
            {modulos.map((modulo) => (
              <Card key={modulo.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {modulo.completado && <Trophy className="w-5 h-5 text-yellow-500" />}
                        {modulo.nombre}
                      </CardTitle>
                      <p className="text-muted-foreground">{modulo.descripcion}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{modulo.progreso.toFixed(0)}%</div>
                      <Progress value={modulo.progreso} className="w-32" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    {modulo.lecciones.map((leccion) => (
                      <div key={leccion.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
                        <div className="flex items-center gap-3">
                          {leccion.completada ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : (
                            <div className="w-5 h-5 border-2 border-muted rounded-full" />
                          )}
                          <div className="flex items-center gap-2">
                            {getCategoriaIcon(leccion.categoria)}
                            <span className="font-medium">{leccion.titulo}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={getTipoColor(leccion.tipo)}>
                            {leccion.tipo}
                          </Badge>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {leccion.duracion} min
                          </div>
                          {!leccion.completada && (
                            <Button 
                              size="sm" 
                              onClick={() => startLesson(leccion)}
                            >
                              <Play className="w-3 h-3 mr-1" />
                              Iniciar
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {leccionActual && (
          <TabsContent value="leccion" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {getCategoriaIcon(leccionActual.categoria)}
                      {leccionActual.titulo}
                    </CardTitle>
                    <p className="text-muted-foreground">{leccionActual.descripcion}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getTipoColor(leccionActual.tipo)}>
                      {leccionActual.tipo}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {leccionActual.duracion} min
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Lightbulb className="w-5 h-5" />
                    Contenido de la Lección
                  </h3>
                  <div className="space-y-3">
                    {leccionActual.contenido.map((item, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                        <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <p className="flex-1">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {leccionActual.ejercicios && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Ejercicios Prácticos</h3>
                    <div className="space-y-2">
                      {leccionActual.ejercicios.map((ejercicio, index) => (
                        <div key={index} className="p-3 border rounded-lg">
                          <p>{ejercicio}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-6">
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedTab("modulos")}
                    className="flex-1"
                  >
                    Volver a Módulos
                  </Button>
                  <Button 
                    onClick={completeLesson}
                    className="flex-1"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Marcar como Completada
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default TutorialInteractivo;