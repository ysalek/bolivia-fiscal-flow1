import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CumplimientoNormativo2025 from "./cumplimiento/CumplimientoNormativo2025";
import NormativaValidator2025 from "./normativa/NormativaValidator2025";
import ComplianceTracker from "./cumplimiento/ComplianceTracker";

const CumplimientoNormativoModule = () => {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="normativas" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="normativas">Normativas 2025</TabsTrigger>
          <TabsTrigger value="seguimiento">Seguimiento</TabsTrigger>
          <TabsTrigger value="validador">Validador</TabsTrigger>
        </TabsList>
        
        <TabsContent value="normativas" className="mt-6">
          <CumplimientoNormativo2025 />
        </TabsContent>
        
        <TabsContent value="seguimiento" className="mt-6">
          <ComplianceTracker />
        </TabsContent>
        
        <TabsContent value="validador" className="mt-6">
          <NormativaValidator2025 />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CumplimientoNormativoModule;