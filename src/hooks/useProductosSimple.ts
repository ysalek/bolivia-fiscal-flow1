import { useState, useEffect } from 'react';
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
}

export const useProductosSimple = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<CategoriaProducto[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Función para transformar producto de Supabase al formato esperado
  const transformarProducto = (producto: any, categoriasMap: Map<string, string>): Producto => {
    const nombreCategoria = categoriasMap.get(producto.categoria_id) || 'General';
    
    return {
      id: producto.id,
      codigo: producto.codigo,
      nombre: producto.nombre,
      descripcion: producto.descripcion || '',
      categoria_id: producto.categoria_id,
      categoria: nombreCategoria,
      unidad_medida: producto.unidad_medida,
      precio_venta: producto.precio_venta,
      precio_compra: producto.precio_compra,
      costo_unitario: producto.costo_unitario,
      stock_actual: producto.stock_actual,
      stock_minimo: producto.stock_minimo,
      codigo_sin: producto.codigo_sin || '00000000',
      activo: producto.activo,
      imagen_url: producto.imagen_url,
      created_at: producto.created_at,
      updated_at: producto.updated_at
    };
  };

  // Cargar datos
  const fetchData = async () => {
    if (loading) return;
    
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setProductos([]);
        setCategorias([]);
        return;
      }
      
      const [productosRes, categoriasRes] = await Promise.all([
        supabase.from('productos').select('*').eq('user_id', user.id).order('codigo'),
        supabase.from('categorias_productos').select('*').eq('user_id', user.id).order('nombre')
      ]);

      if (productosRes.error) throw productosRes.error;
      if (categoriasRes.error) throw categoriasRes.error;

      const categoriasData = categoriasRes.data || [];
      const categoriasMap = new Map(categoriasData.map(c => [c.id, c.nombre]));
      
      const productosTransformados = (productosRes.data || []).map(producto => 
        transformarProducto(producto, categoriasMap)
      );

      setProductos(productosTransformados);
      setCategorias(categoriasData);
    } catch (error: any) {
      console.error('Error cargando datos:', error);
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
  const crearProducto = async (productoData: Omit<Producto, 'id' | 'created_at' | 'updated_at' | 'categoria'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuario no autenticado');

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

      if (error) throw error;

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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuario no autenticado');

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

      if (error) throw error;

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
  }, []);

  return {
    productos,
    categorias,
    loading,
    crearCategoria,
    crearProducto,
    actualizarProducto,
    generarCodigoProducto,
    refetch: fetchData
  };
};