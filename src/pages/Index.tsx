
import React, { Suspense, useState, useEffect, lazy } from 'react';
import { initializarDatosEjemplo } from '@/utils/datosEjemplo';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Calculator, 
  FileText, 
  Package, 
  ShoppingCart, 
  Users, 
  TrendingUp, 
  Scale, 
  BookOpen, 
  Building, 
  Settings, 
  HelpCircle, 
  Banknote,
  FileBarChart,
  CreditCard,
  Factory,
  Archive,
  ClipboardList,
  Target,
  PiggyBank,
  UserCheck,
  Receipt,
  BarChart3,
  HardDrive,
  Zap,
  FileCheck,
  Bookmark,
  Bell,
  Search,
  DollarSign,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import GlobalSearch from '@/components/contable/search/GlobalSearch';

// Lazy load components
const Dashboard = lazy(() => import('@/components/contable/Dashboard'));
const LibroDiario = lazy(() => import('@/components/contable/LibroDiario'));
const BalanceComprobacionModule = lazy(() => import('@/components/contable/BalanceComprobacionModule'));
const BalanceGeneralModule = lazy(() => import('@/components/contable/BalanceGeneralModule'));
const EstadoResultadosModule = lazy(() => import('@/components/contable/EstadoResultadosModule'));
const ProductosModule = lazy(() => import('@/components/contable/ProductosModule'));
const FacturacionModule = lazy(() => import('@/components/contable/FacturacionModule'));
const ComprasModule = lazy(() => import('@/components/contable/ComprasModule'));
const ClientesModule = lazy(() => import('@/components/contable/ClientesModule'));
const InventarioModule = lazy(() => import('@/components/contable/InventarioModule'));
const CuentasPorCobrarPagar = lazy(() => import('@/components/contable/CuentasPorCobrarPagar'));
const DeclaracionesTributariasModule = lazy(() => import('@/components/contable/DeclaracionesTributariasModule'));
const ReportesModule = lazy(() => import('@/components/contable/ReportesModule'));
const ConfiguracionModule = lazy(() => import('@/components/contable/ConfiguracionModule'));
const PuntoVentaModule = lazy(() => import('@/components/contable/PuntoVentaModule'));
const BackupModule = lazy(() => import('@/components/contable/BackupModule'));
const BancosModule = lazy(() => import('@/components/contable/BancosModule'));
const ActivosFijosModule = lazy(() => import('@/components/contable/ActivosFijosModule'));
const KardexModule = lazy(() => import('@/components/contable/KardexModule'));
const PlanCuentasModule = lazy(() => import('@/components/contable/PlanCuentasModule'));
const ComprobantesModule = lazy(() => import('@/components/contable/comprobantes/ComprobantesIntegrados'));
const NotificationCenter = lazy(() => import('@/components/contable/notifications/NotificationCenter'));
const AdvancedCashFlowModule = lazy(() => import('@/components/contable/cashflow/AdvancedCashFlowModule'));
const NominaModule = lazy(() => import('@/components/contable/nomina/NominaModule'));
const AnalisisRentabilidad = lazy(() => import('@/components/contable/rentabilidad/AnalisisRentabilidad'));
const ConciliacionBancaria = lazy(() => import('@/components/contable/bancario/ConciliacionBancaria'));
const PresupuestosEmpresariales = lazy(() => import('@/components/contable/presupuestos/PresupuestosEmpresariales'));
const UserManagement = lazy(() => import('@/components/contable/users/UserManagement'));
const CentrosCostoModule = lazy(() => import('@/components/contable/costos/CentrosCostoModule'));
const TutorialInteractivo = lazy(() => import('@/components/contable/tutorial/TutorialInteractivo'));
const AuditoriaTransacciones = lazy(() => import('@/components/contable/auditoria/AuditoriaTransacciones'));
const AnalisisFinanciero = lazy(() => import('@/components/contable/analisis/AnalisisFinanciero'));
const AdvancesManagement = lazy(() => import('@/components/contable/advances/AdvancesManagement'));
const NominaBoliviana = lazy(() => import('@/components/contable/nomina/NominaBoliviana'));

interface Module {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  component: React.ComponentType<any>;
  category: 'contabilidad' | 'facturacion' | 'inventario' | 'reportes' | 'configuracion' | 'herramientas';
  description?: string;
  keywords?: string[];
}

