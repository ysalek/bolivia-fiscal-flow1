
import { useAsientos } from "../hooks/useAsientos";

export const generarAsientosParaComprobantes = () => {
  const comprobantes = JSON.parse(localStorage.getItem('comprobantes_integrados') || '[]');
  const asientosExistentes = JSON.parse(localStorage.getItem('asientosContables') || '[]');
  
  // Generar asientos para cada comprobante autorizado
  const nuevosAsientos = comprobantes
    .filter((comp: any) => comp.estado === 'autorizado' && comp.asientoGenerado)
    .map((comp: any) => ({
      id: comp.asientoId,
      numero: `COMP-${comp.numero}`,
      fecha: comp.fecha,
      concepto: `${comp.tipo === 'ingreso' ? 'Ingreso' : 'Egreso'} - ${comp.concepto}`,
      referencia: comp.numero,
      debe: comp.cuentas.reduce((sum: number, c: any) => sum + c.debe, 0),
      haber: comp.cuentas.reduce((sum: number, c: any) => sum + c.haber, 0),
      estado: 'registrado' as const,
      cuentas: comp.cuentas.map((cuenta: any) => ({
        codigo: cuenta.codigo,
        nombre: cuenta.nombre,
        debe: cuenta.debe,
        haber: cuenta.haber
      })),
      origen: 'comprobante',
      comprobanteId: comp.id
    }));

  // Combinar con asientos existentes, evitando duplicados
  const asientosActualizados = [...asientosExistentes];
  
  nuevosAsientos.forEach((nuevoAsiento: any) => {
    const existe = asientosActualizados.find(a => a.id === nuevoAsiento.id);
    if (!existe) {
      asientosActualizados.push(nuevoAsiento);
    }
  });

  localStorage.setItem('asientosContables', JSON.stringify(asientosActualizados));
  
  console.log("✅ Asientos contables generados para comprobantes:", nuevosAsientos.length);
  return nuevosAsientos.length;
};
