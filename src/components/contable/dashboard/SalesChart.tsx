
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface SalesChartProps {
  salesChartData: any[];
  salesChartConfig: ChartConfig;
}

const SalesChart = ({ salesChartData, salesChartConfig }: SalesChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ventas de los Últimos 30 Días</CardTitle>
        <CardDescription>Análisis de ingresos diarios (Bs.)</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={salesChartConfig} className="h-[300px] w-full">
          <BarChart accessibilityLayer data={salesChartData} margin={{ top: 20, right: 20, left: 10, bottom: 0 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} fontSize={12} tickFormatter={(value) => `Bs ${Number(value) / 1000}k`} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
            <Bar dataKey="ventas" fill="var(--color-ventas)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default SalesChart;
