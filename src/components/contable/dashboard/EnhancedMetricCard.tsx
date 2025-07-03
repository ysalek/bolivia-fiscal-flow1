import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface EnhancedMetricCardProps {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
  trend: "up" | "down" | "neutral";
  color: string;
  isDragging?: boolean;
  onDragStart?: () => void;
  onDragEnd?: () => void;
}

const EnhancedMetricCard = ({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  trend, 
  color,
  isDragging = false,
  onDragStart,
  onDragEnd
}: EnhancedMetricCardProps) => {
  const getTrendIcon = () => {
    switch (trend) {
      case "up": return <TrendingUp className="w-4 h-4 text-success" />;
      case "down": return <TrendingDown className="w-4 h-4 text-destructive" />;
      default: return <Minus className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case "up": return "text-success";
      case "down": return "text-destructive";
      default: return "text-muted-foreground";
    }
  };

  return (
    <Card 
      className={`
        group cursor-grab active:cursor-grabbing transition-all duration-200 
        hover:shadow-elevated hover:-translate-y-1 bg-gradient-card border-0 shadow-kpi
        ${isDragging ? 'opacity-50 scale-95' : ''}
      `}
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`
              p-3 rounded-xl bg-gradient-primary/10 ${color} 
              group-hover:scale-110 transition-transform duration-200
            `}>
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
              <p className="text-2xl font-bold text-foreground">{value}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-1">
              {getTrendIcon()}
            </div>
            <p className={`text-sm font-medium ${getTrendColor()}`}>
              {description}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedMetricCard;