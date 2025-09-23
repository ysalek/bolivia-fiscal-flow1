import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  data?: any;
}

export interface ConnectivityStatus {
  isConnected: boolean;
  isAuthenticated: boolean;
  userId?: string;
  lastCheck: Date;
  error?: string;
}

/**
 * Hook central para validación de datos y conectividad con Supabase
 * Proporciona un punto único de acceso para verificar estado de conexión y validar datos
 */
export const useDataValidator = () => {
  const [connectivity, setConnectivity] = useState<ConnectivityStatus>({
    isConnected: false,
    isAuthenticated: false,
    lastCheck: new Date()
  });
  const [isValidating, setIsValidating] = useState(false);
  const { toast } = useToast();

  /**
   * Valida la conectividad con Supabase y el estado de autenticación
   */
  const validateConnectivity = useCallback(async (): Promise<ConnectivityStatus> => {
    console.log('🔍 [DataValidator] Validando conectividad...');
    
    try {
      setIsValidating(true);
      
      // Verificar conexión a Supabase
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      const status: ConnectivityStatus = {
        isConnected: !authError,
        isAuthenticated: !authError && !!user,
        userId: user?.id,
        lastCheck: new Date(),
        error: authError?.message
      };
      
      console.log('✅ [DataValidator] Estado de conectividad:', status);
      setConnectivity(status);
      
      return status;
    } catch (error: any) {
      console.error('❌ [DataValidator] Error de conectividad:', error);
      
      const errorStatus: ConnectivityStatus = {
        isConnected: false,
        isAuthenticated: false,
        lastCheck: new Date(),
        error: error.message
      };
      
      setConnectivity(errorStatus);
      return errorStatus;
    } finally {
      setIsValidating(false);
    }
  }, []);

  /**
   * Valida una consulta específica a Supabase antes de ejecutarla
   */
  const validateQuery = useCallback(async (
    tableName: string,
    operation: 'select' | 'insert' | 'update' | 'delete',
    data?: any
  ): Promise<ValidationResult> => {
    console.log(`🔍 [DataValidator] Validando consulta: ${operation} en ${tableName}`);
    
    try {
      // Verificar conectividad primero
      const status = await validateConnectivity();
      
      if (!status.isConnected) {
        return {
          isValid: false,
          error: 'No hay conexión con la base de datos'
        };
      }
      
      if (!status.isAuthenticated) {
        return {
          isValid: false,
          error: 'Usuario no autenticado'
        };
      }
      
      // Validaciones específicas por operación
      if (operation === 'insert' || operation === 'update') {
        if (!data) {
          return {
            isValid: false,
            error: 'No se proporcionaron datos para la operación'
          };
        }
      }
      
      // Validar que la tabla existe y es accesible
      try {
        const { error: tableError } = await supabase
          .from(tableName as any)
          .select('id')
          .limit(1);
        
        if (tableError && tableError.code === 'PGRST116') {
          return {
            isValid: false,
            error: `La tabla ${tableName} no existe o no tienes permisos para acceder a ella`
          };
        }
      } catch (tableValidationError: any) {
        console.error('❌ [DataValidator] Error validando tabla:', tableValidationError);
        return {
          isValid: false,
          error: `Error accediendo a la tabla ${tableName}: ${tableValidationError.message}`
        };
      }
      
      console.log(`✅ [DataValidator] Consulta válida: ${operation} en ${tableName}`);
      
      return {
        isValid: true,
        data: { tableName, operation, userId: status.userId }
      };
    } catch (error: any) {
      console.error('❌ [DataValidator] Error en validación:', error);
      return {
        isValid: false,
        error: error.message
      };
    }
  }, [validateConnectivity]);

  /**
   * Ejecuta una consulta validada con reintentos automáticos
   */
  const executeValidatedQuery = useCallback(async <T>(
    tableName: string,
    queryBuilder: (table: any) => any,
    options: {
      operation: 'select' | 'insert' | 'update' | 'delete';
      data?: any;
      maxRetries?: number;
      showToast?: boolean;
    } = { operation: 'select', maxRetries: 3, showToast: true }
  ): Promise<{ data: T | null; error: string | null }> => {
    console.log(`🚀 [DataValidator] Ejecutando consulta validada en ${tableName}`);
    
    try {
      // Validar antes de ejecutar
      const validation = await validateQuery(tableName, options.operation, options.data);
      
      if (!validation.isValid) {
        if (options.showToast) {
          toast({
            title: "Error de validación",
            description: validation.error,
            variant: "destructive"
          });
        }
        return { data: null, error: validation.error || 'Validación fallida' };
      }
      
      // Ejecutar consulta con reintentos
      let lastError: any = null;
      const maxRetries = options.maxRetries || 3;
      
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          console.log(`🔄 [DataValidator] Intento ${attempt}/${maxRetries}`);
          
          const { data, error } = await queryBuilder(supabase.from(tableName as any));
          
          if (error) {
            lastError = error;
            console.error(`❌ [DataValidator] Error en intento ${attempt}:`, error);
            
            // Si es un error de red, reintentar
            if (error.message?.includes('network') || error.message?.includes('timeout')) {
              if (attempt < maxRetries) {
                console.log(`🔄 [DataValidator] Reintentando en 1 segundo...`);
                await new Promise(resolve => setTimeout(resolve, 1000));
                continue;
              }
            } else {
              // Error no recuperable, no reintentar
              break;
            }
          } else {
            console.log(`✅ [DataValidator] Consulta exitosa en intento ${attempt}`);
            return { data, error: null };
          }
        } catch (networkError: any) {
          lastError = networkError;
          console.error(`❌ [DataValidator] Error de red en intento ${attempt}:`, networkError);
          
          if (attempt < maxRetries) {
            console.log(`🔄 [DataValidator] Reintentando en ${attempt} segundos...`);
            await new Promise(resolve => setTimeout(resolve, attempt * 1000));
          }
        }
      }
      
      // Si llegamos aquí, todos los intentos fallaron
      const errorMessage = lastError?.message || 'Error desconocido en la consulta';
      
      if (options.showToast) {
        toast({
          title: "Error en la consulta",
          description: `${errorMessage} (${maxRetries} intentos)`,
          variant: "destructive"
        });
      }
      
      return { data: null, error: errorMessage };
      
    } catch (error: any) {
      console.error('❌ [DataValidator] Error crítico:', error);
      
      if (options.showToast) {
        toast({
          title: "Error crítico",
          description: error.message,
          variant: "destructive"
        });
      }
      
      return { data: null, error: error.message };
    }
  }, [validateQuery, toast]);

  /**
   * Valida y sincroniza datos entre diferentes fuentes
   */
  const validateDataSync = useCallback(async (
    localData: any[],
    remoteTableName: string,
    keyField: string = 'id'
  ): Promise<{
    isSync: boolean;
    localCount: number;
    remoteCount: number;
    missingInLocal: any[];
    missingInRemote: any[];
  }> => {
    console.log(`🔍 [DataValidator] Validando sincronización de ${remoteTableName}`);
    
    try {
      const { data: remoteData, error } = await executeValidatedQuery(
        remoteTableName,
        (table) => table.select(keyField),
        { operation: 'select', showToast: false }
      );
      
      if (error || !remoteData) {
        console.error('❌ [DataValidator] Error obteniendo datos remotos:', error);
        return {
          isSync: false,
          localCount: localData.length,
          remoteCount: 0,
          missingInLocal: [],
          missingInRemote: localData
        };
      }
      
      const remoteDataArray = Array.isArray(remoteData) ? remoteData : [remoteData];
      
      const localIds = new Set(localData.map(item => item[keyField]));
      const remoteIds = new Set(remoteDataArray.map((item: any) => item[keyField]));
      
      const missingInLocal = remoteDataArray.filter((item: any) => !localIds.has(item[keyField]));
      const missingInRemote = localData.filter(item => !remoteIds.has(item[keyField]));
      
      const isSync = missingInLocal.length === 0 && missingInRemote.length === 0;
      
      console.log(`📊 [DataValidator] Resultado de sincronización:`, {
        isSync,
        localCount: localData.length,
        remoteCount: remoteDataArray.length,
        missingInLocal: missingInLocal.length,
        missingInRemote: missingInRemote.length
      });
      
      return {
        isSync,
        localCount: localData.length,
        remoteCount: remoteDataArray.length,
        missingInLocal,
        missingInRemote
      };
      
    } catch (error: any) {
      console.error('❌ [DataValidator] Error en validación de sincronización:', error);
      return {
        isSync: false,
        localCount: localData.length,
        remoteCount: 0,
        missingInLocal: [],
        missingInRemote: localData
      };
    }
  }, [executeValidatedQuery]);

  // Verificar conectividad inicial y periódica
  useEffect(() => {
    validateConnectivity();
    
    // Verificar cada 30 segundos
    const interval = setInterval(validateConnectivity, 30000);
    
    return () => clearInterval(interval);
  }, [validateConnectivity]);

  // Escuchar cambios de autenticación
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(`🔐 [DataValidator] Cambio de autenticación: ${event}`);
      await validateConnectivity();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [validateConnectivity]);

  return {
    connectivity,
    isValidating,
    validateConnectivity,
    validateQuery,
    executeValidatedQuery,
    validateDataSync
  };
};