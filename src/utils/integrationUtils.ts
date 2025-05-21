
import { supabase } from "@/integrations/supabase/client";

interface IntegrationConnection {
  id: string;
  user_id: string;
  platform: string;
  token: string;
  refresh_token: string | null;
  expires_at: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export type Platform = "spotify" | "youtube";

export const fetchUserConnections = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("external_connections")
      .select("*")
      .eq("user_id", userId);
      
    if (error) throw error;
    
    return data as IntegrationConnection[];
  } catch (error) {
    console.error("Error fetching user connections:", error);
    return [];
  }
};

export const disconnectPlatform = async (userId: string, platform: Platform) => {
  try {
    const { error } = await supabase
      .from("external_connections")
      .delete()
      .eq("user_id", userId)
      .eq("platform", platform);
      
    if (error) throw error;
    
    return { success: true };
  } catch (error) {
    console.error(`Error disconnecting ${platform}:`, error);
    return { success: false, error };
  }
};

export const updateConnectionToken = async (
  userId: string,
  platform: Platform,
  token: string,
  refreshToken?: string,
  expiresAt?: string
) => {
  try {
    // Check if connection exists
    const { data: existingConnection } = await supabase
      .from("external_connections")
      .select("id")
      .eq("user_id", userId)
      .eq("platform", platform)
      .single();
      
    if (existingConnection) {
      // Update existing connection
      const { error } = await supabase
        .from("external_connections")
        .update({
          token,
          refresh_token: refreshToken || null,
          expires_at: expiresAt || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingConnection.id);
        
      if (error) throw error;
    } else {
      // Create new connection
      const { error } = await supabase
        .from("external_connections")
        .insert({
          user_id: userId,
          platform,
          token,
          refresh_token: refreshToken || null,
          expires_at: expiresAt || null,
        });
        
      if (error) throw error;
    }
    
    return { success: true };
  } catch (error) {
    console.error(`Error updating ${platform} connection:`, error);
    return { success: false, error };
  }
};

// Mock function for authorization URL generation (will be implemented in edge functions)
export const getAuthorizationUrl = (platform: Platform, redirectUri: string) => {
  switch (platform) {
    case "spotify":
      return `https://accounts.spotify.com/authorize?client_id=CLIENT_ID_HERE&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=user-read-private,user-read-email,user-top-read,user-read-recently-played`;
      
    case "youtube":
      return `https://accounts.google.com/o/oauth2/v2/auth?client_id=CLIENT_ID_HERE&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=https://www.googleapis.com/auth/youtube.readonly`;
      
    default:
      return "";
  }
};

// Mock function for integrations that will be implemented with edge functions
export const getIntegrationStatus = (
  platform: Platform,
  connections: IntegrationConnection[]
) => {
  const connection = connections.find(conn => conn.platform === platform);
  
  if (!connection) {
    return { connected: false };
  }
  
  // Check if token is expired
  let isExpired = false;
  if (connection.expires_at) {
    const expiryDate = new Date(connection.expires_at);
    isExpired = expiryDate < new Date();
  }
  
  return {
    connected: !isExpired,
    connectionId: connection.id,
    expiresAt: connection.expires_at,
    connectedAt: connection.created_at,
  };
};
