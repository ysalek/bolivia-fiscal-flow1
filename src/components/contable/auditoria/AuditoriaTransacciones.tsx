import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Filter, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  FileText,
  Download,
  Eye,
  Shield
} from "lucide-react";

const AuditoriaTransacciones = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Datos simulados de auditoría
  const transaccionesAuditoria = [
    {
      id: "AUD001",
      fecha: "2024-01-15",
      usuario: "admin@empresa.com",
      accion: "Modificación de asiento",
      documento: "AST-001",
      estadoAnterior: "Borrador",
      estadoNuevo: "Aprobado",
      riesgo: "bajo",
      observaciones: "Cambio autorizado por supervisor"
    },
    {
      id: "AUD002", 
      fecha: "2024-01-14",
      usuario: "contador@empresa.com",
      accion: "Eliminación de factura",
      documento: "FAC-150",
      estadoAnterior: "Anulada",
      estadoNuevo: "Eliminada",
      riesgo: "alto",
      observaciones: "Eliminación sin autorización previa"
    },
    {
      id: "AUD003",
      fecha: "2024-01-13", 
      usuario: "vendedor@empresa.com",
      accion: "Creación de cliente",
      documento: "CLI-089",
      estadoAnterior: "N/A",
      estadoNuevo: "Activo",
      riesgo: "bajo",
      observaciones: "Cliente registrado correctamente"
    }
  ];

  const alertasSeguridad = [
    {
      tipo: "Acceso fuera de horario",
      usuario: "admin@empresa.com",
      fecha: "2024-01-15 23:45",
      riesgo: "medio",
      detalles: "Acceso al sistema fuera del horario laboral"
    },
    {
      tipo: "Múltiples intentos fallidos",
      usuario: "usuario@empresa.com", 
      fecha: "2024-01-14 10:30",
      riesgo: "alto",
      detalles: "5 intentos fallidos de inicio de sesión"
    }
  ];

  const getRiesgoColor = (riesgo: string) => {
    switch (riesgo) {
      case "alto": return "bg-red-100 text-red-800";
      case "medio": return "bg-yellow-100 text-yellow-800";
      case "bajo": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getRiesgoIcon = (riesgo: string) => {
    switch (riesgo) {
      case "alto": return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case "medio": return <Clock className="w-4 h-4 text-yellow-500" />;
      case "bajo": return <CheckCircle className="w-4 h-4 text-green-500" />;
      default: return <Shield className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Auditoría y Control</h2>
          <p className="text-muted-foreground">
            Monitoreo y auditoría de transacciones del sistema
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exportar Reporte
          </Button>
          <Button>
            <FileText className="w-4 h-4 mr-2" />
            Generar Auditoría
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Transacciones Hoy</p>
                <p className="text-2xl font-bold">127</p>
              </div>
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                <FileText className="w-4 h-4 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Alertas Activas</p>
                <p className="text-2xl font-bold text-red-600">3</p>
              </div>
              <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Usuarios Activos</p>
                <p className="text-2xl font-bold">8</p>
              </div>
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Integridad Datos</p>
                <p className="text-2xl font-bold text-green-600">99.8%</p>
              </div>
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <Shield className="w-4 h-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="transacciones" className="space-y-4">
        <TabsList>
          <TabsTrigger value="transacciones">Registro de Transacciones</TabsTrigger>
          <TabsTrigger value="alertas">Alertas de Seguridad</TabsTrigger>
          <TabsTrigger value="permisos">Control de Permisos</TabsTrigger>
          <TabsTrigger value="reportes">Reportes de Auditoría</TabsTrigger>
        </TabsList>

        <TabsContent value="transacciones" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Registro de Transacciones</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Buscar transacciones..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filtros
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID Auditoría</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Usuario</TableHead>
                    <TableHead>Acción</TableHead>
                    <TableHead>Documento</TableHead>
                    <TableHead>Riesgo</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transaccionesAuditoria.map((transaccion) => (
                    <TableRow key={transaccion.id}>
                      <TableCell className="font-medium">{transaccion.id}</TableCell>
                      <TableCell>{transaccion.fecha}</TableCell>
                      <TableCell>{transaccion.usuario}</TableCell>
                      <TableCell>{transaccion.accion}</TableCell>
                      <TableCell>{transaccion.documento}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getRiesgoIcon(transaccion.riesgo)}
                          <Badge className={getRiesgoColor(transaccion.riesgo)}>
                            {transaccion.riesgo.toUpperCase()}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alertas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Alertas de Seguridad</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {alertasSeguridad.map((alerta, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getRiesgoIcon(alerta.riesgo)}
                    <div>
                      <h4 className="font-medium">{alerta.tipo}</h4>
                      <p className="text-sm text-muted-foreground">
                        {alerta.usuario} - {alerta.fecha}
                      </p>
                      <p className="text-sm">{alerta.detalles}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getRiesgoColor(alerta.riesgo)}>
                      {alerta.riesgo.toUpperCase()}
                    </Badge>
                    <Button variant="outline" size="sm">
                      Revisar
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permisos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Control de Permisos por Usuario</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Módulo de control de permisos en desarrollo...
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reportes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reportes de Auditoría</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="h-24 flex flex-col">
                  <FileText className="w-8 h-8 mb-2" />
                  <span>Reporte Mensual</span>
                </Button>
                <Button variant="outline" className="h-24 flex flex-col">
                  <Shield className="w-8 h-8 mb-2" />
                  <span>Análisis de Seguridad</span>
                </Button>
                <Button variant="outline" className="h-24 flex flex-col">
                  <AlertTriangle className="w-8 h-8 mb-2" />
                  <span>Alertas por Usuario</span>
                </Button>
                <Button variant="outline" className="h-24 flex flex-col">
                  <CheckCircle className="w-8 h-8 mb-2" />
                  <span>Cumplimiento</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AuditoriaTransacciones;