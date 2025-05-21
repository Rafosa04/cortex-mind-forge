
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

// Define a proper type for the RPC call parameters
interface EnableRealtimeParams {
  table_name: string;
}

// Enable realtime functionality for a table
export async function enableRealtimeForTable(tableName: string): Promise<boolean> {
  try {
    // We need to explicitly type the parameters object to avoid TypeScript errors
    const params: EnableRealtimeParams = { table_name: tableName };
    
    const { error } = await supabase.rpc('enable_realtime', params);
    
    if (error) {
      console.error(`Error enabling realtime for ${tableName}:`, error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error(`Error in enableRealtimeForTable for ${tableName}:`, error);
    return false;
  }
}

// Setup realtime updates for all necessary tables
export async function setupRealtimeUpdates(): Promise<void> {
  const tables = ["projects", "project_steps"];
  
  for (const table of tables) {
    const success = await enableRealtimeForTable(table);
    if (!success) {
      console.warn(`Failed to enable realtime updates for ${table}`);
    }
  }
}
