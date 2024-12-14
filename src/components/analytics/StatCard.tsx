import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

export interface StatCardProps {
  title: string;
  value: number;
  trend?: number;
  icon: LucideIcon;
  format?: 'number' | 'currency' | 'percentage';
}

export const StatCard = ({ title, value, trend, icon: Icon, format = 'number' }: StatCardProps) => {
  const formattedValue = format === 'currency'
    ? `XAF ${value.toLocaleString()}`
    : format === 'percentage'
    ? `${value.toFixed(1)}%`
    : value.toLocaleString();

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-bold mt-2">{formattedValue}</h3>
            {trend !== undefined && (
              <p className={`text-sm mt-1 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {trend > 0 ? '+' : ''}{trend.toFixed(1)}% from previous period
              </p>
            )}
          </div>
          <div className="p-3 bg-primary/10 rounded-full">
            <Icon className="w-5 h-5 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};