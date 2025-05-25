
import { supabase } from "@/integrations/supabase/client";
import { RealtimeChannel } from '@supabase/supabase-js';

/**
 * Optimized realtime management for Supabase
 */
class RealtimeManager {
  private channels: Map<string, RealtimeChannel> = new Map();
  private subscriptions: Map<string, Set<(payload: any) => void>> = new Map();

  /**
   * Subscribe to table changes with automatic cleanup
   */
  public subscribeToTable(
    tableName: string,
    callback: (payload: any) => void,
    options: {
      event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
      filter?: string;
    } = {}
  ): () => void {
    const { event = '*', filter } = options;
    const channelKey = `${tableName}-${event}-${filter || 'all'}`;
    
    // Add callback to subscriptions
    if (!this.subscriptions.has(channelKey)) {
      this.subscriptions.set(channelKey, new Set());
    }
    this.subscriptions.get(channelKey)!.add(callback);

    // Create channel if it doesn't exist
    if (!this.channels.has(channelKey)) {
      const channel = supabase
        .channel(`realtime-${channelKey}`)
        .on(
          'postgres_changes',
          {
            event,
            schema: 'public',
            table: tableName,
            ...(filter && { filter })
          },
          (payload) => {
            // Notify all subscribers
            const callbacks = this.subscriptions.get(channelKey);
            if (callbacks) {
              callbacks.forEach(cb => {
                try {
                  cb(payload);
                } catch (error) {
                  console.error(`Error in realtime callback for ${channelKey}:`, error);
                }
              });
            }
          }
        )
        .subscribe();

      this.channels.set(channelKey, channel);
    }

    // Return unsubscribe function
    return () => {
      const callbacks = this.subscriptions.get(channelKey);
      if (callbacks) {
        callbacks.delete(callback);
        
        // If no more callbacks, cleanup channel
        if (callbacks.size === 0) {
          const channel = this.channels.get(channelKey);
          if (channel) {
            supabase.removeChannel(channel);
            this.channels.delete(channelKey);
            this.subscriptions.delete(channelKey);
          }
        }
      }
    };
  }

  /**
   * Subscribe to presence updates
   */
  public subscribeToPresence(
    roomId: string,
    callbacks: {
      onJoin?: (key: string, newPresences: any[]) => void;
      onLeave?: (key: string, leftPresences: any[]) => void;
      onSync?: () => void;
    }
  ): {
    track: (state: any) => Promise<void>;
    unsubscribe: () => void;
  } {
    const channel = supabase.channel(roomId);

    if (callbacks.onJoin) {
      channel.on('presence', { event: 'join' }, ({ key, newPresences }) => {
        callbacks.onJoin!(key, newPresences);
      });
    }

    if (callbacks.onLeave) {
      channel.on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        callbacks.onLeave!(key, leftPresences);
      });
    }

    if (callbacks.onSync) {
      channel.on('presence', { event: 'sync' }, callbacks.onSync);
    }

    channel.subscribe();

    return {
      track: async (state: any) => {
        await channel.track(state);
      },
      unsubscribe: () => {
        supabase.removeChannel(channel);
      }
    };
  }

  /**
   * Cleanup all channels
   */
  public cleanup(): void {
    this.channels.forEach(channel => {
      supabase.removeChannel(channel);
    });
    this.channels.clear();
    this.subscriptions.clear();
  }
}

// Global instance
export const realtimeManager = new RealtimeManager();

/**
 * Enhanced error handling for Supabase operations
 */
export function handleSupabaseError(error: any, context?: string): never {
  console.error(`Supabase error${context ? ` in ${context}` : ''}:`, error);
  
  // Map common Supabase errors to user-friendly messages
  const errorMessage = (() => {
    if (error?.code === 'PGRST116') {
      return 'Nenhum dado encontrado';
    }
    if (error?.code === '23505') {
      return 'Este item já existe';
    }
    if (error?.code === '23503') {
      return 'Não é possível excluir este item pois está sendo usado';
    }
    if (error?.message?.includes('JWT')) {
      return 'Sessão expirada. Faça login novamente';
    }
    if (error?.message?.includes('Row Level Security')) {
      return 'Você não tem permissão para esta ação';
    }
    return error?.message || 'Erro desconhecido do servidor';
  })();

  throw new Error(errorMessage);
}

/**
 * Retry wrapper for Supabase operations
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<T> {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      // Don't retry on authentication or permission errors
      if (error instanceof Error && (
        error.message.includes('JWT') || 
        error.message.includes('Row Level Security')
      )) {
        throw error;
      }

      if (attempt < maxRetries) {
        console.warn(`Attempt ${attempt} failed, retrying in ${delayMs}ms...`, error);
        await new Promise(resolve => setTimeout(resolve, delayMs));
        delayMs *= 2; // Exponential backoff
      }
    }
  }

  throw lastError!;
}

/**
 * Batch operations helper
 */
export async function batchOperation<T, R>(
  items: T[],
  operation: (batch: T[]) => Promise<R[]>,
  batchSize: number = 100
): Promise<R[]> {
  const results: R[] = [];
  
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await operation(batch);
    results.push(...batchResults);
  }
  
  return results;
}
