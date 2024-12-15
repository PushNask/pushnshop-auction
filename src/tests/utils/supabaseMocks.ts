import { RealtimeChannel, RealtimePresence } from '@supabase/supabase-js';

export const createSupabaseMock = () => ({
  from: () => ({
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockReturnThis(),
    maybeSingle: vi.fn().mockReturnThis()
  }),
  auth: {
    getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
    signInWithPassword: vi.fn(),
    signUp: vi.fn(),
    signOut: vi.fn(),
  },
  channel: (name: string) => {
    const mockPresence = {
      state: {},
      channel: {} as RealtimeChannel,
      pendingDiffs: [],
      joinRef: '',
      caller: {
        onJoin: vi.fn(),
        onLeave: vi.fn(),
        onSync: vi.fn()
      }
    } as RealtimePresence;

    const channelMock = {
      on: vi.fn().mockReturnThis(),
      subscribe: vi.fn().mockReturnThis(),
      unsubscribe: vi.fn(),
      send: vi.fn(),
      track: vi.fn(),
      untrack: vi.fn(),
      push: vi.fn(),
      log: vi.fn(),
      presence: mockPresence,
      // Add required RealtimeChannel properties
      topic: name,
      params: {},
      socket: {},
      bindings: {},
      state: 'SUBSCRIBED',
      joinQueue: [],
      timeout: 10000,
      rejoinTimer: { timer: null, callback: () => {} },
      stateChangeRefs: [],
      join: vi.fn(),
      leave: vi.fn(),
      _rejoin: vi.fn(),
      trigger: vi.fn()
    };

    return channelMock as unknown as RealtimeChannel;
  },
  rpc: (
    fn: string,
    params?: Record<string, unknown>
  ) => ({
    select: vi.fn().mockReturnThis(),
    execute: vi.fn().mockResolvedValue({ data: null, error: null }),
  }),
  storage: {
    from: (bucket: string) => ({
      upload: vi.fn(),
      download: vi.fn(),
      remove: vi.fn(),
      list: vi.fn(),
    }),
  },
});

export const mockChannel = createSupabaseMock().channel('test-channel');