const modules: Module[] = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3, component: Dashboard, category: 'contabilidad', description: 'Panel principal con métricas y resumen' },
  { id: 'libro-diario', label: 'Libro Diario', icon: BookOpen, component: LibroDiario, category: 'contabilidad', description: 'Registro cronológico de transacciones' },
  { id: 'balance-comprobacion', label: 'Balance de Comprobación', icon: Scale, component: BalanceComprobacionModule, category: 'contabilidad', description: 'Verificación de saldos contables' },
  { id: 'balance-general', label: 'Balance General', icon: FileBarChart, component: BalanceGeneralModule, category: 'contabilidad', description: 'Estado de situación financiera' },
  { id: 'estado-resultados', label: 'Estado de Resultados', icon: TrendingUp, component: EstadoResultadosModule, category: 'contabilidad', description: 'Estado de ganancias y pérdidas' },
  { id: 'plan-cuentas', label: 'Plan de Cuentas', icon: Bookmark, component: PlanCuentasModule, category: 'contabilidad', description: 'Estructura del plan contable' },
  { id: 'comprobantes', label: 'Comprobantes', icon: FileCheck, component: ComprobantesModule, category: 'contabilidad', description: 'Comprobantes de ingreso, egreso y traspaso' },
  
  { id: 'productos', label: 'Productos', icon: Package, component: ProductosModule, category: 'inventario', description: 'Gestión del catálogo de productos' },
  { id: 'inventario', label: 'Inventario', icon: Archive, component: InventarioModule, category: 'inventario', description: 'Control de stock y movimientos' },
  { id: 'kardex', label: 'Kardex', icon: ClipboardList, component: KardexModule, category: 'inventario', description: 'Seguimiento detallado de inventarios' },
  
  { id: 'facturacion', label: 'Facturación', icon: Receipt, component: FacturacionModule, category: 'facturacion', description: 'Emisión de facturas y documentos' },
  { id: 'compras', label: 'Compras', icon: ShoppingCart, component: ComprasModule, category: 'facturacion', description: 'Registro de compras a proveedores' },
  { id: 'clientes', label: 'Clientes', icon: Users, component: ClientesModule, category: 'facturacion', description: 'Gestión de base de clientes' },
  { id: 'cuentas-cobrar-pagar', label: 'Cuentas por Cobrar/Pagar', icon: CreditCard, component: CuentasPorCobrarPagar, category: 'facturacion', description: 'Control de cuentas pendientes' },
  
  { id: 'bancos', label: 'Bancos', icon: PiggyBank, component: BancosModule, category: 'herramientas', description: 'Conciliación y control bancario' },
  { id: 'activos-fijos', label: 'Activos Fijos', icon: Building, component: ActivosFijosModule, category: 'herramientas', description: 'Gestión de bienes de uso' },
  
  { id: 'reportes', label: 'Reportes Avanzados', icon: FileText, component: ReportesModule, category: 'reportes', description: 'Informes y análisis detallados' },
  { id: 'declaraciones', label: 'Declaraciones Tributarias', icon: Calculator, component: DeclaracionesTributariasModule, category: 'reportes', description: 'Declaraciones fiscales y tributarias' },
  
  { id: 'configuracion', label: 'Configuración', icon: Settings, component: ConfiguracionModule, category: 'configuracion', description: 'Configuración del sistema' },
  { id: 'backup', label: 'Respaldos', icon: HardDrive, component: BackupModule, category: 'configuracion', description: 'Copias de seguridad y restauración' },
  { id: 'punto-venta', label: 'Punto de Venta', icon: ShoppingCart, component: PuntoVentaModule, category: 'facturacion', description: 'Sistema POS integrado para ventas directas' },
  { id: 'notificaciones', label: 'Notificaciones', icon: Bell, component: NotificationCenter, category: 'herramientas', description: 'Centro de alertas y notificaciones del sistema' },
  { id: 'flujo-caja-avanzado', label: 'Flujo de Caja Avanzado', icon: DollarSign, component: AdvancedCashFlowModule, category: 'herramientas', description: 'Gestión avanzada de flujo de efectivo con proyecciones' },
  { id: 'nomina', label: 'Nómina Boliviana', icon: UserCheck, component: NominaBoliviana, category: 'herramientas', description: 'Gestión de empleados según normativa boliviana (Gestoras)' },
  { id: 'analisis-rentabilidad', label: 'Análisis de Rentabilidad', icon: Target, component: AnalisisRentabilidad, category: 'reportes', description: 'Análisis detallado de rentabilidad por productos y categorías' },
  { id: 'conciliacion-bancaria', label: 'Conciliación Bancaria', icon: Banknote, component: ConciliacionBancaria, category: 'herramientas', description: 'Conciliación automática de extractos bancarios' },
  { id: 'presupuestos', label: 'Presupuestos Empresariales', icon: Factory, component: PresupuestosEmpresariales, category: 'reportes', description: 'Gestión y control de presupuestos empresariales' },
  { id: 'usuarios', label: 'Gestión de Usuarios', icon: Users, component: UserManagement, category: 'configuracion', description: 'Administración de usuarios y permisos del sistema' },
  { id: 'rrhh', label: 'Recursos Humanos', icon: UserCheck, component: NominaModule, category: 'herramientas', description: 'Gestión de personal y recursos humanos' },
  { id: 'centros-costo', label: 'Centros de Costo', icon: Building, component: CentrosCostoModule, category: 'herramientas', description: 'Gestión y control de centros de costo empresariales' },
  { id: 'tutorial', label: 'Tutorial Interactivo', icon: HelpCircle, component: TutorialInteractivo, category: 'configuracion', description: 'Aprende a usar el sistema paso a paso' },
  { id: 'auditoria', label: 'Auditoría y Control', icon: Shield, component: AuditoriaTransacciones, category: 'herramientas', description: 'Monitoreo y auditoría de transacciones del sistema' },
  { id: 'analisis-financiero', label: 'Análisis Financiero', icon: TrendingUp, component: AnalisisFinanciero, category: 'reportes', description: 'Análisis detallado de indicadores financieros' },
  { id: 'anticipos', label: 'Gestión de Anticipos', icon: CreditCard, component: AdvancesManagement, category: 'herramientas', description: 'Administración de anticipos y préstamos a empleados' }
];

