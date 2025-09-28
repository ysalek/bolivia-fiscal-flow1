
import { useAsientos } from "../hooks/useAsientos";

export const generarAsientosParaComprobantes = () => {
  const comprobantes = JSON.parse(localStorage.getItem('comprobantes_integrados') || '[]');
  const asientosExistentes = JSON.parse(localStorage.getItem('asientosContables') || '[]');
  
  // Generar asientos para cada comprobante autorizado (excluir anulados)
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
  // Remover asientos de comprobantes anulados
  const asientosLimpios = asientosExistentes.filter((asiento: any) => {
    if (asiento.comprobanteId && asiento.origen === 'comprobante') {
      const comprobante = comprobantes.find((c: any) => c.id === asiento.comprobanteId);
      return comprobante && comprobante.estado !== 'anulado';
    }
    return true; // Mantener asientos que no provienen de comprobantes
  });
  
  const asientosActualizados = [...asientosLimpios];
  
  nuevosAsientos.forEach((nuevoAsiento: any) => {
    const existe = asientosActualizados.find(a => a.id === nuevoAsiento.id);
    if (!existe) {
      asientosActualizados.push(nuevoAsiento);
    }
  });

  localStorage.setItem('asientosContables', JSON.stringify(asientosActualizados));
  
  console.log("✅ Asientos contables generados para comprobantes:", nuevosAsientos.length);
  console.log("🚫 Asientos de comprobantes anulados filtrados");
  return nuevosAsientos.length;
};
