import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { PerformanceMetric } from "@/types/monitoring";

interface PerformanceChartProps {
  data: PerformanceMetric[];
  dataKey: keyof PerformanceMetric;
  stroke: string;
  title: string;
}

export const PerformanceChart = ({ data, dataKey, stroke, title }: PerformanceChartProps) => {
  return (
    <div className="h-[300px] w-full">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="created_at" 
            tickFormatter={(value) => new Date(value).toLocaleTimeString()}
          />
          <YAxis />
          <Tooltip 
            labelFormatter={(value) => new Date(value).toLocaleString()}
          />
          <Line 
            type="monotone" 
            dataKey={dataKey} 
            stroke={stroke} 
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};