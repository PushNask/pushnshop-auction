import { useLoadingStore } from "@/lib/loading/LoadingManager";
import { useCallback } from "react";

export function useLoadingState(key: string) {
  const { setLoading, isLoading } = useLoadingStore();
  
  const startLoading = useCallback(() => {
    setLoading(key, true);
  }, [key, setLoading]);

  const stopLoading = useCallback(() => {
    setLoading(key, false);
  }, [key, setLoading]);

  const withLoading = useCallback(async <T,>(fn: () => Promise<T>): Promise<T> => {
    try {
      startLoading();
      return await fn();
    } finally {
      stopLoading();
    }
  }, [startLoading, stopLoading]);

  return {
    isLoading: isLoading(key),
    startLoading,
    stopLoading,
    withLoading
  };
}