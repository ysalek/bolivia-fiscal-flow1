import { useState, useEffect } from 'react';
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

  // Cargar productos y categorías
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Verificar autenticación antes de cargar datos
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      console.log('🔍 Hook productos - Verificando usuario:', user ? user.id : 'NO AUTENTICADO');
      console.log('🔍 Hook productos - Error usuario:', userError);
      
      if (!user) {
        console.warn('⚠️ Hook productos - No hay usuario autenticado');
        
        // Intentar obtener sesión actual
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        console.log('🔍 Hook productos - Verificando sesión:', !!session, sessionError);
        
        if (!session) {
          setProductos([]);
          setCategorias([]);
          setLoading(false);
          return;
        }
      }
      
      const [productosRes, categoriasRes] = await Promise.all([
        supabase.from('productos').select('*').order('codigo'),
        supabase.from('categorias_productos').select('*').order('nombre')
      ]);

      if (productosRes.error) {
        console.error('❌ Error cargando productos:', productosRes.error);
        throw productosRes.error;
      }
      if (categoriasRes.error) {
        console.error('❌ Error cargando categorías:', categoriasRes.error);
        throw categoriasRes.error;
      }

      console.log('📦 Productos cargados:', productosRes.data?.length || 0);
      console.log('🏷️ Categorías cargadas:', categoriasRes.data?.length || 0);

      setProductos(productosRes.data || []);
      setCategorias(categoriasRes.data || []);
    } catch (error: any) {
      console.error('❌ Error general en fetchData:', error);
      toast({
        title: "Error al cargar datos",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuario no autenticado');

      const { data, error } = await supabase
        .from('productos')
        .insert([{
          ...productoData,
          user_id: user.id
        }])
        .select()
        .single();

      if (error) throw error;

      setProductos(prev => [...prev, data]);
      
      toast({
        title: "Producto creado",
        description: "El producto se ha registrado exitosamente",
      });

      return data;
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
      console.log('🔄 Actualizando producto:', productoId, productoData);
      
      // Verificar usuario autenticado
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Usuario no autenticado');
      }
      
      const { data, error } = await supabase
        .from('productos')
        .update(productoData)
        .eq('id', productoId)
        .select()
        .single();

      if (error) {
        console.error('❌ Error actualizando producto:', error);
        throw error;
      }

      console.log('✅ Producto actualizado exitosamente:', data);
      
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
    fetchData();
    
    // Escuchar cambios en la autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Hook productos - cambio de auth:', event, !!session);
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        console.log('✅ Hook productos - recargando datos después de auth');
        await fetchData();
      } else if (event === 'SIGNED_OUT') {
        console.log('🚪 Hook productos - usuario deslogueado, limpiando datos');
        setProductos([]);
        setCategorias([]);
      }
    });

    return () => subscription.unsubscribe();
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