const categories = {
  'contabilidad': { label: 'Contabilidad', icon: Calculator, color: 'bg-blue-500' },
  'inventario': { label: 'Inventario', icon: Package, color: 'bg-green-500' },
  'facturacion': { label: 'Facturación', icon: Receipt, color: 'bg-purple-500' },
  'herramientas': { label: 'Herramientas', icon: Zap, color: 'bg-orange-500' },
  'reportes': { label: 'Reportes', icon: FileText, color: 'bg-red-500' },
  'configuracion': { label: 'Configuración', icon: Settings, color: 'bg-gray-500' }
};

const Index = () => {
  const [activeModule, setActiveModule] = useState<string>('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Función para manejar navegación desde búsqueda global
  const handleGlobalNavigation = (moduleId: string, itemId?: string) => {
    setActiveModule(moduleId);
    // Aquí podrías agregar lógica adicional para navegar a un item específico
    if (itemId) {
      // Por ejemplo, establecer filtros o seleccionar un item específico
      console.log(`Navegando a ${moduleId} con item ${itemId}`);
    }
  };

  // Inicializar datos de ejemplo al cargar
  useEffect(() => {
    initializarDatosEjemplo();
  }, []);

  const filteredModules = modules.filter(module => {
    const matchesSearch = module.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         module.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         module.keywords?.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || module.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const ActiveComponent = modules.find(m => m.id === activeModule)?.component || Dashboard;

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar mejorado */}
        <div className="w-80 border-r bg-card shadow-lg">
          <div className="p-4 border-b bg-gradient-to-r from-primary to-primary/90">
            <h1 className="text-xl font-bold text-primary-foreground">Sistema Contable</h1>
            <p className="text-sm text-primary-foreground/80">Gestión empresarial integral</p>
          </div>
          
          <div className="p-4 space-y-4">
            {/* Búsqueda global */}
            <GlobalSearch onNavigate={handleGlobalNavigation} />
            
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('all')}
              >
                Todos
              </Button>
              {Object.entries(categories).map(([key, category]) => (
                <Button
                  key={key}
                  variant={selectedCategory === key ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(key)}
                  className="flex items-center gap-1"
                >
                  <category.icon className="w-3 h-3" />
                  {category.label}
                </Button>
              ))}
            </div>
          </div>

          <ScrollArea className="h-[calc(100vh-220px)]">
            <div className="p-2">
              {selectedCategory === 'all' ? (
                Object.entries(categories).map(([categoryKey, category]) => {
                  const categoryModules = filteredModules.filter(m => m.category === categoryKey);
                  if (categoryModules.length === 0) return null;
                  
                  return (
                    <div key={categoryKey} className="mb-6">
                      <div className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-muted-foreground">
                        <div className={`w-3 h-3 rounded-full ${category.color}`} />
                        {category.label}
                      </div>
                      <div className="space-y-2">
                        {categoryModules.map((module) => {
                          const IconComponent = module.icon;
                          return (
                            <Card
                              key={module.id}
                              className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                                activeModule === module.id ? 'bg-primary/10 border-primary shadow-md' : 'hover:bg-accent'
                              }`}
                              onClick={() => setActiveModule(module.id)}
                            >
                              <CardContent className="p-3">
                                <div className="flex items-center gap-3">
                                  <div className={`p-2 rounded-lg transition-colors ${
                                    activeModule === module.id ? 'bg-primary text-primary-foreground' : 'bg-muted'
                                  }`}>
                                    <IconComponent className="w-4 h-4" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h3 className="font-medium text-sm leading-tight">{module.label}</h3>
                                    {module.description && (
                                      <p className="text-xs text-muted-foreground truncate mt-1">
                                        {module.description}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="space-y-2">
                  {filteredModules.map((module) => {
                    const IconComponent = module.icon;
                    return (
                      <Card
                        key={module.id}
                        className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                          activeModule === module.id ? 'bg-primary/10 border-primary shadow-md' : 'hover:bg-accent'
                        }`}
                        onClick={() => setActiveModule(module.id)}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg transition-colors ${
                              activeModule === module.id ? 'bg-primary text-primary-foreground' : 'bg-muted'
                            }`}>
                              <IconComponent className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-sm leading-tight">{module.label}</h3>
                              {module.description && (
                                <p className="text-xs text-muted-foreground truncate mt-1">
                                  {module.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            <Suspense fallback={
              <div className="space-y-4">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-64 w-full" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Skeleton className="h-32" />
                  <Skeleton className="h-32" />
                  <Skeleton className="h-32" />
                </div>
              </div>
            }>
              <ActiveComponent />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
