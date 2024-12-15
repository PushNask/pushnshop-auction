import { RealtimeChannel, RealtimeChannelOptions } from '@supabase/supabase-js';

export const createMockSupabaseClient = () => ({
  from: () => ({
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn().mockReturnThis(),
  }),
  auth: {
    getSession: jest.fn().mockResolvedValue({ data: { session: null }, error: null }),
    signInWithPassword: jest.fn(),
    signUp: jest.fn(),
    signOut: jest.fn(),
  },
  channel: (name: string): RealtimeChannel => ({
    on: jest.fn().mockReturnThis(),
    subscribe: jest.fn().mockReturnThis(),
    unsubscribe: jest.fn(),
    send: jest.fn(),
    track: jest.fn(),
    untrack: jest.fn(),
    status: 'SUBSCRIBED',
    join: jest.fn(),
    leave: jest.fn(),
    push: jest.fn(),
    log: jest.fn(),
    presence: {
      track: jest.fn(),
      untrack: jest.fn(),
      state: {},
      onJoin: jest.fn(),
      onLeave: jest.fn(),
      onSync: jest.fn(),
    },
  }),
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
  const channelOptions: RealtimeChannelOptions = {
    config: {
      broadcast: {
        ack: false,
        self: false
      },
      presence: {
        key: ''
      },
      postgres_changes: []
    }
  };

  return {
    on: jest.fn().mockReturnThis(),
    subscribe: jest.fn().mockReturnThis(),
    unsubscribe: jest.fn(),
    options: channelOptions,
    send: jest.fn(),
    track: jest.fn(),
    untrack: jest.fn(),
    status: 'SUBSCRIBED',
    join: jest.fn(),
    leave: jest.fn(),
    push: jest.fn(),
    log: jest.fn(),
    presence: {
      track: jest.fn(),
      untrack: jest.fn(),
      state: {},
      onJoin: jest.fn(),
      onLeave: jest.fn(),
      onSync: jest.fn(),
    },
  };
};