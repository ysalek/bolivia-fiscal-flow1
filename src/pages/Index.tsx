
import { useState } from "react";
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
} from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import LoginForm from "@/components/auth/LoginForm";
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
import AppSidebar from "@/components/AppSidebar";

const Index = () => {
  const { isAuthenticated, user, logout, hasPermission } = useAuth();
  const [activeModule, setActiveModule] = useState("dashboard");

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
      label: "Dashboard", 
      icon: BarChart3, 
      component: Dashboard, 
      permission: "dashboard" 
    },
    { 
      id: "facturacion", 
      label: "Facturación", 
      icon: Receipt, 
      component: FacturacionModule, 
      permission: "facturacion" 
    },
    { 
      id: "clientes", 
      label: "Clientes", 
      icon: Users, 
      component: ClientesModule, 
      permission: "clientes" 
    },
    { 
      id: "productos", 
      label: "Productos", 
      icon: Package, 
      component: ProductosModule, 
      permission: "productos" 
    },
    { 
      id: "inventario", 
      label: "Inventario", 
      icon: Calculator, 
      component: InventarioModule, 
      permission: "inventario" 
    },
    { 
      id: "compras", 
      label: "Compras", 
      icon: ShoppingCart, 
      component: ComprasModule, 
      permission: "compras" 
    },
    { 
      id: "plan-cuentas", 
      label: "Plan de Cuentas", 
      icon: FolderTree, 
      component: PlanCuentasModule, 
      permission: "plan_cuentas" 
    },
    { 
      id: "libro-diario", 
      label: "Libro Diario", 
      icon: FileText, 
      component: JournalView, 
      permission: "libro_diario" 
    },
    { 
      id: "libro-mayor", 
      label: "Libro Mayor", 
      icon: BookCopy, 
      component: GeneralLedgerView, 
      permission: "libro_mayor" 
    },
    { 
      id: "balance", 
      label: "Balance de Comprobación", 
      icon: Scale, 
      component: BalanceComprobacionModule, 
      permission: "balance" 
    },
    { 
      id: "balance-general", 
      label: "Balance General", 
      icon: Landmark, 
      component: BalanceGeneralModule, 
      permission: "balance_general" 
    },
    { 
      id: "reportes", 
      label: "Reportes", 
      icon: FileText, 
      component: ReportesModule, 
      permission: "reportes" 
    },
    { 
      id: "configuracion", 
      label: "Configuración", 
      icon: Settings, 
      component: ConfiguracionModule, 
      permission: "configuracion" 
    },
  ];

  // Filtrar módulos según permisos del usuario
  const allowedModules = modules.filter(module => 
    hasPermission(module.permission) || hasPermission('*')
  );

  const ActiveComponent = allowedModules.find(m => m.id === activeModule)?.component || Dashboard;
  const activeModuleLabel = allowedModules.find(m => m.id === activeModule)?.label || 'Dashboard';

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex bg-muted/40">
        <AppSidebar
          modules={allowedModules}
          activeModule={activeModule}
          setActiveModule={setActiveModule}
        />
        <div className="flex-1 flex flex-col">
          <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40 w-full border-b">
            <div className="container flex h-16 items-center px-6">
              <SidebarTrigger className="mr-4 lg:hidden" />
              <h1 className="text-xl font-semibold text-foreground">
                {activeModuleLabel}
              </h1>
            </div>
          </header>
          <main className="p-6 flex-1">
            <div className="animate-in fade-in-50 duration-300">
              <ActiveComponent key={activeModule} />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
