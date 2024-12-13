import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useAuthCheck = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setIsAuthorized(!!session);
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthorized(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthorized(!!session);
      setIsChecking(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { isAuthorized, isChecking };
};