import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface CumplimientoRecord {
  id: string;
  norma_rnd: string;
  descripcion: string;
  fecha_vigencia: string;
  fecha_implementacion?: string | null;
  estado: 'pendiente' | 'implementado' | 'cumplido' | 'incumplido';
  observaciones?: string | null;
  user_id: string;
  created_at: string | null;
  updated_at?: string | null;
}

export interface ComplianceMetrics {
  total: number;
  cumplidos: number;
  pendientes: number;
  incumplidos: number;
  porcentajeCumplimiento: number;
}

export const useCumplimientoNormativo = () => {
  const [records, setRecords] = useState<CumplimientoRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<ComplianceMetrics>({
    total: 0,
    cumplidos: 0,
    pendientes: 0,
    incumplidos: 0,
    porcentajeCumplimiento: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchCumplimientoRecords();
  }, []);

  useEffect(() => {
    calculateMetrics();
  }, [records]);

  const fetchCumplimientoRecords = async () => {
    try {
      const { data, error } = await supabase
        .from('cumplimiento_normativo_2025')
        .select('*')
        .order('fecha_vigencia', { ascending: false });

      if (error) throw error;
      
      // Map database types to our interface types
      const mappedData = (data || []).map(item => ({
        ...item,
        estado: (item.estado as any) || 'pendiente',
        fecha_implementacion: item.fecha_implementacion || undefined,
        observaciones: item.observaciones || undefined
      })) as CumplimientoRecord[];
      
      setRecords(mappedData);
    } catch (error: any) {
      console.error('Error fetching compliance records:', error);
      toast({
        title: "Error al cargar registros",
        description: "No se pudieron cargar los registros de cumplimiento",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateMetrics = () => {
    const total = records.length;
    const cumplidos = records.filter(r => r.estado === 'cumplido').length;
    const pendientes = records.filter(r => r.estado === 'pendiente').length;
    const incumplidos = records.filter(r => r.estado === 'incumplido').length;
    const porcentajeCumplimiento = total > 0 ? Math.round((cumplidos / total) * 100) : 0;

    setMetrics({
      total,
      cumplidos,
      pendientes,
      incumplidos,
      porcentajeCumplimiento
    });
  };

  const createCumplimientoRecord = async (record: Omit<CumplimientoRecord, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuario no autenticado');

      const { data, error } = await supabase
        .from('cumplimiento_normativo_2025')
        .insert([{
          ...record,
          user_id: user.id,
          estado: record.estado
        }])
        .select()
        .single();

      if (error) throw error;

      const mappedData = {
        ...data,
        estado: (data.estado as any) || 'pendiente',
        fecha_implementacion: data.fecha_implementacion || undefined,
        observaciones: data.observaciones || undefined
      } as CumplimientoRecord;

      setRecords(prev => [mappedData, ...prev]);
      
      toast({
        title: "Registro creado",
        description: "El registro de cumplimiento ha sido creado exitosamente",
      });

      return mappedData;
    } catch (error: any) {
      console.error('Error creating compliance record:', error);
      toast({
        title: "Error al crear registro",
        description: "No se pudo crear el registro de cumplimiento",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateCumplimientoRecord = async (id: string, updates: Partial<CumplimientoRecord>) => {
    try {
      const { data, error } = await supabase
        .from('cumplimiento_normativo_2025')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const mappedData = {
        ...data,
        estado: (data.estado as any) || 'pendiente',
        fecha_implementacion: data.fecha_implementacion || undefined,
        observaciones: data.observaciones || undefined
      } as CumplimientoRecord;

      setRecords(prev => prev.map(record => 
        record.id === id ? { ...record, ...mappedData } : record
      ));

      toast({
        title: "Registro actualizado",
        description: "El estado del cumplimiento ha sido actualizado",
      });

      return mappedData;
    } catch (error: any) {
      console.error('Error updating compliance record:', error);
      toast({
        title: "Error al actualizar",
        description: "No se pudo actualizar el registro de cumplimiento",
        variant: "destructive"
      });
      throw error;
    }
  };

  const marcarComoCumplido = async (id: string, observaciones?: string) => {
    return updateCumplimientoRecord(id, {
      estado: 'cumplido',
      fecha_implementacion: new Date().toISOString().split('T')[0],
      observaciones: observaciones || 'Marcado como cumplido'
    });
  };

  const generateComplianceFromNormativas = async () => {
    try {
      setLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuario no autenticado');
      
      // Obtener normativas desde la base de datos
      const { data: normativas, error } = await supabase
        .from('normativas_2025')
        .select('*')
        .eq('estado', 'vigente');

      if (error) throw error;

      // Crear registros de cumplimiento para normativas que no tienen registro
      const existingRecords = records.map(r => r.norma_rnd);
      const newRecords = normativas
        .filter(normativa => !existingRecords.includes(normativa.rnd_numero))
        .map(normativa => ({
          norma_rnd: normativa.rnd_numero,
          descripcion: `Cumplimiento de ${normativa.titulo}`,
          fecha_vigencia: normativa.fecha_vigencia,
          estado: 'pendiente',
          observaciones: `Generado automáticamente desde ${normativa.categoria}`,
          user_id: user.id
        }));

      if (newRecords.length > 0) {
        const { error: insertError } = await supabase
          .from('cumplimiento_normativo_2025')
          .insert(newRecords);

        if (insertError) throw insertError;

        await fetchCumplimientoRecords();
        
        toast({
          title: "Registros generados",
          description: `Se crearon ${newRecords.length} nuevos registros de cumplimiento`,
        });
      } else {
        toast({
          title: "Sin cambios",
          description: "Todos los registros de cumplimiento están actualizados",
        });
      }
    } catch (error: any) {
      console.error('Error generating compliance records:', error);
      toast({
        title: "Error al generar registros",
        description: "No se pudieron generar los registros de cumplimiento",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getRecordsByStatus = (estado: string) => {
    return records.filter(record => record.estado === estado);
  };

  const getOverdueRecords = () => {
    const today = new Date();
    return records.filter(record => {
      if (record.estado === 'cumplido') return false;
      const vigencia = new Date(record.fecha_vigencia);
      return vigencia < today;
    });
  };

  return {
    records,
    loading,
    metrics,
    fetchCumplimientoRecords,
    createCumplimientoRecord,
    updateCumplimientoRecord,
    marcarComoCumplido,
    generateComplianceFromNormativas,
    getRecordsByStatus,
    getOverdueRecords
  };
};