import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CumplimientoNormativo2025 from "./cumplimiento/CumplimientoNormativo2025";
import NormativaValidator2025 from "./normativa/NormativaValidator2025";

const CumplimientoNormativoModule = () => {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="normativas" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="normativas">Normativas 2025</TabsTrigger>
          <TabsTrigger value="validador">Validador Cumplimiento</TabsTrigger>
        </TabsList>
        
        <TabsContent value="normativas" className="mt-6">
          <CumplimientoNormativo2025 />
        </TabsContent>
        
        <TabsContent value="validador" className="mt-6">
          <NormativaValidator2025 />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CumplimientoNormativoModule;