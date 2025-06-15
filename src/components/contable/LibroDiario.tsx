
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, FileText, Calendar, DollarSign } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

const LibroDiario = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [filterPeriod, setFilterPeriod] = useState("2024-06");
  const { toast } = useToast();

  const asientos = [
    {
      id: 1,
      numero: "001",
      fecha: "2024-06-15",
      concepto: "Venta de productos a Cliente ABC",
      referencia: "FAC-001234",
      total_debe: 1412.50,
      total_haber: 1412.50,
      estado: "Confirmado",
      detalles: [
        { cuenta: "1.1.01 - Caja", debe: 1412.50, haber: 0 },
        { cuenta: "4.1.01 - Ventas", debe: 0, haber: 1250.00 },
        { cuenta: "2.1.05 - IVA por Pagar", debe: 0, haber: 162.50 }
      ]
    },
    {
      id: 2,
      numero: "002",
      fecha: "2024-06-14",
      concepto: "Pago de servicios básicos",
      referencia: "REC-4567",
      total_debe: 850.00,
      total_haber: 850.00,
      estado: "Confirmado",
      detalles: [
        { cuenta: "5.2.01 - Gastos de Oficina", debe: 850.00, haber: 0 },
        { cuenta: "1.1.02 - Bancos", debe: 0, haber: 850.00 }
      ]
    },
    {
      id: 3,
      numero: "003",
      fecha: "2024-06-13",
      concepto: "Compra de suministros de oficina",
      referencia: "FAC-PROV-789",
      total_debe: 565.00,
      total_haber: 565.00,
      estado: "Borrador",
      detalles: [
        { cuenta: "5.2.01 - Gastos de Oficina", debe: 500.00, haber: 0 },
        { cuenta: "1.1.06 - IVA Crédito Fiscal", debe: 65.00, haber: 0 },
        { cuenta: "2.1.01 - Cuentas por Pagar", debe: 0, haber: 565.00 }
      ]
    }
  ];

  const cuentasContables = [
    { codigo: "1.1.01", nombre: "Caja", tipo: "Activo" },
    { codigo: "1.1.02", nombre: "Bancos", tipo: "Activo" },
    { codigo: "1.1.06", nombre: "IVA Crédito Fiscal", tipo: "Activo" },
    { codigo: "1.2.01", nombre: "Cuentas por Cobrar", tipo: "Activo" },
    { codigo: "2.1.01", nombre: "Cuentas por Pagar", tipo: "Pasivo" },
    { codigo: "2.1.05", nombre: "IVA por Pagar", tipo: "Pasivo" },
    { codigo: "3.1.01", nombre: "Capital Social", tipo: "Patrimonio" },
    { codigo: "4.1.01", nombre: "Ventas", tipo: "Ingresos" },
    { codigo: "5.1.01", nombre: "Sueldos y Salarios", tipo: "Gastos" },
    { codigo: "5.2.01", nombre: "Gastos de Oficina", tipo: "Gastos" }
  ];

  const filteredAsientos = asientos.filter(asiento =>
    asiento.concepto.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asiento.numero.includes(searchTerm) ||
    asiento.referencia.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSaveEntry = () => {
    toast({
      title: "Asiento guardado",
      description: "El asiento contable ha sido registrado correctamente.",
    });
    setShowNewEntry(false);
  };

  const getStatusColor = (estado: string) => {
    return estado === "Confirmado" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800";
  };

  const calcularTotales = () => {
    return filteredAsientos.reduce(
      (acc, asiento) => ({
        debe: acc.debe + asiento.total_debe,
        haber: acc.haber + asiento.total_haber
      }),
      { debe: 0, haber: 0 }
    );
  };

  const totales = calcularTotales();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Libro Diario</h2>
          <p className="text-slate-600">Registro cronológico de asientos contables</p>
        </div>
        
        <Dialog open={showNewEntry} onOpenChange={setShowNewEntry}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Asiento
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Nuevo Asiento Contable</DialogTitle>
              <DialogDescription>
                Registrar un nuevo asiento en el libro diario
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              {/* Datos generales */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="numero">Número de Asiento</Label>
                  <Input id="numero" placeholder="004" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fecha">Fecha</Label>
                  <Input id="fecha" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="referencia">Referencia</Label>
                  <Input id="referencia" placeholder="FAC-001, REC-002, etc." />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="concepto">Concepto</Label>
                <Textarea 
                  id="concepto" 
                  placeholder="Descripción del asiento contable..."
                  className="min-h-[60px]"
                />
              </div>

              {/* Detalles del asiento */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Detalle del Asiento</h3>
                
                {/* Fila de ejemplo */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg">
                  <div className="space-y-2">
                    <Label>Cuenta Contable</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar cuenta" />
                      </SelectTrigger>
                      <SelectContent>
                        {cuentasContables.map(cuenta => (
                          <SelectItem key={cuenta.codigo} value={cuenta.codigo}>
                            {cuenta.codigo} - {cuenta.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Debe</Label>
                    <Input type="number" placeholder="0.00" step="0.01" />
                  </div>
                  <div className="space-y-2">
                    <Label>Haber</Label>
                    <Input type="number" placeholder="0.00" step="0.01" />
                  </div>
                  <div className="flex items-end">
                    <Button size="sm" variant="outline">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Totales */}
              <div className="flex justify-end">
                <div className="w-64 space-y-2 p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between">
                    <span>Total Debe:</span>
                    <span className="font-mono">Bs. 0.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Haber:</span>
                    <span className="font-mono">Bs. 0.00</span>
                  </div>
                  <div className="flex justify-between font-bold border-t pt-2">
                    <span>Diferencia:</span>
                    <span className="font-mono">Bs. 0.00</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowNewEntry(false)}>
                Cancelar
              </Button>
              <Button variant="outline">
                Guardar Borrador
              </Button>
              <Button onClick={handleSaveEntry}>
                Confirmar Asiento
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar asientos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={filterPeriod} onValueChange={setFilterPeriod}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024-06">Junio 2024</SelectItem>
                <SelectItem value="2024-05">Mayo 2024</SelectItem>
                <SelectItem value="2024-04">Abril 2024</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                {filteredAsientos.length} asiento(s)
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de asientos */}
      <Card>
        <CardHeader>
          <CardTitle>Asientos Contables</CardTitle>
          <CardDescription>
            Registro cronológico de todas las transacciones contables
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredAsientos.map((asiento) => (
              <div key={asiento.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="font-mono text-lg font-bold">#{asiento.numero}</div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      {asiento.fecha}
                    </div>
                    <Badge className={getStatusColor(asiento.estado)}>
                      {asiento.estado}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Ref: {asiento.referencia}</div>
                  </div>
                </div>
                
                <div className="text-gray-800">{asiento.concepto}</div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Cuenta</th>
                        <th className="text-right p-2">Debe</th>
                        <th className="text-right p-2">Haber</th>
                      </tr>
                    </thead>
                    <tbody>
                      {asiento.detalles.map((detalle, index) => (
                        <tr key={index} className="border-b last:border-b-0">
                          <td className="p-2">{detalle.cuenta}</td>
                          <td className="p-2 text-right font-mono">
                            {detalle.debe > 0 ? `Bs. ${detalle.debe.toFixed(2)}` : '-'}
                          </td>
                          <td className="p-2 text-right font-mono">
                            {detalle.haber > 0 ? `Bs. ${detalle.haber.toFixed(2)}` : '-'}
                          </td>
                        </tr>
                      ))}
                      <tr className="font-bold bg-gray-50">
                        <td className="p-2">TOTALES</td>
                        <td className="p-2 text-right font-mono">Bs. {asiento.total_debe.toFixed(2)}</td>
                        <td className="p-2 text-right font-mono">Bs. {asiento.total_haber.toFixed(2)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Resumen de totales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-2xl font-bold text-red-600">Bs. {totales.debe.toFixed(2)}</p>
                <p className="text-sm text-gray-600">Total Debe</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-green-600">Bs. {totales.haber.toFixed(2)}</p>
                <p className="text-sm text-gray-600">Total Haber</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <FileText className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{asientos.length}</p>
                <p className="text-sm text-gray-600">Total Asientos</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LibroDiario;
