import { Card, CardContent } from "@/components/ui/card";
import { Activity, DollarSign, ShoppingBag, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: number | string;
  trend?: number;
  icon?: "users" | "shopping-bag" | "dollar-sign" | "activity";
  format?: "number" | "currency" | "percentage";
  status?: string;
}

const icons = {
  users: Users,
  "shopping-bag": ShoppingBag,
  "dollar-sign": DollarSign,
  activity: Activity,
};

export function MetricCard({
  title,
  value,
  trend,
  icon,
  format = "number",
  status,
}: MetricCardProps) {
  const Icon = icon ? icons[icon] : null;

  const formattedValue = format === "currency"
    ? `XAF ${Number(value).toLocaleString()}`
    : format === "percentage"
    ? `${Number(value).toFixed(1)}%`
    : Number(value).toLocaleString();

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-bold mt-2">{formattedValue}</h3>
            {trend !== undefined && (
              <p
                className={cn(
                  "text-sm mt-1",
                  trend > 0 ? "text-green-600" : "text-red-600"
                )}
              >
                {trend > 0 ? "+" : ""}
                {trend.toFixed(1)}% from previous period
              </p>
            )}
            {status && (
              <p className="text-sm mt-1 text-muted-foreground">{status}</p>
            )}
          </div>
          {Icon && (
            <div className="p-3 bg-primary/10 rounded-full">
              <Icon className="w-5 h-5 text-primary" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}