
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

type InverterOperationChartProps = {
  name: string;
  operationHours: number;
  totalHours: number;
};

const InverterOperationChart = ({ 
  name, 
  operationHours, 
  totalHours 
}: InverterOperationChartProps) => {
  // Calculate operation percentage
  const operationPercent = Math.round((operationHours / totalHours) * 100);
  
  // Data for pie chart
  const data = [
    { name: "Operação", value: operationHours },
    { name: "Inativo", value: Math.max(0, totalHours - operationHours) }
  ];
  
  // Colors for the pie chart
  const COLORS = ["#3b82f6", "#e4e4e7"]; // Blue for operation, gray for inactive
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Operação: {name}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="text-3xl font-bold mb-2 text-center text-blue-500">
          {operationPercent}%
        </div>
        <p className="text-muted-foreground text-sm mb-4 text-center">
          {operationHours.toFixed(1)} / {totalHours.toFixed(1)} horas
        </p>
        <div className="h-32 w-full">
          <ChartContainer 
            config={{
              operation: { theme: { light: '#3b82f6', dark: '#60a5fa' } },
              inactive: { theme: { light: '#d4d4d8', dark: '#52525b' } }
            }}
          >
            <>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={45}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
              <ChartLegend 
                payload={[
                  { value: 'Em Operação', dataKey: 'operation', color: COLORS[0] },
                  { value: 'Inativo', dataKey: 'inactive', color: COLORS[1] }
                ]} 
                content={<ChartLegendContent />} 
              />
            </>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default InverterOperationChart;
