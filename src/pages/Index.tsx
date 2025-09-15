
import React, { Suspense, useState, useEffect, lazy } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { inicializarSistemaCompleto } from '@/utils/inicializarSistema';
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
import AppSidebar from '@/components/AppSidebar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Bell, User, LogOut, Settings } from 'lucide-react';
import NotificationCenter from '@/components/contable/notifications/NotificationCenter';

// Lazy load components
const SimpleAppTest = lazy(() => import('@/components/contable/SimpleAppTest'));
const ComplianceModule = lazy(() => import('@/components/contable/enterprise/ComplianceModule'));
const IntegrationHub = lazy(() => import('@/components/contable/integration/IntegrationHub'));
const WorkflowManager = lazy(() => import('@/components/contable/workflow/WorkflowManager'));
const Dashboard = lazy(() => import('@/components/contable/Dashboard'));
const AnalisisInteligente = lazy(() => import('@/components/contable/analisis/AnalisisInteligente'));
const LibroDiario = lazy(() => import('@/components/contable/LibroDiario'));
const LibroMayor = lazy(() => import('@/components/contable/LibroMayor'));
const BalanceComprobacionModule = lazy(() => import('@/components/contable/BalanceComprobacionModule'));
const BalanceGeneralModule = lazy(() => import('@/components/contable/BalanceGeneralModule'));
const EstadoResultadosModule = lazy(() => import('@/components/contable/EstadoResultadosModule'));
const PlanCuentasModule = lazy(() => import('@/components/contable/PlanCuentasModule'));
const ComprobantesModule = lazy(() => import('@/components/contable/comprobantes/ComprobantesModule'));
const ProductosModule = lazy(() => import('@/components/contable/ProductosModule'));
const InventarioModule = lazy(() => import('@/components/contable/InventarioModule'));
const KardexModule = lazy(() => import('@/components/contable/KardexModule'));
const FacturacionModule = lazy(() => import('@/components/contable/FacturacionModule'));
const ComprasModule = lazy(() => import('@/components/contable/ComprasModule'));
const ClientesModule = lazy(() => import('@/components/contable/ClientesModule'));
const BancosModule = lazy(() => import('@/components/contable/BancosModule'));
const AdvancedCashFlowModule = lazy(() => import('@/components/contable/cashflow/AdvancedCashFlowModule'));
const DeclaracionesTributariasModule = lazy(() => import('@/components/contable/DeclaracionesTributariasModule'));
const CumplimientoNormativoModule = lazy(() => import('@/components/contable/cumplimiento/CumplimientoNormativoModule'));
const AuditoriaContableAvanzada = lazy(() => import('@/components/contable/auditoria/AuditoriaContableAvanzada'));
const PlanCuentasBoliviano2025Module = lazy(() => import('@/components/contable/PlanCuentasBoliviano2025Module'));
const NominaModule = lazy(() => import('@/components/contable/nomina/NominaModule'));
const ReportesModule = lazy(() => import('@/components/contable/ReportesModule'));
const AnalisisFinanciero = lazy(() => import('@/components/contable/analisis/AnalisisFinanciero'));
const AnalisisRentabilidad = lazy(() => import('@/components/contable/rentabilidad/AnalisisRentabilidad'));
const ConfiguracionModule = lazy(() => import('@/components/contable/ConfiguracionModule'));
const UserManagement = lazy(() => import('@/components/contable/users/UserManagement'));
const BackupModule = lazy(() => import('@/components/contable/BackupModule'));
const TutorialModule = lazy(() => import('@/components/contable/TutorialModule'));
const PuntoVentaModule = lazy(() => import('@/components/contable/PuntoVentaModule'));
const CreditSalesModule = lazy(() => import('@/components/contable/billing/CreditSalesModule'));
const CuentasPorCobrarPagar = lazy(() => import('@/components/contable/CuentasPorCobrarPagar'));
const FacturacionElectronicaModule = lazy(() => import('@/components/contable/facturacion/FacturacionElectronicaModule'));
const RetencionesModule = lazy(() => import('@/components/contable/retenciones/RetencionesModule'));
const GlobalSearch = lazy(() => import('@/components/contable/search/GlobalSearch'));
const EmpleadosModule = lazy(() => import('@/components/contable/empleados/EmpleadosModule'));

