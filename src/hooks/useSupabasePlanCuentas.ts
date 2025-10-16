import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface CuentaContable {
  id?: string;
  codigo: string;
  nombre: string;
  tipo: string;
  naturaleza: string;
  nivel?: number;
  cuenta_padre?: string;
  saldo?: number;
  activa?: boolean;
}

export const useSupabasePlanCuentas = () => {
  const [planCuentas, setPlanCuentas] = useState<CuentaContable[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchPlanCuentas = async () => {
    try {
      console.log('📊 Fetching plan cuentas...');
      const { data, error } = await supabase
        .from('plan_cuentas')
        .select('*')
        .order('codigo', { ascending: true });

      if (error) {
        console.error('❌ Error from Supabase:', error);
        throw error;
      }
      
      console.log('✅ Plan cuentas loaded:', data?.length || 0, 'accounts');
      setPlanCuentas(data || []);
    } catch (error) {
      console.error('❌ Error fetching plan cuentas:', error);
      toast({
        title: "Error",
        description: "No se pudo cargar el plan de cuentas",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createCuenta = async (cuenta: Omit<CuentaContable, 'id'>) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Usuario no autenticado');

      const { data, error } = await supabase
        .from('plan_cuentas')
        .insert([{ ...cuenta, user_id: user.user.id }])
        .select()
        .single();

      if (error) throw error;
      
      setPlanCuentas(prev => [...prev, data].sort((a, b) => a.codigo.localeCompare(b.codigo)));
      toast({
        title: "Éxito",
        description: "Cuenta creada correctamente"
      });
      
      return data;
    } catch (error) {
      console.error('Error creating cuenta:', error);
      toast({
        title: "Error",
        description: "No se pudo crear la cuenta",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateCuenta = async (id: string, updates: Partial<CuentaContable>) => {
    try {
      const { data, error } = await supabase
        .from('plan_cuentas')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setPlanCuentas(prev => prev.map(item => 
        item.id === id ? { ...item, ...data } : item
      ));
      
      toast({
        title: "Éxito",
        description: "Cuenta actualizada correctamente"
      });
      
      return data;
    } catch (error) {
      console.error('Error updating cuenta:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la cuenta",
        variant: "destructive"
      });
      throw error;
    }
  };

  const deleteCuenta = async (id: string) => {
    try {
      const { error } = await supabase
        .from('plan_cuentas')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setPlanCuentas(prev => prev.filter(item => item.id !== id));
      toast({
        title: "Éxito",
        description: "Cuenta eliminada correctamente"
      });
    } catch (error) {
      console.error('Error deleting cuenta:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la cuenta",
        variant: "destructive"
      });
      throw error;
    }
  };

  const initializePlanCuentasBasico = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Usuario no autenticado');

      const planCuentasBasico = [
        // ACTIVOS
        { codigo: "1111", nombre: "Caja General", tipo: "activo", naturaleza: "deudora", saldo: 0, activa: true },
        { codigo: "1112", nombre: "Banco Nacional de Bolivia", tipo: "activo", naturaleza: "deudora", saldo: 0, activa: true },
        { codigo: "1113", nombre: "Banco Mercantil Santa Cruz", tipo: "activo", naturaleza: "deudora", saldo: 0, activa: true },
        { codigo: "1121", nombre: "Cuentas por Cobrar Comerciales", tipo: "activo", naturaleza: "deudora", saldo: 0, activa: true },
        { codigo: "1131", nombre: "Inventarios - Mercaderías", tipo: "activo", naturaleza: "deudora", saldo: 0, activa: true },
        { codigo: "1141", nombre: "Gastos Pagados por Anticipado", tipo: "activo", naturaleza: "deudora", saldo: 0, activa: true },
        { codigo: "1142", nombre: "IVA Crédito Fiscal", tipo: "activo", naturaleza: "deudora", saldo: 0, activa: true },
        { codigo: "1211", nombre: "Muebles y Enseres", tipo: "activo", naturaleza: "deudora", saldo: 0, activa: true },
        { codigo: "1212", nombre: "Equipos de Computación", tipo: "activo", naturaleza: "deudora", saldo: 0, activa: true },
        
        // PASIVOS
        { codigo: "2111", nombre: "Cuentas por Pagar Comerciales", tipo: "pasivo", naturaleza: "acreedora", saldo: 0, activa: true },
        { codigo: "2113", nombre: "IVA por Pagar", tipo: "pasivo", naturaleza: "acreedora", saldo: 0, activa: true },
        { codigo: "2121", nombre: "Sueldos y Salarios por Pagar", tipo: "pasivo", naturaleza: "acreedora", saldo: 0, activa: true },
        
        // PATRIMONIO
        { codigo: "3111", nombre: "Capital Social", tipo: "patrimonio", naturaleza: "acreedora", saldo: 100000, activa: true },
        { codigo: "3211", nombre: "Utilidades Acumuladas", tipo: "patrimonio", naturaleza: "acreedora", saldo: 0, activa: true },
        
        // INGRESOS
        { codigo: "4111", nombre: "Ventas", tipo: "ingresos", naturaleza: "acreedora", saldo: 0, activa: true },
        { codigo: "4191", nombre: "Otros Ingresos", tipo: "ingresos", naturaleza: "acreedora", saldo: 0, activa: true },
        
        // GASTOS
        { codigo: "5111", nombre: "Costo de Ventas", tipo: "gastos", naturaleza: "deudora", saldo: 0, activa: true },
        { codigo: "5191", nombre: "Gastos Varios", tipo: "gastos", naturaleza: "deudora", saldo: 0, activa: true },
        { codigo: "5211", nombre: "Sueldos y Salarios", tipo: "gastos", naturaleza: "deudora", saldo: 0, activa: true },
        { codigo: "5221", nombre: "Cargas Sociales", tipo: "gastos", naturaleza: "deudora", saldo: 0, activa: true },
        { codigo: "5231", nombre: "Servicios Básicos", tipo: "gastos", naturaleza: "deudora", saldo: 0, activa: true },
        { codigo: "5241", nombre: "Alquileres", tipo: "gastos", naturaleza: "deudora", saldo: 0, activa: true },
        { codigo: "5251", nombre: "Materiales y Suministros", tipo: "gastos", naturaleza: "deudora", saldo: 0, activa: true },
        { codigo: "5261", nombre: "Impuesto a las Transacciones", tipo: "gastos", naturaleza: "deudora", saldo: 0, activa: true }
      ];

      const cuentasConUserId = planCuentasBasico.map(cuenta => ({
        ...cuenta,
        user_id: user.user.id
      }));

      const { data, error } = await supabase
        .from('plan_cuentas')
        .insert(cuentasConUserId)
        .select();

      if (error) throw error;
      
      setPlanCuentas(data || []);
      toast({
        title: "Éxito",
        description: "Plan de cuentas inicializado correctamente"
      });
      
      return data;
    } catch (error) {
      console.error('Error initializing plan cuentas:', error);
      toast({
        title: "Error",
        description: "No se pudo inicializar el plan de cuentas",
        variant: "destructive"
      });
      throw error;
    }
  };

  useEffect(() => {
    console.log('🚀 useSupabasePlanCuentas mounting...');
    fetchPlanCuentas();
  }, []);

  return {
    planCuentas,
    loading,
    createCuenta,
    updateCuenta,
    deleteCuenta,
    initializePlanCuentasBasico,
    refetch: fetchPlanCuentas
  };
};