
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Download, 
  Calendar, 
  BarChart3, 
  DollarSign,
  TrendingUp,
  PieChart,
  FileBarChart
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAsientos } from "@/hooks/useAsientos";
import { useReportesContables } from "@/hooks/useReportesContables";

const ReportesModule = () => {
  const [fechaInicio, setFechaInicio] = useState("2025-06-01");
  const [fechaFin, setFechaFin] = useState("2025-06-30");
  const { toast } = useToast();
  const { getAsientos } = useAsientos();
  const { getBalanceSheetData, getIncomeStatementData, getDeclaracionIVAData } = useReportesContables();

  const reportes = [
    {
      id: "libro-compras",
      titulo: "Libro de Compras",
      descripcion: "Registro de todas las compras realizadas",
      icon: FileText,
      categoria: "Libros Auxiliares",
      obligatorio: true
    },
    {
      id: "libro-ventas",
      titulo: "Libro de Ventas",
      descripcion: "Registro de todas las ventas realizadas",
      icon: FileText,
      categoria: "Libros Auxiliares",
      obligatorio: true
    },
    {
      id: "balance-general",
      titulo: "Balance General",
      descripcion: "Estado de situación financiera",
      icon: BarChart3,
      categoria: "Estados Financieros",
      obligatorio: true
    },
    {
      id: "estado-resultados",
      titulo: "Estado de Resultados",
      descripcion: "Ingresos y gastos del período",
      icon: TrendingUp,
      categoria: "Estados Financieros",
      obligatorio: true
    },
    {
      id: "flujo-efectivo",
      titulo: "Flujo de Efectivo",
      descripcion: "Movimientos de efectivo",
      icon: DollarSign,
      categoria: "Estados Financieros",
      obligatorio: false
    },
    {
      id: "patrimonio",
      titulo: "Estado de Patrimonio",
      descripcion: "Cambios en el patrimonio",
      icon: PieChart,
      categoria: "Estados Financieros",
      obligatorio: false
    },
    {
      id: "declaracion-iva",
      titulo: "Declaración de IVA",
      descripcion: "Formulario 200 - Declaración mensual",
      icon: FileBarChart,
      categoria: "Declaraciones",
      obligatorio: true
    },
    {
      id: "rc-iva",
      titulo: "RC-IVA",
      descripcion: "Régimen Complementario al IVA",
      icon: FileBarChart,
      categoria: "Declaraciones",
      obligatorio: false
    }
  ];

  const generarReporte = (reporteId: string) => {
    const reporte = reportes.find(r => r.id === reporteId);
    toast({
      title: "Reporte generado",
      description: `${reporte?.titulo} generado para el período del ${new Date(fechaInicio).toLocaleDateString()} al ${new Date(fechaFin).toLocaleDateString()}`,
    });
  };

  const generarContenidoReporte = (reporteId: string, formato: string): string => {
    const reporte = reportes.find(r => r.id === reporteId);
    let datos: string[][] = [];

    switch(reporteId) {
      case "libro-compras": {
        datos.push(["Fecha", "Número", "Concepto", "Referencia", "Total"]);
        const compras = getAsientos().filter(a => a.numero.startsWith('CMP-'));
        compras.forEach(a => datos.push([new Date(a.fecha).toLocaleDateString(), a.numero, a.concepto, a.referencia, a.debe.toFixed(2)]));
        if (compras.length === 0) {
            toast({ title: "Sin datos", description: "No se encontraron compras en el período." });
            return "";
        }
        break;
      }
      case "libro-ventas": {
        datos.push(["Fecha", "Número", "Concepto", "Referencia", "Total"]);
        const ventas = getAsientos().filter(a => a.numero.startsWith('VTA-'));
        ventas.forEach(a => datos.push([new Date(a.fecha).toLocaleDateString(), a.numero, a.concepto, a.referencia, a.debe.toFixed(2)]));
        if (ventas.length === 0) {
            toast({ title: "Sin datos", description: "No se encontraron ventas en el período." });
            return "";
        }
        break;
      }
      case "balance-general": {
        const { activos, pasivos, patrimonio, totalPasivoPatrimonio, ecuacionCuadrada } = getBalanceSheetData();
        if (!ecuacionCuadrada) {
            toast({ title: "Balance Descuadrado", description: "No se puede generar el reporte.", variant: "destructive" });
            return "";
        }
        datos.push(["Tipo", "Código", "Cuenta", "Saldo (Bs.)"]);
        datos.push(["ACTIVOS", "", "", ""]);
        activos.cuentas.forEach(c => datos.push(["", c.codigo, c.nombre, c.saldo.toFixed(2)]));
        datos.push(["", "Total Activos", "", activos.total.toFixed(2)]);
        datos.push(["PASIVOS", "", "", ""]);
        pasivos.cuentas.forEach(c => datos.push(["", c.codigo, c.nombre, c.saldo.toFixed(2)]));
        datos.push(["", "Total Pasivos", "", pasivos.total.toFixed(2)]);
        datos.push(["PATRIMONIO", "", "", ""]);
        patrimonio.cuentas.forEach(c => datos.push(["", c.codigo, c.nombre, c.saldo.toFixed(2)]));
        datos.push(["", "Total Patrimonio", "", patrimonio.total.toFixed(2)]);
        datos.push(["", "Total Pasivo + Patrimonio", "", totalPasivoPatrimonio.toFixed(2)]);
        break;
      }
      case "estado-resultados": {
        const { ingresos, gastos, utilidadNeta } = getIncomeStatementData();
        datos.push(["Tipo", "Código", "Cuenta", "Saldo (Bs.)"]);
        datos.push(["INGRESOS", "", "", ""]);
        ingresos.cuentas.forEach(c => datos.push(["", c.codigo, c.nombre, c.saldo.toFixed(2)]));
        datos.push(["", "Total Ingresos", "", ingresos.total.toFixed(2)]);
        datos.push(["GASTOS", "", "", ""]);
        gastos.cuentas.forEach(c => datos.push(["", c.codigo, c.nombre, c.saldo.toFixed(2)]));
        datos.push(["", "Total Gastos", "", gastos.total.toFixed(2)]);
        datos.push(["", "UTILIDAD (O PÉRDIDA) NETA", "", utilidadNeta.toFixed(2)]);
        break;
      }
      case "declaracion-iva": {
        const { ventas, compras, saldo } = getDeclaracionIVAData({ fechaInicio, fechaFin });
        
        if (ventas.baseImponible === 0 && compras.baseImponible === 0) {
           toast({ title: "Sin datos", description: "No se encontraron ventas ni compras en el período." });
           return "";
        }

        datos.push(["Concepto", "Base Imponible (Bs.)", "Débito / Crédito Fiscal (Bs.)"]);
        datos.push(["Total Ventas (genera Débito Fiscal)", ventas.baseImponible.toFixed(2), ventas.debitoFiscal.toFixed(2)]);
        datos.push(["Total Compras (genera Crédito Fiscal)", compras.baseImponible.toFixed(2), compras.creditoFiscal.toFixed(2)]);
        datos.push(["", "", ""]);
        if (saldo.aFavorFisco > 0) {
            datos.push(["Saldo a favor del Fisco", "", saldo.aFavorFisco.toFixed(2)]);
        } else {
            datos.push(["Saldo a favor del Contribuyente", "", saldo.aFavorContribuyente.toFixed(2)]);
        }
        break;
      }
      default: {
        const datosEjemplo: { [key: string]: string[][] } = {
          "flujo-efectivo": [
            ["Categoría", "Descripción", "Importe"],
            ["Operativo", "Cobro a clientes", "5000.00"],
            ["Operativo", "Pago a proveedores", "-2000.00"],
            ["NOTA: Reporte con datos de demostración.", "", ""],
          ],
          "patrimonio": [
            ["Concepto", "Capital", "Reservas", "Resultados Acumulados"],
            ["Saldo Inicial", "70000.00", "5000.00", "10000.00"],
            ["Utilidad del Ejercicio", "0.00", "0.00", "15000.00"],
            ["Saldo Final", "70000.00", "5000.00", "25000.00"],
            ["NOTA: Reporte con datos de demostración.", "", ""],
          ],
          "rc-iva": [
            ["Dependiente", "Sueldo Neto", "Base Imponible", "RC-IVA"],
            ["Juan Pérez", "6000.00", "0.00", "0.00"],
            ["María Gómez", "9000.00", "800.00", "104.00"],
            ["NOTA: Módulo de sueldos no implementado.", "", ""],
          ]
        };
        datos = datosEjemplo[reporteId] || [ ["No implementado"], ["Este reporte aún no está disponible con datos reales."] ];
        break;
      }
    }

    if (formato === 'csv') {
      let contenidoCsv = `${reporte?.titulo}\n`;
      contenidoCsv += `Período: ${new Date(fechaInicio).toLocaleDateString()} al ${new Date(fechaFin).toLocaleDateString()}\n\n`;
      datos.forEach(fila => { contenidoCsv += fila.join(',') + '\n'; });
      return contenidoCsv;
    }

    if (formato === 'html') {
      let contenidoHtml = `
        <html><head><title>${reporte?.titulo}</title><style>body{font-family:sans-serif} table{width:100%;border-collapse:collapse} th,td{border:1px solid #ddd;padding:8px} th{background-color:#f2f2f2} tr:last-child{font-weight:bold;}</style></head>
        <body><h1>${reporte?.titulo}</h1><p>Período: ${new Date(fechaInicio).toLocaleDateString()} al ${new Date(fechaFin).toLocaleDateString()}</p><table>`;
      datos.forEach((fila, index) => {
        const tag = index === 0 ? 'th' : 'td';
        contenidoHtml += `<tr>${fila.map(celda => `<${tag}>${celda}</${tag}>`).join('')}</tr>`;
      });
      contenidoHtml += `</table></body></html>`;
      return contenidoHtml;
    }
    return '';
  };

  const descargarArchivo = (contenido: string, nombreArchivo: string, tipoMime: string) => {
    const blob = new Blob([contenido], { type: tipoMime });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = nombreArchivo;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportarReporte = (reporteId: string, formato: string) => {
    const reporte = reportes.find(r => r.id === reporteId);
    if (!reporte) return;

    try {
      if (formato === 'pdf') {
        const contenidoHtml = generarContenidoReporte(reporteId, 'html');
        if (!contenidoHtml) return;
        const ventana = window.open('', '_blank');
        if (ventana) {
          ventana.document.write(contenidoHtml);
          ventana.document.close();
          setTimeout(() => { ventana.print(); }, 500);
        }
        toast({ title: "Reporte PDF listo", description: "Utilice la función de impresión para guardar como PDF." });
      } else if (formato === 'excel') {
        const contenidoCsv = generarContenidoReporte(reporteId, 'csv');
        if (!contenidoCsv) return;
        const nombreArchivo = `${reporte.id}_${new Date().toISOString().split('T')[0]}.csv`;
        descargarArchivo(contenidoCsv, nombreArchivo, 'text/csv;charset=utf-8;');
        toast({ title: "Reporte Excel descargado", description: `${nombreArchivo} ha sido descargado.` });
      }
    } catch (error) {
      toast({ title: "Error al exportar", variant: "destructive" });
    }
  };
  
  const categorias = [...new Set(reportes.map(r => r.categoria))];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Período de Consulta</CardTitle>
          <CardDescription>Seleccione el rango de fechas para los reportes.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2"><Label htmlFor="fechaInicio">Fecha Inicio</Label><Input id="fechaInicio" type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} /></div>
          <div className="space-y-2"><Label htmlFor="fechaFin">Fecha Fin</Label><Input id="fechaFin" type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} /></div>
          <div className="space-y-2"><Label>Período</Label><div className="flex items-center gap-2 h-10 px-3 bg-slate-100 rounded-md"><Calendar className="w-4 h-4" /><span className="text-sm">{new Date(fechaInicio).toLocaleDateString()} - {new Date(fechaFin).toLocaleDateString()}</span></div></div>
        </CardContent>
      </Card>

      {categorias.map(categoria => (
        <Card key={categoria}>
          <CardHeader><CardTitle>{categoria}</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reportes.filter(r => r.categoria === categoria).map(reporte => {
              const Icon = reporte.icon;
              return (
                <div key={reporte.id} className="border rounded-lg p-4 flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"><Icon className="w-5 h-5 text-blue-600" /></div>
                        <div>
                          <h3 className="font-medium">{reporte.titulo}</h3>
                          <p className="text-sm text-slate-600">{reporte.descripcion}</p>
                        </div>
                      </div>
                      {reporte.obligatorio && <Badge variant="secondary" className="text-xs">Obligatorio</Badge>}
                    </div>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Button size="sm" onClick={() => generarReporte(reporte.id)} className="flex-1"><FileText className="w-4 h-4 mr-2" />Generar</Button>
                    <Button size="sm" variant="outline" onClick={() => exportarReporte(reporte.id, 'pdf')}><Download className="w-4 h-4 mr-2" />PDF</Button>
                    <Button size="sm" variant="outline" onClick={() => exportarReporte(reporte.id, 'excel')}><Download className="w-4 h-4 mr-2" />Excel</Button>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ReportesModule;
