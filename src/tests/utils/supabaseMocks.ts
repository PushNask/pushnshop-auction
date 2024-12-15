import { RealtimeChannel, RealtimeChannelOptions, RealtimePresence } from '@supabase/supabase-js';
import { jest } from '@jest/globals';

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
    const mockPresence: RealtimePresence = {
      state: {},
      untrack: jest.fn(),
      onJoin: jest.fn(),
      onLeave: jest.fn(),
      onSync: jest.fn(),
      channel: {} as any,
      pendingDiffs: [],
      joinRef: null,
      caller: {
        onJoin: jest.fn(),
        onLeave: jest.fn(),
        onSync: jest.fn()
      }
    };

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
    } as unknown as RealtimeChannel;
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
  const mockPresence: RealtimePresence = {
    state: {},
    untrack: jest.fn(),
    onJoin: jest.fn(),
    onLeave: jest.fn(),
    onSync: jest.fn(),
    channel: {} as any,
    pendingDiffs: [],
    joinRef: null,
    caller: {
      onJoin: jest.fn(),
      onLeave: jest.fn(),
      onSync: jest.fn()
    }
  };

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
  };
};

export const mockChannel = createMockRealtimeChannel();