import { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type TableName = keyof Database['public']['Tables'];
type RealtimeEvent = 'INSERT' | 'UPDATE' | 'DELETE';

interface RealtimeSubscription {
  channel: RealtimeChannel;
  table: TableName;
  event: RealtimeEvent;
  callback: (payload: RealtimePostgresChangesPayload<any>) => void;
}

export class RealtimeManager {
  private static subscriptions: RealtimeSubscription[] = [];

  static subscribe(
    table: TableName,
    event: RealtimeEvent,
    callback: (payload: RealtimePostgresChangesPayload<any>) => void
  ): RealtimeChannel {
    const channelName = `${table}_${event}_changes`;
    
    // Check for existing subscription
    const existingSub = this.subscriptions.find(
      sub => sub.table === table && sub.event === event
    );
    
    if (existingSub) {
      console.warn(`Subscription already exists for ${table} ${event}`);
      return existingSub.channel;
    }

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event,
          schema: 'public',
          table
        },
        callback
      )
      .subscribe((status) => {
        if (status === 'CHANNEL_ERROR') {
          console.error(`Error subscribing to ${table} ${event}`);
        }
      });

    this.subscriptions.push({ channel, table, event, callback });
    return channel;
  }

  static unsubscribe(table: TableName, event: RealtimeEvent): void {
    const index = this.subscriptions.findIndex(
      sub => sub.table === table && sub.event === event
    );

    if (index !== -1) {
      const subscription = this.subscriptions[index];
      subscription.channel.unsubscribe();
      this.subscriptions.splice(index, 1);
    }
  }

  static unsubscribeAll(): void {
    this.subscriptions.forEach(sub => sub.channel.unsubscribe());
    this.subscriptions = [];
  }
}