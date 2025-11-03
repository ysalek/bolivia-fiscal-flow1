
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Calculator,
  FileText,
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
  Scale,
  BookOpen,
  BookOpenCheck,
  Building,
  Building2,
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
  Shield,
  TestTube,
  Brain,
  Sparkles,
  ChevronDown,
  Home,
  GitBranch,
  CheckCircle,
  Download,
  Cpu,
  Database
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';

const menuItems = [
  {
    group: 'Principal',
    items: [
      { title: 'Dashboard', url: '/?view=dashboard', icon: Home, badge: null },
      { title: 'Análisis IA', url: '/?view=analisis-inteligente', icon: Brain, badge: 'Nuevo' },
    ]
  },
  {
    group: 'Contabilidad',
    items: [
      { title: 'Plan de Cuentas', url: '/?view=plan-cuentas', icon: BookOpen, badge: null },
      { title: 'Comprobantes', url: '/?view=comprobantes-integrados', icon: FileCheck, badge: null },
      { title: 'Libro Diario', url: '/?view=diario', icon: FileText, badge: null },
      { title: 'Libro Mayor', url: '/?view=mayor', icon: BookOpenCheck, badge: null },
      { title: 'Balance de Comprobación', url: '/?view=balance-comprobacion', icon: Scale, badge: null },
      { title: 'Balance General', url: '/?view=balance-general', icon: FileBarChart, badge: null },
      { title: 'Estado de Resultados', url: '/?view=estado-resultados', icon: TrendingUp, badge: null },
    ]
  },
  {
    group: 'Operaciones',
    items: [
      { title: 'Facturación', url: '/?view=facturacion', icon: Receipt, badge: null },
      { title: 'Punto de Venta', url: '/?view=punto-venta', icon: CreditCard, badge: null },
      { title: 'Ventas a Crédito', url: '/?view=credit-sales', icon: DollarSign, badge: null },
      { title: 'Compras', url: '/?view=compras', icon: ShoppingCart, badge: null },
      { title: 'Clientes', url: '/?view=clientes', icon: Users, badge: null },
    ]
  },
  {
    group: 'Inventario y Activos',
    items: [
      { title: 'Productos', url: '/?view=productos', icon: Package, badge: null },
      { title: 'Inventario', url: '/?view=inventario', icon: Archive, badge: null },
      { title: 'Kardex', url: '/?view=kardex', icon: ClipboardList, badge: null },
      { title: 'Activos Fijos', url: '/?view=activos-fijos', icon: Building2, badge: null },
    ]
  },
  {
    group: 'Finanzas',
    items: [
      { title: 'Bancos', url: '/?view=bancos', icon: Building2, badge: null },
      { title: 'Flujo de Caja', url: '/?view=flujo-caja', icon: PiggyBank, badge: null },
      { title: 'Cuentas por Cobrar/Pagar', url: '/?view=cuentas-cobrar-pagar', icon: CreditCard, badge: null },
      { title: 'Declaraciones IVA', url: '/?view=declaraciones-tributarias', icon: FileText, badge: null },
      { title: 'Cumplimiento Normativo', url: '/?view=cumplimiento-normativo', icon: Shield, badge: 'Nuevo' },
      { title: 'Auditoría Avanzada', url: '/?view=auditoria-avanzada', icon: TestTube, badge: 'Nuevo' },
      { title: 'Plan Cuentas 2025', url: '/?view=plan-cuentas-2025', icon: BookOpen, badge: 'Actualizado' },
      { title: 'Retenciones', url: '/?view=retenciones', icon: Receipt, badge: null },
      { title: 'Facturación Electrónica', url: '/?view=facturacion-electronica', icon: Zap, badge: 'Pro' },
    ]
  },
  {
    group: 'Planificación',
    items: [
      { title: 'Presupuestos', url: '/?view=presupuestos', icon: Target, badge: 'Nuevo' },
      { title: 'Centros de Costo', url: '/?view=centros-costo', icon: Factory, badge: 'Nuevo' },
    ]
  },
  {
    group: 'Recursos Humanos',
    items: [
      { title: 'Nómina', url: '/?view=nomina', icon: UserCheck, badge: null },
      { title: 'Empleados', url: '/?view=empleados', icon: Users, badge: null },
     ]
  },
  {
    group: 'Enterprise',
    items: [
      { title: 'Integraciones', url: '/?view=integrations', icon: Zap, badge: 'Pro' },
      { title: 'Workflows', url: '/?view=workflows', icon: GitBranch, badge: 'Pro' },
      { title: 'Validador Sistema', url: '/?view=system-validator', icon: CheckCircle, badge: 'Pro' },
      { title: 'Integrador Sistema', url: '/?view=system-integrator', icon: Shield, badge: 'Pro' },
      { title: 'Pruebas del Sistema', url: '/?view=pruebas-sistema', icon: TestTube, badge: 'Nuevo' },
      { title: 'Optimizador', url: '/?view=optimizador', icon: Cpu, badge: 'Nuevo' },
    ]
  },
  {
    group: 'Configuración',
    items: [
      { title: 'Configuración', url: '/?view=configuracion', icon: Settings, badge: null },
      { title: 'Backup', url: '/?view=backup', icon: Download, badge: null },
      { title: 'Tutorial', url: '/?view=tutorial', icon: HelpCircle, badge: null },
    ]
  }
];

const AppSidebar = () => {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const location = useLocation();
  
  // Obtener el view actual desde los parámetros de URL
  const urlParams = new URLSearchParams(location.search);
  const currentView = urlParams.get('view') || 'dashboard';

  const isActive = (url: string) => {
    const viewParam = new URLSearchParams(url.split('?')[1] || '').get('view');
    return viewParam === currentView;
  };

  const handleNavigation = (url: string) => {
    window.history.pushState({}, '', url);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const getNavClasses = (active: boolean) => 
    active 
      ? "bg-primary text-primary-foreground font-medium shadow-sm" 
      : "hover:bg-accent hover:text-accent-foreground";

  return (
    <Sidebar className="border-r border-border">
      <SidebarContent className="p-3">
        {/* Logo/Brand */}
        <div className={`px-4 py-5 mb-4 ${isCollapsed ? 'text-center' : ''}`}>
          {isCollapsed ? (
            <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center mx-auto">
              <Calculator className="w-5 h-5 text-white" />
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center flex-shrink-0">
                <Calculator className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg text-foreground">
                  ContaBolivia
                </h1>
                <p className="text-xs text-muted-foreground">Sistema Contable Pro</p>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Groups */}
        {menuItems.map((group, groupIndex) => (
          <div key={groupIndex} className="mb-6">
            {!isCollapsed && (
              <div className="px-3 mb-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {group.group}
                </span>
              </div>
            )}
            
            <div className="space-y-1">
              {group.items.map((item, itemIndex) => (
                <button
                  key={itemIndex}
                  onClick={() => handleNavigation(item.url)}
                  className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                    getNavClasses(isActive(item.url))
                  }`}
                  title={isCollapsed ? item.title : undefined}
                >
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  {!isCollapsed && (
                    <>
                      <span className="flex-1 truncate text-sm">{item.title}</span>
                      {item.badge && (
                        <Badge 
                          variant={item.badge === 'Nuevo' ? 'default' : 'secondary'} 
                          className="text-xs px-2 py-0.5"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Footer */}
        {!isCollapsed && (
          <div className="mt-auto pt-4 px-3 border-t">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
              <span>Sistema Activo v2.0</span>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
