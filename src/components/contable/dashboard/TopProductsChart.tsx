
import { Pie, PieChart, Cell } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart as PieChartIcon } from "lucide-react";

interface TopProductsChartProps {
    topProductsChartData: any[];
    topProductsChartConfig: ChartConfig;
}

const TopProductsChart = ({ topProductsChartData, topProductsChartConfig }: TopProductsChartProps) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <PieChartIcon className="w-5 h-5" /> Top 5 Productos Vendidos
                </CardTitle>
                <CardDescription>Productos con mayores ingresos por ventas (Bs.)</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center p-4">
                <ChartContainer config={topProductsChartConfig} className="h-[250px] w-full aspect-square">
                    <PieChart>
                        <ChartTooltip content={<ChartTooltipContent nameKey="name" formatter={(value) => `Bs. ${Number(value).toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} />} />
                        <Pie data={topProductsChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} labelLine={false} label={({ percent }) => {
                              if (percent * 100 < 5) return null;
                              return `${(percent * 100).toFixed(0)}%`;
                          }}>
                          {topProductsChartData.map((entry) => (
                              <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <ChartLegend content={<ChartLegendContent nameKey="name" />} />
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
};

export default TopProductsChart;
