import { RealtimeChannel, REALTIME_SUBSCRIBE_STATES, REALTIME_PRESENCE_LISTEN_EVENTS } from '@supabase/supabase-js';
import { vi } from 'vitest';

export const createMockRealtimeChannel = (): RealtimeChannel => ({
  on: vi.fn().mockReturnThis(),
  subscribe: vi.fn().mockImplementation((callback) => {
    if (callback) callback('SUBSCRIBED');
    return mockChannel;
  }),
  unsubscribe: vi.fn(),
  send: vi.fn(),
  track: vi.fn(),
  untrack: vi.fn(),
  on_broadcast: vi.fn(),
  on_presence: vi.fn(),
  on_postgres_changes: vi.fn(),
  topic: 'realtime:test',
  params: {},
  socket: {
    accessToken: '',
    channels: [],
    connect: vi.fn(),
    disconnect: vi.fn(),
    isConnected: vi.fn(),
  },
  bindings: [],
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
  config: {
    broadcast: { ack: true, self: false },
    presence: { key: '' }
  }
});

export const mockChannel = createMockRealtimeChannel();

export const createSupabaseMock = () => ({
  from: vi.fn(() => ({
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    upsert: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: null, error: null }),
    url: '',
    headers: {},
  })),
  channel: vi.fn(() => mockChannel),
  storage: {
    from: vi.fn().mockReturnThis(),
    upload: vi.fn().mockResolvedValue({ data: { path: 'test.jpg' }, error: null })
  },
  auth: {
    signUp: vi.fn(),
    signIn: vi.fn(),
    signOut: vi.fn(),
  }
});