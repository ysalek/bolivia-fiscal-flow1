
import { initializarSistemaProduccion } from './datosEjemplo';
import { generarAsientosParaComprobantes } from './generarAsientosComprobantes';

export const inicializarSistemaCompleto = () => {
  console.log("🚀 Inicializando sistema contable para producción...");
  
  // 1. Inicializar sistema limpio para producción
  initializarSistemaProduccion();
  
  // 2. Generar asientos contables para comprobantes
  const asientosGenerados = generarAsientosParaComprobantes();
  
  // 3. Verificar integridad
  verificarIntegridadDatos();
  
  console.log("✅ Sistema de producción inicializado correctamente");
  console.log("🏭 Listo para ambiente productivo");
  
  return true;
};

const verificarIntegridadDatos = () => {
  const productos = JSON.parse(localStorage.getItem('productos') || '[]');
  const comprobantes = JSON.parse(localStorage.getItem('comprobantes_integrados') || '[]');
  const asientos = JSON.parse(localStorage.getItem('asientosContables') || '[]');
  const planCuentas = JSON.parse(localStorage.getItem('planCuentas') || '[]');
  
  console.log("🔍 Verificando integridad del sistema:");
  console.log(`- Productos: ${productos.length}`);
  console.log(`- Comprobantes: ${comprobantes.length}`);
  console.log(`- Asientos contables: ${asientos.length}`);
  console.log(`- Cuentas contables: ${planCuentas.length}`);
  
  // Verificar que todos los comprobantes autorizados tengan asientos
  const comprobantesAutorizados = comprobantes.filter((c: any) => c.estado === 'autorizado');
  const asientosDeComprobantes = asientos.filter((a: any) => a.origen === 'comprobante');
  
  console.log(`- Comprobantes autorizados: ${comprobantesAutorizados.length}`);
  console.log(`- Asientos de comprobantes: ${asientosDeComprobantes.length}`);
  
  if (comprobantesAutorizados.length !== asientosDeComprobantes.length) {
    console.warn("⚠️ Advertencia: No todos los comprobantes tienen asientos contables");
  }
  
  // Verificar balance de asientos
  asientos.forEach((asiento: any) => {
    const totalDebe = asiento.cuentas.reduce((sum: number, c: any) => sum + c.debe, 0);
    const totalHaber = asiento.cuentas.reduce((sum: number, c: any) => sum + c.haber, 0);
    
    if (Math.abs(totalDebe - totalHaber) > 0.01) {
      console.error(`❌ Error en asiento ${asiento.numero}: Debe (${totalDebe}) ≠ Haber (${totalHaber})`);
    }
  });
  
  console.log("✅ Verificación de integridad completada");
};
