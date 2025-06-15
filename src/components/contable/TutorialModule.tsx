
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
        content: "Como administrador, tienes acceso total a todas las funcionalidades del sistema. Puedes gestionar usuarios, configurar el sistema, y supervisar todas las operaciones contables, de ventas y de compras. Este manual te guiará a través de cada módulo."
      },
      {
        id: "dashboard",
        title: "Dashboard",
        content: "El Dashboard te ofrece una vista general del estado de la empresa. Aquí puedes ver métricas clave como ventas, compras, y el estado de las facturas. Es tu centro de comando para la toma de decisiones."
      },
      {
        id: "facturacion",
        title: "Facturación",
        content: "Crea, gestiona y anula facturas de venta. El sistema genera automáticamente los asientos contables correspondientes, actualiza las cuentas por cobrar y disminuye el stock del inventario. Puedes ver el historial de cada factura y procesar sus pagos."
      },
      {
        id: "compras",
        title: "Compras",
        content: "Registra las compras a proveedores. Al ingresar una compra, se genera el asiento contable, se actualiza el inventario y se crea una cuenta por pagar. También puedes gestionar el pago a proveedores desde aquí."
      },
      {
        id: "contabilidad",
        title: "Módulos Contables (Plan de Cuentas, Libro Diario, Mayor, Balances)",
        content: "Esta es el área central de la contabilidad. Puedes definir tu plan de cuentas, consultar el libro diario con todos los asientos generados, revisar el libro mayor por cuenta, y generar los balances de comprobación y general. Todos los reportes se actualizan en tiempo real."
      },
      {
        id: "reportes",
        title: "Reportes",
        content: "Genera reportes financieros clave como el Estado de Resultados y la Declaración de IVA. Estos reportes se basan en la información contable registrada y te ayudan a cumplir con las obligaciones fiscales y a analizar la rentabilidad."
      },
      {
        id: "configuracion",
        title: "Configuración",
        content: "Desde aquí puedes gestionar los datos de tu empresa, los perfiles de usuario y otras configuraciones generales del sistema."
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
