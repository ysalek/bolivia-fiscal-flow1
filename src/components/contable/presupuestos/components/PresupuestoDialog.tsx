import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PresupuestoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PresupuestoDialog: React.FC<PresupuestoDialogProps> = ({
  open,
  onOpenChange
}) => {
  const { toast } = useToast();

  const crearPresupuesto = () => {
    toast({
      title: "Presupuesto creado",
      description: "El nuevo presupuesto ha sido creado exitosamente",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nuevo Presupuesto
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Presupuesto</DialogTitle>
          <DialogDescription>
            Configure los parámetros para el nuevo presupuesto empresarial
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre del Presupuesto</Label>
            <Input id="nombre" placeholder="Ej. Presupuesto Anual 2024" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="periodo">Período</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="anual">Anual</SelectItem>
                <SelectItem value="semestral">Semestral</SelectItem>
                <SelectItem value="trimestral">Trimestral</SelectItem>
                <SelectItem value="mensual">Mensual</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="fecha-inicio">Fecha de Inicio</Label>
            <Input id="fecha-inicio" type="date" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="fecha-fin">Fecha de Fin</Label>
            <Input id="fecha-fin" type="date" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="responsable">Responsable</Label>
            <Input id="responsable" placeholder="Nombre del responsable" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="monto-total">Monto Total Presupuestado</Label>
            <Input id="monto-total" type="number" placeholder="0.00" />
          </div>
          
          <div className="col-span-2 space-y-2">
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea id="descripcion" placeholder="Descripción del presupuesto" />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={crearPresupuesto}>
            Crear Presupuesto
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};