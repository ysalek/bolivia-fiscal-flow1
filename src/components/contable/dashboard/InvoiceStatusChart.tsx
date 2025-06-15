
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

interface InvoiceStatusChartProps {
  pieChartData: any[];
  statusChartConfig: ChartConfig;
}

const InvoiceStatusChart = ({ pieChartData, statusChartConfig }: InvoiceStatusChartProps) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Estado de Facturas</CardTitle>
                <CardDescription>Distribución del total de facturas</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center p-4">
                <ChartContainer config={statusChartConfig} className="h-[250px] w-full aspect-square">
                    <PieChart>
                        <ChartTooltip content={<ChartTooltipContent nameKey="name" hideIndicator />} />
                        <Pie data={pieChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} labelLine={false} label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                          const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                          const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                          const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                          if ((percent * 100) < 5) return null;
                          return (
                            <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" className="text-xs font-medium">
                              {`${(percent * 100).toFixed(0)}%`}
                            </text>
                          );
                        }}>
                          {pieChartData.map((entry) => (
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

export default InvoiceStatusChart;
