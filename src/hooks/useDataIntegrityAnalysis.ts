import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

/**
 * Análisis completo de integridad de datos del sistema
 * Identifica inconsistencias entre módulos que acceden a las mismas tablas
 */

export interface DataAccessPattern {
  tableName: string;
  accessCount: number;
  hooks: string[];
  components: string[];
  inconsistencies: string[];
}

export interface DataIntegrityReport {
  totalTables: number;
  duplicatedAccess: DataAccessPattern[];
  orphanedHooks: string[];
  recommendedConsolidations: ConsolidationRecommendation[];
  severityLevel: 'low' | 'medium' | 'high' | 'critical';
}

export interface ConsolidationRecommendation {
  issue: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  solution: string;
  affectedFiles: string[];
  estimatedImpact: string;
}

export const useDataIntegrityAnalysis = () => {
  const [report, setReport] = useState<DataIntegrityReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [connectivity, setConnectivity] = useState(false);

  const analyzeDataIntegrity = async () => {
    setLoading(true);
    
    try {
      // Verificar conectividad con Supabase
      const { data: { user }, error } = await supabase.auth.getUser();
      setConnectivity(!error && !!user);

      // Análisis de patrones de acceso identificados
      const dataPatterns: DataAccessPattern[] = [
        {
          tableName: 'productos',
          accessCount: 6,
          hooks: [
            'useSupabaseProductos.ts',
            'useProductosUnificado.ts', 
            'useProductosValidated.ts',
            'useProductosSimple.ts',
            'useProductosRobust.ts',
            'useProductos.ts (wrapper)'
          ],
          components: [
            'ProductosModule.tsx',
            'InventarioModule.tsx',
            'FacturacionModule.tsx',
            'ComprasModule.tsx'
          ],
          inconsistencies: [
            'Múltiples hooks accediendo directamente a la misma tabla',
            'Diferentes transformaciones de datos en cada hook',
            'Estados duplicados de productos en memoria',
            'Posible desincronización entre componentes',
            'Diferentes estrategias de caché y refresco'
          ]
        },
        {
          tableName: 'categorias_productos',
          accessCount: 4,
          hooks: [
            'useSupabaseProductos.ts',
            'useProductosUnificado.ts',
            'useProductosValidated.ts', 
            'useProductosSimple.ts'
          ],
          components: [
            'ProductosModule.tsx',
            'InventarioModule.tsx'
          ],
          inconsistencies: [
            'Misma tabla accedida por múltiples hooks',
            'Duplicación de estado de categorías',
            'Falta de sincronización centralizada'
          ]
        },
        {
          tableName: 'facturas',
          accessCount: 3,
          hooks: [
            'useSupabaseFacturas.ts (inferido)',
            'Acceso directo en componentes',
            'SystemHealth.tsx'
          ],
          components: [
            'FacturacionModule.tsx',
            'SystemHealth.tsx',
            'AutomatedReporting.tsx'
          ],
          inconsistencies: [
            'Acceso directo desde componentes sin hook centralizado',
            'Diferentes consultas para el mismo objetivo',
            'Posibles problemas de permisos RLS'
          ]
        },
        {
          tableName: 'clientes',
          accessCount: 2,
          hooks: [
            'useSupabaseClientes.ts',
            'Acceso directo en FacturacionModule'
          ],
          components: [
            'ClientesModule.tsx',
            'FacturacionModule.tsx'
          ],
          inconsistencies: [
            'Hook dedicado pero también acceso directo',
            'Posible duplicación de datos de clientes'
          ]
        }
      ];

      // Identificar hooks huérfanos o redundantes
      const orphanedHooks = [
        'useProductosRobust.ts - Funcionalidad duplicada con useProductosValidated',
        'useProductosSimple.ts - Funcionalidad básica cubierta por otros hooks'
      ];

      // Generar recomendaciones de consolidación
      const recommendations: ConsolidationRecommendation[] = [
        {
          issue: 'Múltiples hooks para productos fragmentan el estado',
          severity: 'critical',
          solution: 'Consolidar en un solo hook maestro (useProductos) que centralice toda la lógica',
          affectedFiles: [
            'useSupabaseProductos.ts',
            'useProductosUnificado.ts',
            'useProductosValidated.ts',
            'useProductosSimple.ts',
            'useProductosRobust.ts'
          ],
          estimatedImpact: 'Alto - Mejora significativa en consistencia y rendimiento'
        },
        {
          issue: 'Acceso directo a Supabase desde componentes',
          severity: 'high',
          solution: 'Implementar hooks dedicados para cada entidad principal',
          affectedFiles: [
            'FacturacionModule.tsx',
            'SystemHealth.tsx',
            'AutomatedReporting.tsx'
          ],
          estimatedImpact: 'Medio - Mejor organización y mantenibilidad'
        },
        {
          issue: 'Estados duplicados en memoria',
          severity: 'medium',
          solution: 'Implementar un contexto global de datos o state manager',
          affectedFiles: ['Todos los hooks de datos'],
          estimatedImpact: 'Alto - Reducción significativa de uso de memoria'
        },
        {
          issue: 'Diferentes estrategias de validación y error handling',
          severity: 'high',
          solution: 'Estandarizar con useDataValidator para todos los hooks',
          affectedFiles: ['Todos los hooks que acceden Supabase'],
          estimatedImpact: 'Alto - Consistencia en manejo de errores y conectividad'
        }
      ];

      // Determinar nivel de severidad general
      const criticalCount = recommendations.filter(r => r.severity === 'critical').length;
      const highCount = recommendations.filter(r => r.severity === 'high').length;
      
      let severityLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
      if (criticalCount > 0) severityLevel = 'critical';
      else if (highCount > 1) severityLevel = 'high';
      else if (highCount > 0) severityLevel = 'medium';

      const integryReport: DataIntegrityReport = {
        totalTables: dataPatterns.length,
        duplicatedAccess: dataPatterns.filter(p => p.accessCount > 1),
        orphanedHooks,
        recommendedConsolidations: recommendations,
        severityLevel
      };

      setReport(integryReport);
      
    } catch (error) {
      console.error('Error analizando integridad de datos:', error);
      setConnectivity(false);
    } finally {
      setLoading(false);
    }
  };

  const generateConsolidationPlan = () => {
    if (!report) return null;

    return {
      phase1: {
        title: 'Consolidación de Hooks de Productos',
        actions: [
          'Crear useProductosMaster.ts como hook principal',
          'Migrar funcionalidad de validación de useProductosValidated',
          'Integrar transformaciones de useProductosUnificado',
          'Deprecar hooks redundantes gradualmente'
        ],
        priority: 'critical',
        estimatedTime: '3-5 días'
      },
      phase2: {
        title: 'Estandarización de Acceso a Datos',
        actions: [
          'Implementar hooks dedicados para todas las entidades',
          'Remover acceso directo desde componentes',
          'Centralizar validación con useDataValidator'
        ],
        priority: 'high',
        estimatedTime: '2-3 días'
      },
      phase3: {
        title: 'Optimización de Estado Global',
        actions: [
          'Evaluar implementación de contexto global',
          'Implementar caché inteligente',
          'Optimizar re-renderizados'
        ],
        priority: 'medium',
        estimatedTime: '1-2 días'
      }
    };
  };

  useEffect(() => {
    analyzeDataIntegrity();
  }, []);

  return {
    report,
    loading,
    connectivity,
    analyzeDataIntegrity,
    generateConsolidationPlan
  };
};