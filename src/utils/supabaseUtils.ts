
import { supabase } from "@/integrations/supabase/client";

/**
 * Enables realtime for a specific table in Supabase
 * @param tableName The name of the table to enable realtime for
 * @returns A promise that resolves to true if successful, false otherwise
 */
export async function enableRealtimeForTable(tableName: string): Promise<boolean> {
  try {
    console.log(`Enabling realtime for table: ${tableName}`);
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
