import { vi } from 'vitest';
import { RealtimeChannel, RealtimeClient, RealtimeChannelOptions, REALTIME_SUBSCRIBE_STATES } from '@supabase/supabase-js';
import type { PostgrestQueryBuilder, PostgrestSingleResponse } from '@supabase/postgrest-js';
import type { Database } from '@/integrations/supabase/types';

// Create a properly typed mock RealtimeChannel
export const createMockRealtimeChannel = (): RealtimeChannel => {
  const channel: RealtimeChannel = {
    topic: 'realtime:test',
    subscribe: vi.fn((callback?: (status: REALTIME_SUBSCRIBE_STATES, err?: Error) => void) => {
      if (callback) callback(REALTIME_SUBSCRIBE_STATES.SUBSCRIBED);
      return channel;
    }),
    unsubscribe: vi.fn(),
    on: vi.fn().mockReturnThis(),
    send: vi.fn(),
    track: vi.fn(),
    untrack: vi.fn(),
    on_broadcast: vi.fn(),
    on_presence: vi.fn(),
    on_postgres_changes: vi.fn(),
    socket: {
      accessToken: null,
      accessTokenValue: null,
      apiKey: 'test-api-key',
      channels: [],
      connect: vi.fn(),
      disconnect: vi.fn(),
      isConnected: vi.fn(),
      endPoint: 'ws://localhost:54321',
      httpEndpoint: 'http://localhost:54321',
      maxReconnectAttempts: 5,
      minReconnectDelay: 1000,
      maxReconnectDelay: 5000,
      reconnectAfterMs: vi.fn(),
      reconnectTimer: null,
      ref: 0,
      timeout: 10000,
      transport: WebSocket,
      heartbeatIntervalMs: 30000,
      heartbeatTimer: null,
      pendingHeartbeatRef: null,
      params: {},
      endPointURL: vi.fn(),
      connectionState: vi.fn(),
      push: vi.fn(),
      makeRef: vi.fn(),
      leaveOpenTopic: vi.fn(),
      subscribe: vi.fn(),
      unsubscribe: vi.fn(),
      log: vi.fn(),
      hasLogger: vi.fn(),
      onOpen: vi.fn(),
      onClose: vi.fn(),
      onError: vi.fn(),
      onMessage: vi.fn(),
      triggerChanError: vi.fn(),
      connectionStateRecovery: null,
      encode: vi.fn(),
      decode: vi.fn(),
      binaryEncode: vi.fn(),
      binaryDecode: vi.fn(),
    } as unknown as RealtimeClient,
    bindings: {},
    state: REALTIME_SUBSCRIBE_STATES.SUBSCRIBED,
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
      presence: { key: '' },
      config: {}
    } as unknown as RealtimeChannelOptions
  };
  return channel;
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
    single: vi.fn().mockReturnThis(),
    maybeSingle: vi.fn().mockReturnThis(),
    url: '',
    headers: {},
  };
  return mock as unknown as PostgrestQueryBuilder<Database['public'], any, any>;
};

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