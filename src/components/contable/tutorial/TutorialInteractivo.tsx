import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Play, 
  CheckCircle, 
  Clock, 
  BookOpen, 
  Video, 
  FileText,
  Users,
  Calculator,
  BarChart3,
  Settings,
  Lightbulb,
  Star,
  Trophy,
  Target,
  AlertCircle,
  Info
} from "lucide-react";

interface Leccion {
  id: string;
  titulo: string;
  descripcion: string;
  duracion: number;
  tipo: 'basico' | 'intermedio' | 'avanzado';
  categoria: 'contabilidad' | 'facturacion' | 'inventario' | 'reportes' | 'configuracion';
  completada: boolean;
  contenido: string[];
  videoUrl?: string;
  ejercicios?: string[];
  consejos?: string[];
  advertencias?: string[];
}

interface Modulo {
  id: string;
  nombre: string;
  descripcion: string;
  lecciones: Leccion[];
  progreso: number;
  completado: boolean;
}

const TutorialInteractivo = () => {
  const [modulos, setModulos] = useState<Modulo[]>([]);
  const [leccionActual, setLeccionActual] = useState<Leccion | null>(null);
  const [progresoGeneral, setProgresoGeneral] = useState(0);
  const [selectedTab, setSelectedTab] = useState("dashboard");

  useEffect(() => {
    initializeTutorials();
    loadProgress();
  }, []);

  const initializeTutorials = () => {
    const tutorialModules: Modulo[] = [
      {
        id: 'introduccion',
        nombre: 'Primeros Pasos en el Sistema',
        descripcion: 'Aprende lo esencial para comenzar a usar el sistema contable boliviano',
        completado: false,
        progreso: 0,
        lecciones: [
          {
            id: 'nav-basica',
            titulo: 'Navegación y Menú Principal',
            descripcion: 'Conoce la interfaz del sistema y cómo moverte por los diferentes módulos',
            duracion: 8,
            tipo: 'basico',
            categoria: 'configuracion',
            completada: false,
            contenido: [
              '🏠 DASHBOARD: Es tu página principal donde ves el resumen de toda la actividad de tu empresa (ventas del día, productos con poco stock, etc.).',
              '📱 MENÚ LATERAL: Se organiza por categorías: Facturación (para vender), Compras (para comprar a proveedores), Contabilidad (asientos, balances), Inventario (control de productos), etc.',
              '🔔 NOTIFICACIONES: La campanita en la esquina superior derecha te avisa cuando hay stock bajo, facturas vencidas, o tareas pendientes.',
              '🔍 BÚSQUEDA RÁPIDA: Usa Ctrl+K para buscar cualquier función o módulo rápidamente sin navegar por el menú.',
              '👤 PERFIL DE USUARIO: En la esquina superior derecha puedes ver tu rol (admin, contador, ventas) y cerrar sesión.'
            ],
            consejos: [
              'Siempre empieza tu día revisando el Dashboard para ver las tareas importantes',
              'Usa las notificaciones para no perderte nada crítico como stock bajo',
              'El atajo Ctrl+K te ahorra mucho tiempo para encontrar funciones'
            ]
          },
          {
            id: 'config-inicial',
            titulo: 'Configuración Básica de tu Empresa',
            descripcion: 'Configura correctamente los datos de tu empresa antes de empezar a usar el sistema',
            duracion: 15,
            tipo: 'basico',
            categoria: 'configuracion',
            completada: false,
            contenido: [
              '🏢 DATOS DE LA EMPRESA: Ve a Configuración → Empresa. Aquí debes llenar tu NIT, razón social, dirección, teléfono y correo. Estos datos aparecerán en todas tus facturas.',
              '📄 CONFIGURACIÓN FISCAL: En Configuración → Fiscal, ingresa tu código de actividad económica del SIN, el tipo de contribuyente (Responsable Inscrito, etc.) y las tasas de impuestos vigentes.',
              '🔢 NUMERACIÓN DE FACTURAS: En Configuración → Facturación, configura los rangos de numeración autorizados por el SIN. Sin esto, no podrás emitir facturas válidas.',
              '👥 USUARIOS: Si trabajas en equipo, crea usuarios en Configuración → Usuarios. Puedes crear contadores (acceso a contabilidad), vendedores (solo facturación) o administradores.',
              '💰 MONEDA Y DECIMALES: Configura si trabajas en bolivianos (BOB), dólares (USD) o ambos, y cuántos decimales mostrar en los precios.'
            ],
            advertencias: [
              '⚠️ SIN CONFIGURACIÓN FISCAL CORRECTA NO PODRÁS EMITIR FACTURAS VÁLIDAS',
              '⚠️ Los datos de la empresa son obligatorios para cumplir con las normas del SIN',
              '⚠️ La numeración debe coincidir exactamente con lo autorizado por el SIN'
            ],
            consejos: [
              'Completa toda la configuración antes de empezar a trabajar con datos reales',
              'Guarda una copia de tu configuración como respaldo',
              'Verifica que los datos fiscales estén actualizados según las normas vigentes'
            ]
          }
        ]
      },
      {
        id: 'contabilidad',
        nombre: 'Sistema Contable Fundamental',
        descripcion: 'Domina los módulos contables esenciales según la normativa boliviana',
        completado: false,
        progreso: 0,
        lecciones: [
          {
            id: 'plan-cuentas',
            titulo: 'Plan de Cuentas Boliviano',
            descripcion: 'Comprende y gestiona el plan de cuentas según las normas contables bolivianas',
            duracion: 20,
            tipo: 'basico',
            categoria: 'contabilidad',
            completada: false,
            contenido: [
              '📊 QUÉ ES: El Plan de Cuentas es la estructura básica de tu contabilidad. Organiza todas las cuentas en 5 categorías: Activos (lo que tienes), Pasivos (lo que debes), Patrimonio (tu capital), Ingresos (ventas) y Gastos (costos).',
              '🔢 CÓDIGOS: Cada cuenta tiene un código numérico. Por ejemplo: 1111=Caja, 1112=Banco, 2111=Proveedores por Pagar, 4111=Ventas. Esto facilita la organización.',
              '➕ CREAR CUENTAS: Ve a Contabilidad → Plan de Cuentas → Nueva Cuenta. Define el código, nombre, tipo (activo/pasivo/etc.) y naturaleza (deudora/acreedora).',
              '📋 CUENTAS PREDEFINIDAS: El sistema viene con las cuentas básicas más comunes en Bolivia. Puedes agregar las específicas de tu negocio.',
              '⚖️ NATURALEZA DE CUENTAS: Las cuentas de Activos y Gastos son deudoras (aumentan con cargos). Las de Pasivos, Patrimonio e Ingresos son acreedoras (aumentan con abonos).'
            ],
            ejercicios: [
              'Crear una cuenta nueva: Código 1151, Nombre "Cuentas por Cobrar - Cliente Específico", Tipo "Activo", Naturaleza "Deudora"',
              'Revisar las cuentas existentes y verificar que estén correctamente categorizadas',
              'Crear una cuenta de gasto específica para tu negocio'
            ],
            consejos: [
              'No crear demasiadas cuentas al inicio, empezar con las básicas',
              'Usar códigos consecutivos para facilitar el orden',
              'Revisar periódicamente si necesitas cuentas adicionales'
            ]
          },
          {
            id: 'libro-diario',
            titulo: 'Libro Diario y Asientos Contables',
            descripcion: 'Aprende a registrar todas las transacciones usando el método de partida doble',
            duracion: 25,
            tipo: 'intermedio',
            categoria: 'contabilidad',
            completada: false,
            contenido: [
              '📚 QUÉ ES: El Libro Diario registra TODAS las transacciones de tu empresa día a día. Cada transacción se llama "asiento contable" y debe cumplir la regla: Total Debe = Total Haber.',
              '⚖️ PARTIDA DOBLE: Cada asiento tiene dos partes: Debe (lado izquierdo) y Haber (lado derecho). Si vendes por Bs. 100, el Debe va en Caja (+100) y el Haber en Ventas (+100).',
              '📝 CREAR ASIENTOS: Ve a Contabilidad → Libro Diario → Nuevo Asiento. Selecciona las cuentas, ingresa los montos y asegúrate que el total Debe = total Haber.',
              '🔄 ASIENTOS AUTOMÁTICOS: Cuando creas facturas o registras compras, el sistema genera los asientos automáticamente. También puedes crear asientos manuales para otros movimientos.',
              '🎯 EJEMPLOS PRÁCTICOS: Venta al contado: Debe=Caja, Haber=Ventas. Compra a crédito: Debe=Inventario, Haber=Proveedores por Pagar. Pago de servicios: Debe=Gastos de Servicios, Haber=Caja.'
            ],
            ejercicios: [
              'Crear un asiento manual de venta al contado por Bs. 500',
              'Registrar el pago de un servicio básico por Bs. 200',
              'Verificar que un asiento cuadre correctamente (Debe = Haber)'
            ],
            advertencias: [
              '⚠️ TODOS LOS ASIENTOS DEBEN CUADRAR - Si Debe ≠ Haber, hay error',
              '⚠️ No borrar asientos sin justificación, mejor hacer asientos de corrección',
              '⚠️ Revisar la fecha de los asientos para mantener el orden cronológico'
            ],
            consejos: [
              'Practica con transacciones simples antes de hacer asientos complejos',
              'Usa descripciones claras para recordar de qué trata cada asiento',
              'Revisa el Libro Diario regularmente para detectar errores'
            ]
          },
          {
            id: 'libro-mayor',
            titulo: 'Libro Mayor y Control de Cuentas',
            descripcion: 'Analiza el movimiento individual de cada cuenta contable',
            duracion: 18,
            tipo: 'intermedio',
            categoria: 'contabilidad',
            completada: false,
            contenido: [
              '📋 QUÉ ES: El Libro Mayor muestra todos los movimientos de cada cuenta por separado. Si quieres ver todo lo que pasó con "Caja" durante el mes, el Mayor te lo muestra ordenado.',
              '🔍 ANÁLISIS POR CUENTA: Ve a Contabilidad → Libro Mayor, selecciona una cuenta (ej: Banco) y un período. Verás todos los débitos, créditos y el saldo final.',
              '💰 SALDOS ACTUALES: Cada cuenta muestra su saldo actual. Las cuentas deudoras (Activos/Gastos) tienen saldo positivo cuando hay más débitos. Las acreedoras (Pasivos/Ingresos) cuando hay más créditos.',
              '📊 CONCILIACIÓN: Usa el Mayor para conciliar. Por ejemplo, el saldo de "Banco" en el Mayor debe coincidir con tu estado de cuenta bancario.',
              '🎯 CASOS PRÁCTICOS: Revisar Caja para ver entradas y salidas de efectivo. Analizar Ventas para ver ingresos del período. Controlar Proveedores por Pagar para saber qué debes.'
            ],
            ejercicios: [
              'Consultar el Mayor de la cuenta "Caja" y verificar su saldo',
              'Revisar los movimientos de "Ventas" del último mes',
              'Analizar una cuenta de Proveedores para ver pagos pendientes'
            ],
            consejos: [
              'Usa el Mayor para encontrar errores en asientos específicos',
              'Revisa regularmente las cuentas de Bancos para conciliación',
              'El Mayor es útil para preparar reportes detallados por cuenta'
            ]
          },
          {
            id: 'balance-comprobacion',
            titulo: 'Balance de Comprobación',
            descripcion: 'Verifica que tu contabilidad esté cuadrada y sin errores',
            duracion: 15,
            tipo: 'intermedio',
            categoria: 'contabilidad',
            completada: false,
            contenido: [
              '⚖️ QUÉ ES: El Balance de Comprobación es un reporte que lista todas tus cuentas con sus saldos deudores y acreedores. Si está bien hecho, Total Deudores = Total Acreedores.',
              '✅ VERIFICACIÓN: Ve a Contabilidad → Balance de Comprobación. Si los totales no cuadran, hay errores en tus asientos que debes corregir.',
              '📅 POR PERÍODOS: Puedes generar el balance de cualquier período (mes, trimestre, año). Esto te ayuda a ver la situación en fechas específicas.',
              '🔍 DETECTAR ERRORES: Si una cuenta tiene saldo inusual (ej: Ventas con saldo deudor), probablemente hay un error en los asientos.',
              '📊 BASE PARA REPORTES: El Balance de Comprobación es la base para preparar el Balance General y Estado de Resultados.'
            ],
            ejercicios: [
              'Generar el Balance de Comprobación del mes actual',
              'Verificar que los totales deudores y acreedores coincidan',
              'Identificar si alguna cuenta tiene saldo inusual'
            ],
            advertencias: [
              '⚠️ Si el balance no cuadra, HAY ERRORES que debes corregir inmediatamente',
              '⚠️ Nunca ignores diferencias en el balance, por pequeñas que sean'
            ],
            consejos: [
              'Genera el balance semanalmente para detectar errores temprano',
              'Si no cuadra, revisa los últimos asientos ingresados',
              'Usa este reporte antes de preparar estados financieros'
            ]
          }
        ]
      },
      {
        id: 'facturacion',
        nombre: 'Facturación y Gestión de Ventas',
        descripcion: 'Domina el proceso completo de ventas y facturación según normativa SIN',
        completado: false,
        progreso: 0,
        lecciones: [
          {
            id: 'clientes',
            titulo: 'Base de Datos de Clientes',
            descripcion: 'Organiza y gestiona tu cartera de clientes de manera eficiente',
            duracion: 12,
            tipo: 'basico',
            categoria: 'facturacion',
            completada: false,
            contenido: [
              '👥 IMPORTANCIA: Una buena base de clientes te permite facturar rápido, hacer seguimiento de pagos y generar reportes de ventas por cliente.',
              '📝 DATOS OBLIGATORIOS: Para facturar necesitas: NIT/CI, nombre/razón social, dirección, teléfono, email. Para empresas también el código de actividad económica.',
              '➕ CREAR CLIENTES: Ve a Facturación → Clientes → Nuevo Cliente. Llena todos los campos obligatorios. El sistema validará que el NIT tenga formato correcto.',
              '🏷️ CATEGORIZACIÓN: Puedes categorizar clientes (Mayorista, Minorista, VIP) para aplicar descuentos específicos o generar reportes segmentados.',
              '💳 CRÉDITO: Si vendes a crédito, puedes configurar límites de crédito y plazos de pago por cliente.'
            ],
            ejercicios: [
              'Crear un cliente persona natural con CI y datos completos',
              'Crear un cliente empresa con NIT y actividad económica',
              'Configurar límite de crédito para un cliente frecuente'
            ],
            consejos: [
              'Mantén actualizados los datos de contacto para comunicarte fácilmente',
              'Usa códigos cortos o nombres fáciles de buscar',
              'Revisa periódicamente que los NITs estén correctos'
            ]
          },
          {
            id: 'productos',
            titulo: 'Catálogo de Productos y Servicios',
            descripcion: 'Administra tu inventario de productos con control de stock y precios',
            duracion: 18,
            tipo: 'basico',
            categoria: 'inventario',
            completada: false,
            contenido: [
              '📦 GESTIÓN COMPLETA: Tu catálogo incluye productos físicos y servicios. Cada uno tiene código, nombre, precio, stock, unidad de medida y categoría.',
              '💰 PRECIOS: Puedes manejar precio de costo (lo que te costó) y precio de venta (lo que cobras). El sistema calcula automáticamente tu margen de ganancia.',
              '📊 CONTROL DE STOCK: Para productos físicos, el sistema controla automáticamente el stock. Cuando vendes, resta del inventario. Te avisa cuando queda poco stock.',
              '🏷️ CATEGORÍAS: Organiza productos por categorías (Alimentos, Ropa, Servicios, etc.) para facilitar búsquedas y generar reportes.',
              '📋 CÓDIGOS: Usa códigos únicos para cada producto. Pueden ser tus códigos internos o códigos de barras estándar.'
            ],
            ejercicios: [
              'Crear un producto físico con control de stock',
              'Crear un servicio sin control de stock',
              'Configurar alertas de stock mínimo para productos críticos'
            ],
            advertencias: [
              '⚠️ Productos sin precio no se pueden facturar',
              '⚠️ Revisa regularmente que los stocks coincidan físicamente',
              '⚠️ Los productos con stock 0 no se pueden vender'
            ],
            consejos: [
              'Usa nombres descriptivos y códigos fáciles de recordar',
              'Mantén actualizados los precios según el mercado',
              'Revisa periódicamente los reportes de productos más/menos vendidos'
            ]
          },
          {
            id: 'facturas',
            titulo: 'Proceso Completo de Facturación',
            descripcion: 'Crea facturas profesionales que cumplan con todos los requisitos del SIN',
            duracion: 30,
            tipo: 'intermedio',
            categoria: 'facturacion',
            completada: false,
            contenido: [
              '🧾 PROCESO PASO A PASO: 1) Seleccionar cliente, 2) Agregar productos/servicios, 3) El sistema calcula impuestos automáticamente, 4) Generar e imprimir factura.',
              '💯 CÁLCULO DE IMPUESTOS: El sistema calcula automáticamente IVA (13%), IT (3%) y RC-IVA según corresponda. Todo conforme a las normas del SIN.',
              '🔢 NUMERACIÓN: Las facturas deben usar numeración autorizada por el SIN. Configura los rangos en Configuración → Facturación.',
              '💾 INTEGRACIÓN CONTABLE: Cada factura genera automáticamente el asiento contable: Debe en Cuentas por Cobrar/Caja, Haber en Ventas e IVA por Pagar.',
              '📱 FORMATOS: Puedes generar facturas en formato PDF para imprimir o enviar por email. También tienes vista previa antes de confirmar.',
              '🔄 ESTADOS: Las facturas pueden estar Pendientes (no pagadas), Pagadas o Anuladas. Puedes registrar pagos parciales o totales.'
            ],
            ejercicios: [
              'Crear una factura de venta al contado con IVA',
              'Facturar un servicio profesional con RC-IVA',
              'Registrar el pago de una factura a crédito'
            ],
            advertencias: [
              '⚠️ FACTURAS SIN NUMERACIÓN AUTORIZADA NO SON VÁLIDAS ANTE EL SIN',
              '⚠️ Verificar siempre que los datos del cliente estén correctos',
              '⚠️ No facturar productos sin stock disponible'
            ],
            consejos: [
              'Revisa la factura antes de confirmarla, los errores son difíciles de corregir',
              'Mantén copias digitales de todas las facturas',
              'Usa la función de búsqueda para encontrar facturas rápidamente'
            ]
          }
        ]
      },
      {
        id: 'inventario',
        nombre: 'Control de Inventarios',
        descripcion: 'Controla eficientemente tu stock y movimientos de inventario',
        completado: false,
        progreso: 0,
        lecciones: [
          {
            id: 'control-stock',
            titulo: 'Control de Stock y Movimientos',
            descripcion: 'Administra entradas, salidas y ajustes de inventario',
            duracion: 22,
            tipo: 'intermedio',
            categoria: 'inventario',
            completada: false,
            contenido: [
              '📦 TIPOS DE MOVIMIENTO: Entradas (compras, devoluciones de clientes), Salidas (ventas, devoluciones a proveedores), Ajustes (correcciones por conteos físicos).',
              '🔄 MÉTODOS DE VALORACIÓN: El sistema usa PEPS (Primero en Entrar, Primero en Salir) para valorar el inventario. Los productos más antiguos se venden primero.',
              '📊 KARDEX: Ve a Inventario → Kardex para ver el historial completo de cada producto: entradas, salidas, saldos y valores.',
              '⚠️ ALERTAS DE STOCK: Configura niveles mínimos de stock. El sistema te avisará cuando un producto esté por agotarse.',
              '🔍 INVENTARIO FÍSICO: Periódicamente debes contar físicamente tu inventario y ajustar las diferencias en el sistema.'
            ],
            ejercicios: [
              'Registrar una entrada de inventario por compra',
              'Hacer un ajuste por diferencia de inventario físico',
              'Configurar alertas de stock mínimo para productos críticos'
            ],
            consejos: [
              'Haz conteos físicos al menos una vez al mes',
              'Investiga las diferencias entre stock físico y del sistema',
              'Mantén ordenado tu almacén para facilitar los conteos'
            ]
          }
        ]
      },
      {
        id: 'reportes',
        nombre: 'Reportes y Estados Financieros',
        descripcion: 'Genera reportes para tomar decisiones y cumplir obligaciones fiscales',
        completado: false,
        progreso: 0,
        lecciones: [
          {
            id: 'estados-financieros',
            titulo: 'Estados Financieros Básicos',
            descripcion: 'Comprende y genera Balance General y Estado de Resultados',
            duracion: 25,
            tipo: 'avanzado',
            categoria: 'reportes',
            completada: false,
            contenido: [
              '📊 BALANCE GENERAL: Muestra la situación financiera en un momento específico. Tiene Activos (lo que tienes), Pasivos (lo que debes) y Patrimonio (tu capital neto).',
              '💹 ESTADO DE RESULTADOS: Muestra si ganaste o perdiste dinero en un período. Incluye Ingresos (ventas), Costos (lo que te costaron los productos vendidos) y Gastos (operativos).',
              '🔍 ANÁLISIS: Compara períodos para ver si estás mejorando. Analiza ratios como margen de ganancia, liquidez, endeudamiento.',
              '📅 PERÍODOS: Puedes generar estados mensuales, trimestrales o anuales según necesites.',
              '📋 USO: Los estados financieros son obligatorios para presentar al SIN y útiles para evaluar el desempeño de tu negocio.'
            ],
            ejercicios: [
              'Generar el Balance General del mes actual',
              'Crear un Estado de Resultados del último trimestre',
              'Comparar resultados de dos meses consecutivos'
            ],
            consejos: [
              'Genera estados financieros mensualmente para hacer seguimiento',
              'Compara con períodos anteriores para identificar tendencias',
              'Usa estos reportes para tomar decisiones de negocio'
            ]
          },
          {
            id: 'reportes-impuestos',
            titulo: 'Reportes para Impuestos',
            descripcion: 'Prepara información para declaraciones de IVA y otros impuestos',
            duracion: 20,
            tipo: 'avanzado',
            categoria: 'reportes',
            completada: false,
            contenido: [
              '🧾 DECLARACIÓN DE IVA: El sistema genera automáticamente el reporte de IVA con ventas gravadas, IVA cobrado, compras con IVA e IVA pagado.',
              '📊 FORMULARIO 200: Para Responsables Inscriptos, el sistema prepara la información necesaria para llenar el formulario 200 del SIN.',
              '💰 IT (IMPUESTO A LAS TRANSACCIONES): Genera reportes de IT retenido y pagado para la declaración mensual.',
              '📅 PERÍODOS FISCALES: Los reportes se generan por mes fiscal (del 1 al último día del mes) según exige el SIN.',
              '🔍 VALIDACIONES: El sistema verifica que la información esté completa antes de generar los reportes fiscales.'
            ],
            ejercicios: [
              'Generar reporte de IVA del mes anterior',
              'Preparar información para formulario 200',
              'Verificar cálculos de IT del período'
            ],
            advertencias: [
              '⚠️ Los reportes fiscales deben ser exactos - errores pueden generar multas',
              '⚠️ Presenta las declaraciones dentro de los plazos establecidos por el SIN'
            ],
            consejos: [
              'Genera reportes fiscales antes del vencimiento',
              'Guarda copias de todos los reportes presentados',
              'Revisa los datos antes de presentar al SIN'
            ]
          }
        ]
      }
    ];

    setModulos(tutorialModules);
  };

  const loadProgress = () => {
    const progress = JSON.parse(localStorage.getItem('tutorialProgress') || '{}');
    setProgresoGeneral(progress.general || 0);
  };

  const saveProgress = (moduleId: string, lessonId: string, completed: boolean) => {
    const progress = JSON.parse(localStorage.getItem('tutorialProgress') || '{}');
    if (!progress[moduleId]) progress[moduleId] = {};
    progress[moduleId][lessonId] = completed;
    
    localStorage.setItem('tutorialProgress', JSON.stringify(progress));
    
    const updatedModulos = modulos.map(modulo => {
      if (modulo.id === moduleId) {
        const updatedLecciones = modulo.lecciones.map(leccion => 
          leccion.id === lessonId ? { ...leccion, completada: completed } : leccion
        );
        const completedCount = updatedLecciones.filter(l => l.completada).length;
        const progreso = (completedCount / updatedLecciones.length) * 100;
        
        return {
          ...modulo,
          lecciones: updatedLecciones,
          progreso,
          completado: progreso === 100
        };
      }
      return modulo;
    });
    
    setModulos(updatedModulos);
    
    const totalLecciones = updatedModulos.reduce((sum, m) => sum + m.lecciones.length, 0);
    const completedLecciones = updatedModulos.reduce((sum, m) => 
      sum + m.lecciones.filter(l => l.completada).length, 0
    );
    const generalProgress = totalLecciones > 0 ? (completedLecciones / totalLecciones) * 100 : 0;
    
    setProgresoGeneral(generalProgress);
    
    progress.general = generalProgress;
    localStorage.setItem('tutorialProgress', JSON.stringify(progress));
  };

  const startLesson = (leccion: Leccion) => {
    setLeccionActual(leccion);
    setSelectedTab("leccion");
  };

  const completeLesson = () => {
    if (leccionActual) {
      const modulo = modulos.find(m => m.lecciones.some(l => l.id === leccionActual.id));
      if (modulo) {
        saveProgress(modulo.id, leccionActual.id, true);
      }
      setLeccionActual(null);
      setSelectedTab("dashboard");
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'basico': return 'bg-green-100 text-green-800';
      case 'intermedio': return 'bg-yellow-100 text-yellow-800';
      case 'avanzado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoriaIcon = (categoria: string) => {
    switch (categoria) {
      case 'contabilidad': return <Calculator className="w-4 h-4" />;
      case 'facturacion': return <FileText className="w-4 h-4" />;
      case 'inventario': return <BarChart3 className="w-4 h-4" />;
      case 'reportes': return <Target className="w-4 h-4" />;
      case 'configuracion': return <Settings className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Tutorial Interactivo</h2>
          <p className="text-muted-foreground">Aprende a usar el sistema paso a paso con explicaciones detalladas</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-muted-foreground">Progreso General</div>
          <div className="flex items-center gap-2">
            <Progress value={progresoGeneral} className="w-32" />
            <span className="font-bold">{progresoGeneral.toFixed(0)}%</span>
          </div>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="modulos">Módulos</TabsTrigger>
          {leccionActual && <TabsTrigger value="leccion">Lección Actual</TabsTrigger>}
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Módulos</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{modulos.length}</div>
                <p className="text-xs text-muted-foreground">
                  {modulos.filter(m => m.completado).length} completados
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Lecciones</CardTitle>
                <Video className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {modulos.reduce((sum, m) => sum + m.lecciones.length, 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {modulos.reduce((sum, m) => sum + m.lecciones.filter(l => l.completada).length, 0)} completadas
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tiempo Total</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {modulos.reduce((sum, m) => sum + m.lecciones.reduce((s, l) => s + l.duracion, 0), 0)} min
                </div>
                <p className="text-xs text-muted-foreground">
                  Duración estimada
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Progreso</CardTitle>
                <Trophy className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{progresoGeneral.toFixed(0)}%</div>
                <p className="text-xs text-muted-foreground">
                  {progresoGeneral === 100 ? '¡Completado!' : 'En progreso'}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Módulos por Completar</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {modulos.filter(m => !m.completado).slice(0, 3).map((modulo) => (
                  <div key={modulo.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{modulo.nombre}</h4>
                      <p className="text-sm text-muted-foreground">{modulo.descripcion}</p>
                      <Progress value={modulo.progreso} className="w-full mt-2" />
                    </div>
                    <Button 
                      size="sm" 
                      onClick={() => setSelectedTab("modulos")}
                      className="ml-4"
                    >
                      <Play className="w-3 h-3 mr-1" />
                      Continuar
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Últimas Lecciones</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {modulos
                  .flatMap(m => m.lecciones.map(l => ({ ...l, moduloNombre: m.nombre })))
                  .filter(l => l.completada)
                  .slice(-3)
                  .map((leccion) => (
                    <div key={leccion.id} className="flex items-center gap-3 p-3 border rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <div className="flex-1">
                        <h4 className="font-medium">{leccion.titulo}</h4>
                        <p className="text-sm text-muted-foreground">{leccion.moduloNombre}</p>
                      </div>
                      <Badge className={getTipoColor(leccion.tipo)}>
                        {leccion.tipo}
                      </Badge>
                    </div>
                  ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="modulos" className="space-y-6">
          <div className="grid gap-6">
            {modulos.map((modulo) => (
              <Card key={modulo.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {modulo.completado && <Trophy className="w-5 h-5 text-yellow-500" />}
                        {modulo.nombre}
                      </CardTitle>
                      <p className="text-muted-foreground">{modulo.descripcion}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{modulo.progreso.toFixed(0)}%</div>
                      <Progress value={modulo.progreso} className="w-32" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    {modulo.lecciones.map((leccion) => (
                      <div key={leccion.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
                        <div className="flex items-center gap-3">
                          {leccion.completada ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : (
                            <div className="w-5 h-5 border-2 border-muted rounded-full" />
                          )}
                          <div className="flex items-center gap-2">
                            {getCategoriaIcon(leccion.categoria)}
                            <span className="font-medium">{leccion.titulo}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={getTipoColor(leccion.tipo)}>
                            {leccion.tipo}
                          </Badge>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {leccion.duracion} min
                          </div>
                          {!leccion.completada && (
                            <Button 
                              size="sm" 
                              onClick={() => startLesson(leccion)}
                            >
                              <Play className="w-3 h-3 mr-1" />
                              Iniciar
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {leccionActual && (
          <TabsContent value="leccion" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {getCategoriaIcon(leccionActual.categoria)}
                      {leccionActual.titulo}
                    </CardTitle>
                    <p className="text-muted-foreground">{leccionActual.descripcion}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getTipoColor(leccionActual.tipo)}>
                      {leccionActual.tipo}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {leccionActual.duracion} min
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Lightbulb className="w-5 h-5" />
                    Contenido de la Lección
                  </h3>
                  <div className="space-y-3">
                    {leccionActual.contenido.map((item, index) => (
                      <div key={index} className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg">
                        <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium mt-1">
                          {index + 1}
                        </div>
                        <p className="flex-1 leading-relaxed">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {leccionActual.consejos && leccionActual.consejos.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Info className="w-5 h-5 text-blue-500" />
                      Consejos Prácticos
                    </h3>
                    <div className="space-y-2">
                      {leccionActual.consejos.map((consejo, index) => (
                        <div key={index} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <p className="text-blue-800">💡 {consejo}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {leccionActual.advertencias && leccionActual.advertencias.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-red-500" />
                      Advertencias Importantes
                    </h3>
                    <div className="space-y-2">
                      {leccionActual.advertencias.map((advertencia, index) => (
                        <div key={index} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-red-800">{advertencia}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {leccionActual.ejercicios && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Target className="w-5 h-5 text-green-500" />
                      Ejercicios Prácticos
                    </h3>
                    <div className="space-y-3">
                      {leccionActual.ejercicios.map((ejercicio, index) => (
                        <div key={index} className="p-4 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                              {index + 1}
                            </div>
                            <p className="flex-1 text-green-800">{ejercicio}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-6">
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedTab("modulos")}
                    className="flex-1"
                  >
                    Volver a Módulos
                  </Button>
                  <Button 
                    onClick={completeLesson}
                    className="flex-1"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Marcar como Completada
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default TutorialInteractivo;
