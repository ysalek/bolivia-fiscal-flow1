import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface CategoriaProductoSupabase {
  id: string;
  nombre: string;
  descripcion?: string;
  activo: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ProductoSupabase {
  id: string;
  codigo: string;
  nombre: string;
  descripcion?: string;
  categoria_id?: string;
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
}

export const useSupabaseProductos = () => {
  const [productos, setProductos] = useState<ProductoSupabase[]>([]);
  const [categorias, setCategorias] = useState<CategoriaProductoSupabase[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Cargar productos y categorías - función simplificada
  const fetchData = async () => {
    console.log('🚀 HOOK - fetchData iniciado');
    console.log('🚀 HOOK - Estado inicial:', { loading, productos: productos.length, categorias: categorias.length });
    
    try {
      setLoading(true);
      console.log('⏳ HOOK - setLoading(true) ejecutado');
      
      // Obtener usuario autenticado
      console.log('🔍 HOOK - Obteniendo usuario autenticado...');
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      console.log('🔍 HOOK - Respuesta de auth.getUser():', { user: user?.id, error: userError });

      if (!user) {
        console.log('❌ HOOK - No hay usuario autenticado');
        setProductos([]);
        setCategorias([]);
        setLoading(false);
        return;
      }

      if (userError) {
        console.error('❌ HOOK - Error de autenticación:', userError);
        throw userError;
      }

      console.log('👤 HOOK - Usuario autenticado:', user.id);
      console.log('📤 HOOK - Ejecutando consultas a Supabase...');
      
      const [productosRes, categoriasRes] = await Promise.all([
        supabase.from('productos').select('*').eq('user_id', user.id).order('codigo'),
        supabase.from('categorias_productos').select('*').eq('user_id', user.id).order('nombre')
      ]);

      console.log('📦 HOOK - Productos response:', productosRes);
      console.log('📂 HOOK - Categorías response:', categoriasRes);

      if (productosRes.error) {
        throw productosRes.error;
      }
      if (categoriasRes.error) {
        throw categoriasRes.error;
      }

      setProductos(productosRes.data || []);
      setCategorias(categoriasRes.data || []);
      console.log('✅ HOOK - Datos cargados exitosamente:', { 
        productos: productosRes.data?.length || 0, 
        categorias: categoriasRes.data?.length || 0 
      });
    } catch (error: any) {
      console.error('❌ HOOK - Error cargando datos:', error);
      toast({
        title: "Error al cargar datos",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      console.log('🏁 HOOK - fetchData finalizado, loading = false');
    }
  };

  // Crear categoría
  const crearCategoria = async (categoriaData: Omit<CategoriaProductoSupabase, 'id' | 'created_at' | 'updated_at'>) => {
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
  const crearProducto = async (productoData: Omit<ProductoSupabase, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      console.log('🆕 HOOK - Iniciando creación de producto:', productoData);
      
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      console.log('🔍 HOOK - Usuario para crear:', { userId: user?.id, error: userError });
      
      if (!user) {
        console.error('❌ HOOK - Usuario no autenticado para crear');
        throw new Error('Usuario no autenticado');
      }

      const dataWithUser = {
        ...productoData,
        user_id: user.id
      };
      
      console.log('📤 HOOK - Datos a insertar:', dataWithUser);
      
      const { data, error } = await supabase
        .from('productos')
        .insert([dataWithUser])
        .select()
        .single();

      console.log('📥 HOOK - Respuesta crear:', { data, error });

      if (error) {
        console.error('❌ HOOK - Error crear:', error);
        throw error;
      }

      console.log('✅ HOOK - Producto creado exitosamente:', data);
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
  const actualizarProducto = async (productoId: string, productoData: Partial<ProductoSupabase>) => {
    try {
      console.log('🔄 HOOK - Iniciando actualización de producto:', { productoId, productoData });
      
      // Verificar usuario autenticado
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      console.log('🔍 HOOK - Usuario actual:', { userId: user?.id, error: userError });
      
      if (!user) {
        console.error('❌ HOOK - Usuario no autenticado');
        throw new Error('Usuario no autenticado');
      }
      
      console.log('📤 HOOK - Ejecutando UPDATE en Supabase...');
      const { data, error } = await supabase
        .from('productos')
        .update(productoData)
        .eq('id', productoId)
        .eq('user_id', user.id) // Agregar verificación explícita del user_id
        .select()
        .single();

      console.log('📥 HOOK - Respuesta de Supabase:', { data, error });

      if (error) {
        console.error('❌ HOOK - Error de Supabase:', error);
        throw error;
      }

      console.log('✅ HOOK - Producto actualizado exitosamente:', data);
      
      setProductos(prev => 
        prev.map(p => p.id === productoId ? { ...p, ...data } : p)
      );
      
      toast({
        title: "Producto actualizado",
        description: "Los cambios se han guardado exitosamente",
      });

      return data;
    } catch (error: any) {
      console.error('❌ Error completo en actualizarProducto:', error);
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

      setProductos(prev => 
        prev.map(p => p.id === productoId ? { ...p, stock_actual: nuevoStock } : p)
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

  useEffect(() => {
    console.log('🚀 HOOK - useEffect ejecutado en useSupabaseProductos');
    console.log('🚀 HOOK - Iniciando fetchData...');
    fetchData();
    
    // Escuchar cambios en la autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 HOOK - Auth state change:', event, session?.user?.id);
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        console.log('✅ HOOK - Ejecutando fetchData por cambio de auth');
        fetchData();
      } else if (event === 'SIGNED_OUT') {
        console.log('🚪 HOOK - Usuario deslogueado, limpiando datos');
        setProductos([]);
        setCategorias([]);
        setLoading(false);
      }
    });

    return () => {
      console.log('🧹 HOOK - Cleanup: desuscribiendo de auth changes');
      subscription.unsubscribe();
    };
  }, []);

  return {
    productos,
    categorias,
    loading,
    crearCategoria,
    crearProducto,
    actualizarProducto,
    actualizarStockProducto,
    generarCodigoProducto,
    refetch: fetchData
  };
};