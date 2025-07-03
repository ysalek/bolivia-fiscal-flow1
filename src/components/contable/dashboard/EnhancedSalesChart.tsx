import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, ReferenceLine } from "recharts";
import { TrendingUp, Calendar } from "lucide-react";

interface EnhancedSalesChartProps {
  salesChartData: Array<{
    date: string;
    ventas: number;
  }>;
  salesChartConfig: ChartConfig;
}

const EnhancedSalesChart = ({ salesChartData, salesChartConfig }: EnhancedSalesChartProps) => {
  // Calcular promedio para línea de referencia
  const average = salesChartData.reduce((sum, item) => sum + item.ventas, 0) / salesChartData.length;
  
  // Calcular tendencia
  const lastWeek = salesChartData.slice(-7).reduce((sum, item) => sum + item.ventas, 0);
  const previousWeek = salesChartData.slice(-14, -7).reduce((sum, item) => sum + item.ventas, 0);
  const trendPercentage = previousWeek > 0 ? ((lastWeek - previousWeek) / previousWeek) * 100 : 0;

  // Formatear datos para mostrar en miles
  const formattedData = salesChartData.map(item => ({
    ...item,
    ventasDisplay: item.ventas / 1000 // Convertir a miles
  }));

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}k`;
    }
    return value.toString();
  };

  return (
    <Card className="bg-gradient-card border-0 shadow-elevated">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Ventas Últimos 30 Días
            </CardTitle>
            <CardDescription className="flex items-center gap-2 mt-2">
              <TrendingUp className={`w-4 h-4 ${trendPercentage >= 0 ? 'text-success' : 'text-destructive'}`} />
              <span className={trendPercentage >= 0 ? 'text-success' : 'text-destructive'}>
                {trendPercentage >= 0 ? '+' : ''}{trendPercentage.toFixed(1)}% vs semana anterior
              </span>
            </CardDescription>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Total del período</p>
            <p className="text-2xl font-bold text-primary">
              Bs. {formatCurrency(salesChartData.reduce((sum, item) => sum + item.ventas, 0))}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={salesChartConfig} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={formattedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis 
                dataKey="date" 
                axisLine={false}
                tickLine={false}
                className="text-sm text-muted-foreground"
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                className="text-sm text-muted-foreground"
                tickFormatter={(value) => `${value}k`}
              />
              <ChartTooltip
                content={<ChartTooltipContent 
                  formatter={(value, name) => [
                    `Bs. ${((value as number) * 1000).toLocaleString('es-BO')}`, 
                    'Ventas'
                  ]}
                />}
              />
              <ReferenceLine 
                y={average / 1000} 
                stroke="hsl(var(--muted-foreground))" 
                strokeDasharray="5 5" 
                strokeOpacity={0.6}
              />
              <Bar 
                dataKey="ventasDisplay" 
                fill="url(#colorGradient)" 
                radius={[4, 4, 0, 0]}
                className="hover:opacity-80 transition-opacity"
              />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default EnhancedSalesChart;