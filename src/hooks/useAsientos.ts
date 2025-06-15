
import { useToast } from "@/hooks/use-toast";
import { AsientoContable } from "@/components/contable/diary/DiaryData";

export const useAsientos = () => {
  const { toast } = useToast();

  const getAsientos = (): AsientoContable[] => {
    const data = localStorage.getItem('asientosContables');
    return data ? JSON.parse(data) : [];
  };

  const validarTransaccion = (asiento: AsientoContable): boolean => {
    const totalDebe = asiento.cuentas.reduce((sum, cuenta) => sum + cuenta.debe, 0);
    const totalHaber = asiento.cuentas.reduce((sum, cuenta) => sum + cuenta.haber, 0);
    
    if (Math.abs(totalDebe - totalHaber) > 0.01) {
      console.error("Error: El asiento no está balanceado", { totalDebe, totalHaber });
      return false;
    }
    
    return true;
  };

  const guardarAsiento = (asiento: AsientoContable): boolean => {
    if (!validarTransaccion(asiento)) {
      toast({
        title: "Error en el asiento contable",
        description: "El asiento no está balanceado. Debe = Haber",
        variant: "destructive"
      });
      return false;
    }

    const asientosExistentes = getAsientos();
    const nuevosAsientos = [asiento, ...asientosExistentes];
    localStorage.setItem('asientosContables', JSON.stringify(nuevosAsientos));
    
    console.log("Asiento guardado correctamente:", asiento);
    
    toast({
      title: "Asiento contable registrado",
      description: `Asiento ${asiento.numero} registrado exitosamente`,
    });
    return true;
  };


  return { getAsientos, guardarAsiento, validarTransaccion };
};
