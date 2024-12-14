import { Alert } from '@/lib/monitoring/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AlertsListProps {
  alerts: Alert[];
}

export function AlertsList({ alerts }: AlertsListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>System Alerts</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          <div className="space-y-2">
            {alerts.map((alert, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg ${
                  alert.severity === 'high'
                    ? 'bg-red-100 text-red-800'
                    : alert.severity === 'medium'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-blue-100 text-blue-800'
                }`}
              >
                <p className="font-medium">
                  {alert.metric}: {alert.value.toFixed(2)} (Threshold: {alert.threshold})
                </p>
                <p className="text-sm">
                  {alert.timestamp.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}