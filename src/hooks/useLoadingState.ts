import { useState, useCallback } from 'react';
import { LoadingState } from '@/types/shared';

export const useLoadingState = (initialState = false) => {
  const [state, setState] = useState<LoadingState>({
    isLoading: initialState,
    error: null,
  });

  const startLoading = useCallback(() => {
    setState({ isLoading: true, error: null });
  }, []);

  const stopLoading = useCallback(() => {
    setState({ isLoading: false, error: null });
  }, []);

  const setError = useCallback((error: string) => {
    setState({ isLoading: false, error });
  }, []);

  const reset = useCallback(() => {
    setState({ isLoading: false, error: null });
  }, []);

  return {
    ...state,
    startLoading,
    stopLoading,
    setError,
    reset,
  };
};