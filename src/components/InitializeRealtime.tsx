
import { useEffect, useState } from 'react';
import { setupRealtimeUpdates } from '@/utils/supabaseUtils';

export function InitializeRealtime() {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      await setupRealtimeUpdates();
      setInitialized(true);
    };

    initialize();
  }, []);

  return null; // This component doesn't render anything
}
