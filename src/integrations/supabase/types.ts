export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      agenda_events: {
        Row: {
          completed: boolean | null
          created_at: string
          description: string | null
          end_time: string
          event_type: string
          id: string
          start_time: string
          subcrebro_relacionado: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          created_at?: string
          description?: string | null
          end_time: string
          event_type?: string
          id?: string
          start_time: string
          subcrebro_relacionado?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed?: boolean | null
          created_at?: string
          description?: string | null
          end_time?: string
          event_type?: string
          id?: string
          start_time?: string
          subcrebro_relacionado?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      athena_highlights: {
        Row: {
          action: string | null
          created_at: string
          description: string | null
          dismissed: boolean | null
          id: string
          title: string
          type: string
          user_id: string
        }
        Insert: {
          action?: string | null
          created_at?: string
          description?: string | null
          dismissed?: boolean | null
          id?: string
          title: string
          type: string
          user_id: string
        }
        Update: {
          action?: string | null
          created_at?: string
          description?: string | null
          dismissed?: boolean | null
          id?: string
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      athena_insights: {
        Row: {
          action_suggestion: string | null
          category: string
          confidence_score: number | null
          context_data: Json | null
          created_at: string
          description: string
          expires_at: string | null
          id: string
          priority: number | null
          related_item_id: string | null
          related_item_type: string | null
          status: string | null
          title: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          action_suggestion?: string | null
          category: string
          confidence_score?: number | null
          context_data?: Json | null
          created_at?: string
          description: string
          expires_at?: string | null
          id?: string
          priority?: number | null
          related_item_id?: string | null
          related_item_type?: string | null
          status?: string | null
          title: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          action_suggestion?: string | null
          category?: string
          confidence_score?: number | null
          context_data?: Json | null
          created_at?: string
          description?: string
          expires_at?: string | null
          id?: string
          priority?: number | null
          related_item_id?: string | null
          related_item_type?: string | null
          status?: string | null
          title?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      athena_logs: {
        Row: {
          context_id: string | null
          context_type: string | null
          created_at: string | null
          id: string
          is_favorite: boolean | null
          prompt: string
          response: string | null
          user_id: string
        }
        Insert: {
          context_id?: string | null
          context_type?: string | null
          created_at?: string | null
          id?: string
          is_favorite?: boolean | null
          prompt: string
          response?: string | null
          user_id: string
        }
        Update: {
          context_id?: string | null
          context_type?: string | null
          created_at?: string | null
          id?: string
          is_favorite?: boolean | null
          prompt?: string
          response?: string | null
          user_id?: string
        }
        Relationships: []
      }
      athena_predictions: {
        Row: {
          accuracy_score: number | null
          created_at: string
          factors: Json | null
          id: string
          prediction_label: string | null
          prediction_type: string
          prediction_value: number | null
          target_id: string | null
          target_type: string
          user_id: string
          valid_until: string | null
        }
        Insert: {
          accuracy_score?: number | null
          created_at?: string
          factors?: Json | null
          id?: string
          prediction_label?: string | null
          prediction_type: string
          prediction_value?: number | null
          target_id?: string | null
          target_type: string
          user_id: string
          valid_until?: string | null
        }
        Update: {
          accuracy_score?: number | null
          created_at?: string
          factors?: Json | null
          id?: string
          prediction_label?: string | null
          prediction_type?: string
          prediction_value?: number | null
          target_id?: string | null
          target_type?: string
          user_id?: string
          valid_until?: string | null
        }
        Relationships: []
      }
      athena_reactivation_suggestions: {
        Row: {
          action_question: string | null
          content_type: string | null
          created_at: string
          description: string | null
          dismissed: boolean | null
          id: string
          related_item_id: string | null
          thumbnail: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          action_question?: string | null
          content_type?: string | null
          created_at?: string
          description?: string | null
          dismissed?: boolean | null
          id?: string
          related_item_id?: string | null
          thumbnail?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          action_question?: string | null
          content_type?: string | null
          created_at?: string
          description?: string | null
          dismissed?: boolean | null
          id?: string
          related_item_id?: string | null
          thumbnail?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "athena_reactivation_suggestions_related_item_id_fkey"
            columns: ["related_item_id"]
            isOneToOne: false
            referencedRelation: "saved_items"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string
          id: string
          participant_1: string
          participant_2: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          participant_1: string
          participant_2: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          participant_1?: string
          participant_2?: string
          updated_at?: string
        }
        Relationships: []
      }
      diary_entries: {
        Row: {
          athena_analysis: Json | null
          content: string
          created_at: string
          date: string
          emotion: string
          id: string
          sentiment_label: string | null
          sentiment_score: number | null
          title: string | null
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          athena_analysis?: Json | null
          content: string
          created_at?: string
          date?: string
          emotion: string
          id?: string
          sentiment_label?: string | null
          sentiment_score?: number | null
          title?: string | null
          type?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          athena_analysis?: Json | null
          content?: string
          created_at?: string
          date?: string
          emotion?: string
          id?: string
          sentiment_label?: string | null
          sentiment_score?: number | null
          title?: string | null
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      external_connections: {
        Row: {
          created_at: string | null
          expires_at: string | null
          id: string
          platform: string
          refresh_token: string | null
          token: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          platform: string
          refresh_token?: string | null
          token: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          platform?: string
          refresh_token?: string | null
          token?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      favorites: {
        Row: {
          created_at: string | null
          id: string
          platform: string | null
          tags: string[] | null
          title: string
          type: string | null
          url: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          platform?: string | null
          tags?: string[] | null
          title: string
          type?: string | null
          url?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          platform?: string | null
          tags?: string[] | null
          title?: string
          type?: string | null
          url?: string | null
          user_id?: string
        }
        Relationships: []
      }
      habit_check_ins: {
        Row: {
          checked_in_at: string
          created_at: string
          habit_id: string
          id: string
          notes: string | null
          user_id: string
        }
        Insert: {
          checked_in_at?: string
          created_at?: string
          habit_id: string
          id?: string
          notes?: string | null
          user_id: string
        }
        Update: {
          checked_in_at?: string
          created_at?: string
          habit_id?: string
          id?: string
          notes?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "habit_check_ins_habit_id_fkey"
            columns: ["habit_id"]
            isOneToOne: false
            referencedRelation: "habits"
            referencedColumns: ["id"]
          },
        ]
      }
      habits: {
        Row: {
          ai_observation: string | null
          created_at: string | null
          description: string | null
          frequency: string | null
          goal: number | null
          icon: string | null
          id: string
          last_check_in: string | null
          name: string
          progress: number | null
          streak: number | null
          tags: string[] | null
          user_id: string
        }
        Insert: {
          ai_observation?: string | null
          created_at?: string | null
          description?: string | null
          frequency?: string | null
          goal?: number | null
          icon?: string | null
          id?: string
          last_check_in?: string | null
          name: string
          progress?: number | null
          streak?: number | null
          tags?: string[] | null
          user_id: string
        }
        Update: {
          ai_observation?: string | null
          created_at?: string | null
          description?: string | null
          frequency?: string | null
          goal?: number | null
          icon?: string | null
          id?: string
          last_check_in?: string | null
          name?: string
          progress?: number | null
          streak?: number | null
          tags?: string[] | null
          user_id?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          message_type: string | null
          metadata: Json | null
          read_at: string | null
          sender_id: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          message_type?: string | null
          metadata?: Json | null
          read_at?: string | null
          sender_id: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          message_type?: string | null
          metadata?: Json | null
          read_at?: string | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      post_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          post_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          post_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          post_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      post_likes: {
        Row: {
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      post_saves: {
        Row: {
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_saves_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          category: string
          comments_count: number | null
          content: string
          created_at: string
          id: string
          image_url: string | null
          likes_count: number | null
          saves_count: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          category: string
          comments_count?: number | null
          content: string
          created_at?: string
          id?: string
          image_url?: string | null
          likes_count?: number | null
          saves_count?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          comments_count?: number | null
          content?: string
          created_at?: string
          id?: string
          image_url?: string | null
          likes_count?: number | null
          saves_count?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          cover_url: string | null
          created_at: string | null
          id: string
          location: string | null
          name: string
          role: string
          updated_at: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          cover_url?: string | null
          created_at?: string | null
          id: string
          location?: string | null
          name: string
          role?: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          cover_url?: string | null
          created_at?: string | null
          id?: string
          location?: string | null
          name?: string
          role?: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Relationships: []
      }
      project_steps: {
        Row: {
          created_at: string | null
          description: string
          done: boolean | null
          id: string
          order_index: number | null
          project_id: string
        }
        Insert: {
          created_at?: string | null
          description: string
          done?: boolean | null
          id?: string
          order_index?: number | null
          project_id: string
        }
        Update: {
          created_at?: string | null
          description?: string
          done?: boolean | null
          id?: string
          order_index?: number | null
          project_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_steps_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          category: string | null
          content: string | null
          created_at: string | null
          deadline: string | null
          description: string | null
          id: string
          is_favorite: boolean | null
          name: string
          progress: number | null
          status: string | null
          tags: string[] | null
          user_id: string
        }
        Insert: {
          category?: string | null
          content?: string | null
          created_at?: string | null
          deadline?: string | null
          description?: string | null
          id?: string
          is_favorite?: boolean | null
          name: string
          progress?: number | null
          status?: string | null
          tags?: string[] | null
          user_id: string
        }
        Update: {
          category?: string | null
          content?: string | null
          created_at?: string | null
          deadline?: string | null
          description?: string | null
          id?: string
          is_favorite?: boolean | null
          name?: string
          progress?: number | null
          status?: string | null
          tags?: string[] | null
          user_id?: string
        }
        Relationships: []
      }
      saved_items: {
        Row: {
          athena_insight: string | null
          created_at: string
          description: string | null
          id: string
          last_accessed: string | null
          saved_at: string
          source: string | null
          source_type: string | null
          status: string | null
          tags: string[] | null
          thumbnail: string | null
          title: string
          type: string
          updated_at: string
          url: string | null
          user_id: string
        }
        Insert: {
          athena_insight?: string | null
          created_at?: string
          description?: string | null
          id?: string
          last_accessed?: string | null
          saved_at?: string
          source?: string | null
          source_type?: string | null
          status?: string | null
          tags?: string[] | null
          thumbnail?: string | null
          title: string
          type: string
          updated_at?: string
          url?: string | null
          user_id: string
        }
        Update: {
          athena_insight?: string | null
          created_at?: string
          description?: string | null
          id?: string
          last_accessed?: string | null
          saved_at?: string
          source?: string | null
          source_type?: string | null
          status?: string | null
          tags?: string[] | null
          thumbnail?: string | null
          title?: string
          type?: string
          updated_at?: string
          url?: string | null
          user_id?: string
        }
        Relationships: []
      }
      subcerebro_connections: {
        Row: {
          connection_strength: number | null
          created_at: string
          id: string
          source_id: string
          source_type: string
          target_id: string
          target_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          connection_strength?: number | null
          created_at?: string
          id?: string
          source_id: string
          source_type: string
          target_id: string
          target_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          connection_strength?: number | null
          created_at?: string
          id?: string
          source_id?: string
          source_type?: string
          target_id?: string
          target_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      subcerebro_recommendations: {
        Row: {
          created_at: string
          id: string
          reasoning: string | null
          recommendation_type: string
          recommended_subcerebro_id: string | null
          similarity_score: number | null
          source_subcerebro_id: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          reasoning?: string | null
          recommendation_type: string
          recommended_subcerebro_id?: string | null
          similarity_score?: number | null
          source_subcerebro_id?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          reasoning?: string | null
          recommendation_type?: string
          recommended_subcerebro_id?: string | null
          similarity_score?: number | null
          source_subcerebro_id?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subcerebro_recommendations_recommended_subcerebro_id_fkey"
            columns: ["recommended_subcerebro_id"]
            isOneToOne: false
            referencedRelation: "subcerebros"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subcerebro_recommendations_source_subcerebro_id_fkey"
            columns: ["source_subcerebro_id"]
            isOneToOne: false
            referencedRelation: "subcerebros"
            referencedColumns: ["id"]
          },
        ]
      }
      subcerebros: {
        Row: {
          area: string | null
          created_at: string
          descricao: string | null
          id: string
          last_access: string | null
          nome: string
          relevancia: number | null
          tags: string[] | null
          tipo: string
          updated_at: string
          user_id: string
        }
        Insert: {
          area?: string | null
          created_at?: string
          descricao?: string | null
          id?: string
          last_access?: string | null
          nome: string
          relevancia?: number | null
          tags?: string[] | null
          tipo?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          area?: string | null
          created_at?: string
          descricao?: string | null
          id?: string
          last_access?: string | null
          nome?: string
          relevancia?: number | null
          tags?: string[] | null
          tipo?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_connections: {
        Row: {
          addressee_id: string
          created_at: string
          id: string
          requester_id: string
          status: string
          updated_at: string
        }
        Insert: {
          addressee_id: string
          created_at?: string
          id?: string
          requester_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          addressee_id?: string
          created_at?: string
          id?: string
          requester_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_follows: {
        Row: {
          created_at: string
          follower_id: string
          following_id: string
          id: string
        }
        Insert: {
          created_at?: string
          follower_id: string
          following_id: string
          id?: string
        }
        Update: {
          created_at?: string
          follower_id?: string
          following_id?: string
          id?: string
        }
        Relationships: []
      }
      user_integrations: {
        Row: {
          access_token: string | null
          created_at: string
          expires_at: string | null
          id: string
          is_connected: boolean
          permissions: Json | null
          refresh_token: string | null
          service_name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          access_token?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          is_connected?: boolean
          permissions?: Json | null
          refresh_token?: string | null
          service_name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          access_token?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          is_connected?: boolean
          permissions?: Json | null
          refresh_token?: string | null
          service_name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          ai_language: string
          ai_style: string
          animation_speed: string
          athena_avatar: string
          auto_save: boolean
          channel_app: boolean
          channel_email: boolean
          channel_push: boolean
          created_at: string
          custom_primary_color: string | null
          custom_secondary_color: string | null
          display_mode: string
          economy_mode: boolean
          id: string
          interaction_level: string
          interventions: string
          lab_collaborative_subbrains: boolean
          lab_immersive_mode: boolean
          lab_neuronal_feed: boolean
          lab_voice_generation: boolean
          memory_access: string
          notif_ai_suggestions: boolean
          notif_habit_progress: boolean
          notif_messages: boolean
          notif_new_connections: boolean
          notif_weekly_report: boolean
          notification_frequency: string
          offline_mode: boolean
          profile_visibility: string
          subbrain_sharing: boolean
          theme: string
          typography: string
          updated_at: string
          user_id: string
          visual_compression: boolean
        }
        Insert: {
          ai_language?: string
          ai_style?: string
          animation_speed?: string
          athena_avatar?: string
          auto_save?: boolean
          channel_app?: boolean
          channel_email?: boolean
          channel_push?: boolean
          created_at?: string
          custom_primary_color?: string | null
          custom_secondary_color?: string | null
          display_mode?: string
          economy_mode?: boolean
          id?: string
          interaction_level?: string
          interventions?: string
          lab_collaborative_subbrains?: boolean
          lab_immersive_mode?: boolean
          lab_neuronal_feed?: boolean
          lab_voice_generation?: boolean
          memory_access?: string
          notif_ai_suggestions?: boolean
          notif_habit_progress?: boolean
          notif_messages?: boolean
          notif_new_connections?: boolean
          notif_weekly_report?: boolean
          notification_frequency?: string
          offline_mode?: boolean
          profile_visibility?: string
          subbrain_sharing?: boolean
          theme?: string
          typography?: string
          updated_at?: string
          user_id: string
          visual_compression?: boolean
        }
        Update: {
          ai_language?: string
          ai_style?: string
          animation_speed?: string
          athena_avatar?: string
          auto_save?: boolean
          channel_app?: boolean
          channel_email?: boolean
          channel_push?: boolean
          created_at?: string
          custom_primary_color?: string | null
          custom_secondary_color?: string | null
          display_mode?: string
          economy_mode?: boolean
          id?: string
          interaction_level?: string
          interventions?: string
          lab_collaborative_subbrains?: boolean
          lab_immersive_mode?: boolean
          lab_neuronal_feed?: boolean
          lab_voice_generation?: boolean
          memory_access?: string
          notif_ai_suggestions?: boolean
          notif_habit_progress?: boolean
          notif_messages?: boolean
          notif_new_connections?: boolean
          notif_weekly_report?: boolean
          notification_frequency?: string
          offline_mode?: boolean
          profile_visibility?: string
          subbrain_sharing?: boolean
          theme?: string
          typography?: string
          updated_at?: string
          user_id?: string
          visual_compression?: boolean
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      accept_subcerebro_recommendation: {
        Args: { recommendation_id: string; user_id_param: string }
        Returns: boolean
      }
      calculate_habit_streak: {
        Args: { habit_id_param: string }
        Returns: number
      }
      generate_proactive_insights: {
        Args: { target_user_id: string }
        Returns: {
          insight_type: string
          title: string
          description: string
          action_suggestion: string
          priority: number
        }[]
      }
      generate_subcerebro_recommendations: {
        Args: { target_user_id: string }
        Returns: {
          recommended_subcerebro_id: string
          source_subcerebro_id: string
          recommendation_type: string
          similarity_score: number
          reasoning: string
        }[]
      }
      reject_subcerebro_recommendation: {
        Args: { recommendation_id: string; user_id_param: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
