import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ClienteSupabase {
  id: string;
  nombre: string;
  nit: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  activo: boolean;
  created_at?: string;
  updated_at?: string;
}

export const useSupabaseClientes = () => {
  const [clientes, setClientes] = useState<ClienteSupabase[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Cargar clientes
  const fetchClientes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .order('nombre');

      if (error) throw error;
      setClientes(data || []);
    } catch (error: any) {
      toast({
        title: "Error al cargar clientes",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Crear cliente
  const crearCliente = async (clienteData: Omit<ClienteSupabase, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuario no autenticado');

      const { data, error } = await supabase
        .from('clientes')
        .insert([{
          ...clienteData,
          user_id: user.id
        }])
        .select()
        .single();

      if (error) throw error;

      setClientes(prev => [...prev, data]);
      
      toast({
        title: "Cliente creado",
        description: "El cliente se ha registrado exitosamente",
      });

      return data;
    } catch (error: any) {
      toast({
        title: "Error al crear cliente",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }
  };

  // Actualizar cliente
  const actualizarCliente = async (id: string, clienteData: Partial<ClienteSupabase>) => {
    try {
      const { data, error } = await supabase
        .from('clientes')
        .update(clienteData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setClientes(prev => 
        prev.map(cliente => cliente.id === id ? { ...cliente, ...data } : cliente)
      );

      toast({
        title: "Cliente actualizado",
        description: "Los datos del cliente se han actualizado exitosamente",
      });

      return data;
    } catch (error: any) {
      toast({
        title: "Error al actualizar cliente",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }
  };

  // Eliminar cliente
  const eliminarCliente = async (id: string) => {
    try {
      const { error } = await supabase
        .from('clientes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setClientes(prev => prev.filter(cliente => cliente.id !== id));

      toast({
        title: "Cliente eliminado",
        description: "El cliente se ha eliminado exitosamente",
      });
    } catch (error: any) {
      toast({
        title: "Error al eliminar cliente",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  return {
    clientes,
    loading,
    crearCliente,
    actualizarCliente,
    eliminarCliente,
    refetch: fetchClientes
  };
};