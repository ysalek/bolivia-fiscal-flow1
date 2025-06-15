
import { useToast } from "@/hooks/use-toast";

export const useBackup = () => {
  const { toast } = useToast();

  const LOCAL_STORAGE_KEYS = [
    'asientosContables',
    'productos',
    'facturas',
    'clientes',
    'compras',
    'proveedores',
    'configSin',
    'configuracionEmpresa',
    'configuracionFiscal',
    'configuracionSistema'
  ];

  const crearBackup = () => {
    try {
      const backupData: { [key: string]: any } = {};
      
      LOCAL_STORAGE_KEYS.forEach(key => {
        const data = localStorage.getItem(key);
        if (data) {
          try {
            backupData[key] = JSON.parse(data);
          } catch (e) {
            console.warn(`Could not parse JSON for key: ${key}`, e);
            // backup as plain string if not json
            backupData[key] = data;
          }
        }
      });

      if (Object.keys(backupData).length === 0) {
        toast({
          title: "No hay datos para respaldar",
          description: "No se encontró información en el sistema para crear un backup.",
          variant: "destructive"
        });
        return;
      }

      const jsonString = JSON.stringify(backupData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      const date = new Date().toISOString().slice(0, 10);
      a.download = `backup_contable_${date}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Backup creado exitosamente",
        description: "El archivo de respaldo ha sido descargado.",
      });

    } catch (error) {
      console.error("Error al crear el backup:", error);
      toast({
        title: "Error al crear el backup",
        description: "Ocurrió un error inesperado. Revisa la consola para más detalles.",
        variant: "destructive"
      });
    }
  };

  const restaurarBackup = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result;
        if (typeof content !== 'string') {
          throw new Error("El archivo no es válido.");
        }
        
        const backupData = JSON.parse(content);
        
        Object.keys(backupData).forEach(key => {
          if (LOCAL_STORAGE_KEYS.includes(key)) {
            localStorage.setItem(key, JSON.stringify(backupData[key]));
          }
        });

        toast({
          title: "Restauración completada",
          description: "Los datos han sido restaurados. La página se recargará.",
        });

        setTimeout(() => {
          window.location.reload();
        }, 2000);

      } catch (error) {
        console.error("Error al restaurar el backup:", error);
        toast({
          title: "Error al restaurar",
          description: "El archivo de backup es inválido o está corrupto.",
          variant: "destructive"
        });
      }
    };

    reader.readAsText(file);
  };

  return { crearBackup, restaurarBackup };
};
