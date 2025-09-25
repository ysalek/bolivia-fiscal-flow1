import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useDataValidator } from '@/hooks/useDataValidator';

/**
 * Hook maestro unificado para productos - Consolida toda la funcionalidad
 * Este hook reemplaza a useSupabaseProductos, useProductosUnificado, useProductosValidated, etc.
 */

export interface CategoriaProducto {
  id: string;
  nombre: string;
  descripcion?: string;
  activo: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Producto {
  id: string;
  codigo: string;
  nombre: string;
  descripcion: string;
  categoria_id?: string;
  categoria: string;
  unidad_medida: string;
  precio_venta: number;
  precio_compra: number;
  costo_unitario: number;
  stock_actual: number;
  stock_minimo: number;
  codigo_sin?: string;
  activo: boolean;
  imagen_url?: string;
  created_at?: string;
  updated_at?: string;
  fechaCreacion?: string;
  fechaActualizacion?: string;
  // Alias para compatibilidad con código existente
  unidadMedida?: string;
  precioVenta?: number;
  precioCompra?: number;
  costoUnitario?: number;
  stockActual?: number;
  stockMinimo?: number;
  codigoSIN?: string;
  imagenUrl?: string;
}

export interface ProductosState {
  productos: Producto[];
  categorias: CategoriaProducto[];
  loading: boolean;
  error: string | null;
  lastSync: Date | null;
  syncCount: number;
}

/**
 * Hook maestro para gestión centralizada de productos
 */
export const useProductosMaster = () => {
  const [state, setState] = useState<ProductosState>({
    productos: [],
    categorias: [],
    loading: true,
    error: null,
    lastSync: null,
    syncCount: 0
  });
  
  const { toast } = useToast();
  const { 
    connectivity, 
    validateConnectivity, 
    executeValidatedQuery 
  } = useDataValidator();
  
  const loadingRef = useRef(false);
  const mountedRef = useRef(true);
  const cacheRef = useRef<Map<string, any>>(new Map());

  // Transformación unificada de productos
  const transformarProducto = useCallback((producto: any, categoriasMap: Map<string, string>): Producto => {
    const nombreCategoria = categoriasMap.get(producto.categoria_id) || 'General';
    
    const productoTransformado: Producto = {
      id: producto.id,
      codigo: producto.codigo,
      nombre: producto.nombre,
      descripcion: producto.descripcion || '',
      categoria_id: producto.categoria_id,
      categoria: nombreCategoria,
      unidad_medida: producto.unidad_medida || 'PZA',
      precio_venta: Number(producto.precio_venta) || 0,
      precio_compra: Number(producto.precio_compra) || 0,
      costo_unitario: Number(producto.costo_unitario) || 0,
      stock_actual: Number(producto.stock_actual) || 0,
      stock_minimo: Number(producto.stock_minimo) || 0,
      codigo_sin: producto.codigo_sin || '00000000',
      activo: Boolean(producto.activo),
      imagen_url: producto.imagen_url,
      created_at: producto.created_at,
      updated_at: producto.updated_at,
      fechaCreacion: producto.created_at?.split('T')[0] || new Date().toISOString().slice(0, 10),
      fechaActualizacion: producto.updated_at?.split('T')[0] || new Date().toISOString().slice(0, 10),
      // Alias para compatibilidad
      unidadMedida: producto.unidad_medida || 'PZA',
      precioVenta: Number(producto.precio_venta) || 0,
      precioCompra: Number(producto.precio_compra) || 0,
      costoUnitario: Number(producto.costo_unitario) || 0,
      stockActual: Number(producto.stock_actual) || 0,
      stockMinimo: Number(producto.stock_minimo) || 0,
      codigoSIN: producto.codigo_sin || '00000000',
      imagenUrl: producto.imagen_url
    };

    return productoTransformado;
  }, []);

  // Carga optimizada de datos con caché y validación
  const loadData = useCallback(async (force: boolean = false) => {
    const cacheKey = 'productos_categorias_data';
    const cachedData = cacheRef.current.get(cacheKey);
    const cacheExpiry = 5 * 60 * 1000; // 5 minutos
    
    // Verificar caché si no es forzado
    if (!force && cachedData && (Date.now() - cachedData.timestamp < cacheExpiry)) {
      console.log('📋 [ProductosMaster] Usando datos del caché');
      if (mountedRef.current) {
        setState(prev => ({
          ...prev,
          productos: cachedData.productos,
          categorias: cachedData.categorias,
          loading: false,
          error: null,
          lastSync: cachedData.timestamp,
          syncCount: prev.syncCount + 1
        }));
      }
      return;
    }

    if (loadingRef.current && !force) {
      console.log('🛑 [ProductosMaster] Carga ya en proceso...');
      return;
    }

    loadingRef.current = true;
    
    if (mountedRef.current) {
      setState(prev => ({ ...prev, loading: true, error: null }));
    }

    try {
      console.log('🚀 [ProductosMaster] Iniciando carga de datos...');
      
      await validateConnectivity();
      
      if (!connectivity.isAuthenticated) {
        throw new Error('Usuario no autenticado');
      }

      // Cargar categorías con validación
      const categoriasResult = await executeValidatedQuery(
        'categorias_productos',
        (table) => table.select('*').eq('user_id', connectivity.userId).order('nombre'),
        { operation: 'select', maxRetries: 3, showToast: false }
      );

      if (categoriasResult.error) {
        throw new Error(categoriasResult.error || 'Error cargando categorías');
      }

      // Cargar productos con validación
      const productosResult = await executeValidatedQuery(
        'productos',
        (table) => table.select('*').eq('user_id', connectivity.userId).order('codigo'),
        { operation: 'select', maxRetries: 3, showToast: false }
      );

      if (productosResult.error) {
        throw new Error(productosResult.error || 'Error cargando productos');
      }

      const categorias = (categoriasResult.data as CategoriaProducto[]) || [];
      const productos = (productosResult.data as any[]) || [];

      console.log('✅ [ProductosMaster] Datos cargados:', {
        categorias: categorias.length,
        productos: productos.length
      });

      // Transformar productos
      const categoriasMap = new Map(categorias.map((c: CategoriaProducto) => [c.id, c.nombre]));
      const productosTransformados = productos.map((producto: any) => 
        transformarProducto(producto, categoriasMap)
      );

      // Actualizar caché
      const timestamp = new Date();
      cacheRef.current.set(cacheKey, {
        productos: productosTransformados,
        categorias,
        timestamp: timestamp.getTime()
      });

      if (mountedRef.current) {
        setState(prev => ({
          ...prev,
          productos: productosTransformados,
          categorias: categorias,
          loading: false,
          error: null,
          lastSync: timestamp,
          syncCount: prev.syncCount + 1
        }));
      }

      console.log('✅ [ProductosMaster] Estado actualizado exitosamente');

    } catch (error: any) {
      console.error('❌ [ProductosMaster] Error cargando datos:', error);
      
      if (mountedRef.current) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: error.message,
          syncCount: prev.syncCount + 1
        }));
        
        toast({
          title: "Error al cargar productos",
          description: `${error.message} - Verificando conectividad`,
          variant: "destructive"
        });
      }
    } finally {
      loadingRef.current = false;
    }
  }, [connectivity, validateConnectivity, executeValidatedQuery, transformarProducto, toast]);

  // Crear producto con validación completa
  const crearProducto = async (productoData: Omit<Producto, 'id' | 'created_at' | 'updated_at' | 'categoria' | 'fechaCreacion' | 'fechaActualizacion'>) => {
    console.log('🆕 [ProductosMaster] Creando producto:', productoData);
    
    try {
      const dataForSupabase = {
        codigo: productoData.codigo,
        nombre: productoData.nombre,
        descripcion: productoData.descripcion,
        categoria_id: productoData.categoria_id,
        unidad_medida: productoData.unidad_medida,
        precio_venta: productoData.precio_venta,
        precio_compra: productoData.precio_compra,
        costo_unitario: productoData.costo_unitario,
        stock_actual: productoData.stock_actual,
        stock_minimo: productoData.stock_minimo,
        codigo_sin: productoData.codigo_sin,
        activo: productoData.activo,
        imagen_url: productoData.imagen_url,
        user_id: connectivity.userId
      };

      const result = await executeValidatedQuery(
        'productos',
        (table) => table.insert([dataForSupabase]).select().single(),
        { operation: 'insert', data: dataForSupabase }
      );

      if (result.error) {
        throw new Error(result.error || 'Error creando producto');
      }

      // Transformar y agregar al estado
      const categoriasMap = new Map(state.categorias.map(c => [c.id, c.nombre]));
      const productoTransformado = transformarProducto(result.data as any, categoriasMap);
      
      setState(prev => ({
        ...prev,
        productos: [...prev.productos, productoTransformado]
      }));

      // Limpiar caché
      cacheRef.current.clear();

      toast({
        title: "Producto creado",
        description: "El producto se ha registrado exitosamente",
      });

      return productoTransformado;
    } catch (error: any) {
      console.error('❌ [ProductosMaster] Error creando producto:', error);
      toast({
        title: "Error al crear producto",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }
  };

  // Actualizar stock con máxima validación y consistencia
  const actualizarStockProducto = async (productoId: string, cantidad: number, tipo: 'entrada' | 'salida') => {
    console.log('🔄 [ProductosMaster] Actualizando stock:', { productoId, cantidad, tipo });
    
    try {
      const producto = state.productos.find(p => p.id === productoId);
      if (!producto) {
        throw new Error('Producto no encontrado en el estado local');
      }

      const nuevoStock = tipo === 'entrada' 
        ? producto.stock_actual + cantidad 
        : producto.stock_actual - cantidad;

      if (nuevoStock < 0) {
        throw new Error(`Stock insuficiente. Disponible: ${producto.stock_actual}, requerido: ${cantidad}`);
      }

      // Actualizar en BD con validación
      const result = await executeValidatedQuery(
        'productos',
        (table) => table
          .update({ stock_actual: nuevoStock })
          .eq('id', productoId)
          .eq('user_id', connectivity.userId)
          .select()
          .single(),
        { operation: 'update', data: { stock_actual: nuevoStock } }
      );

      if (result.error) {
        throw new Error(result.error || 'Error actualizando stock en base de datos');
      }

      console.log('✅ [ProductosMaster] Stock actualizado en BD');

      // Actualizar estado local
      const categoriasMap = new Map(state.categorias.map(c => [c.id, c.nombre]));
      const productoActualizado = transformarProducto(result.data as any, categoriasMap);
      
      setState(prev => ({
        ...prev,
        productos: prev.productos.map(p => 
          p.id === productoId ? productoActualizado : p
        )
      }));

      // Limpiar caché para próximas cargas
      cacheRef.current.clear();

      // Crear registro de movimiento (sin fallar si hay error)
      try {
        await executeValidatedQuery(
          'movimientos_inventario',
          (table) => table.insert([{
            user_id: connectivity.userId,
            producto_id: productoId,
            fecha: new Date().toISOString().split('T')[0],
            tipo,
            cantidad,
            stock_anterior: producto.stock_actual,
            stock_actual: nuevoStock,
            observaciones: `Movimiento ${tipo} - Hook maestro`
          }]),
          { operation: 'insert' }
        );
      } catch (movError) {
        console.warn('⚠️ [ProductosMaster] Error registrando movimiento (no crítico):', movError);
      }

      // Alerta de stock bajo
      if (nuevoStock <= producto.stock_minimo && nuevoStock > 0) {
        toast({
          title: "Stock bajo",
          description: `${producto.nombre} tiene stock bajo (${nuevoStock} unidades)`,
          variant: "destructive"
        });
      }

      console.log('✅ [ProductosMaster] Stock actualizado exitosamente');
      return true;

    } catch (error: any) {
      console.error('❌ [ProductosMaster] Error actualizando stock:', error);
      toast({
        title: "Error al actualizar stock",
        description: error.message,
        variant: "destructive"
      });
      return false;
    }
  };

  // Generar código único
  const generarCodigoProducto = () => {
    const ultimoCodigo = state.productos.reduce((max, prod) => {
      const numero = parseInt(prod.codigo.replace(/\D/g, ''));
      return numero > max ? numero : max;
    }, 0);
    
    return `PROD${(ultimoCodigo + 1).toString().padStart(3, '0')}`;
  };

  // Refetch con limpieza de caché
  const refetch = useCallback(async () => {
    cacheRef.current.clear();
    await loadData(true);
  }, [loadData]);

  // Funciones de compatibilidad para migración gradual
  const obtenerProductos = () => state.productos;

  // Inicialización y cleanup
  useEffect(() => {
    console.log('🎯 [ProductosMaster] Inicializando hook maestro...');
    loadData();
    
    return () => {
      mountedRef.current = false;
      console.log('🧹 [ProductosMaster] Cleanup completado');
    };
  }, []);

  // Auto-reconexión en cambios de autenticación
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(`🔐 [ProductosMaster] Auth cambió: ${event}`);
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        cacheRef.current.clear();
        await loadData(true);
      } else if (event === 'SIGNED_OUT') {
        setState({
          productos: [],
          categorias: [],
          loading: false,
          error: null,
          lastSync: null,
          syncCount: 0
        });
        cacheRef.current.clear();
      }
    });

    return () => subscription.unsubscribe();
  }, [loadData]);

  return {
    // Estado
    productos: state.productos,
    categorias: state.categorias,
    loading: state.loading,
    error: state.error,
    connectivity,
    lastSync: state.lastSync,
    syncCount: state.syncCount,
    
    // Operaciones principales
    crearProducto,
    actualizarStockProducto,
    refetch,
    generarCodigoProducto,
    
    // Funciones de compatibilidad
    obtenerProductos,
    
    // Métricas adicionales
    metrics: {
      totalProductos: state.productos.length,
      productosActivos: state.productos.filter(p => p.activo).length,
      stockBajo: state.productos.filter(p => p.stock_actual <= p.stock_minimo).length,
      totalCategorias: state.categorias.length
    }
  };
};