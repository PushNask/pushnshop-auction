import { vi } from 'vitest';
import { RealtimeChannel, RealtimeChannelOptions, RealtimeClient, REALTIME_LISTEN_TYPES, REALTIME_SUBSCRIBE_STATES } from '@supabase/supabase-js';
import { PostgrestQueryBuilder } from '@supabase/postgrest-js';
import type { Database } from '@/integrations/supabase/types';

// Create a properly typed mock RealtimeChannel
export const createMockRealtimeChannel = (): Partial<RealtimeChannel> => {
  return {
    subscribe: vi.fn().mockImplementation((callback) => {
      if (callback) callback(REALTIME_SUBSCRIBE_STATES.SUBSCRIBED);
      return Promise.resolve({} as RealtimeChannel);
    }),
    unsubscribe: vi.fn(),
    on: vi.fn().mockReturnThis(),
    send: vi.fn(),
    track: vi.fn(),
    untrack: vi.fn(),
    on_broadcast: vi.fn(),
    on_presence: vi.fn(),
    on_postgres_changes: vi.fn(),
    presenceState: vi.fn(),
    socket: null as unknown as RealtimeClient,
    bindings: {},
    state: REALTIME_SUBSCRIBE_STATES.SUBSCRIBED,
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
      broadcast: { ack: true, self: false },
      presence: { key: '' },
      config: {
        broadcast: { ack: true, self: false },
        presence: { key: '' }
      }
    } as RealtimeChannelOptions
  };
};

export const mockChannel = createMockRealtimeChannel();

// Create a properly typed mock PostgrestQueryBuilder
export const createPostgrestMock = () => {
  const mock = {
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    upsert: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockImplementation(() => Promise.resolve({
      data: null,
      error: null
    })),
    maybeSingle: vi.fn().mockImplementation(() => Promise.resolve({
      data: null,
      error: null
    })),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis()
  };

  return {
    ...mock,
    mockResolvedValueOnce: (value: any) => {
      mock.select.mockImplementationOnce(() => Promise.resolve(value));
      return mock;
    }
  } as unknown as PostgrestQueryBuilder<Database['public'], any, any>;
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