import { RealtimeChannel, RealtimePresence } from '@supabase/supabase-js';

export const createSupabaseMock = () => ({
  from: () => ({
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn().mockReturnThis(),
    maybeSingle: jest.fn().mockReturnThis()
  }),
  auth: {
    getSession: jest.fn().mockResolvedValue({ data: { session: null }, error: null }),
    signInWithPassword: jest.fn(),
    signUp: jest.fn(),
    signOut: jest.fn(),
  },
  channel: (name: string): RealtimeChannel => {
    const mockPresence = {
      state: {},
      channel: {} as RealtimeChannel,
      pendingDiffs: [],
      joinRef: '',
      caller: {
        onJoin: jest.fn(),
        onLeave: jest.fn(),
        onSync: jest.fn()
      }
    } as RealtimePresence;

    return {
      on: jest.fn().mockReturnThis(),
      subscribe: jest.fn().mockReturnThis(),
      unsubscribe: jest.fn(),
      send: jest.fn(),
      track: jest.fn(),
      untrack: jest.fn(),
      join: jest.fn(),
      leave: jest.fn(),
      push: jest.fn(),
      log: jest.fn(),
      presence: mockPresence
    } as RealtimeChannel;
  },
  rpc: (
    fn: string,
    params?: Record<string, unknown>
  ) => ({
    select: jest.fn().mockReturnThis(),
    execute: jest.fn().mockResolvedValue({ data: null, error: null }),
  }),
  storage: {
    from: (bucket: string) => ({
      upload: jest.fn(),
      download: jest.fn(),
      remove: jest.fn(),
      list: jest.fn(),
    }),
  },
});

export const createMockRealtimeChannel = (): Partial<RealtimeChannel> => {
  const mockPresence = {
    state: {},
    channel: {} as RealtimeChannel,
    pendingDiffs: [],
    joinRef: '',
    caller: {
      onJoin: jest.fn(),
      onLeave: jest.fn(),
      onSync: jest.fn()
    }
  } as RealtimePresence;

  return {
    on: jest.fn().mockReturnThis(),
    subscribe: jest.fn().mockReturnThis(),
    unsubscribe: jest.fn(),
    send: jest.fn(),
    track: jest.fn(),
    untrack: jest.fn(),
    leave: jest.fn(),
    push: jest.fn(),
    log: jest.fn(),
    presence: mockPresence
  };
};

export const mockChannel = createMockRealtimeChannel();