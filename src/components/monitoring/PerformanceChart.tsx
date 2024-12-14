import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { PerformanceMetric } from '@/types/monitoring';

interface PerformanceChartProps {
  data: PerformanceMetric[];
}

export const PerformanceChart = ({ data }: PerformanceChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="created_at" 
          tickFormatter={(value) => new Date(value).toLocaleTimeString()}
        />
        <YAxis yAxisId="left" />
        <YAxis yAxisId="right" orientation="right" />
        <Tooltip 
          labelFormatter={(value) => new Date(value).toLocaleString()}
        />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="response_time"
          stroke="#0077B6"
          name="Response Time (ms)"
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="error_rate"
          stroke="#EF4444"
          name="Error Rate (%)"
        />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="active_users"
          stroke="#10B981"
          name="Active Users"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};