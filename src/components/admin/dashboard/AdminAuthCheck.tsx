import { useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AdminAuthCheckProps {
  children: ReactNode;
}

export const AdminAuthCheck = ({ children }: AdminAuthCheckProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;
        
        if (!session) {
          toast({
            title: "Authentication required",
            description: "Please log in to access the admin dashboard",
            variant: "destructive"
          });
          navigate('/auth');
          return;
        }

        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('role')
          .eq('id', session.user.id)
          .single();

        if (userError) throw userError;

        if (userData?.role !== 'admin') {
          toast({
            title: "Access denied",
            description: "You don't have permission to access the admin dashboard",
            variant: "destructive"
          });
          navigate('/');
        }
      } catch (error: any) {
        console.error('Auth check failed:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to verify authentication",
          variant: "destructive"
        });
        navigate('/auth');
      }
    };

    checkAuth();
  }, [navigate, toast]);

  return <>{children}</>;
};