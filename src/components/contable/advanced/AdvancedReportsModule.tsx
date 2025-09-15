import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  FileText, 
  Download, 
  TrendingUp, 
  BarChart3, 
  PieChart, 
  Calendar,
  Filter,
  Eye,
  Printer,
  Mail,
  DollarSign,
  Package,
  Users,
  ShoppingCart
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Report {
  id: string;
  title: string;
  description: string;
  category: string;
  format: string[];
  icon: any;
  data?: any;
  lastGenerated?: string;
}

const AdvancedReportsModule = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    initializeReports();
  }, []);

  const initializeReports = () => {
    const availableReports: Report[] = [
      {
        id: 'balance-general',
        title: 'Balance General',
        description: 'Estado de situación financiera con activos, pasivos y patrimonio',
        category: 'Financiero',
        format: ['PDF', 'Excel', 'HTML'],
        icon: BarChart3
      },
      {
        id: 'estado-resultados',
        title: 'Estado de Resultados',
        description: 'Ingresos, gastos y utilidad del período',
        category: 'Financiero',
        format: ['PDF', 'Excel'],
        icon: TrendingUp
      },
      {
        id: 'flujo-caja',
        title: 'Flujo de Caja',
        description: 'Movimientos de efectivo por actividades operativas, inversión y financiamiento',
        category: 'Financiero',
        format: ['PDF', 'Excel'],
        icon: DollarSign
      },
      {
        id: 'balance-comprobacion',
        title: 'Balance de Comprobación',
        description: 'Saldos de todas las cuentas contables',
        category: 'Contable',
        format: ['PDF', 'Excel'],
        icon: FileText
      },
      {
        id: 'libro-diario',
        title: 'Libro Diario',
        description: 'Registro cronológico de todas las transacciones',
        category: 'Contable',
        format: ['PDF', 'Excel'],
        icon: FileText
      },
      {
        id: 'libro-mayor',
        title: 'Libro Mayor',
        description: 'Movimientos por cuenta contable',
        category: 'Contable',
        format: ['PDF', 'Excel'],
        icon: FileText
      },
      {
        id: 'inventario-valorizado',
        title: 'Inventario Valorizado',
        description: 'Stock actual con valores de costo y venta',
        category: 'Inventario',
        format: ['PDF', 'Excel'],
        icon: Package
      },
      {
        id: 'kardex-productos',
        title: 'Kardex de Productos',
        description: 'Movimientos detallados por producto',
        category: 'Inventario',
        format: ['PDF', 'Excel'],
        icon: Package
      },
      {
        id: 'ventas-clientes',
        title: 'Ventas por Cliente',
        description: 'Análisis de ventas agrupado por cliente',
        category: 'Ventas',
        format: ['PDF', 'Excel'],
        icon: Users
      },
      {
        id: 'compras-proveedores',
        title: 'Compras por Proveedor',
        description: 'Análisis de compras agrupado por proveedor',
        category: 'Compras',
        format: ['PDF', 'Excel'],
        icon: ShoppingCart
      },
      {
        id: 'cuentas-cobrar',
        title: 'Cuentas por Cobrar',
        description: 'Análisis de antigüedad de saldos por cobrar',
        category: 'Cartera',
        format: ['PDF', 'Excel'],
        icon: DollarSign
      },
      {
        id: 'cuentas-pagar',
        title: 'Cuentas por Pagar',
        description: 'Análisis de antigüedad de saldos por pagar',
        category: 'Cartera',
        format: ['PDF', 'Excel'],
        icon: DollarSign
      }
    ];

    setReports(availableReports);
  };

  const generateReport = async (report: Report, format: string) => {
    setIsGenerating(true);
    setGenerationProgress(0);
    setSelectedReport(report);

    try {
      // Simular generación de reporte
      const steps = [
        'Consultando base de datos...',
        'Procesando información...',
        'Aplicando formatos...',
        'Generando archivo...',
        'Finalizando reporte...'
      ];

      for (let i = 0; i < steps.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 800));
        setGenerationProgress((i + 1) / steps.length * 100);
        
        toast({
          title: "Generando reporte",
          description: steps[i],
          variant: "default"
        });
      }

      // Simular descarga del archivo
      const fileName = `${report.id}-${new Date().toISOString().slice(0, 10)}.${format.toLowerCase()}`;
      
      // Crear contenido del reporte según el tipo
      let content = generateReportContent(report);
      
      if (format === 'PDF') {
        // Simular PDF
        content = `PDF Report: ${report.title}\n\n${content}`;
      } else if (format === 'Excel') {
        // Simular Excel
        content = `Excel Report: ${report.title}\n\n${content}`;
      }

      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(url);

      // Actualizar fecha de generación
      setReports(prev => prev.map(r => 
        r.id === report.id 
          ? { ...r, lastGenerated: new Date().toISOString() }
          : r
      ));

      toast({
        title: "Reporte generado",
        description: `${report.title} descargado como ${format}`,
        variant: "default"
      });

    } catch (error) {
      toast({
        title: "Error al generar reporte",
        description: "No se pudo completar la generación del reporte",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
      setGenerationProgress(0);
      setSelectedReport(null);
    }
  };

  const generateReportContent = (report: Report): string => {
    const currentDate = new Date().toLocaleDateString();
    
    switch (report.id) {
      case 'balance-general':
        return `BALANCE GENERAL
Al ${currentDate}

ACTIVOS
Activo Corriente
  Caja y Bancos                 150,000.00
  Cuentas por Cobrar             80,000.00
  Inventarios                   120,000.00
  Total Activo Corriente        350,000.00

Activo No Corriente
  Propiedad, Planta y Equipo    200,000.00
  Total Activo No Corriente     200,000.00

TOTAL ACTIVOS                   550,000.00

PASIVOS
Pasivo Corriente
  Cuentas por Pagar              60,000.00
  Obligaciones Tributarias       15,000.00
  Total Pasivo Corriente         75,000.00

PATRIMONIO
  Capital Social                300,000.00
  Utilidades Retenidas          175,000.00
  Total Patrimonio              475,000.00

TOTAL PASIVOS Y PATRIMONIO      550,000.00`;

      case 'estado-resultados':
        return `ESTADO DE RESULTADOS
Del 01 al ${currentDate}

INGRESOS
Ventas                          500,000.00
Otros Ingresos                   10,000.00
Total Ingresos                  510,000.00

COSTOS Y GASTOS
Costo de Ventas                 300,000.00
Gastos Operativos                80,000.00
Gastos Administrativos           50,000.00
Total Costos y Gastos           430,000.00

UTILIDAD ANTES DE IMPUESTOS      80,000.00
Impuesto a las Utilidades        20,000.00

UTILIDAD NETA                    60,000.00`;

      case 'inventario-valorizado':
        return `INVENTARIO VALORIZADO
Al ${currentDate}

PRODUCTO                    CANTIDAD    COSTO UNIT.    TOTAL
Aceite Selecto 1L               177         15.61     2,762.97
Aceite Fino 1L                  150         16.02     2,403.00
Azúcar Aguaí 1kg                200          5.18     1,036.00
Azúcar Guabirá 2kg              100         10.88     1,088.00

TOTAL INVENTARIO                                      7,289.97`;

      default:
        return `REPORTE: ${report.title.toUpperCase()}
Generado el: ${currentDate}

Este es un reporte de ejemplo que contiene la información
procesada del sistema contable boliviano.

Datos incluidos:
- Información actualizada al ${currentDate}
- Totales y subtotales calculados
- Formato profesional compatible con normativas bolivianas
- Desglose detallado por categorías`;
    }
  };

  const previewReport = (report: Report) => {
    const content = generateReportContent(report);
    alert(`Vista previa de ${report.title}:\n\n${content.substring(0, 300)}...`);
  };

  const categories = [...new Set(reports.map(r => r.category))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Reportes Avanzados</h2>
          <p className="text-muted-foreground">
            Generación de reportes contables y financieros profesionales
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline">
            {reports.length} reportes disponibles
          </Badge>
        </div>
      </div>

      {/* Progress Bar */}
      {isGenerating && generationProgress > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Generando: {selectedReport?.title}</span>
                <span>{Math.round(generationProgress)}%</span>
              </div>
              <Progress value={generationProgress} />
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all">Todos</TabsTrigger>
          {categories.map(category => (
            <TabsTrigger key={category} value={category}>
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reports.map((report) => (
              <ReportCard 
                key={report.id}
                report={report}
                onGenerate={generateReport}
                onPreview={previewReport}
                isGenerating={isGenerating}
              />
            ))}
          </div>
        </TabsContent>

        {categories.map(category => (
          <TabsContent key={category} value={category} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {reports
                .filter(report => report.category === category)
                .map((report) => (
                  <ReportCard 
                    key={report.id}
                    report={report}
                    onGenerate={generateReport}
                    onPreview={previewReport}
                    isGenerating={isGenerating}
                  />
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

interface ReportCardProps {
  report: Report;
  onGenerate: (report: Report, format: string) => void;
  onPreview: (report: Report) => void;
  isGenerating: boolean;
}

const ReportCard: React.FC<ReportCardProps> = ({ 
  report, 
  onGenerate, 
  onPreview, 
  isGenerating 
}) => {
  const IconComponent = report.icon;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <IconComponent className="w-6 h-6 text-primary" />
          <div className="flex-1">
            <CardTitle className="text-lg">{report.title}</CardTitle>
            <Badge variant="secondary" className="text-xs">
              {report.category}
            </Badge>
          </div>
        </div>
        <CardDescription className="text-sm">
          {report.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {report.lastGenerated && (
          <div className="text-xs text-muted-foreground">
            Último: {new Date(report.lastGenerated).toLocaleString()}
          </div>
        )}
        
        <div className="flex space-x-2">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => onPreview(report)}
            disabled={isGenerating}
          >
            <Eye className="w-3 h-3 mr-1" />
            Vista
          </Button>
          {report.format.map(format => (
            <Button 
              key={format}
              size="sm"
              onClick={() => onGenerate(report, format)}
              disabled={isGenerating}
            >
              <Download className="w-3 h-3 mr-1" />
              {format}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AdvancedReportsModule;