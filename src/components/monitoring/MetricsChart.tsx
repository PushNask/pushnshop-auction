import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface MetricsChartProps {
  title: string;
  data: any[];
  dataKey: string;
  stroke?: string;
}

export function MetricsChart({ title, data, dataKey, stroke = '#8884d8' }: MetricsChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data}>
            <XAxis 
              dataKey="created_at"
              tickFormatter={(timestamp) => new Date(timestamp).toLocaleTimeString()}
            />
            <YAxis />
            <Tooltip
              labelFormatter={(timestamp) => new Date(timestamp).toLocaleString()}
            />
            <Line type="monotone" dataKey={dataKey} stroke={stroke} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}