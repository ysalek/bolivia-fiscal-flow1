import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CumplimientoNormativo2025 from "./cumplimiento/CumplimientoNormativo2025";
import NormativaValidator2025 from "./normativa/NormativaValidator2025";
import ComplianceTracker from "./cumplimiento/ComplianceTracker";
import ComplianceAlerts from "./cumplimiento/ComplianceAlerts";
import AutomatedReporting from "./cumplimiento/AutomatedReporting";

const CumplimientoNormativoModule = () => {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="normativas" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="normativas">Normativas 2025</TabsTrigger>
          <TabsTrigger value="seguimiento">Seguimiento</TabsTrigger>
          <TabsTrigger value="alertas">Alertas</TabsTrigger>
          <TabsTrigger value="reportes">Reportes</TabsTrigger>
          <TabsTrigger value="validador">Validador</TabsTrigger>
        </TabsList>
        
        <TabsContent value="normativas" className="mt-6">
          <CumplimientoNormativo2025 />
        </TabsContent>
        
        <TabsContent value="seguimiento" className="mt-6">
          <ComplianceTracker />
        </TabsContent>
        
        <TabsContent value="alertas" className="mt-6">
          <ComplianceAlerts />
        </TabsContent>
        
        <TabsContent value="reportes" className="mt-6">
          <AutomatedReporting />
        </TabsContent>
        
        <TabsContent value="validador" className="mt-6">
          <NormativaValidator2025 />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CumplimientoNormativoModule;