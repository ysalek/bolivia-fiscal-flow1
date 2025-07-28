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

const Index = () => {
  const { hasPermission } = useAuth();
  
  // Obtener el view desde la URL
  const urlParams = new URLSearchParams(window.location.search);
  const currentView = urlParams.get('view') || 'dashboard';

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
      default:
        return <Dashboard />;
    }
  };

  const getPageTitle = () => {
    const titles = {
      'dashboard': 'Panel de Control',
      'analisis-inteligente': 'Análisis Inteligente',
      'diario': 'Libro Diario',
      'mayor': 'Libro Mayor'
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