export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      admin_logs: {
        Row: {
          actor_id: string | null
          context: string | null
          created_at: string
          id: string
          level: string
          message: string
        }
        Insert: {
          actor_id?: string | null
          context?: string | null
          created_at?: string
          id?: string
          level?: string
          message: string
        }
        Update: {
          actor_id?: string | null
          context?: string | null
          created_at?: string
          id?: string
          level?: string
          message?: string
        }
        Relationships: []
      }
      announcements: {
        Row: {
          author_id: string | null
          category: string
          content: string
          created_at: string
          id: string
          published: boolean
          title: string
        }
        Insert: {
          author_id?: string | null
          category?: string
          content: string
          created_at?: string
          id?: string
          published?: boolean
          title: string
        }
        Update: {
          author_id?: string | null
          category?: string
          content?: string
          created_at?: string
          id?: string
          published?: boolean
          title?: string
        }
        Relationships: []
      }
      boards: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          name: string
          slug: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          slug: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          slug?: string
          sort_order?: number
        }
        Relationships: []
      }
      channel_messages: {
        Row: {
          author_id: string | null
          author_name: string | null
          channel_id: string
          created_at: string
          id: string
          text: string
        }
        Insert: {
          author_id?: string | null
          author_name?: string | null
          channel_id: string
          created_at?: string
          id?: string
          text: string
        }
        Update: {
          author_id?: string | null
          author_name?: string | null
          channel_id?: string
          created_at?: string
          id?: string
          text?: string
        }
        Relationships: []
      }
      fishing_methods: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      friend_requests: {
        Row: {
          created_at: string
          id: string
          receiver_id: string
          sender_id: string
          status: string
        }
        Insert: {
          created_at?: string
          id?: string
          receiver_id: string
          sender_id: string
          status?: string
        }
        Update: {
          created_at?: string
          id?: string
          receiver_id?: string
          sender_id?: string
          status?: string
        }
        Relationships: []
      }
      friendships: {
        Row: {
          created_at: string
          id: string
          user_a: string
          user_b: string
        }
        Insert: {
          created_at?: string
          id?: string
          user_a: string
          user_b: string
        }
        Update: {
          created_at?: string
          id?: string
          user_a?: string
          user_b?: string
        }
        Relationships: []
      }
      gallery_comments: {
        Row: {
          author_id: string
          author_name: string | null
          content: string
          created_at: string
          gallery_item_id: string
          id: string
          parent_id: string | null
        }
        Insert: {
          author_id: string
          author_name?: string | null
          content: string
          created_at?: string
          gallery_item_id: string
          id?: string
          parent_id?: string | null
        }
        Update: {
          author_id?: string
          author_name?: string | null
          content?: string
          created_at?: string
          gallery_item_id?: string
          id?: string
          parent_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gallery_comments_gallery_item_id_fkey"
            columns: ["gallery_item_id"]
            isOneToOne: false
            referencedRelation: "gallery_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gallery_comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "gallery_comments"
            referencedColumns: ["id"]
          },
        ]
      }
      gallery_items: {
        Row: {
          author_id: string
          author_name: string | null
          category: string
          created_at: string
          description: string | null
          id: string
          image_url: string
          title: string
        }
        Insert: {
          author_id: string
          author_name?: string | null
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          image_url: string
          title: string
        }
        Update: {
          author_id?: string
          author_name?: string | null
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string
          title?: string
        }
        Relationships: []
      }
      gallery_likes: {
        Row: {
          created_at: string
          gallery_item_id: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          gallery_item_id: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          gallery_item_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "gallery_likes_gallery_item_id_fkey"
            columns: ["gallery_item_id"]
            isOneToOne: false
            referencedRelation: "gallery_items"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          created_at: string
          id: string
          read_at: string | null
          receiver_id: string
          sender_id: string
          text: string
        }
        Insert: {
          created_at?: string
          id?: string
          read_at?: string | null
          receiver_id: string
          sender_id: string
          text: string
        }
        Update: {
          created_at?: string
          id?: string
          read_at?: string | null
          receiver_id?: string
          sender_id?: string
          text?: string
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          id: string
          is_read: boolean
          link: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          link?: string | null
          title: string
          type?: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          link?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      posts: {
        Row: {
          author_id: string
          content: string
          created_at: string
          deleted_at: string | null
          id: string
          parent_id: string | null
          thread_id: string
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          parent_id?: string | null
          thread_id: string
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          parent_id?: string | null
          thread_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "threads"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          age: number | null
          avatar_url: string | null
          ban_reason: string | null
          banned_until: string | null
          bio: string | null
          created_at: string
          display_name: string | null
          fishing_method_id: string | null
          id: string
          joined_at: string
          last_seen_at: string | null
          rank_id: string | null
          region_id: string | null
          updated_at: string
          user_id: string
          username: string | null
        }
        Insert: {
          age?: number | null
          avatar_url?: string | null
          ban_reason?: string | null
          banned_until?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          fishing_method_id?: string | null
          id?: string
          joined_at?: string
          last_seen_at?: string | null
          rank_id?: string | null
          region_id?: string | null
          updated_at?: string
          user_id: string
          username?: string | null
        }
        Update: {
          age?: number | null
          avatar_url?: string | null
          ban_reason?: string | null
          banned_until?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          fishing_method_id?: string | null
          id?: string
          joined_at?: string
          last_seen_at?: string | null
          rank_id?: string | null
          region_id?: string | null
          updated_at?: string
          user_id?: string
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_fishing_method_id_fkey"
            columns: ["fishing_method_id"]
            isOneToOne: false
            referencedRelation: "fishing_methods"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_rank_id_fkey"
            columns: ["rank_id"]
            isOneToOne: false
            referencedRelation: "ranks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          },
        ]
      }
      ranks: {
        Row: {
          color: string | null
          created_at: string
          id: string
          min_posts: number
          name: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          id?: string
          min_posts?: number
          name: string
        }
        Update: {
          color?: string | null
          created_at?: string
          id?: string
          min_posts?: number
          name?: string
        }
        Relationships: []
      }
      reactions: {
        Row: {
          created_at: string
          id: string
          post_id: string | null
          thread_id: string | null
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id?: string | null
          thread_id?: string | null
          type?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string | null
          thread_id?: string | null
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reactions_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reactions_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "threads"
            referencedColumns: ["id"]
          },
        ]
      }
      regions: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      reports: {
        Row: {
          author_id: string
          author_name: string | null
          created_at: string
          description: string | null
          id: string
          resolved_at: string | null
          resolved_by: string | null
          status: string
          target_id: string | null
          target_type: string | null
          title: string
          type: string
        }
        Insert: {
          author_id: string
          author_name?: string | null
          created_at?: string
          description?: string | null
          id?: string
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string
          target_id?: string | null
          target_type?: string | null
          title: string
          type?: string
        }
        Update: {
          author_id?: string
          author_name?: string | null
          created_at?: string
          description?: string | null
          id?: string
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string
          target_id?: string | null
          target_type?: string | null
          title?: string
          type?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          key: string
          updated_at: string
          value: string
        }
        Insert: {
          key: string
          updated_at?: string
          value: string
        }
        Update: {
          key?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      threads: {
        Row: {
          author_id: string
          board_id: string
          content: string
          created_at: string
          deleted_at: string | null
          id: string
          is_pinned: boolean
          tag: string | null
          title: string
          updated_at: string
          view_count: number
        }
        Insert: {
          author_id: string
          board_id: string
          content: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          is_pinned?: boolean
          tag?: string | null
          title: string
          updated_at?: string
          view_count?: number
        }
        Update: {
          author_id?: string
          board_id?: string
          content?: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          is_pinned?: boolean
          tag?: string | null
          title?: string
          updated_at?: string
          view_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "threads_board_id_fkey"
            columns: ["board_id"]
            isOneToOne: false
            referencedRelation: "boards"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_notification: {
        Args: {
          _body?: string
          _link?: string
          _title: string
          _type: string
          _user_id: string
        }
        Returns: undefined
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      increment_thread_views: {
        Args: { thread_id: string }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
