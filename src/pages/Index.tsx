import { useState, useEffect, lazy, Suspense } from "react";
import { 
  Calculator,
  FileText,
  Users,
  Package,
  BarChart3,
  Receipt,
  Settings,
  FolderTree,
  BookCopy,
  Scale,
  Landmark,
  ShoppingCart,
  HelpCircle,
  TrendingUp,
  Database,
  Building2,
  CreditCard,
  Bell,
  Target,
  Shield,
} from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import LoginForm from "@/components/auth/LoginForm";
import OnboardingTour from "@/components/contable/dashboard/OnboardingTour";
import Dashboard from "@/components/contable/Dashboard";
import FacturacionModule from "@/components/contable/FacturacionModule";
import ClientesModule from "@/components/contable/ClientesModule";
import ProductosModule from "@/components/contable/ProductosModule";
import InventarioModule from "@/components/contable/InventarioModule";
import ComprasModule from "@/components/contable/ComprasModule";
import JournalView from "@/components/contable/journal/JournalView";
import GeneralLedgerView from "@/components/contable/ledger/GeneralLedgerView";
import BalanceComprobacionModule from "@/components/contable/BalanceComprobacionModule";
import BalanceGeneralModule from "@/components/contable/BalanceGeneralModule";
import ReportesModule from "@/components/contable/ReportesModule";
import ConfiguracionModule from "@/components/contable/ConfiguracionModule";
import PlanCuentasModule from "@/components/contable/PlanCuentasModule";
import TutorialModule from "@/components/contable/TutorialModule";
import NotificationsCenter from "@/components/contable/NotificationsCenter";
import BancosModule from "@/components/contable/BancosModule";
import CuentasPorCobrarPagar from "@/components/contable/CuentasPorCobrarPagar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import SearchableSidebar from "@/components/contable/dashboard/SearchableSidebar";
import EnhancedLayout from "@/components/contable/dashboard/EnhancedLayout";
import ActivosFijosModule from "@/components/contable/ActivosFijosModule";

// Lazy load de módulos pesados
const EstadoResultadosModule = lazy(() => import("@/components/contable/EstadoResultadosModule"));
const KardexModule = lazy(() => import("@/components/contable/KardexModule"));
const BackupModule = lazy(() => import("@/components/contable/BackupModule"));
import DeclaracionesTributariasModule from "@/components/contable/DeclaracionesTributariasModule";

