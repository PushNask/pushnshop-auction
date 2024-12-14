import { create } from 'zustand';

interface LoadingState {
  [key: string]: boolean;
}

interface LoadingStore {
  states: LoadingState;
  setLoading: (key: string, isLoading: boolean) => void;
  isLoading: (key: string) => boolean;
}

export const useLoadingStore = create<LoadingStore>((set, get) => ({
  states: {},
  setLoading: (key, isLoading) =>
    set((state) => ({
      states: {
        ...state.states,
        [key]: isLoading
      }
    })),
  isLoading: (key) => get().states[key] || false
}));