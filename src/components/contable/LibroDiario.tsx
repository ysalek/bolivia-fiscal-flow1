
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, FileText, Search, Download } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const LibroDiario = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [filterMonth, setFilterMonth] = useState("all");

  const asientos = [
    {
      id: 1,
      fecha: "2024-06-15",
      numero: "AST-001",
      concepto: "Venta de servicios - Factura 001234",
      debe: [
        { cuenta: "1.1.01 - Caja", codigo: "110100", monto: 1412.50 }
      ],
      haber: [
        { cuenta: "4.1.01 - Ventas", codigo: "410100", monto: 1250.00 },
        { cuenta: "2.1.05 - IVA por Pagar", codigo: "210500", monto: 162.50 }
      ],
      estado: "Registrado",
      usuario: "Admin"
    },
    {
      id: 2,
      fecha: "2024-06-14",
      numero: "AST-002",
      concepto: "Pago de salarios - Mes de junio",
      debe: [
        { cuenta: "5.1.01 - Sueldos y Salarios", codigo: "510100", monto: 15000.00 }
      ],
      haber: [
        { cuenta: "1.1.01 - Caja", codigo: "110100", monto: 12000.00 },
        { cuenta: "2.1.01 - Retenciones por Pagar", codigo: "210100", monto: 3000.00 }
      ],
      estado: "Registrado",
      usuario: "Contador"
    },
    {
      id: 3,
      fecha: "2024-06-13",
      numero: "AST-003",
      concepto: "Compra de suministros de oficina",
      debe: [
        { cuenta: "5.2.01 - Gastos de Oficina", codigo: "520100", monto: 850.00 },
        { cuenta: "1.1.06 - IVA Crédito Fiscal", codigo: "110600", monto: 110.50 }
      ],
      haber: [
        { cuenta: "1.1.01 - Caja", codigo: "110100", monto: 960.50 }
      ],
      estado: "Pendiente",
      usuario: "Admin"
    }
  ];

  const cuentas = [
    { codigo: "110100", nombre: "Caja" },
    { codigo: "110200", nombre: "Bancos" },
    { codigo: "120100", nombre: "Cuentas por Cobrar" },
    { codigo: "210100", nombre: "Retenciones por Pagar" },
    { codigo: "210500", nombre: "IVA por Pagar" },
    { codigo: "410100", nombre: "Ventas" },
    { codigo: "510100", nombre: "Sueldos y Salarios" },
    { codigo: "520100", nombre: "Gastos de Oficina" }
  ];

  const getStatusColor = (status: string) => {
    return status === "Registrado" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800";
  };

  const calculateTotal = (movimientos: Array<{ monto: number }>) => {
    return movimientos.reduce((sum, mov) => sum + mov.monto, 0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Libro Diario</h2>
          <p className="text-slate-600">Registro cronológico de todas las transacciones contables</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          
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
                  Registrar un nuevo movimiento en el libro diario
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6 py-4">
                {/* Datos generales */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fecha">Fecha</Label>
                    <Input id="fecha" type="date" defaultValue="2024-06-15" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="numero">Número</Label>
                    <Input id="numero" placeholder="AST-004" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="concepto">Concepto</Label>
                    <Input id="concepto" placeholder="Descripción del asiento" />
                  </div>
                </div>

                {/* Movimientos debe */}
                <div>
                  <h3 className="text-lg font-medium mb-3">Debe</h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg">
                      <div className="space-y-2">
                        <Label>Cuenta</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar cuenta" />
                          </SelectTrigger>
                          <SelectContent>
                            {cuentas.map(cuenta => (
                              <SelectItem key={cuenta.codigo} value={cuenta.codigo}>
                                {cuenta.codigo} - {cuenta.nombre}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Monto</Label>
                        <Input type="number" placeholder="0.00" step="0.01" />
                      </div>
                      <div className="flex items-end">
                        <Button variant="outline" size="sm">
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Movimientos haber */}
                <div>
                  <h3 className="text-lg font-medium mb-3">Haber</h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg">
                      <div className="space-y-2">
                        <Label>Cuenta</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar cuenta" />
                          </SelectTrigger>
                          <SelectContent>
                            {cuentas.map(cuenta => (
                              <SelectItem key={cuenta.codigo} value={cuenta.codigo}>
                                {cuenta.codigo} - {cuenta.nombre}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Monto</Label>
                        <Input type="number" placeholder="0.00" step="0.01" />
                      </div>
                      <div className="flex items-end">
                        <Button variant="outline" size="sm">
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Balance */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-sm text-gray-600">Total Debe</p>
                      <p className="text-xl font-bold">Bs. 0.00</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Haber</p>
                      <p className="text-xl font-bold">Bs. 0.00</p>
                    </div>
                  </div>
                  <div className="text-center mt-2">
                    <Badge variant="secondary">
                      Diferencia: Bs. 0.00
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowNewEntry(false)}>
                  Cancelar
                </Button>
                <Button onClick={() => setShowNewEntry(false)}>
                  Registrar Asiento
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por concepto o número..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex items-center gap-4">
              <Select value={filterMonth} onValueChange={setFilterMonth}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filtrar por mes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los meses</SelectItem>
                  <SelectItem value="2024-06">Junio 2024</SelectItem>
                  <SelectItem value="2024-05">Mayo 2024</SelectItem>
                  <SelectItem value="2024-04">Abril 2024</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  {asientos.length} asiento(s)
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de asientos */}
      <div className="space-y-4">
        {asientos.map((asiento) => (
          <Card key={asiento.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div>
                    <CardTitle className="text-lg">{asiento.numero}</CardTitle>
                    <CardDescription>{asiento.fecha}</CardDescription>
                  </div>
                  <Badge className={getStatusColor(asiento.estado)}>
                    {asiento.estado}
                  </Badge>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Registrado por: {asiento.usuario}</p>
                </div>
              </div>
              <p className="text-sm">{asiento.concepto}</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Debe */}
                <div>
                  <h4 className="font-medium mb-3 text-red-700">DEBE</h4>
                  <div className="space-y-2">
                    {asiento.debe.map((mov, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                        <div>
                          <p className="font-medium text-sm">{mov.cuenta}</p>
                          <p className="text-xs text-gray-500">{mov.codigo}</p>
                        </div>
                        <p className="font-mono text-red-700">Bs. {mov.monto.toFixed(2)}</p>
                      </div>
                    ))}
                    <div className="flex justify-between items-center pt-2 font-bold text-red-700">
                      <span>Total Debe:</span>
                      <span>Bs. {calculateTotal(asiento.debe).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Haber */}
                <div>
                  <h4 className="font-medium mb-3 text-green-700">HABER</h4>
                  <div className="space-y-2">
                    {asiento.haber.map((mov, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                        <div>
                          <p className="font-medium text-sm">{mov.cuenta}</p>
                          <p className="text-xs text-gray-500">{mov.codigo}</p>
                        </div>
                        <p className="font-mono text-green-700">Bs. {mov.monto.toFixed(2)}</p>
                      </div>
                    ))}
                    <div className="flex justify-between items-center pt-2 font-bold text-green-700">
                      <span>Total Haber:</span>
                      <span>Bs. {calculateTotal(asiento.haber).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LibroDiario;
