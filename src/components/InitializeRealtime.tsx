
import { useEffect } from 'react';
import { setupRealtimeUpdates } from '@/utils/supabaseUtils';

export function InitializeRealtime() {
  useEffect(() => {
    setupRealtimeUpdates();
  }, []);
  
  // Return null since this is just a utility component with no UI
  return null;
}
