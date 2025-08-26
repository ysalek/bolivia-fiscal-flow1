
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LucideIcon, TrendingUp, TrendingDown, AlertTriangle, AlertCircle, CheckCircle } from "lucide-react";
import { calculateMetricAlert, getAlertColor } from "@/utils/metricsUtils";

interface MetricCardProps {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
  trend: "up" | "down" | "neutral";
  color: string;
  percentage?: number; // Para calcular alertas automáticamente
  showAlert?: boolean; // Para mostrar alertas
}

const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-success" />;
      case "down":
        return <TrendingDown className="w-4 h-4 text-destructive" />;
      default:
        return null;
    }
};

const MetricCard = ({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  trend, 
  color,
  percentage,
  showAlert = true 
}: MetricCardProps) => {
  
  // Calcular alerta si se proporciona porcentaje
  const alert = percentage !== undefined ? calculateMetricAlert(percentage) : null;
  const shouldShowAlert = showAlert && alert && alert.level !== 'normal';
  
  const getAlertIcon = () => {
    if (!alert) return null;
    switch (alert.level) {
      case 'critical': return <AlertTriangle className="w-4 h-4" />;
      case 'warning': return <AlertCircle className="w-4 h-4" />;
      default: return <CheckCircle className="w-4 h-4" />;
    }
  };

  return (
    <Card className={shouldShowAlert ? getAlertColor(alert!.level) : ''}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="flex items-center gap-2">
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold mb-1">{value}</div>
        <div className="flex items-center gap-2">
          {getTrendIcon(trend)}
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricCard;
