import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MetricCard } from "./MetricCard";
import { LoadingOverlay } from "@/components/loading/LoadingOverlay";
import type { AdminDashboardMetrics } from "@/types/admin-dashboard";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export function AdminDashboard() {
  const [timeRange, setTimeRange] = useState<string>("7d");

  const { data: metrics, isLoading } = useQuery({
    queryKey: ["admin-metrics", timeRange],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_admin_dashboard_metrics", {
        time_range: timeRange,
      });
      if (error) throw error;
      return data as AdminDashboardMetrics;
    },
  });

  return (
    <LoadingOverlay loading={isLoading}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24 Hours</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {metrics && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                title="Total Users"
                value={metrics.overview.totalUsers}
                trend={metrics.overview.usersTrend}
                icon="users"
              />
              <MetricCard
                title="Active Listings"
                value={metrics.overview.activeListings}
                trend={metrics.overview.listingsTrend}
                icon="shopping-bag"
              />
              <MetricCard
                title="Total Revenue"
                value={metrics.overview.totalRevenue}
                trend={metrics.overview.revenueTrend}
                format="currency"
                icon="dollar-sign"
              />
              <MetricCard
                title="System Health"
                value={metrics.overview.systemHealth}
                icon="activity"
                status={`Response Time: ${metrics.overview.systemStatus.responseTime.toFixed(
                  0
                )}ms`}
              />
            </div>

            <Tabs defaultValue="users" className="space-y-6">
              <TabsList>
                <TabsTrigger value="users">User Analytics</TabsTrigger>
                <TabsTrigger value="products">Product Analytics</TabsTrigger>
              </TabsList>

              <TabsContent value="users">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="p-4">
                    <h3 className="text-lg font-semibold mb-4">User Growth</h3>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={metrics.userMetrics.growth}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Line
                            type="monotone"
                            dataKey="count"
                            stroke="#8884d8"
                            name="New Users"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <h3 className="text-lg font-semibold mb-4">
                      User Demographics
                    </h3>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={metrics.userMetrics.demographics}
                            dataKey="count"
                            nameKey="role"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            label
                          >
                            {metrics.userMetrics.demographics.map((_, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="products">
                <Card className="p-4">
                  <h3 className="text-lg font-semibold mb-4">
                    Product Categories
                  </h3>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={metrics.productMetrics.categories}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="status" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </LoadingOverlay>
  );
}