import React, { Suspense, useState, useEffect, lazy } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { inicializarSistemaCompleto } from '@/utils/inicializarSistema';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
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
  
  // Obtener el view desde la URL
  const urlParams = new URLSearchParams(window.location.search);
  const currentView = urlParams.get('view') || 'dashboard';

  // Función para cambiar el view
  const setView = (view: string) => {
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('view', view);
    window.history.pushState({}, '', newUrl.toString());
    window.location.reload(); // Recargar para actualizar el componente
  };

  // Función para manejar navegación desde búsqueda global
  const handleGlobalNavigation = (moduleId: string, itemId?: string) => {
    setView(moduleId);
    if (itemId) {
      console.log(`Navegando a ${moduleId} con item ${itemId}`);
    }
  };

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
        return <GlobalSearch onNavigate={handleGlobalNavigation} />;
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
      'search': 'Búsqueda Global'
    };
    return titles[currentView as keyof typeof titles] || 'Sistema Contable';
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center px-4">
            <SidebarTrigger className="mr-4" />
            <div className="flex-1">
              <h1 className="font-semibold text-lg">
                {getPageTitle()}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Bell className="w-4 h-4" />
              </Button>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-hidden">
            <Suspense fallback={
              <div className="p-6 space-y-4">
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
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;