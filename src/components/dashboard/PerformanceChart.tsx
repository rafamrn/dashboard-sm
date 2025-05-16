
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { 
  ComposedChart, 
  Line, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer
} from "recharts";

type PerformanceChartProps = {
  period: "daily" | "monthly" | "annual";
};

// Sample data with actual vs expected generation
const dailyData = Array.from({ length: 24 }, (_, i) => {
  const expected = i > 6 && i < 19 ? Math.sin((i - 6) * 0.2) * 25 + 25 : 0;
  const actual = expected * (0.85 + Math.random() * 0.3); // 85-115% of expected
  
  return {
    time: `${i}:00`,
    expected,
    actual,
    difference: actual - expected
  };
});

const monthlyData = Array.from({ length: 30 }, (_, i) => {
  const expected = 100 + Math.random() * 50;
  const actual = expected * (0.85 + Math.random() * 0.3);
  
  return {
    day: i + 1,
    expected,
    actual,
    difference: actual - expected
  };
});

const annualData = Array.from({ length: 12 }, (_, i) => {
  const month = new Date(0, i).toLocaleString('default', { month: 'short' });
  const expected = 2000 + Math.random() * 1000;
  const actual = expected * (0.85 + Math.random() * 0.3);
  
  return {
    month,
    expected,
    actual,
    difference: actual - expected
  };
});

const PerformanceChart = ({ period }: PerformanceChartProps) => {
  const getData = () => {
    switch (period) {
      case 'daily':
        return { data: dailyData, xKey: 'time', unit: 'kW' };
      case 'monthly':
        return { data: monthlyData, xKey: 'day', unit: 'kWh' };
      case 'annual':
        return { data: annualData, xKey: 'month', unit: 'kWh' };
      default:
        return { data: dailyData, xKey: 'time', unit: 'kW' };
    }
  };
  
  const getChartTitle = () => {
    switch (period) {
      case 'daily':
        return 'Performance Diária: Real vs Esperado (kW)';
      case 'monthly':
        return 'Performance Mensal: Real vs Esperado (kWh)';
      case 'annual':
        return 'Performance Anual: Real vs Esperado (kWh)';
      default:
        return 'Performance: Real vs Esperado';
    }
  };
  
  const { data, xKey, unit } = getData();
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>{getChartTitle()}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer 
          config={{
            actual: { theme: { light: '#22c55e', dark: '#4ade80' } },
            expected: { theme: { light: '#3b82f6', dark: '#60a5fa' } },
            difference: { theme: { light: '#d97706', dark: '#f59e0b' } }
          }}
          className="h-80"
        >
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey={xKey} />
            <YAxis unit={` ${unit}`} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar
              dataKey="actual"
              name="actual"
              fill="var(--color-actual)"
              opacity={0.8}
              barSize={20}
            />
            <Line
              type="monotone"
              dataKey="expected"
              name="expected"
              stroke="var(--color-expected)"
              strokeWidth={2}
              dot={false}
            />
          </ComposedChart>
          <ChartLegend 
            payload={[
              { value: 'Real', dataKey: 'actual', color: 'var(--color-actual)' },
              { value: 'Esperado', dataKey: 'expected', color: 'var(--color-expected)' }
            ]} 
            content={<ChartLegendContent />} 
          />
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default PerformanceChart;
