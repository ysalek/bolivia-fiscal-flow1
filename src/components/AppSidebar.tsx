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
  Home
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
  SidebarTrigger,
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
      { title: 'Búsqueda Global', url: '/?view=search', icon: Search, badge: null },
    ]
  },
  {
    group: 'Contabilidad',
    items: [
      { title: 'Plan de Cuentas', url: '/?view=plan-cuentas', icon: BookOpen, badge: null },
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
      { title: 'Inventario', url: '/?view=inventario', icon: Package, badge: null },
      { title: 'Kardex', url: '/?view=kardex', icon: ClipboardList, badge: null },
    ]
  }
];

const AppSidebar = () => {
  const [collapsed, setCollapsed] = React.useState(false);
  const location = useLocation();
  const currentPath = location.pathname + location.search;

  const isActive = (url: string) => currentPath === url;

  const getNavClasses = (active: boolean) => 
    active 
      ? "bg-primary/10 text-primary font-medium border-r-2 border-primary" 
      : "hover:bg-accent/50 hover:text-accent-foreground";

  return (
    <Sidebar
      className={`border-r transition-all duration-300 ${collapsed ? "w-16" : "w-72"}`}
    >
      <SidebarContent className="p-2">
        {/* Logo/Brand */}
        <div className={`p-4 border-b mb-4 ${collapsed ? 'text-center' : ''}`}>
          {collapsed ? (
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
            {!collapsed && (
              <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                {group.group}
              </SidebarGroupLabel>
            )}
            
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {group.items.map((item, itemIndex) => (
                  <SidebarMenuItem key={itemIndex}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        className={({ isActive: navIsActive }) => 
                          `flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                            getNavClasses(navIsActive || isActive(item.url))
                          }`
                        }
                      >
                        <item.icon className={`${collapsed ? 'w-5 h-5' : 'w-4 h-4'} flex-shrink-0`} />
                        {!collapsed && (
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
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}

        {/* Footer */}
        {!collapsed && (
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