const Index = () => {
  const { hasPermission, user, logout } = useAuth();
  const [openNotifications, setOpenNotifications] = useState(false);

  const UserProfileMenu = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-2">
          <User className="w-4 h-4" />
          <span className="hidden md:inline text-sm">{user?.nombre}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.nombre}</p>
            <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
            <p className="text-xs leading-none text-muted-foreground">{user?.empresa}</p>
            <p className="text-xs leading-none text-primary font-medium">Rol: {user?.rol}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => {
          const url = `/?view=configuracion`;
          window.history.pushState({}, '', url);
          window.dispatchEvent(new PopStateEvent('popstate'));
        }}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Configuración</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={async () => {
          console.log('🔄 Reiniciando sesión...');
          await logout();
          window.location.reload();
        }}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Reiniciar Sesión</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={async () => {
            try {
              console.log('🚪 Iniciando logout...');
              await logout();
              console.log('✅ Logout completado');
            } catch (error) {
              console.error('❌ Error en logout:', error);
            }
          }}
          className="text-red-600 focus:text-red-600"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Cerrar Sesión</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
  
  // Obtener el view desde la URL y actualizar cuando cambie
  const [currentView, setCurrentView] = React.useState(() => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('view') || 'dashboard';
  });

  // Escuchar cambios en la URL
  React.useEffect(() => {
    const handlePopState = () => {
      const urlParams = new URLSearchParams(window.location.search);
      setCurrentView(urlParams.get('view') || 'dashboard');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Escuchar eventos de navegación desde componentes (notificaciones, etc.)
  useEffect(() => {
    const handler = (e: any) => {
      const view = e.detail || 'dashboard';
      const url = `/?view=${view}`;
      window.history.pushState({}, '', url);
      window.dispatchEvent(new PopStateEvent('popstate'));
      setOpenNotifications(false);
    };
    window.addEventListener('navigate-to-module', handler as EventListener);
    return () => window.removeEventListener('navigate-to-module', handler as EventListener);
  }, []);

  // Sistema ya utiliza Supabase, no necesita inicialización localStorage
  // useEffect(() => {
  //   inicializarSistemaCompleto();
  // }, []);

  // Renderizar componente basado en el view actual
  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'analisis-inteligente':
        return <AnalisisInteligente />;
      case 'diario':
        return <LibroDiario />;
      case 'mayor':
        return <LibroMayor />;
      case 'balance-comprobacion':
        return <BalanceComprobacionModule />;
      case 'balance-general':
        return <BalanceGeneralModule />;
      case 'estado-resultados':
        return <EstadoResultadosModule />;
      case 'plan-cuentas':
        return <PlanCuentasModule />;
      case 'comprobantes-integrados':
        return <ComprobantesModule />;
      case 'productos':
        return <ProductosModule />;
      case 'inventario':
        return <InventarioModule />;
      case 'kardex':
        return <KardexModule />;
      case 'facturacion':
        return <FacturacionModule />;
      case 'compras':
        return <ComprasModule />;
      case 'clientes':
        return <ClientesModule />;
      case 'search':
        return <GlobalSearch onNavigate={() => {}} />;
      case 'bancos':
        return <BancosModule />;
      case 'flujo-caja':
        return <AdvancedCashFlowModule />;
      case 'cuentas-cobrar-pagar':
        return <CuentasPorCobrarPagar />;
      case 'declaraciones-tributarias':
        return <DeclaracionesTributariasModule />;
      case 'cumplimiento-normativo':
        return <CumplimientoNormativoModule />;
      case 'auditoria-avanzada':
        return <AuditoriaContableAvanzada />;
      case 'plan-cuentas-2025':
        return <PlanCuentasBoliviano2025Module />;
      case 'nomina':
        return <NominaModule />;
      case 'empleados':
        return <EmpleadosModule />;
      case 'reportes':
        return <ReportesModule />;
      case 'analisis-financiero':
        return <AnalisisFinanciero />;
      case 'rentabilidad':
        return <AnalisisRentabilidad />;
      case 'configuracion':
        return <ConfiguracionModule />;
      case 'usuarios':
        return <UserManagement />;
      case 'backup':
        return <BackupModule />;
      case 'tutorial':
        return <TutorialModule />;
      case 'punto-venta':
        return <PuntoVentaModule />;
      case 'credit-sales':
        return <CreditSalesModule />;
      case 'facturacion-electronica':
        return <FacturacionElectronicaModule />;
      case 'retenciones':
        return <RetencionesModule />;
      case 'compliance':
        return <ComplianceModule />;
      case 'integrations':
        return <IntegrationHub />;
      case 'workflows':
        return <WorkflowManager />;
      default:
        return <Dashboard />;
    }
  };

  const getPageTitle = () => {
    const titles = {
      'dashboard': 'Panel de Control',
      'analisis-inteligente': 'Análisis Inteligente',
      'diario': 'Libro Diario',
      'mayor': 'Libro Mayor',
      'balance-comprobacion': 'Balance de Comprobación',
      'balance-general': 'Balance General',
      'estado-resultados': 'Estado de Resultados',
      'plan-cuentas': 'Plan de Cuentas',
      'comprobantes-integrados': 'Comprobantes Integrados',
      'productos': 'Gestión de Productos',
      'inventario': 'Control de Inventario',
      'kardex': 'Kardex de Productos',
      'facturacion': 'Sistema de Facturación',
      'compras': 'Gestión de Compras',
      'clientes': 'Gestión de Clientes',
      'search': 'Búsqueda Global',
      'bancos': 'Gestión de Bancos',
      'flujo-caja': 'Flujo de Caja',
      'cuentas-cobrar-pagar': 'Cuentas por Cobrar/Pagar',
      'declaraciones-tributarias': 'Declaraciones Tributarias',
      'cumplimiento-normativo': 'Cumplimiento Normativo',
      'auditoria-avanzada': 'Auditoría Avanzada',
      'plan-cuentas-2025': 'Plan de Cuentas 2025',
      'nomina': 'Nómina',
      'empleados': 'Gestión de Empleados',
      'reportes': 'Reportes',
      'analisis-financiero': 'Análisis Financiero',
      'rentabilidad': 'Análisis de Rentabilidad',
      'configuracion': 'Configuración',
      'usuarios': 'Gestión de Usuarios',
      'backup': 'Backup',
      'tutorial': 'Tutorial',
      'punto-venta': 'Punto de Venta',
      'credit-sales': 'Ventas a Crédito',
      'compliance': 'Cumplimiento Normativo',
      'integrations': 'Centro de Integraciones',
      'workflows': 'Gestión de Workflows'
    };
    return titles[currentView as keyof typeof titles] || 'Sistema Contable';
  };

  // SEO dinámico por vista
  useEffect(() => {
    const title = `${getPageTitle()} | Sistema Contable Bolivia`;
    document.title = title;

    const descriptions: Record<string, string> = {
      'dashboard': 'Panel de control con KPIs contables y financieros en Bolivia.',
      'punto-venta': 'POS con precios con IVA incluido, inventario y clientes en Bolivia.',
      'credit-sales': 'Gestión de ventas a crédito y cuentas por cobrar (1121).',
      'facturacion': 'Facturación y control fiscal conforme normativa boliviana.',
      'inventario': 'Control de inventario y kardex.',
      'compras': 'Gestión de compras y proveedores.',
      'empleados': 'Gestión completa de empleados: datos personales, cargos, salarios y beneficios.',
    };
    const description = descriptions[currentView] || 'Sistema contable integral para Bolivia: POS, compras, ventas e informes.';

    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', description);

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', `${window.location.origin}/?view=${currentView}`);
  }, [currentView]);

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex">
        <AppSidebar />
        
        <SidebarInset>
          {/* Header */}
          <header className="flex h-16 shrink-0 items-center gap-2 px-4 border-b">
            <SidebarTrigger className="-ml-1" />
            
            <div className="flex-1 max-w-md">
              <Suspense fallback={<div className="h-8 bg-muted rounded animate-pulse" />}>
                <GlobalSearch onNavigate={(moduleId) => {
                  const viewMap: { [key: string]: string } = {
                    'dashboard': 'dashboard',
                    'analisis-inteligente': 'analisis-inteligente',
                    'diario': 'diario',
                    'mayor': 'mayor',
                    'balance-comprobacion': 'balance-comprobacion',
                    'balance-general': 'balance-general',
                    'estado-resultados': 'estado-resultados',
                    'plan-cuentas': 'plan-cuentas',
                    'comprobantes-integrados': 'comprobantes-integrados',
                    'productos': 'productos',
                    'inventario': 'inventario',
                    'kardex': 'kardex',
                    'facturacion': 'facturacion',
                    'compras': 'compras',
                    'clientes': 'clientes'
                  };
                  const view = viewMap[moduleId] || 'dashboard';
                  const url = `/?view=${view}`;
                  window.history.pushState({}, '', url);
                  window.dispatchEvent(new PopStateEvent('popstate'));
                }} />
              </Suspense>
            </div>
            
            <h1 className="font-semibold text-lg mx-4">
              {getPageTitle()}
            </h1>
            
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => setOpenNotifications(true)} aria-label="Abrir notificaciones">
                <Bell className="w-4 h-4" />
              </Button>
              
              {/* User Info and Logout */}
              <UserProfileMenu />
            </div>
          </header>

          <Dialog open={openNotifications} onOpenChange={setOpenNotifications}>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Centro de Notificaciones</DialogTitle>
                <DialogDescription>Alertas del sistema: inventario, finanzas y obligaciones fiscales.</DialogDescription>
              </DialogHeader>
              <Suspense fallback={<div className="h-32 bg-muted rounded animate-pulse" />}> 
                <NotificationCenter />
              </Suspense>
            </DialogContent>
          </Dialog>

          {/* Main Content */}
          <main className="flex-1 overflow-auto p-4">
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
              {renderCurrentView()}
            </Suspense>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Index;
