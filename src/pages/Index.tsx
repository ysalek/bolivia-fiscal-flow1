
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  FolderTree
} from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import LoginForm from "@/components/auth/LoginForm";
import Dashboard from "@/components/contable/Dashboard";
import FacturacionModule from "@/components/contable/FacturacionModule";
import ClientesModule from "@/components/contable/ClientesModule";
import ProductosModule from "@/components/contable/ProductosModule";
import InventarioModule from "@/components/contable/InventarioModule";
import LibroDiario from "@/components/contable/LibroDiario";
import BalanceComprobacion from "@/components/contable/BalanceComprobacion";
import ReportesModule from "@/components/contable/ReportesModule";
import ConfiguracionModule from "@/components/contable/ConfiguracionModule";
import PlanCuentasModule from "@/components/contable/PlanCuentasModule";

const Index = () => {
  const { isAuthenticated, user, logout, hasPermission } = useAuth();
  const [activeModule, setActiveModule] = useState("dashboard");

  // Si no está autenticado, mostrar formulario de login
  if (!isAuthenticated) {
    return <LoginForm />;
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
      component: LibroDiario, 
      permission: "libro_diario" 
    },
    { 
      id: "balance", 
      label: "Balance", 
      icon: Calculator, 
      component: BalanceComprobacion, 
      permission: "balance" 
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

  const getRoleColor = (rol: string) => {
    const colors: { [key: string]: string } = {
      'admin': 'bg-red-100 text-red-800',
      'contador': 'bg-blue-100 text-blue-800',
      'ventas': 'bg-green-100 text-green-800',
      'usuario': 'bg-gray-100 text-gray-800'
    };
    return colors[rol] || colors.usuario;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header con información del usuario */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-800 mb-2">
                Sistema Contable Integrado
              </h1>
              <p className="text-lg text-slate-600">
                Gestión contable y facturación electrónica para Bolivia
              </p>
            </div>
            
            {/* Info del usuario */}
            <Card className="min-w-[300px]">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-medium">{user?.nombre}</div>
                      <div className="text-sm text-gray-600">{user?.empresa}</div>
                      <Badge className={getRoleColor(user?.rol || '')}>
                        {user?.rol?.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Settings className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={logout}>
                      <LogOut className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Navigation */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-2">
              {allowedModules.map((module) => {
                const Icon = module.icon;
                return (
                  <Button
                    key={module.id}
                    variant={activeModule === module.id ? "default" : "outline"}
                    onClick={() => setActiveModule(module.id)}
                    className="flex items-center gap-2"
                  >
                    <Icon className="w-4 h-4" />
                    {module.label}
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Content */}
        <div className="animate-in fade-in-50 duration-200">
          <ActiveComponent />
        </div>
      </div>
    </div>
  );
};

export default Index;
