
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
  GitBranch
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
    group: 'Inventario',
    items: [
      { title: 'Productos', url: '/?view=productos', icon: Package, badge: null },
      { title: 'Inventario', url: '/?view=inventario', icon: Archive, badge: null },
      { title: 'Kardex', url: '/?view=kardex', icon: ClipboardList, badge: null },
    ]
  },
  {
    group: 'Finanzas',
    items: [
      { title: 'Bancos', url: '/?view=bancos', icon: Building2, badge: null },
      { title: 'Flujo de Caja', url: '/?view=flujo-caja', icon: PiggyBank, badge: null },
      { title: 'Cuentas por Cobrar/Pagar', url: '/?view=cuentas-cobrar-pagar', icon: CreditCard, badge: null },
      { title: 'Declaraciones IVA', url: '/?view=declaraciones-tributarias', icon: FileText, badge: null },
      { title: 'Cumplimiento Normativo', url: '/?view=compliance', icon: Shield, badge: 'Nuevo' },
      { title: 'Auditoría Avanzada', url: '/?view=auditoria-avanzada', icon: TestTube, badge: 'Nuevo' },
      { title: 'Plan Cuentas 2025', url: '/?view=plan-cuentas-2025', icon: BookOpen, badge: 'Actualizado' },
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
    group: 'Reportes',
    items: [
      { title: 'Reportes', url: '/?view=reportes', icon: BarChart3, badge: null },
      { title: 'Análisis Financiero', url: '/?view=analisis-financiero', icon: TrendingUp, badge: null },
      { title: 'Análisis de Rentabilidad', url: '/?view=rentabilidad', icon: Target, badge: null },
    ]
  },
  {
    group: 'Enterprise',
    items: [
      { title: 'Integraciones', url: '/?view=integrations', icon: Zap, badge: 'Pro' },
      { title: 'Workflows', url: '/?view=workflows', icon: GitBranch, badge: 'Pro' },
    ]
  },
  {
    group: 'Configuración',
    items: [
      { title: 'Configuración', url: '/?view=configuracion', icon: Settings, badge: null },
      { title: 'Usuarios', url: '/?view=usuarios', icon: UserCheck, badge: null },
      { title: 'Backup', url: '/?view=backup', icon: HardDrive, badge: null },
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
      ? "bg-primary/10 text-primary font-medium border-r-2 border-primary" 
      : "hover:bg-accent/50 hover:text-accent-foreground";

  return (
    <Sidebar>
      <SidebarContent className="p-2">
        {/* Logo/Brand */}
        <div className={`p-4 border-b mb-4 ${isCollapsed ? 'text-center' : ''}`}>
          {isCollapsed ? (
            <Calculator className="w-8 h-8 text-primary mx-auto" />
          ) : (
            <div className="flex items-center gap-2">
              <Calculator className="w-8 h-8 text-primary" />
              <div>
                <h1 className="font-bold text-lg bg-gradient-to-r from-primary to-primary-variant bg-clip-text text-transparent">
                  ContaBolivia
                </h1>
                <p className="text-xs text-muted-foreground">Sistema Contable</p>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Groups */}
        {menuItems.map((group, groupIndex) => (
          <SidebarGroup key={groupIndex} className="mb-4">
            {!isCollapsed && (
              <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                {group.group}
              </SidebarGroupLabel>
            )}
            
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {group.items.map((item, itemIndex) => (
                  <SidebarMenuItem key={itemIndex}>
                    <SidebarMenuButton asChild>
                      <button
                        onClick={() => handleNavigation(item.url)}
                        className={`w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                          getNavClasses(isActive(item.url))
                        }`}
                      >
                        <item.icon className={`${isCollapsed ? 'w-5 h-5' : 'w-4 h-4'} flex-shrink-0`} />
                        {!isCollapsed && (
                          <>
                            <span className="flex-1 truncate">{item.title}</span>
                            {item.badge && (
                              <Badge 
                                variant={item.badge === 'Nuevo' ? 'default' : 'secondary'} 
                                className="text-xs px-1.5 py-0.5"
                              >
                                {item.badge}
                              </Badge>
                            )}
                          </>
                        )}
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}

        {/* Footer */}
        {!isCollapsed && (
          <div className="mt-auto p-4 border-t">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Sparkles className="w-3 h-3" />
              <span>Versión 2.0</span>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
