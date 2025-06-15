
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2, FileText, Calculator } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { AsientoContable, CuentaAsiento, planCuentas, asientosIniciales, generarNumeroAsiento } from "./diary/DiaryData";

const LibroDiario = () => {
  const [asientos, setAsientos] = useState<AsientoContable[]>(asientosIniciales);
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPeriod, setFilterPeriod] = useState("mes-actual");
  const [newAsiento, setNewAsiento] = useState({
    fecha: new Date().toISOString().slice(0, 10),
    concepto: "",
    referencia: "",
    cuentas: [
      { codigo: "", nombre: "", debe: 0, haber: 0 },
      { codigo: "", nombre: "", debe: 0, haber: 0 }
    ] as CuentaAsiento[]
  });
  const { toast } = useToast();

  const addCuenta = () => {
    setNewAsiento(prev => ({
      ...prev,
      cuentas: [...prev.cuentas, { codigo: "", nombre: "", debe: 0, haber: 0 }]
    }));
  };

  const updateCuenta = (index: number, field: string, value: any) => {
    setNewAsiento(prev => {
      const newCuentas = [...prev.cuentas];
      
      if (field === 'codigo') {
        const cuenta = planCuentas.find(c => c.codigo === value);
        if (cuenta) {
          newCuentas[index] = { ...newCuentas[index], codigo: value, nombre: cuenta.nombre };
        }
      } else {
        newCuentas[index] = { ...newCuentas[index], [field]: value };
      }
      
      return { ...prev, cuentas: newCuentas };
    });
  };

  const removeCuenta = (index: number) => {
    if (newAsiento.cuentas.length > 2) {
      setNewAsiento(prev => ({
        ...prev,
        cuentas: prev.cuentas.filter((_, i) => i !== index)
      }));
    }
  };

  const calculateTotals = () => {
    const debe = newAsiento.cuentas.reduce((sum, cuenta) => sum + (cuenta.debe || 0), 0);
    const haber = newAsiento.cuentas.reduce((sum, cuenta) => sum + (cuenta.haber || 0), 0);
    return { debe, haber };
  };

  const isBalanced = () => {
    const { debe, haber } = calculateTotals();
    return Math.abs(debe - haber) < 0.01 && debe > 0;
  };

  const handleSaveAsiento = () => {
    if (!isBalanced()) {
      toast({
        title: "Error en el asiento",
        description: "El asiento debe estar balanceado (Debe = Haber) y ser mayor a 0.",
        variant: "destructive"
      });
      return;
    }

    if (!newAsiento.concepto.trim()) {
      toast({
        title: "Error en el asiento",
        description: "El concepto es obligatorio.",
        variant: "destructive"
      });
      return;
    }

    const { debe, haber } = calculateTotals();
    const ultimoNumero = asientos.length > 0 ? parseInt(asientos[0].numero.split('-')[1]) : 0;
    
    const nuevoAsiento: AsientoContable = {
      id: Date.now().toString(),
      numero: generarNumeroAsiento(ultimoNumero),
      fecha: newAsiento.fecha,
      concepto: newAsiento.concepto,
      referencia: newAsiento.referencia,
      debe,
      haber,
      estado: 'registrado',
      cuentas: newAsiento.cuentas.filter(c => c.codigo && (c.debe > 0 || c.haber > 0))
    };

    setAsientos(prev => [nuevoAsiento, ...prev]);

    toast({
      title: "Asiento guardado",
      description: `Asiento ${nuevoAsiento.numero} registrado correctamente.`,
    });
    
    setShowNewEntry(false);
    setNewAsiento({
      fecha: new Date().toISOString().slice(0, 10),
      concepto: "",
      referencia: "",
      cuentas: [
        { codigo: "", nombre: "", debe: 0, haber: 0 },
        { codigo: "", nombre: "", debe: 0, haber: 0 }
      ]
    });
  };

  const filteredAsientos = asientos.filter(asiento => {
    const matchesSearch = asiento.concepto.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asiento.numero.includes(searchTerm) ||
                         asiento.referencia.includes(searchTerm);
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Libro Diario</h2>
          <p className="text-slate-600">Registro cronológico de todas las transacciones contables</p>
        </div>
        
        <Dialog open={showNewEntry} onOpenChange={setShowNewEntry}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Asiento
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Nuevo Asiento Contable</DialogTitle>
              <DialogDescription>
                Registre un nuevo asiento en el libro diario
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              {/* Datos generales */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fecha">Fecha</Label>
                  <Input
                    id="fecha"
                    type="date"
                    value={newAsiento.fecha}
                    onChange={(e) => setNewAsiento(prev => ({ ...prev, fecha: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="concepto">Concepto</Label>
                  <Input
                    id="concepto"
                    value={newAsiento.concepto}
                    onChange={(e) => setNewAsiento(prev => ({ ...prev, concepto: e.target.value }))}
                    placeholder="Descripción del asiento contable"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="referencia">Referencia</Label>
                  <Input
                    id="referencia"
                    value={newAsiento.referencia}
                    onChange={(e) => setNewAsiento(prev => ({ ...prev, referencia: e.target.value }))}
                    placeholder="Documento de referencia"
                  />
                </div>
              </div>

              {/* Cuentas */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Cuentas Contables</h3>
                  <Button onClick={addCuenta} size="sm" variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Cuenta
                  </Button>
                </div>

                <div className="border rounded-lg">
                  <div className="grid grid-cols-7 gap-2 p-3 bg-gray-50 border-b font-medium text-sm">
                    <div>Código</div>
                    <div className="col-span-2">Cuenta</div>
                    <div>Debe</div>
                    <div>Haber</div>
                    <div>Acciones</div>
                  </div>
                  
                  {newAsiento.cuentas.map((cuenta, index) => (
                    <div key={index} className="grid grid-cols-7 gap-2 p-3 border-b">
                      <div>
                        <Select 
                          value={cuenta.codigo} 
                          onValueChange={(value) => updateCuenta(index, 'codigo', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Código" />
                          </SelectTrigger>
                          <SelectContent>
                            {planCuentas.map(c => (
                              <SelectItem key={c.codigo} value={c.codigo}>
                                {c.codigo}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-2">
                        <Input
                          value={cuenta.nombre}
                          readOnly
                          placeholder="Seleccione una cuenta"
                          className="bg-gray-50"
                        />
                      </div>
                      <div>
                        <Input
                          type="number"
                          value={cuenta.debe}
                          onChange={(e) => updateCuenta(index, 'debe', parseFloat(e.target.value) || 0)}
                          placeholder="0.00"
                          step="0.01"
                        />
                      </div>
                      <div>
                        <Input
                          type="number"
                          value={cuenta.haber}
                          onChange={(e) => updateCuenta(index, 'haber', parseFloat(e.target.value) || 0)}
                          placeholder="0.00"
                          step="0.01"
                        />
                      </div>
                      <div>
                        {newAsiento.cuentas.length > 2 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeCuenta(index)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {/* Totales */}
                  <div className="grid grid-cols-7 gap-2 p-3 bg-gray-50 font-bold">
                    <div className="col-span-3">TOTALES:</div>
                    <div>Bs. {calculateTotals().debe.toFixed(2)}</div>
                    <div>Bs. {calculateTotals().haber.toFixed(2)}</div>
                    <div>
                      {isBalanced() ? (
                        <Badge className="bg-green-100 text-green-800">✓ Balanceado</Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-800">✗ No balanceado</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowNewEntry(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSaveAsiento} disabled={!isBalanced()}>
                  Guardar Asiento
                </Button>
              </div>
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
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mes-actual">Mes Actual</SelectItem>
                <SelectItem value="trimestre">Último Trimestre</SelectItem>
                <SelectItem value="año">Año Actual</SelectItem>
                <SelectItem value="todos">Todos</SelectItem>
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
            Registro cronológico de movimientos contables
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredAsientos.map((asiento) => (
              <div key={asiento.id} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-4">
                    <Badge variant="outline" className="font-mono">
                      {asiento.numero}
                    </Badge>
                    <div>
                      <div className="font-medium">{asiento.concepto}</div>
                      <div className="text-sm text-gray-500">
                        {asiento.fecha} • Ref: {asiento.referencia}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">Bs. {asiento.debe.toFixed(2)}</div>
                    <Badge className="bg-green-100 text-green-800">
                      {asiento.estado}
                    </Badge>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded p-3">
                  <div className="grid grid-cols-4 gap-2 text-sm font-medium mb-2">
                    <div>Código</div>
                    <div>Cuenta</div>
                    <div className="text-right">Debe</div>
                    <div className="text-right">Haber</div>
                  </div>
                  {asiento.cuentas.map((cuenta, index) => (
                    <div key={index} className="grid grid-cols-4 gap-2 text-sm py-1">
                      <div className="font-mono">{cuenta.codigo}</div>
                      <div>{cuenta.nombre}</div>
                      <div className="text-right">
                        {cuenta.debe > 0 ? `Bs. ${cuenta.debe.toFixed(2)}` : '—'}
                      </div>
                      <div className="text-right">
                        {cuenta.haber > 0 ? `Bs. ${cuenta.haber.toFixed(2)}` : '—'}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-end gap-2 mt-3">
                  <Button size="sm" variant="outline">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <FileText className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Calculator className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{asientos.length}</p>
                <p className="text-sm text-gray-600">Total Asientos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <Calculator className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  Bs. {asientos.reduce((sum, a) => sum + a.debe, 0).toFixed(2)}
                </p>
                <p className="text-sm text-gray-600">Total Movimientos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                <FileText className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">100%</p>
                <p className="text-sm text-gray-600">Asientos Balanceados</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LibroDiario;
