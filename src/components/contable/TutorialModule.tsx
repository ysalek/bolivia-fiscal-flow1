
import { useAuth } from "@/components/auth/AuthProvider";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const TutorialModule = () => {
  const { user } = useAuth();
  const role = user?.rol || 'usuario';

  const tutorials = {
    admin: [
      {
        id: "general",
        title: "Bienvenida, Administrador",
        content: "Como administrador, tienes acceso total a todas las funcionalidades del sistema contable boliviano. Puedes gestionar usuarios, configurar el sistema, supervisar operaciones contables, y asegurar el cumplimiento de las normativas del SIN.\n\nTU RESPONSABILIDAD:\n• Configurar correctamente la empresa y datos fiscales\n• Gestionar usuarios y sus permisos de acceso\n• Supervisar la integridad de la información contable\n• Generar reportes para cumplimiento tributario\n• Mantener respaldos regulares del sistema"
      },
      {
        id: "dashboard",
        title: "Dashboard",
        content: "El Dashboard es tu centro de control principal. Desde aquí puedes:\n\n• MONITOREAR métricas en tiempo real (ventas, compras, inventario)\n• RECIBIR notificaciones importantes (stock bajo, vencimientos fiscales)\n• ACCEDER rápidamente a funciones críticas\n• VISUALIZAR el estado financiero general\n\nCLIC en el ícono de campana (🔔) para ver notificaciones importantes del sistema."
      },
      {
        id: "facturacion",
        title: "Facturación",
        content: "PROCESO COMPLETO DE FACTURACIÓN:\n\n1. CREAR FACTURA: Selecciona cliente y productos\n2. CÁLCULO AUTOMÁTICO: IVA, IT, RC-IVA según normativa SIN\n3. INTEGRACIÓN CONTABLE: Genera asientos automáticamente\n4. ACTUALIZACIÓN STOCK: Reduce inventario en tiempo real\n5. CUENTAS POR COBRAR: Registra pendientes de cobro\n\nIMPORTANTE: Las facturas deben cumplir formato SIN y tener numeración autorizada."
      },
      {
        id: "compras",
        title: "Compras",
        content: "Registra las compras a proveedores. Al ingresar una compra, se genera el asiento contable, se actualiza el inventario y se crea una cuenta por pagar. También puedes gestionar el pago a proveedores desde aquí."
      },
      {
        id: "contabilidad",
        title: "Módulos Contables (Plan de Cuentas, Libro Diario, Mayor, Balances)",
        content: "NÚCLEO DEL SISTEMA CONTABLE:\n\n• PLAN DE CUENTAS: Estructura según normativa boliviana (activos, pasivos, patrimonio, ingresos, gastos)\n• LIBRO DIARIO: Registro cronológico de todas las transacciones con partida doble\n• LIBRO MAYOR: Movimientos detallados por cada cuenta contable\n• BALANCE DE COMPROBACIÓN: Verificación de saldos deudores y acreedores\n• BALANCE GENERAL: Estado de situación patrimonial\n\nTODO SE ACTUALIZA AUTOMÁTICAMENTE con cada transacción registrada."
      },
      {
        id: "reportes",
        title: "Reportes",
        content: "REPORTES PARA CUMPLIMIENTO Y ANÁLISIS:\n\n• ESTADO DE RESULTADOS: Ingresos, costos y gastos del período\n• DECLARACIÓN IVA: Formularios 200 y 603 para el SIN\n• BALANCE GENERAL: Situación patrimonial de la empresa\n• FLUJO DE CAJA: Entradas y salidas de efectivo\n• ANÁLISIS FINANCIERO: Ratios e indicadores de gestión\n\nTODOS los reportes se generan en tiempo real y pueden exportarse en PDF/Excel."
      },
      {
        id: "configuracion",
        title: "Configuración",
        content: "CONFIGURACIÓN CRÍTICA DEL SISTEMA:\n\n• DATOS EMPRESA: NIT, razón social, dirección, actividad económica\n• USUARIOS: Crear cuentas (admin, contador, ventas) con permisos específicos\n• NUMERACIÓN: Configurar secuencias de facturas autorizadas por SIN\n• IMPUESTOS: Configurar tasas de IVA, IT, RC-IVA vigentes\n• RESPALDOS: Programar copias de seguridad automáticas\n\nESTOS DATOS SON FUNDAMENTALES para el correcto funcionamiento del sistema."
      }
    ],
    contador: [
       {
        id: "general",
        title: "Bienvenida, Contador",
        content: "Como contador, tu rol es fundamental para mantener la salud financiera de la empresa. Tienes acceso a todos los módulos contables, de compras y de gestión de inventario para asegurar que la información sea precisa y esté al día."
      },
      {
        id: "contabilidad",
        title: "Módulos Contables (Plan de Cuentas, Libro Diario, Mayor, Balances)",
        content: "Tu área principal de trabajo. Aquí puedes definir y ajustar el plan de cuentas, verificar cada asiento contable en el Libro Diario, analizar los movimientos por cuenta en el Libro Mayor, y generar los balances financieros (Comprobación y General) para asegurar que todo cuadre."
      },
      {
        id: "reportes",
        title: "Reportes",
        content: "Genera el Estado de Resultados para ver la rentabilidad y prepara la Declaración de IVA para los impuestos. Los datos se toman automáticamente de los asientos registrados, facilitando tu trabajo."
      },
       {
        id: "compras",
        title: "Compras",
        content: "Supervisa y registra las compras. Cada compra genera su asiento contable y actualiza las cuentas por pagar. Puedes procesar los pagos a proveedores y el sistema registrará la salida de dinero."
      },
       {
        id: "inventario",
        title: "Inventario",
        content: "Controla las entradas y salidas de inventario. El sistema utiliza un método de costeo (ej. PEPS) para valorar tu stock y genera los asientos de costo de venta automáticamente cuando se realiza una venta."
      },
    ],
    ventas: [
      {
        id: "general",
        title: "Bienvenida, Equipo de Ventas",
        content: "Tu objetivo es generar ventas y gestionar la relación con los clientes. El sistema te proporciona las herramientas para facturar de manera rápida y eficiente."
      },
      {
        id: "dashboard",
        title: "Dashboard",
        content: "Aquí puedes ver un resumen de tus ventas y el estado de tus facturas. Es una herramienta útil para seguir tus metas."
      },
       {
        id: "facturacion",
        title: "Facturación",
        content: "Este es tu módulo principal. Desde aquí puedes crear nuevas facturas para los clientes. Al crear una factura, el sistema descuenta el producto del inventario y registra la venta automáticamente. También puedes consultar el estado de tus facturas (pendientes, pagadas)."
      },
      {
        id: "clientes",
        title: "Clientes",
        content: "Gestiona la base de datos de clientes. Puedes añadir nuevos clientes o editar la información de los existentes. Tener la información correcta es clave para una facturación sin errores."
      },
      {
        id: "productos",
        title: "Productos",
        content: "Consulta el catálogo de productos, sus precios y el stock disponible. Esta información es crucial para saber qué puedes vender."
      }
    ],
    usuario: [
        {
            id: "general",
            title: "Bienvenido",
            content: "Hola. Tu perfil de usuario tiene acceso limitado. Actualmente, solo puedes ver el Dashboard principal con un resumen de la actividad de la empresa."
        },
        {
            id: "dashboard",
            title: "Dashboard",
            content: "El Dashboard te muestra indicadores clave del rendimiento del negocio. Es una vista de solo lectura para mantenerte informado."
        }
    ]
  };

  const tutorialContent = tutorials[role as keyof typeof tutorials] || tutorials.usuario;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Manual de Usuario</h2>
        <p className="text-muted-foreground">
          Guía detallada del sistema según tu perfil de <span className="font-semibold">{role}</span>.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Guía por Módulos</CardTitle>
          <CardDescription>
            Haz clic en cada sección para expandir y ver los detalles de cómo funciona.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {tutorialContent.map((item) => (
              <AccordionItem value={item.id} key={item.id}>
                <AccordionTrigger className="text-lg">{item.title}</AccordionTrigger>
                <AccordionContent className="text-base leading-relaxed whitespace-pre-wrap">
                  {item.content}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
};

export default TutorialModule;
