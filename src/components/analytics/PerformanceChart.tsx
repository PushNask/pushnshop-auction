import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { AnalyticsData } from '@/types/analytics';

interface PerformanceChartProps {
  data: AnalyticsData[];
}

export const PerformanceChart = ({ data }: PerformanceChartProps) => (
  <Card>
    <CardHeader>
      <CardTitle>Performance Overview</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="views" 
              stroke="#0077B6" 
              name="Views" 
            />
            <Line 
              type="monotone" 
              dataKey="clicks" 
              stroke="#FB8500" 
              name="Clicks" 
            />
            <Line 
              type="monotone" 
              dataKey="inquiries" 
              stroke="#10B981" 
              name="Inquiries" 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </CardContent>
  </Card>
);