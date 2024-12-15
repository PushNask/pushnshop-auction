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
  channel: (name: string) => {
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
      state: CHANNEL_STATES.CLOSED as string,
      joinQueue: [],
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
      config: {
        presence: {
          key: ''
        }
      }
    } as unknown as RealtimeChannel;
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