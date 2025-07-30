
import React, { Suspense, useState, useEffect, lazy } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { inicializarSistemaCompleto } from '@/utils/inicializarSistema';
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
import AppSidebar from '@/components/AppSidebar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Bell } from 'lucide-react';

// Lazy load components
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
const GlobalSearch = lazy(() => import('@/components/contable/search/GlobalSearch'));

const Index = () => {
  const { hasPermission } = useAuth();
  
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

  // Inicializar sistema al cargar
  useEffect(() => {
    inicializarSistemaCompleto();
  }, []);

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
        return <div className="p-6"><h2 className="text-2xl font-bold">Módulo de Bancos - En desarrollo</h2></div>;
      case 'flujo-caja':
        return <div className="p-6"><h2 className="text-2xl font-bold">Flujo de Caja - En desarrollo</h2></div>;
      case 'cuentas-cobrar-pagar':
        return <div className="p-6"><h2 className="text-2xl font-bold">Cuentas por Cobrar/Pagar - En desarrollo</h2></div>;
      case 'declaraciones-tributarias':
        return <div className="p-6"><h2 className="text-2xl font-bold">Declaraciones Tributarias - En desarrollo</h2></div>;
      case 'nomina':
        return <div className="p-6"><h2 className="text-2xl font-bold">Nómina - En desarrollo</h2></div>;
      case 'empleados':
        return <div className="p-6"><h2 className="text-2xl font-bold">Empleados - En desarrollo</h2></div>;
      case 'reportes':
        return <div className="p-6"><h2 className="text-2xl font-bold">Reportes - En desarrollo</h2></div>;
      case 'analisis-financiero':
        return <div className="p-6"><h2 className="text-2xl font-bold">Análisis Financiero - En desarrollo</h2></div>;
      case 'rentabilidad':
        return <div className="p-6"><h2 className="text-2xl font-bold">Análisis de Rentabilidad - En desarrollo</h2></div>;
      case 'configuracion':
        return <div className="p-6"><h2 className="text-2xl font-bold">Configuración - En desarrollo</h2></div>;
      case 'usuarios':
        return <div className="p-6"><h2 className="text-2xl font-bold">Gestión de Usuarios - En desarrollo</h2></div>;
      case 'backup':
        return <div className="p-6"><h2 className="text-2xl font-bold">Backup - En desarrollo</h2></div>;
      case 'tutorial':
        return <div className="p-6"><h2 className="text-2xl font-bold">Tutorial - En desarrollo</h2></div>;
      case 'punto-venta':
        return <div className="p-6"><h2 className="text-2xl font-bold">Punto de Venta - En desarrollo</h2></div>;
      case 'credit-sales':
        return <div className="p-6"><h2 className="text-2xl font-bold">Ventas a Crédito - En desarrollo</h2></div>;
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
      'credit-sales': 'Ventas a Crédito'
    };
    return titles[currentView as keyof typeof titles] || 'Sistema Contable';
  };

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
              <Button variant="ghost" size="sm">
                <Bell className="w-4 h-4" />
              </Button>
            </div>
          </header>

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
