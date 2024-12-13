import { useEffect } from 'react';
import AnalyticsDashboard from "@/components/analytics/AnalyticsDashboard";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const HomePage = () => {
  const { toast } = useToast();

  useEffect(() => {
    const checkAnalyticsAccess = async () => {
      const { error } = await supabase
        .from('analytics')
        .select('id')
        .limit(1);

      if (error) {
        toast({
          variant: "destructive",
          title: "Analytics Error",
          description: "Unable to fetch analytics data. Please try again later.",
        });
        console.error('Analytics access error:', error);
      }
    };

    checkAnalyticsAccess();
  }, [toast]);

  return (
    <div className="container mx-auto p-4">
      <AnalyticsDashboard />
    </div>
  );
};

export default HomePage;