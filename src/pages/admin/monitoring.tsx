import { MonitoringDashboard } from '@/components/monitoring/MonitoringDashboard';

export default function MonitoringPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">System Monitoring</h1>
      <MonitoringDashboard />
    </div>
  );
}