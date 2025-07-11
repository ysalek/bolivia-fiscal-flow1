import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Search, Edit, Trash2, FolderTree } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Cuenta {
  codigo: string;
  nombre: string;
  tipo: 'activo' | 'pasivo' | 'patrimonio' | 'ingresos' | 'gastos';
  nivel: number;
  padre?: string;
  naturaleza: 'deudora' | 'acreedora';
  saldo: number;
  activa: boolean;
}

const PlanCuentasModule = () => {
  const [cuentas, setCuentas] = useState<Cuenta[]>([]);
  const [showNewCuenta, setShowNewCuenta] = useState(false);
  const [showEditCuenta, setShowEditCuenta] = useState(false);
  const [editingCuenta, setEditingCuenta] = useState<Cuenta | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTipo, setFilterTipo] = useState("todos");
  const [newCuenta, setNewCuenta] = useState({
    codigo: "",
    nombre: "",
    tipo: "activo" as const,
    nivel: 1,
    padre: "",
    naturaleza: "deudora" as const
  });
  const { toast } = useToast();

  // Cargar el plan de cuentas desde localStorage al inicializar
  useEffect(() => {
    const savedCuentas = localStorage.getItem('planCuentas');
    if (savedCuentas) {
      setCuentas(JSON.parse(savedCuentas));
    } else {
      // Plan de cuentas inicial
      const initialCuentas: Cuenta[] = [
    // ACTIVOS (1000-1999)
    { codigo: "1", nombre: "ACTIVOS", tipo: "activo", nivel: 1, naturaleza: "deudora", saldo: 150000, activa: true },
    { codigo: "11", nombre: "ACTIVO CORRIENTE", tipo: "activo", nivel: 2, padre: "1", naturaleza: "deudora", saldo: 75000, activa: true },
    { codigo: "111", nombre: "DISPONIBLE", tipo: "activo", nivel: 3, padre: "11", naturaleza: "deudora", saldo: 25000, activa: true },
    { codigo: "1111", nombre: "Caja General", tipo: "activo", nivel: 4, padre: "111", naturaleza: "deudora", saldo: 5000, activa: true },
    { codigo: "1112", nombre: "Banco Nacional de Bolivia", tipo: "activo", nivel: 4, padre: "111", naturaleza: "deudora", saldo: 15000, activa: true },
    { codigo: "1113", nombre: "Banco Mercantil Santa Cruz", tipo: "activo", nivel: 4, padre: "111", naturaleza: "deudora", saldo: 5000, activa: true },
    
    { codigo: "112", nombre: "EXIGIBLE", tipo: "activo", nivel: 3, padre: "11", naturaleza: "deudora", saldo: 30000, activa: true },
    { codigo: "1121", nombre: "Cuentas por Cobrar", tipo: "activo", nivel: 4, padre: "112", naturaleza: "deudora", saldo: 25000, activa: true },
    { codigo: "1122", nombre: "Documentos por Cobrar", tipo: "activo", nivel: 4, padre: "112", naturaleza: "deudora", saldo: 5000, activa: true },
    { codigo: "1142", nombre: "IVA Crédito Fiscal", tipo: "activo", nivel: 4, padre: "112", naturaleza: "deudora", saldo: 0, activa: true },
    
    { codigo: "113", nombre: "REALIZABLE", tipo: "activo", nivel: 3, padre: "11", naturaleza: "deudora", saldo: 20000, activa: true },
    { codigo: "1131", nombre: "Inventarios", tipo: "activo", nivel: 4, padre: "113", naturaleza: "deudora", saldo: 20000, activa: true },
    
    { codigo: "12", nombre: "ACTIVO NO CORRIENTE", tipo: "activo", nivel: 2, padre: "1", naturaleza: "deudora", saldo: 75000, activa: true },
    { codigo: "121", nombre: "BIENES DE USO", tipo: "activo", nivel: 3, padre: "12", naturaleza: "deudora", saldo: 75000, activa: true },
    { codigo: "1211", nombre: "Muebles y Enseres", tipo: "activo", nivel: 4, padre: "121", naturaleza: "deudora", saldo: 25000, activa: true },
    { codigo: "1212", nombre: "Equipos de Computación", tipo: "activo", nivel: 4, padre: "121", naturaleza: "deudora", saldo: 15000, activa: true },
    { codigo: "1213", nombre: "Vehículos", tipo: "activo", nivel: 4, padre: "121", naturaleza: "deudora", saldo: 35000, activa: true },
    
    // PASIVOS (2000-2999)
    { codigo: "2", nombre: "PASIVOS", tipo: "pasivo", nivel: 1, naturaleza: "acreedora", saldo: 60000, activa: true },
    { codigo: "21", nombre: "PASIVO CORRIENTE", tipo: "pasivo", nivel: 2, padre: "2", naturaleza: "acreedora", saldo: 40000, activa: true },
    { codigo: "211", nombre: "EXIGIBLE", tipo: "pasivo", nivel: 3, padre: "21", naturaleza: "acreedora", saldo: 40000, activa: true },
    { codigo: "2111", nombre: "Cuentas por Pagar", tipo: "pasivo", nivel: 4, padre: "211", naturaleza: "acreedora", saldo: 25000, activa: true },
    { codigo: "2112", nombre: "Documentos por Pagar", tipo: "pasivo", nivel: 4, padre: "211", naturaleza: "acreedora", saldo: 10000, activa: true },
    { codigo: "2113", nombre: "IVA por Pagar", tipo: "pasivo", nivel: 4, padre: "211", naturaleza: "acreedora", saldo: 5000, activa: true },
    { codigo: "2141", nombre: "IVA Débito Fiscal", tipo: "pasivo", nivel: 4, padre: "211", naturaleza: "acreedora", saldo: 0, activa: true },
    
    { codigo: "22", nombre: "PASIVO NO CORRIENTE", tipo: "pasivo", nivel: 2, padre: "2", naturaleza: "acreedora", saldo: 20000, activa: true },
    { codigo: "221", nombre: "DEUDAS A LARGO PLAZO", tipo: "pasivo", nivel: 3, padre: "22", naturaleza: "acreedora", saldo: 20000, activa: true },
    { codigo: "2211", nombre: "Préstamos Bancarios LP", tipo: "pasivo", nivel: 4, padre: "221", naturaleza: "acreedora", saldo: 20000, activa: true },
    
    // PATRIMONIO (3000-3999)
    { codigo: "3", nombre: "PATRIMONIO", tipo: "patrimonio", nivel: 1, naturaleza: "acreedora", saldo: 90000, activa: true },
    { codigo: "31", nombre: "CAPITAL", tipo: "patrimonio", nivel: 2, padre: "3", naturaleza: "acreedora", saldo: 80000, activa: true },
    { codigo: "311", nombre: "Capital Social", tipo: "patrimonio", nivel: 3, padre: "31", naturaleza: "acreedora", saldo: 80000, activa: true },
    { codigo: "32", nombre: "RESULTADOS", tipo: "patrimonio", nivel: 2, padre: "3", naturaleza: "acreedora", saldo: 10000, activa: true },
    { codigo: "321", nombre: "Utilidades del Ejercicio", tipo: "patrimonio", nivel: 3, padre: "32", naturaleza: "acreedora", saldo: 10000, activa: true },
    
    // INGRESOS (4000-4999)
    { codigo: "4", nombre: "INGRESOS", tipo: "ingresos", nivel: 1, naturaleza: "acreedora", saldo: 0, activa: true },
    { codigo: "41", nombre: "INGRESOS OPERACIONALES", tipo: "ingresos", nivel: 2, padre: "4", naturaleza: "acreedora", saldo: 0, activa: true },
    { codigo: "411", nombre: "Ventas", tipo: "ingresos", nivel: 3, padre: "41", naturaleza: "acreedora", saldo: 0, activa: true },
    { codigo: "4111", nombre: "Ventas de Productos", tipo: "ingresos", nivel: 4, padre: "411", naturaleza: "acreedora", saldo: 0, activa: true },
    
    // GASTOS (5000-5999)
    { codigo: "5", nombre: "GASTOS", tipo: "gastos", nivel: 1, naturaleza: "deudora", saldo: 0, activa: true },
    { codigo: "51", nombre: "COSTO DE VENTAS", tipo: "gastos", nivel: 2, padre: "5", naturaleza: "deudora", saldo: 0, activa: true },
    { codigo: "511", nombre: "Costo de Productos Vendidos", tipo: "gastos", nivel: 3, padre: "51", naturaleza: "deudora", saldo: 0, activa: true },
    { codigo: "52", nombre: "GASTOS OPERACIONALES", tipo: "gastos", nivel: 2, padre: "5", naturaleza: "deudora", saldo: 0, activa: true },
    { codigo: "521", nombre: "Gastos Administrativos", tipo: "gastos", nivel: 3, padre: "52", naturaleza: "deudora", saldo: 0, activa: true },
    { codigo: "5211", nombre: "Sueldos y Salarios", tipo: "gastos", nivel: 4, padre: "521", naturaleza: "deudora", saldo: 0, activa: true },
    { codigo: "5212", nombre: "Servicios Básicos", tipo: "gastos", nivel: 4, padre: "521", naturaleza: "deudora", saldo: 0, activa: true },
    { codigo: "5231", nombre: "Servicios Básicos", tipo: "gastos", nivel: 4, padre: "521", naturaleza: "deudora", saldo: 0, activa: true },
    { codigo: "522", nombre: "Gastos de Ventas", tipo: "gastos", nivel: 3, padre: "52", naturaleza: "deudora", saldo: 0, activa: true },
      ];
      setCuentas(initialCuentas);
      localStorage.setItem('planCuentas', JSON.stringify(initialCuentas));
    }
  }, []);

  // Guardar cambios en localStorage cada vez que se actualicen las cuentas
  useEffect(() => {
    if (cuentas.length > 0) {
      localStorage.setItem('planCuentas', JSON.stringify(cuentas));
    }
  }, [cuentas]);

  const getTipoColor = (tipo: string) => {
    const colors = {
      'activo': 'bg-green-100 text-green-800',
      'pasivo': 'bg-red-100 text-red-800', 
      'patrimonio': 'bg-blue-100 text-blue-800',
      'ingresos': 'bg-purple-100 text-purple-800',
      'gastos': 'bg-orange-100 text-orange-800'
    };
    return colors[tipo as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const handleSaveCuenta = () => {
    if (!newCuenta.codigo || !newCuenta.nombre) {
      toast({
        title: "Error",
        description: "Código y nombre son obligatorios.",
        variant: "destructive"
      });
      return;
    }

    // Verificar que el código no exista
    if (cuentas.find(c => c.codigo === newCuenta.codigo)) {
      toast({
        title: "Error",
        description: "Ya existe una cuenta con ese código.",
        variant: "destructive"
      });
      return;
    }

    const nuevaCuenta: Cuenta = {
      ...newCuenta,
      saldo: 0,
      activa: true
    };

    setCuentas(prev => [...prev, nuevaCuenta]);

    toast({
      title: "Cuenta creada",
      description: `Cuenta ${newCuenta.codigo} - ${newCuenta.nombre} ha sido creada.`,
    });

    setShowNewCuenta(false);
    setNewCuenta({
      codigo: "",
      nombre: "",
      tipo: "activo",
      nivel: 1,
      padre: "",
      naturaleza: "deudora"
    });
  };

  const handleEditCuenta = (cuenta: Cuenta) => {
    setEditingCuenta(cuenta);
    setShowEditCuenta(true);
  };

  const handleUpdateCuenta = () => {
    if (!editingCuenta) return;

    setCuentas(prev => 
      prev.map(c => 
        c.codigo === editingCuenta.codigo ? editingCuenta : c
      )
    );

    toast({
      title: "Cuenta actualizada",
      description: `Cuenta ${editingCuenta.codigo} ha sido actualizada.`,
    });

    setShowEditCuenta(false);
    setEditingCuenta(null);
  };

  const handleDeleteCuenta = (codigo: string) => {
    // Verificar si hay cuentas hijas
    const cuentasHijas = cuentas.filter(c => c.padre === codigo);
    if (cuentasHijas.length > 0) {
      toast({
        title: "No se puede eliminar",
        description: "Esta cuenta tiene subcuentas asociadas.",
        variant: "destructive"
      });
      return;
    }

    if (confirm("¿Está seguro de eliminar esta cuenta?")) {
      setCuentas(prev => prev.filter(c => c.codigo !== codigo));
      toast({
        title: "Cuenta eliminada",
        description: "La cuenta ha sido eliminada correctamente.",
      });
    }
  };

  const filteredCuentas = cuentas.filter(cuenta => {
    const matchesSearch = cuenta.codigo.includes(searchTerm) || 
                         cuenta.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTipo = filterTipo === "todos" || cuenta.tipo === filterTipo;
    return matchesSearch && matchesTipo;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Plan de Cuentas</h2>
          <p className="text-slate-600">Gestión del catálogo de cuentas contables</p>
        </div>
        
        <Dialog open={showNewCuenta} onOpenChange={setShowNewCuenta}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nueva Cuenta
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nueva Cuenta Contable</DialogTitle>
              <DialogDescription>
                Crear una nueva cuenta en el plan de cuentas
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="codigo">Código</Label>
                  <Input
                    id="codigo"
                    value={newCuenta.codigo}
                    onChange={(e) => setNewCuenta(prev => ({ ...prev, codigo: e.target.value }))}
                    placeholder="Ej: 1111"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nivel">Nivel</Label>
                  <Select 
                    value={newCuenta.nivel.toString()} 
                    onValueChange={(value) => setNewCuenta(prev => ({ ...prev, nivel: parseInt(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1,2,3,4,5].map(n => (
                        <SelectItem key={n} value={n.toString()}>Nivel {n}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre de la Cuenta</Label>
                <Input
                  id="nombre"
                  value={newCuenta.nombre}
                  onChange={(e) => setNewCuenta(prev => ({ ...prev, nombre: e.target.value }))}
                  placeholder="Nombre descriptivo de la cuenta"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tipo de Cuenta</Label>
                  <Select 
                    value={newCuenta.tipo} 
                    onValueChange={(value: any) => setNewCuenta(prev => ({ ...prev, tipo: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="activo">Activo</SelectItem>
                      <SelectItem value="pasivo">Pasivo</SelectItem>
                      <SelectItem value="patrimonio">Patrimonio</SelectItem>
                      <SelectItem value="ingresos">Ingresos</SelectItem>
                      <SelectItem value="gastos">Gastos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Naturaleza</Label>
                  <Select 
                    value={newCuenta.naturaleza} 
                    onValueChange={(value: any) => setNewCuenta(prev => ({ ...prev, naturaleza: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="deudora">Deudora</SelectItem>
                      <SelectItem value="acreedora">Acreedora</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowNewCuenta(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSaveCuenta}>
                  Crear Cuenta
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Dialog para editar cuenta */}
        <Dialog open={showEditCuenta} onOpenChange={setShowEditCuenta}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Cuenta Contable</DialogTitle>
              <DialogDescription>
                Modificar la información de la cuenta
              </DialogDescription>
            </DialogHeader>
            
            {editingCuenta && (
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-codigo">Código</Label>
                    <Input
                      id="edit-codigo"
                      value={editingCuenta.codigo}
                      disabled
                      className="bg-gray-100"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-nivel">Nivel</Label>
                    <Input
                      id="edit-nivel"
                      value={editingCuenta.nivel}
                      disabled
                      className="bg-gray-100"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-nombre">Nombre de la Cuenta</Label>
                  <Input
                    id="edit-nombre"
                    value={editingCuenta.nombre}
                    onChange={(e) => setEditingCuenta(prev => prev ? { ...prev, nombre: e.target.value } : null)}
                    placeholder="Nombre descriptivo de la cuenta"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Tipo de Cuenta</Label>
                    <Select 
                      value={editingCuenta.tipo} 
                      onValueChange={(value: any) => setEditingCuenta(prev => prev ? { ...prev, tipo: value } : null)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="activo">Activo</SelectItem>
                        <SelectItem value="pasivo">Pasivo</SelectItem>
                        <SelectItem value="patrimonio">Patrimonio</SelectItem>
                        <SelectItem value="ingresos">Ingresos</SelectItem>
                        <SelectItem value="gastos">Gastos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Naturaleza</Label>
                    <Select 
                      value={editingCuenta.naturaleza} 
                      onValueChange={(value: any) => setEditingCuenta(prev => prev ? { ...prev, naturaleza: value } : null)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="deudora">Deudora</SelectItem>
                        <SelectItem value="acreedora">Acreedora</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowEditCuenta(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleUpdateCuenta}>
                    Guardar Cambios
                  </Button>
                </div>
              </div>
            )}
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
                placeholder="Buscar por código o nombre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterTipo} onValueChange={setFilterTipo}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los tipos</SelectItem>
                <SelectItem value="activo">Activos</SelectItem>
                <SelectItem value="pasivo">Pasivos</SelectItem>
                <SelectItem value="patrimonio">Patrimonio</SelectItem>
                <SelectItem value="ingresos">Ingresos</SelectItem>
                <SelectItem value="gastos">Gastos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Cuentas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderTree className="w-6 h-6" />
            Catálogo de Cuentas
          </CardTitle>
          <CardDescription>
            Listado completo del plan de cuentas con sus saldos actuales
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Código</th>
                  <th className="text-left p-2">Nombre</th>
                  <th className="text-left p-2">Tipo</th>
                  <th className="text-left p-2">Nivel</th>
                  <th className="text-left p-2">Naturaleza</th>
                  <th className="text-right p-2">Saldo</th>
                  <th className="text-center p-2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredCuentas.map((cuenta) => (
                  <tr key={cuenta.codigo} className="border-b hover:bg-gray-50">
                    <td className="p-2 font-mono text-sm">{cuenta.codigo}</td>
                    <td className="p-2">
                      <span style={{ paddingLeft: `${(cuenta.nivel - 1) * 20}px` }}>
                        {cuenta.nombre}
                      </span>
                    </td>
                    <td className="p-2">
                      <Badge className={getTipoColor(cuenta.tipo)}>
                        {cuenta.tipo}
                      </Badge>
                    </td>
                    <td className="p-2">{cuenta.nivel}</td>
                    <td className="p-2">
                      <Badge variant={cuenta.naturaleza === 'deudora' ? 'secondary' : 'outline'}>
                        {cuenta.naturaleza}
                      </Badge>
                    </td>
                    <td className="p-2 text-right font-mono">
                      {cuenta.saldo.toLocaleString('es-BO', {
                        style: 'currency',
                        currency: 'BOB'
                      })}
                    </td>
                    <td className="p-2">
                      <div className="flex justify-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditCuenta(cuenta)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteCuenta(cuenta.codigo)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlanCuentasModule;