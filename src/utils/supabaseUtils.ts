
import { supabase } from "@/integrations/supabase/client";

/**
 * Enables realtime for a specific table in Supabase
 * @param tableName The name of the table to enable realtime for
 * @returns A promise that resolves to true if successful, false otherwise
 */
export async function enableRealtimeForTable(tableName: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .rpc('enable_realtime', { table_name: tableName });

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

/**
 * Enables realtime for multiple tables at once
 * @param tableNames Array of table names to enable realtime for
 * @returns A promise that resolves when all tables have been processed
 */
export async function enableRealtimeForMultipleTables(tableNames: string[]): Promise<void> {
  try {
    await Promise.all(tableNames.map(enableRealtimeForTable));
  } catch (error) {
    console.error("Error enabling realtime for multiple tables:", error);
  }
}
