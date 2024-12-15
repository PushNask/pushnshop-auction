import { vi } from 'vitest';
import { 
  RealtimeChannel, 
  RealtimeChannelOptions, 
  RealtimeClient, 
  REALTIME_SUBSCRIBE_STATES,
  RealtimePresenceState
} from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

// Create a properly typed mock RealtimeChannel
export const createMockRealtimeChannel = (): Partial<RealtimeChannel> => {
  return {
    subscribe: vi.fn().mockImplementation((callback) => {
      if (callback) callback(REALTIME_SUBSCRIBE_STATES.SUBSCRIBED);
      return Promise.resolve({
        unsubscribe: vi.fn(),
      } as unknown as RealtimeChannel);
    }),
    unsubscribe: vi.fn(),
    on: vi.fn().mockReturnThis(),
    send: vi.fn(),
    track: vi.fn(),
    untrack: vi.fn(),
    on_broadcast: vi.fn(),
    on_presence: vi.fn(),
    on_postgres_changes: vi.fn(),
    presenceState: vi.fn().mockReturnValue({} as RealtimePresenceState),
    socket: null as unknown as RealtimeClient,
    bindings: {},
    state: REALTIME_SUBSCRIBE_STATES.SUBSCRIBED as any,
    joinedOnce: false,
    rejoinTimer: null,
    rejoinAttempts: 0,
    timeout: null,
    push: vi.fn(),
    leave: vi.fn(),
    trigger: vi.fn(),
    cancelRejoin: vi.fn(),
    rejoin: vi.fn(),
    clearHeartbeat: vi.fn(),
    startHeartbeat: vi.fn(),
    stopHeartbeat: vi.fn(),
    params: {},
    config: {
      broadcast: false,
      presence: false,
      postgres_changes: false
    } as RealtimeChannelOptions
  };
};

export const mockChannel = createMockRealtimeChannel();

export const createPostgrestMock = () => {
  const mock = {
    select: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    upsert: vi.fn(),
    eq: vi.fn(),
    single: vi.fn(),
    maybeSingle: vi.fn(),
    order: vi.fn(),
    limit: vi.fn()
  };

  // Set up chainable methods
  mock.select.mockReturnValue(mock);
  mock.insert.mockReturnValue(mock);
  mock.update.mockReturnValue(mock);
  mock.delete.mockReturnValue(mock);
  mock.upsert.mockReturnValue(mock);
  mock.eq.mockReturnValue(mock);
  mock.order.mockReturnValue(mock);
  mock.limit.mockReturnValue(mock);
  mock.single.mockResolvedValue({ data: null, error: null });
  mock.maybeSingle.mockResolvedValue({ data: null, error: null });

  return mock;
};

// Create a complete Supabase mock
export const createSupabaseMock = () => ({
  from: vi.fn(() => createPostgrestMock()),
  channel: vi.fn(() => mockChannel),
  rpc: vi.fn().mockImplementation((func: string, params?: any) => {
    if (func === 'increment_rotation_count') {
      return Promise.resolve({ data: null, error: null });
    }
    return Promise.resolve({ data: null, error: null });
  }),
  storage: {
    from: vi.fn().mockReturnThis(),
    upload: vi.fn().mockResolvedValue({ data: { path: 'test.jpg' }, error: null })
  },
  auth: {
    signUp: vi.fn(),
    signIn: vi.fn(),
    signOut: vi.fn(),
    getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null })
  }
});

export const supabaseMock = createSupabaseMock();