
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  Calculator,
  FileText,
  Users,
  Package,
  TrendingUp,
  DollarSign,
  BarChart3,
  Receipt
} from "lucide-react";
import Dashboard from "@/components/contable/Dashboard";
import FacturacionModule from "@/components/contable/FacturacionModule";
import ClientesModule from "@/components/contable/ClientesModule";
import ProductosModule from "@/components/contable/ProductosModule";
import LibroDiario from "@/components/contable/LibroDiario";
import BalanceComprobacion from "@/components/contable/BalanceComprobacion";

const Index = () => {
  const [activeModule, setActiveModule] = useState("dashboard");

  const modules = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3, component: Dashboard },
    { id: "facturacion", label: "Facturación", icon: Receipt, component: FacturacionModule },
    { id: "clientes", label: "Clientes", icon: Users, component: ClientesModule },
    { id: "productos", label: "Productos", icon: Package, component: ProductosModule },
    { id: "libro-diario", label: "Libro Diario", icon: FileText, component: LibroDiario },
    { id: "balance", label: "Balance", icon: Calculator, component: BalanceComprobacion },
  ];

  const ActiveComponent = modules.find(m => m.id === activeModule)?.component || Dashboard;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            Sistema Contable Integrado
          </h1>
          <p className="text-lg text-slate-600">
            Gestión contable y facturación electrónica para Bolivia
          </p>
        </div>

        {/* Navigation */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-2">
              {modules.map((module) => {
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
