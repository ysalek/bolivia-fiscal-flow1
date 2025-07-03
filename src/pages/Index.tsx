
import { useState, useEffect } from "react";
import { 
  Calculator,
  FileText,
  Users,
  Package,
  BarChart3,
  Receipt,
  LogOut,
  User,
  Settings,
  FolderTree,
  BookCopy,
  Scale,
  Landmark,
  ShoppingCart,
  HelpCircle,
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
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import SearchableSidebar from "@/components/contable/dashboard/SearchableSidebar";
import TutorialModule from "@/components/contable/TutorialModule";

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
      id: "reportes", 
      label: "Reportes Contables", 
      icon: FileText, 
      component: ReportesModule, 
      permission: "reportes",
      keywords: ["reportes", "informes", "análisis", "excel", "exportar"]
    },
    { 
      id: "configuracion", 
      label: "Configuración del Sistema", 
      icon: Settings, 
      component: ConfiguracionModule, 
      permission: "configuracion",
      keywords: ["configuración", "ajustes", "sistema", "parámetros"]
    },
    {
      id: "tutorial",
      label: "Centro de Ayuda",
      icon: HelpCircle,
      component: TutorialModule,
      permission: "tutorial",
      keywords: ["tutorial", "ayuda", "guía", "aprendizaje", "soporte"]
    },
  ];

  // Filtrar módulos según permisos del usuario
  const allowedModules = modules.filter(module => 
    module.permission === 'tutorial' || hasPermission(module.permission)
  );

  const ActiveComponent = allowedModules.find(m => m.id === activeModule)?.component || Dashboard;
  const activeModuleLabel = allowedModules.find(m => m.id === activeModule)?.label || 'Dashboard';

  return (
    <SidebarProvider>
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
              <ActiveComponent key={activeModule} />
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
    </SidebarProvider>
  );
};

export default Index;
