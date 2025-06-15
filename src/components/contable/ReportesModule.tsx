
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

const ReportesModule = () => {
  const [fechaInicio, setFechaInicio] = useState("2024-06-01");
  const [fechaFin, setFechaFin] = useState("2024-06-30");
  const [tipoReporte, setTipoReporte] = useState("");
  const { toast } = useToast();

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
      description: `${reporte?.titulo} generado para el período ${fechaInicio} - ${fechaFin}`,
    });
  };

  const exportarReporte = (reporteId: string, formato: string) => {
    const reporte = reportes.find(r => r.id === reporteId);
    toast({
      title: "Reporte exportado",
      description: `${reporte?.titulo} exportado en formato ${formato.toUpperCase()}`,
    });
  };

  const categorias = [...new Set(reportes.map(r => r.categoria))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Reportes Contables</h2>
          <p className="text-slate-600">Generación de reportes y estados financieros</p>
        </div>
      </div>

      {/* Filtros generales */}
      <Card>
        <CardHeader>
          <CardTitle>Período de Consulta</CardTitle>
          <CardDescription>
            Selecciona el rango de fechas para generar los reportes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fechaInicio">Fecha Inicio</Label>
              <Input
                id="fechaInicio"
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fechaFin">Fecha Fin</Label>
              <Input
                id="fechaFin"
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Período Seleccionado</Label>
              <div className="flex items-center gap-2 h-10 px-3 bg-slate-100 rounded-md">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">
                  {new Date(fechaInicio).toLocaleDateString()} - {new Date(fechaFin).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reportes por categoría */}
      {categorias.map(categoria => (
        <Card key={categoria}>
          <CardHeader>
            <CardTitle>{categoria}</CardTitle>
            <CardDescription>
              {categoria === "Libros Auxiliares" && "Libros obligatorios según normativa tributaria"}
              {categoria === "Estados Financieros" && "Estados financieros básicos y complementarios"}
              {categoria === "Declaraciones" && "Formularios de declaración de impuestos"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reportes.filter(r => r.categoria === categoria).map(reporte => {
                const Icon = reporte.icon;
                return (
                  <div key={reporte.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Icon className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">{reporte.titulo}</h3>
                          <p className="text-sm text-slate-600">{reporte.descripcion}</p>
                        </div>
                      </div>
                      {reporte.obligatorio && (
                        <Badge variant="secondary" className="text-xs">
                          Obligatorio
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        onClick={() => generarReporte(reporte.id)}
                        className="flex-1"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Generar
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => exportarReporte(reporte.id, 'pdf')}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        PDF
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => exportarReporte(reporte.id, 'excel')}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Excel
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Resumen de reportes pendientes */}
      <Card>
        <CardHeader>
          <CardTitle>Estado de Reportes</CardTitle>
          <CardDescription>
            Resumen del estado de los reportes obligatorios
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">4</div>
              <div className="text-sm text-green-700">Reportes Generados</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">2</div>
              <div className="text-sm text-yellow-700">Pendientes</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">6</div>
              <div className="text-sm text-blue-700">Total Reportes</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">100%</div>
              <div className="text-sm text-purple-700">Cumplimiento</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportesModule;
