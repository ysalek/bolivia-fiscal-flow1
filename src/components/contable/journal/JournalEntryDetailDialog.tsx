
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AsientoContable } from "../diary/DiaryData";
import { Badge } from "@/components/ui/badge";

interface JournalEntryDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  asiento: AsientoContable | null;
}

const JournalEntryDetailDialog = ({ isOpen, onClose, asiento }: JournalEntryDetailDialogProps) => {
  if (!asiento) return null;

  const getEstadoBadge = (estado: string) => {
    const colors = {
      'registrado': 'bg-green-100 text-green-800',
      'anulado': 'bg-red-100 text-red-800',
      'borrador': 'bg-yellow-100 text-yellow-800'
    };
    return colors[estado as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Detalle del Asiento: {asiento.numero}</DialogTitle>
          <DialogDescription>
            {asiento.concepto}
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-3 gap-4 py-4 text-sm">
          <div><strong>Fecha:</strong> {asiento.fecha}</div>
          <div><strong>Referencia:</strong> {asiento.referencia || 'N/A'}</div>
          <div><strong>Estado:</strong> <Badge className={getEstadoBadge(asiento.estado)}>{asiento.estado.toUpperCase()}</Badge></div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Cuenta</TableHead>
              <TableHead className="text-right">Debe</TableHead>
              <TableHead className="text-right">Haber</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {asiento.cuentas.map((cuenta, index) => (
              <TableRow key={index}>
                <TableCell>{cuenta.codigo}</TableCell>
                <TableCell>{cuenta.nombre}</TableCell>
                <TableCell className="text-right">{cuenta.debe > 0 ? `Bs. ${cuenta.debe.toFixed(2)}` : '-'}</TableCell>
                <TableCell className="text-right">{cuenta.haber > 0 ? `Bs. ${cuenta.haber.toFixed(2)}` : '-'}</TableCell>
              </TableRow>
            ))}
             <TableRow className="font-bold bg-gray-50">
                <TableCell colSpan={2} className="text-right">Totales</TableCell>
                <TableCell className="text-right">Bs. {asiento.debe.toFixed(2)}</TableCell>
                <TableCell className="text-right">Bs. {asiento.haber.toFixed(2)}</TableCell>
              </TableRow>
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
};

export default JournalEntryDetailDialog;
