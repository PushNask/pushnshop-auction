import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  trend?: number;
}

export const StatCard = ({ title, value, icon: Icon, trend }: StatCardProps) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold mt-2">{value}</h3>
          {trend !== undefined && (
            <p className={`text-sm mt-2 ${
              trend > 0 ? 'text-green-500' : 'text-red-500'
            }`}>
              {trend > 0 ? '+' : ''}{trend}% from last period
            </p>
          )}
        </div>
        <div className="p-2 bg-gray-100 rounded-lg">
          <Icon className="w-5 h-5 text-gray-600" />
        </div>
      </div>
    </CardContent>
  </Card>
);