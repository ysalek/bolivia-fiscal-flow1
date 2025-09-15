import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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

export const useProductosUnificado = () => {
  console.log('🔧 useProductosUnificado inicializado');
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<CategoriaProducto[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);
  const { toast } = useToast();
  
  console.log('📊 Estado actual:', { productos: productos.length, loading, dataLoaded });

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

  // Función principal de carga de datos
  const loadData = useCallback(async () => {
    console.log('🔍 loadData llamado - dataLoaded:', dataLoaded, 'loading:', loading);
    if (dataLoaded || loading) {
      console.log('🛑 Saliendo temprano - dataLoaded:', dataLoaded, 'loading:', loading);
      return;
    }
    
    setLoading(true);
    
    try {
      console.log('🔄 Iniciando carga de productos...');
      console.log('🔍 Estado actual - dataLoaded:', dataLoaded, 'loading:', loading);
      
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        console.log('❌ Usuario no autenticado');
        setProductos([]);
        setCategorias([]);
        setLoading(false);
        return;
      }

      console.log('✅ Usuario autenticado:', user.id);
      console.log('🔄 Ejecutando consultas a Supabase...');
      
      // Cargar categorías y productos en paralelo
      const [categoriasResult, productosResult] = await Promise.all([
        supabase
          .from('categorias_productos')
          .select('*')
          .eq('user_id', user.id)
          .order('nombre'),
        supabase
          .from('productos')
          .select('*')
          .eq('user_id', user.id)
          .order('codigo')
      ]);

      if (categoriasResult.error) {
        console.error('❌ Error categorías:', categoriasResult.error);
        throw categoriasResult.error;
      }

      if (productosResult.error) {
        console.error('❌ Error productos:', productosResult.error);
        throw productosResult.error;
      }

      const categoriasData = categoriasResult.data || [];
      const productosData = productosResult.data || [];
      
      console.log('📁 Categorías cargadas:', categoriasData.length);
      console.log('📦 Productos encontrados:', productosData.length);
      console.log('🔍 Primeros 3 productos:', productosData.slice(0, 3).map(p => ({ id: p.id, codigo: p.codigo, nombre: p.nombre })));

      // Transformar productos
      const categoriasMap = new Map(categoriasData.map(c => [c.id, c.nombre]));
      const productosTransformados = productosData.map(producto => 
        transformarProducto(producto, categoriasMap)
      );

      setCategorias(categoriasData);
      setProductos(productosTransformados);
      setDataLoaded(true);
      
      console.log('✅ Carga completa:', {
        productos: productosTransformados.length,
        categorias: categoriasData.length
      });

    } catch (error: any) {
      console.error('❌ Error cargando datos:', error);
      toast({
        title: "Error al cargar productos",
        description: error.message,
        variant: "destructive"
      });
      setProductos([]);
      setCategorias([]);
    } finally {
      setLoading(false);
    }
  }, [dataLoaded, loading, toast, transformarProducto]);

  // Crear categoría
  const crearCategoria = async (categoriaData: Omit<CategoriaProducto, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuario no autenticado');

      const { data, error } = await supabase
        .from('categorias_productos')
        .insert([{
          ...categoriaData,
          user_id: user.id
        }])
        .select()
        .single();

      if (error) throw error;

      setCategorias(prev => [...prev, data]);
      
      toast({
        title: "Categoría creada",
        description: "La categoría se ha registrado exitosamente",
      });

      return data;
    } catch (error: any) {
      toast({
        title: "Error al crear categoría",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }
  };

  // Crear producto
  const crearProducto = async (productoData: Omit<Producto, 'id' | 'created_at' | 'updated_at' | 'categoria' | 'fechaCreacion' | 'fechaActualizacion'>) => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Usuario no autenticado');
      }

      // Limpiar datos para Supabase
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
        user_id: user.id
      };
      
      const { data, error } = await supabase
        .from('productos')
        .insert([dataForSupabase])
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Transformar y agregar a la lista
      const categoriasMap = new Map(categorias.map(c => [c.id, c.nombre]));
      const productoTransformado = transformarProducto(data, categoriasMap);
      setProductos(prev => [...prev, productoTransformado]);
      
      toast({
        title: "Producto creado",
        description: "El producto se ha registrado exitosamente",
      });

      return productoTransformado;
    } catch (error: any) {
      toast({
        title: "Error al crear producto",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }
  };

  // Actualizar producto
  const actualizarProducto = async (productoId: string, productoData: Partial<Producto>) => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Usuario no autenticado');
      }

      // Limpiar datos para Supabase
      const dataForSupabase: any = {};
      if (productoData.codigo !== undefined) dataForSupabase.codigo = productoData.codigo;
      if (productoData.nombre !== undefined) dataForSupabase.nombre = productoData.nombre;
      if (productoData.descripcion !== undefined) dataForSupabase.descripcion = productoData.descripcion;
      if (productoData.categoria_id !== undefined) dataForSupabase.categoria_id = productoData.categoria_id;
      if (productoData.unidad_medida !== undefined) dataForSupabase.unidad_medida = productoData.unidad_medida;
      if (productoData.precio_venta !== undefined) dataForSupabase.precio_venta = productoData.precio_venta;
      if (productoData.precio_compra !== undefined) dataForSupabase.precio_compra = productoData.precio_compra;
      if (productoData.costo_unitario !== undefined) dataForSupabase.costo_unitario = productoData.costo_unitario;
      if (productoData.stock_actual !== undefined) dataForSupabase.stock_actual = productoData.stock_actual;
      if (productoData.stock_minimo !== undefined) dataForSupabase.stock_minimo = productoData.stock_minimo;
      if (productoData.codigo_sin !== undefined) dataForSupabase.codigo_sin = productoData.codigo_sin;
      if (productoData.activo !== undefined) dataForSupabase.activo = productoData.activo;
      if (productoData.imagen_url !== undefined) dataForSupabase.imagen_url = productoData.imagen_url;
      
      const { data, error } = await supabase
        .from('productos')
        .update(dataForSupabase)
        .eq('id', productoId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Transformar y actualizar en la lista
      const categoriasMap = new Map(categorias.map(c => [c.id, c.nombre]));
      const productoTransformado = transformarProducto(data, categoriasMap);
      
      setProductos(prev => 
        prev.map(p => p.id === productoId ? productoTransformado : p)
      );
      
      toast({
        title: "Producto actualizado",
        description: "Los cambios se han guardado exitosamente",
      });

      return productoTransformado;
    } catch (error: any) {
      toast({
        title: "Error al actualizar producto",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }
  };

  // Actualizar stock de producto
  const actualizarStockProducto = async (productoId: string, cantidad: number, tipo: 'entrada' | 'salida') => {
    try {
      const producto = productos.find(p => p.id === productoId);
      if (!producto) throw new Error('Producto no encontrado');

      const nuevoStock = tipo === 'entrada' 
        ? producto.stock_actual + cantidad 
        : producto.stock_actual - cantidad;

      if (nuevoStock < 0) {
        throw new Error('Stock insuficiente');
      }

      const { data, error } = await supabase
        .from('productos')
        .update({ stock_actual: nuevoStock })
        .eq('id', productoId)
        .select()
        .single();

      if (error) throw error;

      // Actualizar en la lista local
      const categoriasMap = new Map(categorias.map(c => [c.id, c.nombre]));
      const productoTransformado = transformarProducto(data, categoriasMap);
      
      setProductos(prev => 
        prev.map(p => p.id === productoId ? productoTransformado : p)
      );

      // Crear movimiento de inventario
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('movimientos_inventario')
          .insert([{
            user_id: user.id,
            producto_id: productoId,
            fecha: new Date().toISOString().split('T')[0],
            tipo,
            cantidad,
            stock_anterior: producto.stock_actual,
            stock_actual: nuevoStock,
            observaciones: `Movimiento ${tipo} manual`
          }]);
      }

      // Verificar stock bajo
      if (nuevoStock <= producto.stock_minimo && nuevoStock > 0) {
        toast({
          title: "Stock bajo",
          description: `El producto ${producto.nombre} tiene stock bajo (${nuevoStock} unidades)`,
          variant: "destructive"
        });
      }

      return true;
    } catch (error: any) {
      toast({
        title: "Error al actualizar stock",
        description: error.message,
        variant: "destructive"
      });
      return false;
    }
  };

  // Generar código de producto
  const generarCodigoProducto = () => {
    const ultimoCodigo = productos.reduce((max, prod) => {
      const numero = parseInt(prod.codigo.replace('PROD', ''));
      return numero > max ? numero : max;
    }, 0);
    
    return `PROD${(ultimoCodigo + 1).toString().padStart(3, '0')}`;
  };

  // Función de compatibilidad para useProductos
  const obtenerProductos = () => productos;

  // Función de refetch
  const refetch = useCallback(async () => {
    setDataLoaded(false);
    await loadData();
  }, [loadData]);

  // Effect para cargar datos inicial
  useEffect(() => {
    console.log('🎯 useEffect ejecutándose - dataLoaded:', dataLoaded);
    if (!dataLoaded) {
      console.log('🚀 Llamando loadData desde useEffect');
      loadData();
    }
  }, [loadData, dataLoaded]);

  return {
    productos,
    categorias,
    loading,
    crearCategoria,
    crearProducto,
    actualizarProducto,
    actualizarStockProducto,
    generarCodigoProducto,
    refetch,
    // Función de compatibilidad
    obtenerProductos
  };
};