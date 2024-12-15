import { vi } from 'vitest';
import type { RealtimeChannel, RealtimeChannelOptions } from '@supabase/supabase-js';
import type { PostgrestQueryBuilder } from '@supabase/postgrest-js';
import type { Database } from '@/integrations/supabase/types';

// Create a complete mock implementation of PostgrestQueryBuilder
export const createPostgrestMock = () => ({
  select: vi.fn().mockReturnThis(),
  insert: vi.fn().mockReturnThis(),
  update: vi.fn().mockReturnThis(),
  delete: vi.fn().mockReturnThis(),
  upsert: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  single: vi.fn().mockReturnThis(),
  url: '',
  headers: {},
});

// Create a properly typed mock RealtimeChannel
export const createMockRealtimeChannel = (): RealtimeChannel => {
  const channel: RealtimeChannel = {
    topic: 'realtime:test',
    subscribe: (callback?: (status: 'SUBSCRIBED' | 'CLOSED' | 'TIMED_OUT' | 'CHANNEL_ERROR', err?: Error) => void) => {
      if (callback) callback('SUBSCRIBED');
      return channel;
    },
    unsubscribe: vi.fn(),
    on: vi.fn().mockReturnThis(),
    send: vi.fn(),
    track: vi.fn(),
    untrack: vi.fn(),
    on_broadcast: vi.fn(),
    on_presence: vi.fn(),
    on_postgres_changes: vi.fn(),
    socket: {
      accessToken: async () => 'mock-token',
      channels: [],
      connect: vi.fn(),
      disconnect: vi.fn(),
      isConnected: vi.fn(),
    },
    bindings: {},
    state: 'joined',
    presenceState: vi.fn(),
    joinedOnce: false,
    rejoinTimer: null,
    rejoinAttempts: 0,
    timeout: vi.fn(),
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
      presence: { key: '' }
    }
  };
  return channel;
};

export const mockChannel = createMockRealtimeChannel();

// Create a complete Supabase mock
export const createSupabaseMock = () => ({
  from: vi.fn(() => createPostgrestMock()),
  channel: vi.fn(() => mockChannel),
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