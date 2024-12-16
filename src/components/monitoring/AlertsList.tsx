import { Alert } from "@/types/analytics";

interface AlertsListProps {
  alerts: Alert[];
}

export const AlertsList = ({ alerts }: AlertsListProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">System Alerts</h2>
      <div className="space-y-2">
        {alerts.map((alert, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border ${
              alert.severity === 'high'
                ? 'bg-red-50 border-red-200'
                : alert.severity === 'medium'
                ? 'bg-yellow-50 border-yellow-200'
                : 'bg-blue-50 border-blue-200'
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">
                  {alert.metric.replace(/_/g, ' ').toUpperCase()}
                </h3>
                <p className="text-sm">
                  Current value: {alert.value} (Threshold: {alert.threshold})
                </p>
              </div>
              <span
                className={`px-2 py-1 text-xs rounded ${
                  alert.severity === 'high'
                    ? 'bg-red-100 text-red-800'
                    : alert.severity === 'medium'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-blue-100 text-blue-800'
                }`}
              >
                {alert.severity.toUpperCase()}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {alert.timestamp.toLocaleString()}
            </p>
          </div>
        ))}
        {alerts.length === 0 && (
          <p className="text-gray-500">No active alerts</p>
        )}
      </div>
    </div>
  );
};