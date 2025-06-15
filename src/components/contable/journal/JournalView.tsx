
import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';
import { useContabilidadIntegration } from '@/hooks/useContabilidadIntegration';
import { AsientoContable } from '../diary/DiaryData';
import JournalEntryDetailDialog from './JournalEntryDetailDialog';

const JournalView = () => {
  const { getAsientos } = useContabilidadIntegration();
  const [asientos] = useState<AsientoContable[]>(getAsientos());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAsiento, setSelectedAsiento] = useState<AsientoContable | null>(null);

  const filteredAsientos = useMemo(() => {
    if (!searchTerm) return asientos;
    return asientos.filter(asiento =>
      asiento.concepto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asiento.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (asiento.referencia && asiento.referencia.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [asientos, searchTerm]);

  const handleViewDetails = (asiento: AsientoContable) => {
    setSelectedAsiento(asiento);
  };
  
  const getEstadoBadge = (estado: string) => {
    const colors = {
      'registrado': 'bg-green-100 text-green-800',
      'anulado': 'bg-red-100 text-red-800',
      'borrador': 'bg-yellow-100 text-yellow-800'
    };
    return colors[estado as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Libro Diario</CardTitle>
          <CardDescription>Consulta y gestiona los asientos contables registrados en el sistema.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar por concepto, número o referencia..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Concepto</TableHead>
                  <TableHead className="text-right">Debe</TableHead>
                  <TableHead className="text-right">Haber</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAsientos.length > 0 ? (
                  filteredAsientos.map(asiento => (
                    <TableRow key={asiento.id}>
                      <TableCell className="font-medium">{asiento.numero}</TableCell>
                      <TableCell>{asiento.fecha}</TableCell>
                      <TableCell className="max-w-[300px] truncate">{asiento.concepto}</TableCell>
                      <TableCell className="text-right">Bs. {asiento.debe.toFixed(2)}</TableCell>
                      <TableCell className="text-right">Bs. {asiento.haber.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge className={getEstadoBadge(asiento.estado)}>
                          {asiento.estado.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" onClick={() => handleViewDetails(asiento)}>
                          Ver Detalles
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No se encontraron asientos contables.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      <JournalEntryDetailDialog
        isOpen={!!selectedAsiento}
        onClose={() => setSelectedAsiento(null)}
        asiento={selectedAsiento}
      />
    </>
  );
};

export default JournalView;