const Index = () => {
  const { isAuthenticated, user, logout, hasPermission } = useAuth();
  const [activeModule, setActiveModule] = useState("dashboard");
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Check if onboarding should be shown
  useEffect(() => {
    if (isAuthenticated) {
      const hasCompletedOnboarding = localStorage.getItem('onboarding-completed');
      if (!hasCompletedOnboarding) {
        setShowOnboarding(true);
      }
    }
  }, [isAuthenticated]);

  // Si no está autenticado, mostrar formulario de login
  if (!isAuthenticated) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-50">
        <LoginForm />
      </div>
    );
  }

  const modules = [
    { 
      id: "dashboard", 
      label: "Escritorio Financiero", 
      icon: BarChart3, 
      component: Dashboard, 
      permission: "dashboard",
      keywords: ["dashboard", "resumen", "finanzas", "kpi", "métricas", "ventas"]
    },
    { 
      id: "facturacion", 
      label: "Facturación Electrónica", 
      icon: Receipt, 
      component: FacturacionModule, 
      permission: "facturacion",
      keywords: ["facturación", "facturas", "siat", "QR", "electrónica", "fiscal"]
    },
    { 
      id: "clientes", 
      label: "Gestión de Clientes", 
      icon: Users, 
      component: ClientesModule, 
      permission: "clientes",
      keywords: ["clientes", "contactos", "nit", "ci", "gestión"]
    },
    { 
      id: "productos", 
      label: "Catálogo de Productos", 
      icon: Package, 
      component: ProductosModule, 
      permission: "productos",
      keywords: ["productos", "servicios", "catálogo", "precios", "gestión"]
    },
    { 
      id: "inventario", 
      label: "Control de Inventario", 
      icon: Calculator, 
      component: InventarioModule, 
      permission: "inventario",
      keywords: ["inventario", "stock", "almacén", "movimientos", "control"]
    },
    { 
      id: "compras", 
      label: "Gestión de Compras", 
      icon: ShoppingCart, 
      component: ComprasModule, 
      permission: "compras",
      keywords: ["compras", "proveedores", "órdenes", "adquisiciones"]
    },
    {
      id: "bancos",
      label: "Gestión Bancaria",
      icon: Building2,
      component: BancosModule,
      permission: "bancos",
      keywords: ["bancos", "conciliación", "cuentas", "movimientos", "bancario"]
    },
    {
      id: "cuentas-cobrar-pagar",
      label: "Cuentas por Cobrar/Pagar",
      icon: CreditCard,
      component: CuentasPorCobrarPagar,
      permission: "cuentas_cobrar_pagar",
      keywords: ["cuentas", "cobrar", "pagar", "cartera", "deudores", "acreedores"]
    },
    {
      id: "activos-fijos",
      label: "Activos Fijos",
      icon: Building2,
      component: ActivosFijosModule,
      permission: "activos_fijos",
      keywords: ["activos", "fijos", "depreciación", "bienes", "muebles", "inmuebles"]
    },
    { 
      id: "plan-cuentas", 
      label: "Plan de Cuentas", 
      icon: FolderTree, 
      component: PlanCuentasModule, 
      permission: "plan_cuentas",
      keywords: ["plan", "cuentas", "contabilidad", "estructura", "código"]
    },
    { 
      id: "libro-diario", 
      label: "Libro Diario", 
      icon: FileText, 
      component: JournalView, 
      permission: "libro_diario",
      keywords: ["libro", "diario", "asientos", "contabilidad", "registros"]
    },
    { 
      id: "libro-mayor", 
      label: "Libro Mayor", 
      icon: BookCopy, 
      component: GeneralLedgerView, 
      permission: "libro_mayor",
      keywords: ["libro", "mayor", "cuentas", "saldos", "movimientos"]
    },
    { 
      id: "balance", 
      label: "Balance de Comprobación", 
      icon: Scale, 
      component: BalanceComprobacionModule, 
      permission: "balance",
      keywords: ["balance", "comprobación", "sumas", "saldos", "verificación"]
    },
    { 
      id: "balance-general", 
      label: "Balance General", 
      icon: Landmark, 
      component: BalanceGeneralModule, 
      permission: "balance_general",
      keywords: ["balance", "general", "estados", "financieros", "situación"]
    },
    { 
      id: "estado-resultados", 
      label: "Estado de Resultados", 
      icon: TrendingUp, 
      component: EstadoResultadosModule, 
      permission: "reportes",
      keywords: ["estado", "resultados", "ganancias", "pérdidas", "utilidad"]
    },
    { 
      id: "kardex", 
      label: "Kardex por Producto", 
      icon: Calculator, 
      component: KardexModule, 
      permission: "inventario",
      keywords: ["kardex", "movimientos", "fifo", "lifo", "promedio", "valoración"]
    },
    { 
      id: "conciliacion-bancaria", 
      label: "Conciliación Bancaria", 
      icon: Building2, 
      component: lazy(() => import("@/components/contable/bancario/ConciliacionBancaria")), 
      permission: "bancos",
      keywords: ["conciliación", "bancaria", "estado", "cuenta", "movimientos", "diferencias"]
    },
    { 
      id: "flujo-caja", 
      label: "Flujo de Caja", 
      icon: TrendingUp, 
      component: lazy(() => import("@/components/contable/finanzas/FlujoCaja")), 
      permission: "reportes",
      keywords: ["flujo", "caja", "liquidez", "proyección", "ingresos", "egresos"]
    },
    { 
      id: "centros-costo", 
      label: "Centros de Costo", 
      icon: Building2, 
      component: lazy(() => import("@/components/contable/costos/CentrosCosto")), 
      permission: "reportes",
      keywords: ["centros", "costo", "presupuesto", "asignación", "análisis", "distribución"]
    },
    {
      id: "analisis-financiero",
      label: "Análisis Financiero",
      icon: TrendingUp,
      component: lazy(() => import("@/components/contable/analisis/AnalisisFinanciero")),
      permission: "reportes",
      keywords: ["análisis", "financiero", "ratios", "rentabilidad", "liquidez", "indicadores"]
    },
    {
      id: "presupuestos-empresariales",
      label: "Presupuestos Empresariales",
      icon: Target,
      component: lazy(() => import("@/components/contable/presupuestos/PresupuestosEmpresariales")),
      permission: "presupuestos",
      keywords: ["presupuestos", "planificación", "proyección", "control", "variaciones", "seguimiento"]
    },
    {
      id: "auditoria-transacciones",
      label: "Auditoría de Transacciones",
      icon: Shield,
      component: lazy(() => import("@/components/contable/auditoria/AuditoriaTransacciones")),
      permission: "auditoria",
      keywords: ["auditoría", "controles", "seguridad", "riesgos", "transacciones", "monitoreo"]
    },
    { 
      id: "reportes", 
      label: "Reportes Contables", 
      icon: FileText, 
      component: ReportesModule, 
      permission: "reportes",
      keywords: ["reportes", "informes", "análisis", "excel", "exportar"]
    },
    {
      id: "notificaciones",
      label: "Centro de Notificaciones",
      icon: Bell,
      component: NotificationsCenter,
      permission: "notificaciones",
      keywords: ["notificaciones", "alertas", "recordatorios", "avisos", "centro"]
    },
    {
      id: "declaraciones-tributarias",
      label: "Declaraciones Tributarias",
      icon: FileText,
      component: DeclaracionesTributariasModule,
      permission: "declaraciones_tributarias",
      keywords: ["declaraciones", "tributarias", "iva", "it", "iue", "impuestos", "formularios"]
    },
    { 
      id: "configuracion", 
      label: "Configuración del Sistema", 
      icon: Settings, 
      component: ConfiguracionModule, 
      permission: "configuracion",
      keywords: ["configuración", "ajustes", "sistema", "parámetros", "backup", "respaldo"]
    },
    {
      id: "tutorial",
      label: "Centro de Ayuda",
      icon: HelpCircle,
      component: TutorialModule,
      permission: "tutorial",
      keywords: ["tutorial", "ayuda", "guía", "aprendizaje", "soporte"]
    },
    {
      name: "Comprobantes",
      icon: FileText,
      component: () => import("../components/contable/comprobantes/ComprobantesModule"),
      description: "Comprobantes de ingreso, egreso y traspasos"
    },
  ];

  // Filtrar módulos según permisos del usuario
  const allowedModules = modules.filter(module => 
    module.permission === 'tutorial' || hasPermission(module.permission)
  );

  const activeModuleData = allowedModules.find(m => m.id === activeModule);
  const ActiveComponent = activeModuleData?.component || Dashboard;
  const activeModuleLabel = activeModuleData?.label || 'Dashboard';

  return (
    <SidebarProvider>
      <EnhancedLayout>
        <div className="min-h-screen w-full flex bg-muted/40">
          <SearchableSidebar
            modules={allowedModules}
            activeModule={activeModule}
            setActiveModule={setActiveModule}
          />
          <div className="flex-1 flex flex-col">
            <header className="bg-gradient-card/95 backdrop-blur supports-[backdrop-filter]:bg-gradient-card/90 sticky top-0 z-40 w-full border-b shadow-card">
              <div className="container flex h-16 items-center px-6">
                <SidebarTrigger className="mr-4 lg:hidden hover:bg-primary/10 rounded-lg transition-colors" />
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-4 h-4 text-white" />
                  </div>
                  <h1 className="text-xl font-bold text-foreground">
                    {activeModuleLabel}
                  </h1>
                </div>
              </div>
            </header>
            <main className="p-6 flex-1 bg-gradient-card/30">
              <div className="animate-in fade-in-50 duration-300">
                <Suspense fallback={<div className="flex items-center justify-center h-64">Cargando...</div>}>
                  <ActiveComponent key={activeModule} />
                </Suspense>
              </div>
            </main>
          </div>
        </div>

        {/* Onboarding Tour */}
        <OnboardingTour
          isOpen={showOnboarding}
          onClose={() => setShowOnboarding(false)}
          onNavigateToModule={(moduleId) => setActiveModule(moduleId)}
        />
      </EnhancedLayout>
    </SidebarProvider>
  );
};

export default Index;
