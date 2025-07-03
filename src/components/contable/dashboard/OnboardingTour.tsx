import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart3, 
  ArrowRight, 
  ArrowLeft, 
  X, 
  CheckCircle, 
  Users, 
  Receipt,
  Calculator,
  BookOpen,
  Lightbulb
} from "lucide-react";

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: any;
  targetModule?: string;
  position: "center" | "sidebar" | "header" | "dashboard";
}

interface OnboardingTourProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToModule?: (moduleId: string) => void;
}

const OnboardingTour = ({ isOpen, onClose, onNavigateToModule }: OnboardingTourProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const steps: OnboardingStep[] = [
    {
      id: "welcome",
      title: "¡Bienvenido al Sistema Contable Boliviano!",
      description: "Te guiaremos a través de las funcionalidades principales para que puedas empezar a trabajar de inmediato con tu contabilidad.",
      icon: Lightbulb,
      position: "center"
    },
    {
      id: "dashboard",
      title: "Escritorio Financiero",
      description: "Tu centro de control con métricas en tiempo real, gráficos de ventas y alertas importantes. Aquí verás el estado general de tu negocio.",
      icon: BarChart3,
      targetModule: "dashboard",
      position: "dashboard"
    },
    {
      id: "facturacion",
      title: "Facturación Electrónica",
      description: "Crea y gestiona facturas electrónicas cumpliendo con las normativas del SIAT. Incluye códigos QR y validación automática.",
      icon: Receipt,
      targetModule: "facturacion",
      position: "sidebar"
    },
    {
      id: "clientes",
      title: "Gestión de Clientes",
      description: "Administra tu cartera de clientes con información completa: NIT, CI, direcciones y historial de transacciones.",
      icon: Users,
      targetModule: "clientes",
      position: "sidebar"
    },
    {
      id: "inventario",
      title: "Control de Inventario",
      description: "Monitorea tu stock en tiempo real, controla entradas y salidas, y recibe alertas de stock mínimo.",
      icon: Calculator,
      targetModule: "inventario",
      position: "sidebar"
    },
    {
      id: "contabilidad",
      title: "Módulos Contables",
      description: "Accede al Libro Diario, Mayor, Balance de Comprobación y todos los reportes contables necesarios para cumplir con las normativas bolivianas.",
      icon: BookOpen,
      targetModule: "libro-diario",
      position: "sidebar"
    }
  ];

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    }
  }, [isOpen]);

  const progress = ((currentStep + 1) / steps.length) * 100;
  const currentStepData = steps[currentStep];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      if (currentStepData.targetModule && onNavigateToModule) {
        onNavigateToModule(currentStepData.targetModule);
      }
    } else {
      handleClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('onboarding-completed', 'true');
    setTimeout(() => onClose(), 300);
  };

  const handleSkip = () => {
    handleClose();
  };

  if (!isOpen || !isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-gradient-card border-primary/20 shadow-elevated animate-in fade-in-50 scale-in-95 duration-300">
        <CardContent className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-kpi">
                <currentStepData.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  {currentStepData.title}
                </h2>
                <p className="text-sm text-muted-foreground">
                  Paso {currentStep + 1} de {steps.length}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="hover:bg-destructive/10 hover:text-destructive"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <Progress value={progress} className="h-2" />
          </div>

          {/* Content */}
          <div className="mb-8">
            <p className="text-lg text-foreground/80 leading-relaxed">
              {currentStepData.description}
            </p>
            
            {currentStep === 0 && (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <Receipt className="w-8 h-8 text-primary mb-2" />
                  <h3 className="font-semibold text-foreground">Facturación SIAT</h3>
                  <p className="text-sm text-muted-foreground">Cumple con normativas bolivianas</p>
                </div>
                <div className="p-4 bg-success/5 rounded-lg border border-success/20">
                  <BarChart3 className="w-8 h-8 text-success mb-2" />
                  <h3 className="font-semibold text-foreground">Reportes en Tiempo Real</h3>
                  <p className="text-sm text-muted-foreground">Dashboards interactivos</p>
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {currentStep > 0 && (
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  className="border-primary/20 hover:bg-primary/5"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Anterior
                </Button>
              )}
              <Button
                variant="ghost"
                onClick={handleSkip}
                className="text-muted-foreground hover:text-foreground"
              >
                Saltar tour
              </Button>
            </div>

            <Button
              onClick={handleNext}
              className="bg-gradient-primary hover:opacity-90 transition-opacity"
            >
              {currentStep === steps.length - 1 ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  ¡Comenzar!
                </>
              ) : (
                <>
                  Siguiente
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>

          {/* Step Indicators */}
          <div className="flex justify-center gap-2 mt-6">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index <= currentStep 
                    ? 'bg-primary' 
                    : 'bg-muted-foreground/20'
                }`}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingTour;