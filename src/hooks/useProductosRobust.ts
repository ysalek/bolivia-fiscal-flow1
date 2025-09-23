import { useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useDataValidator } from './useDataValidator';

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
  // Alias para compatibilidad
  unidadMedida?: string;
  precioVenta?: number;
  precioCompra?: number;
  costoUnitario?: number;
  stockActual?: number;
  stockMinimo?: number;
  codigoSIN?: string;
  imagenUrl?: string;
}

/**
 * Hook robusto para manejo de productos con validación centralizada
 * Resuelve problemas de conectividad y sincronización entre módulos
 */
export const useProductosRobust = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<CategoriaProducto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  
  const { toast } = useToast();
  const { connectivity, validateConnectivity, executeValidatedQuery, validateDataSync } = useDataValidator();
  
  // Ref para evitar múltiples cargas simultáneas
  const loadingRef = useRef(false);
  const mountedRef = useRef(true);

  // Función para transformar producto de Supabase al formato unificado
  const transformarProducto = useCallback((producto: any, categoriasMap: Map<string, string>): Producto => {
    const nombreCategoria = categoriasMap.get(producto.categoria_id) || 'General';
    
    return {
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
  }, []);

  // Función principal de carga de datos con validación robusta
  const loadData = useCallback(async (force: boolean = false) => {
    console.log('🚀 [ProductosRobust] Iniciando carga de datos...', { force, loading: loadingRef.current });
    
    // Evitar múltiples cargas simultáneas
    if (loadingRef.current && !force) {
      console.log('🛑 [ProductosRobust] Carga ya en proceso, saltando...');
      return;
    }
    
    loadingRef.current = true;
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔍 [ProductosRobust] Verificando conectividad...');
      
      // Verificar conectividad antes de proceder
      const connectivityStatus = await validateConnectivity();
      
      if (!connectivityStatus.isAuthenticated) {
        throw new Error('Usuario no autenticado');
      }
      
      console.log('✅ [ProductosRobust] Conectividad verificada, cargando datos...');
      
      // Cargar categorías con validación
      const categoriasResult = await executeValidatedQuery<CategoriaProducto[]>(
        'categorias_productos',
        (table) => table
          .select('*')
          .eq('user_id', connectivityStatus.userId)
          .order('nombre'),
        { operation: 'select' }
      );
      
      if (categoriasResult.error) {
        throw new Error(`Error cargando categorías: ${categoriasResult.error}`);
      }
      
      // Cargar productos con validación
      const productosResult = await executeValidatedQuery<any[]>(
        'productos',
        (table) => table
          .select('*')
          .eq('user_id', connectivityStatus.userId)
          .order('codigo'),
        { operation: 'select' }
      );
      
      if (productosResult.error) {
        throw new Error(`Error cargando productos: ${productosResult.error}`);
      }
      
      const categoriasData = categoriasResult.data || [];
      const productosData = productosResult.data || [];
      
      console.log('📊 [ProductosRobust] Datos cargados:', {
        categorias: categoriasData.length,
        productos: productosData.length
      });
      
      // Transformar productos
      const categoriasMap = new Map(categoriasData.map(c => [c.id, c.nombre]));
      const productosTransformados = productosData.map(producto => 
        transformarProducto(producto, categoriasMap)
      );
      
      // Solo actualizar estado si el componente sigue montado
      if (mountedRef.current) {
        setCategorias(categoriasData);
        setProductos(productosTransformados);
        setLastSync(new Date());
        setError(null);
        
        console.log('✅ [ProductosRobust] Datos sincronizados exitosamente:', {
          productos: productosTransformados.length,
          categorias: categoriasData.length,
          timestamp: new Date().toISOString()
        });
      }
      
    } catch (error: any) {
      console.error('❌ [ProductosRobust] Error cargando datos:', error);
      
      if (mountedRef.current) {
        setError(error.message);
        toast({
          title: "Error al cargar productos",
          description: error.message,
          variant: "destructive"
        });
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
      loadingRef.current = false;
    }
  }, [validateConnectivity, executeValidatedQuery, transformarProducto, toast]);

  // Crear producto con validación
  const crearProducto = async (productoData: Omit<Producto, 'id' | 'created_at' | 'updated_at' | 'categoria' | 'fechaCreacion' | 'fechaActualizacion'>) => {
    console.log('🆕 [ProductosRobust] Creando producto:', productoData);
    
    try {
      if (!connectivity.isAuthenticated) {
        throw new Error('Usuario no autenticado');
      }

      // Preparar datos para Supabase
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
      
      const result = await executeValidatedQuery<any>(
        'productos',
        (table) => table
          .insert([dataForSupabase])
          .select()
          .single(),
        { operation: 'insert', data: dataForSupabase }
      );

      if (result.error) {
        throw new Error(result.error);
      }

      // Transformar y agregar a la lista
      const categoriasMap = new Map(categorias.map(c => [c.id, c.nombre]));
      const productoTransformado = transformarProducto(result.data, categoriasMap);
      
      setProductos(prev => [...prev, productoTransformado]);
      
      toast({
        title: "Producto creado",
        description: "El producto se ha registrado exitosamente",
      });

      console.log('✅ [ProductosRobust] Producto creado exitosamente:', productoTransformado);
      return productoTransformado;
    } catch (error: any) {
      console.error('❌ [ProductosRobust] Error creando producto:', error);
      toast({
        title: "Error al crear producto",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }
  };

  // Actualizar stock con validación robusta
  const actualizarStockProducto = async (productoId: string, cantidad: number, tipo: 'entrada' | 'salida') => {
    console.log('🔄 [ProductosRobust] Actualizando stock:', { productoId, cantidad, tipo });
    
    try {
      if (!connectivity.isAuthenticated) {
        throw new Error('Usuario no autenticado');
      }

      const producto = productos.find(p => p.id === productoId);
      if (!producto) {
        throw new Error('Producto no encontrado en la lista local');
      }

      const nuevoStock = tipo === 'entrada' 
        ? producto.stock_actual + cantidad 
        : producto.stock_actual - cantidad;

      if (nuevoStock < 0) {
        throw new Error('Stock insuficiente');
      }

      console.log('📊 [ProductosRobust] Calculando stock:', {
        stockAnterior: producto.stock_actual,
        cantidad,
        tipo,
        nuevoStock
      });

      // Actualizar en Supabase con validación
      const updateResult = await executeValidatedQuery<any>(
        'productos',
        (table) => table
          .update({ stock_actual: nuevoStock })
          .eq('id', productoId)
          .eq('user_id', connectivity.userId)
          .select()
          .single(),
        { 
          operation: 'update',
          data: { stock_actual: nuevoStock }
        }
      );

      if (updateResult.error) {
        throw new Error(`Error actualizando stock: ${updateResult.error}`);
      }

      console.log('✅ [ProductosRobust] Stock actualizado en Supabase:', updateResult.data);

      // Actualizar en la lista local
      const categoriasMap = new Map(categorias.map(c => [c.id, c.nombre]));
      const productoTransformado = transformarProducto(updateResult.data, categoriasMap);
      
      setProductos(prev => 
        prev.map(p => p.id === productoId ? productoTransformado : p)
      );

      // Crear movimiento de inventario
      const movimientoResult = await executeValidatedQuery(
        'movimientos_inventario',
        (table) => table.insert([{
          user_id: connectivity.userId,
          producto_id: productoId,
          fecha: new Date().toISOString().split('T')[0],
          tipo,
          cantidad,
          stock_anterior: producto.stock_actual,
          stock_actual: nuevoStock,
          observaciones: `Movimiento ${tipo} por facturación - Sistema robusto`
        }]),
        { 
          operation: 'insert',
          showToast: false // No mostrar toast para movimientos
        }
      );

      if (movimientoResult.error) {
        console.warn('⚠️ [ProductosRobust] Error creando movimiento de inventario:', movimientoResult.error);
        // No lanzar error para no cancelar la operación principal
      }

      // Verificar stock bajo
      if (nuevoStock <= producto.stock_minimo && nuevoStock > 0) {
        toast({
          title: "Stock bajo",
          description: `El producto ${producto.nombre} tiene stock bajo (${nuevoStock} unidades)`,
          variant: "destructive"
        });
      }

      console.log('✅ [ProductosRobust] Stock actualizado exitosamente');
      return true;
    } catch (error: any) {
      console.error('❌ [ProductosRobust] Error actualizando stock:', error);
      toast({
        title: "Error al actualizar stock",
        description: error.message,
        variant: "destructive"
      });
      return false;
    }
  };

  // Validar sincronización
  const validarSincronizacion = useCallback(async () => {
    console.log('🔍 [ProductosRobust] Validando sincronización...');
    
    const syncResult = await validateDataSync(productos, 'productos');
    
    if (!syncResult.isSync) {
      console.warn('⚠️ [ProductosRobust] Datos desincronizados:', syncResult);
      
      toast({
        title: "Datos desincronizados",
        description: `Local: ${syncResult.localCount}, Remoto: ${syncResult.remoteCount}. Se recomienda actualizar.`,
        variant: "destructive"
      });
      
      return false;
    }
    
    console.log('✅ [ProductosRobust] Datos sincronizados correctamente');
    return true;
  }, [productos, validateDataSync, toast]);

  // Generar código de producto
  const generarCodigoProducto = () => {
    const ultimoCodigo = productos.reduce((max, prod) => {
      const numero = parseInt(prod.codigo.replace(/\D/g, ''));
      return numero > max ? numero : max;
    }, 0);
    
    return `PROD${(ultimoCodigo + 1).toString().padStart(3, '0')}`;
  };

  // Función de refetch
  const refetch = useCallback(async () => {
    await loadData(true);
  }, [loadData]);

  // Efecto de inicialización
  useEffect(() => {
    console.log('🎯 [ProductosRobust] Inicializando hook...');
    loadData();
    
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Efecto para responder a cambios de conectividad
  useEffect(() => {
    if (connectivity.isAuthenticated && !loading && productos.length === 0) {
      console.log('🔄 [ProductosRobust] Conectividad restaurada, recargando datos...');
      loadData();
    }
  }, [connectivity.isAuthenticated]);

  // Auto-sincronización periódica
  useEffect(() => {
    if (productos.length > 0) {
      const interval = setInterval(() => {
        validarSincronizacion();
      }, 60000); // Cada minuto
      
      return () => clearInterval(interval);
    }
  }, [productos.length, validarSincronizacion]);

  return {
    productos,
    categorias,
    loading,
    error,
    connectivity,
    lastSync,
    crearProducto,
    actualizarStockProducto,
    generarCodigoProducto,
    validarSincronizacion,
    refetch,
    // Función de compatibilidad
    obtenerProductos: () => productos
  };
};