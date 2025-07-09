import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Upload, Download, CheckCircle, AlertCircle, RefreshCw, FileSpreadsheet } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MovimientoBancario {
  id: string;
  fecha: string;
  descripcion: string;
  referencia: string;
  debito: number;
  credito: number;
  saldo: number;
  conciliado: boolean;
}

interface MovimientoContable {
  id: string;
  fecha: string;
  numero: string;
  descripcion: string;
  debe: number;
  haber: number;
  conciliado: boolean;
}

const ConciliacionBancaria = () => {
  const { toast } = useToast();
  const [selectedBank, setSelectedBank] = useState('');
  const [fechaCorte, setFechaCorte] = useState('');
  const [saldoLibros, setSaldoLibros] = useState(0);
  const [saldoBanco, setSaldoBanco] = useState(0);

  const [movimientosBanco] = useState<MovimientoBancario[]>([
    {
      id: '1',
      fecha: '2024-01-15',
      descripcion: 'Depósito Cliente ABC',
      referencia: 'DEP001',
      debito: 0,
      credito: 5000,
      saldo: 25000,
      conciliado: true
    },
    {
      id: '2',
      fecha: '2024-01-16',
      descripcion: 'Pago Proveedor XYZ',
      referencia: 'CHQ001',
      debito: 1500,
      credito: 0,
      saldo: 23500,
      conciliado: false
    }
  ]);

  const [movimientosLibros] = useState<MovimientoContable[]>([
    {
      id: '1',
      fecha: '2024-01-15',
      numero: 'AS001',
      descripcion: 'Depósito Cliente ABC',
      debe: 5000,
      haber: 0,
      conciliado: true
    },
    {
      id: '2',
      fecha: '2024-01-17',
      descripcion: 'Cheque en tránsito',
      numero: 'AS002',
      debe: 0,
      haber: 1200,
      conciliado: false
    }
  ]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Simular procesamiento de archivo Excel
      toast({
        title: "Archivo cargado",
        description: `Extracto bancario ${file.name} procesado exitosamente`,
      });
    }
  };

  const realizarConciliacion = () => {
    toast({
      title: "Conciliación realizada",
      description: "La conciliación bancaria se ha completado exitosamente",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Conciliación Bancaria</h2>
          <p className="text-muted-foreground">
            Conciliación automática de extractos bancarios con registros contables
          </p>
        </div>
        <Button onClick={realizarConciliacion} className="flex items-center gap-2">
          <RefreshCw className="w-4 h-4" />
          Ejecutar Conciliación
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Saldo en Libros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Bs. 24,300.00</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Saldo Banco</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">Bs. 23,500.00</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Diferencia</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">Bs. 800.00</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">% Conciliado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">85%</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Importar Extracto Bancario</CardTitle>
          <CardDescription>
            Cargue el extracto bancario en formato Excel para iniciar la conciliación automática
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="banco">Banco</Label>
              <Input
                id="banco"
                placeholder="Seleccionar banco"
                value={selectedBank}
                onChange={(e) => setSelectedBank(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="fecha-corte">Fecha de Corte</Label>
              <Input
                id="fecha-corte"
                type="date"
                value={fechaCorte}
                onChange={(e) => setFechaCorte(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="archivo">Extracto Bancario</Label>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="flex items-center gap-2" asChild>
                  <label htmlFor="archivo" className="cursor-pointer">
                    <Upload className="w-4 h-4" />
                    Cargar Excel
                  </label>
                </Button>
                <input
                  id="archivo"
                  type="file"
                  accept=".xlsx,.xls"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4" />
                  Plantilla
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="movimientos-banco" className="space-y-4">
        <TabsList>
          <TabsTrigger value="movimientos-banco">Movimientos Banco</TabsTrigger>
          <TabsTrigger value="movimientos-libros">Movimientos Libros</TabsTrigger>
          <TabsTrigger value="partidas-conciliacion">Partidas de Conciliación</TabsTrigger>
        </TabsList>

        <TabsContent value="movimientos-banco">
          <Card>
            <CardHeader>
              <CardTitle>Movimientos del Banco</CardTitle>
              <CardDescription>
                Movimientos importados del extracto bancario
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Referencia</TableHead>
                    <TableHead className="text-right">Débito</TableHead>
                    <TableHead className="text-right">Crédito</TableHead>
                    <TableHead className="text-right">Saldo</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {movimientosBanco.map((mov) => (
                    <TableRow key={mov.id}>
                      <TableCell>{mov.fecha}</TableCell>
                      <TableCell>{mov.descripcion}</TableCell>
                      <TableCell>{mov.referencia}</TableCell>
                      <TableCell className="text-right">
                        {mov.debito > 0 ? `Bs. ${mov.debito.toFixed(2)}` : '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        {mov.credito > 0 ? `Bs. ${mov.credito.toFixed(2)}` : '-'}
                      </TableCell>
                      <TableCell className="text-right">Bs. {mov.saldo.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant={mov.conciliado ? "default" : "secondary"}>
                          {mov.conciliado ? (
                            <>
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Conciliado
                            </>
                          ) : (
                            <>
                              <AlertCircle className="w-3 h-3 mr-1" />
                              Pendiente
                            </>
                          )}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="movimientos-libros">
          <Card>
            <CardHeader>
              <CardTitle>Movimientos en Libros</CardTitle>
              <CardDescription>
                Registros contables de la cuenta bancaria
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Número</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead className="text-right">Debe</TableHead>
                    <TableHead className="text-right">Haber</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {movimientosLibros.map((mov) => (
                    <TableRow key={mov.id}>
                      <TableCell>{mov.fecha}</TableCell>
                      <TableCell>{mov.numero}</TableCell>
                      <TableCell>{mov.descripcion}</TableCell>
                      <TableCell className="text-right">
                        {mov.debe > 0 ? `Bs. ${mov.debe.toFixed(2)}` : '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        {mov.haber > 0 ? `Bs. ${mov.haber.toFixed(2)}` : '-'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={mov.conciliado ? "default" : "secondary"}>
                          {mov.conciliado ? (
                            <>
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Conciliado
                            </>
                          ) : (
                            <>
                              <AlertCircle className="w-3 h-3 mr-1" />
                              Pendiente
                            </>
                          )}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="partidas-conciliacion">
          <Card>
            <CardHeader>
              <CardTitle>Partidas de Conciliación</CardTitle>
              <CardDescription>
                Ajustes necesarios para cuadrar los saldos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Partidas que Aumentan el Saldo</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <span>Depósitos en tránsito</span>
                        <span className="font-semibold">Bs. 2,000.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Notas de crédito no registradas</span>
                        <span className="font-semibold">Bs. 300.00</span>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Partidas que Disminuyen el Saldo</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <span>Cheques pendientes</span>
                        <span className="font-semibold">Bs. 1,200.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Comisiones bancarias</span>
                        <span className="font-semibold">Bs. 300.00</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ConciliacionBancaria;