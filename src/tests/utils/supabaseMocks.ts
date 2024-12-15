import { vi } from 'vitest';
import type { RealtimeChannel, RealtimePresence } from '@supabase/supabase-js';

enum CHANNEL_STATES {
  CLOSED = 'CLOSED',
  INITIALIZED = 'INITIALIZED',
  JOINED = 'JOINED',
  JOINING = 'JOINING',
  LEAVING = 'LEAVING',
  ERRORED = 'ERRORED'
}

// Create a proper type that extends RealtimeChannel
type ExtendedRealtimeChannel = RealtimeChannel & {
  emit: (event: string, payload: any) => void;
};

export const createSupabaseMock = () => ({
  from: vi.fn(() => ({
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockReturnThis(),
    maybeSingle: vi.fn().mockReturnThis()
  })),
  auth: {
    getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
    signInWithPassword: vi.fn(),
    signUp: vi.fn(),
    signOut: vi.fn(),
  },
  channel: (name: string): ExtendedRealtimeChannel => {
    const mockPresence: RealtimePresence = {
      state: {},
      pendingDiffs: [],
      joinRef: '',
      caller: {
        onJoin: vi.fn(),
        onLeave: vi.fn(),
        onSync: vi.fn()
      },
      channel: {} as RealtimeChannel
    };

    return {
      on: vi.fn().mockReturnThis(),
      subscribe: vi.fn().mockReturnThis(),
      unsubscribe: vi.fn(),
      send: vi.fn(),
      track: vi.fn(),
      push: vi.fn(),
      log: vi.fn(),
      presence: mockPresence,
      topic: name,
      params: {},
      socket: {} as WebSocket,
      bindings: {},
      state: CHANNEL_STATES.CLOSED,
      joinedOnce: false,
      joinPush: null,
      pushBuffer: [],
      timeout: 10000,
      rejoinTimer: {
        timer: null,
        tries: 0,
        callback: () => {},
        timerCalc: () => 1000,
        reset: vi.fn(),
        scheduleTimeout: vi.fn()
      },
      stateChangeRefs: [],
      emit: vi.fn(),
      // Add missing required properties
      subTopic: '',
      private: false,
      presenceState: () => ({}),
      untrack: vi.fn(),
      updateJoinPayload: vi.fn(),
      broadcastEndpointURL: () => '',
      isClosed: () => false,
      isErrored: () => false,
      isJoined: () => true,
      isJoining: () => false,
      isLeaving: () => false,
      replyEventName: (ref: string) => `chan_reply_${ref}`
    } as ExtendedRealtimeChannel;
  },
  rpc: vi.fn(() => ({
    select: vi.fn().mockReturnThis(),
    execute: vi.fn().mockResolvedValue({ data: null, error: null }),
  })),
  storage: {
    from: vi.fn(() => ({
      upload: vi.fn(),
      download: vi.fn(),
      remove: vi.fn(),
      list: vi.fn(),
    })),
  },
});

export const mockChannel = createSupabaseMock().channel('test-channel');