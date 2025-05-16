
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

type PerformancePieChartProps = {
  title?: string;
  actualValue: number;
  expectedValue: number;
  inverterName?: string;
};

const PerformancePieChart = ({ 
  title = "Performance", 
  actualValue, 
  expectedValue,
  inverterName 
}: PerformancePieChartProps) => {
  // Calculate performance percentage
  const performancePercent = Math.round((actualValue / expectedValue) * 100);
  
  // Data for pie chart
  const data = [
    { name: "Real", value: actualValue },
    { name: "Diferença", value: Math.max(0, expectedValue - actualValue) }
  ];
  
  // Colors for the pie chart
  const COLORS = ["#4ade80", "#fb7185"];
  
  // Performance text color based on percentage
  const getPerformanceColor = (percent: number) => {
    if (percent >= 95) return "text-green-500";
    if (percent >= 85) return "text-yellow-500";
    return "text-red-500";
  };
  
  const displayTitle = inverterName ? `${title}: ${inverterName}` : title;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>{displayTitle}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="text-4xl font-bold mb-2 text-center">
          <span className={getPerformanceColor(performancePercent)}>
            {performancePercent}%
          </span>
        </div>
        <p className="text-muted-foreground text-sm mb-4 text-center">
          {actualValue.toFixed(1)} / {expectedValue.toFixed(1)} kWh
        </p>
        <div className="h-40 w-full">
          <ChartContainer 
            config={{
              actual: { theme: { light: '#22c55e', dark: '#4ade80' } },
              diff: { theme: { light: '#f43f5e', dark: '#fb7185' } }
            }}
          >
            {/* Wrap chart elements with a React Fragment */}
            <>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={60}
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
                  { value: 'Gerado', dataKey: 'actual', color: COLORS[0] },
                  { value: 'Diferença', dataKey: 'diff', color: COLORS[1] }
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

export default PerformancePieChart;
