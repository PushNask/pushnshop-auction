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
      active_sessions: {
        Row: {
          created_at: string | null
          id: string
          last_activity: string | null
          metadata: Json | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_activity?: string | null
          metadata?: Json | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          last_activity?: string | null
          metadata?: Json | null
          user_id?: string | null
        }
        Relationships: []
      }
      analytics: {
        Row: {
          created_at: string | null
          id: string
          listing_id: string
          updated_at: string | null
          views: number | null
          whatsapp_clicks: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          listing_id: string
          updated_at?: string | null
          views?: number | null
          whatsapp_clicks?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          listing_id?: string
          updated_at?: string | null
          views?: number | null
          whatsapp_clicks?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "analytics_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      error_logs: {
        Row: {
          created_at: string | null
          error_message: string
          id: number
          metadata: Json | null
          stack_trace: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          error_message: string
          id?: number
          metadata?: Json | null
          stack_trace?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          error_message?: string
          id?: number
          metadata?: Json | null
          stack_trace?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      link_analytics: {
        Row: {
          clicks: number | null
          created_at: string | null
          id: string
          last_activity: string | null
          link_id: number | null
          updated_at: string | null
          views: number | null
        }
        Insert: {
          clicks?: number | null
          created_at?: string | null
          id?: string
          last_activity?: string | null
          link_id?: number | null
          updated_at?: string | null
          views?: number | null
        }
        Update: {
          clicks?: number | null
          created_at?: string | null
          id?: string
          last_activity?: string | null
          link_id?: number | null
          updated_at?: string | null
          views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "link_analytics_link_id_fkey"
            columns: ["link_id"]
            isOneToOne: true
            referencedRelation: "permanent_links"
            referencedColumns: ["id"]
          },
        ]
      }
      listings: {
        Row: {
          created_at: string | null
          duration_hours: number
          end_time: string | null
          id: string
          permanent_link_id: number | null
          price_paid: number
          product_id: string
          start_time: string | null
          status: Database["public"]["Enums"]["listing_status"] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          duration_hours: number
          end_time?: string | null
          id?: string
          permanent_link_id?: number | null
          price_paid: number
          product_id: string
          start_time?: string | null
          status?: Database["public"]["Enums"]["listing_status"] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          duration_hours?: number
          end_time?: string | null
          id?: string
          permanent_link_id?: number | null
          price_paid?: number
          product_id?: string
          start_time?: string | null
          status?: Database["public"]["Enums"]["listing_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "listings_permanent_link_id_fkey"
            columns: ["permanent_link_id"]
            isOneToOne: false
            referencedRelation: "permanent_links"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listings_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          message: string
          read: boolean | null
          title: string | null
          type: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          read?: boolean | null
          title?: string | null
          type: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          read?: boolean | null
          title?: string | null
          type?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string | null
          currency: Database["public"]["Enums"]["currency_type"] | null
          id: string
          listing_id: string
          payment_method: string | null
          reference_number: string | null
          status: Database["public"]["Enums"]["payment_status"] | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: Database["public"]["Enums"]["currency_type"] | null
          id?: string
          listing_id: string
          payment_method?: string | null
          reference_number?: string | null
          status?: Database["public"]["Enums"]["payment_status"] | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: Database["public"]["Enums"]["currency_type"] | null
          id?: string
          listing_id?: string
          payment_method?: string | null
          reference_number?: string | null
          status?: Database["public"]["Enums"]["payment_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      permanent_links: {
        Row: {
          created_at: string | null
          current_listing_id: string | null
          id: number
          last_assigned_at: string | null
          performance_score: number | null
          rotation_count: number | null
          status: Database["public"]["Enums"]["permanent_link_status"]
          url_key: string
          url_path: string
        }
        Insert: {
          created_at?: string | null
          current_listing_id?: string | null
          id?: number
          last_assigned_at?: string | null
          performance_score?: number | null
          rotation_count?: number | null
          status?: Database["public"]["Enums"]["permanent_link_status"]
          url_key: string
          url_path: string
        }
        Update: {
          created_at?: string | null
          current_listing_id?: string | null
          id?: number
          last_assigned_at?: string | null
          performance_score?: number | null
          rotation_count?: number | null
          status?: Database["public"]["Enums"]["permanent_link_status"]
          url_key?: string
          url_path?: string
        }
        Relationships: []
      }
      product_images: {
        Row: {
          alt: string | null
          created_at: string | null
          id: string
          order_number: number
          product_id: string | null
          url: string
        }
        Insert: {
          alt?: string | null
          created_at?: string | null
          id?: string
          order_number: number
          product_id?: string | null
          url: string
        }
        Update: {
          alt?: string | null
          created_at?: string | null
          id?: string
          order_number?: number
          product_id?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          created_at: string | null
          currency: Database["public"]["Enums"]["currency_type"] | null
          description: string
          end_time: string | null
          id: string
          payment_status: string | null
          price: number
          promotion_range: string | null
          quantity: number
          searchable: unknown | null
          seller_id: string
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          currency?: Database["public"]["Enums"]["currency_type"] | null
          description: string
          end_time?: string | null
          id?: string
          payment_status?: string | null
          price: number
          promotion_range?: string | null
          quantity: number
          searchable?: unknown | null
          seller_id: string
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          currency?: Database["public"]["Enums"]["currency_type"] | null
          description?: string
          end_time?: string | null
          id?: string
          payment_status?: string | null
          price?: number
          promotion_range?: string | null
          quantity?: number
          searchable?: unknown | null
          seller_id?: string
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      system_alerts: {
        Row: {
          acknowledged: boolean | null
          created_at: string | null
          id: number
          metric: string
          severity: string
          threshold: number
          value: number
        }
        Insert: {
          acknowledged?: boolean | null
          created_at?: string | null
          id?: number
          metric: string
          severity: string
          threshold: number
          value: number
        }
        Update: {
          acknowledged?: boolean | null
          created_at?: string | null
          id?: number
          metric?: string
          severity?: string
          threshold?: number
          value?: number
        }
        Relationships: []
      }
      system_logs: {
        Row: {
          created_at: string | null
          id: number
          level: string
          message: string
          metadata: Json | null
          source: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          level: string
          message: string
          metadata?: Json | null
          source?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          level?: string
          message?: string
          metadata?: Json | null
          source?: string | null
        }
        Relationships: []
      }
      system_metrics: {
        Row: {
          active_users: number | null
          cpu_usage: number | null
          created_at: string | null
          database_connections: number | null
          error_rate: number | null
          id: number
          memory_usage: number | null
          response_time: number | null
        }
        Insert: {
          active_users?: number | null
          cpu_usage?: number | null
          created_at?: string | null
          database_connections?: number | null
          error_rate?: number | null
          id?: number
          memory_usage?: number | null
          response_time?: number | null
        }
        Update: {
          active_users?: number | null
          cpu_usage?: number | null
          created_at?: string | null
          database_connections?: number | null
          error_rate?: number | null
          id?: number
          memory_usage?: number | null
          response_time?: number | null
        }
        Relationships: []
      }
      system_settings: {
        Row: {
          created_at: string | null
          default_currency: string | null
          id: number
          maintenance_mode: boolean | null
          max_file_size: number | null
          notification_settings: Json | null
          security_settings: Json | null
          site_name: string
          smtp_settings: Json | null
          updated_at: string | null
          user_registration: boolean | null
        }
        Insert: {
          created_at?: string | null
          default_currency?: string | null
          id?: number
          maintenance_mode?: boolean | null
          max_file_size?: number | null
          notification_settings?: Json | null
          security_settings?: Json | null
          site_name?: string
          smtp_settings?: Json | null
          updated_at?: string | null
          user_registration?: boolean | null
        }
        Update: {
          created_at?: string | null
          default_currency?: string | null
          id?: number
          maintenance_mode?: boolean | null
          max_file_size?: number | null
          notification_settings?: Json | null
          security_settings?: Json | null
          site_name?: string
          smtp_settings?: Json | null
          updated_at?: string | null
          user_registration?: boolean | null
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          updated_at: string | null
          website_url: string | null
          whatsapp_number: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name?: string | null
          id?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
          website_url?: string | null
          whatsapp_number?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
          website_url?: string | null
          whatsapp_number?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_admin_dashboard_metrics: {
        Args: {
          time_range: string
        }
        Returns: Json
      }
      get_system_metrics: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      increment_link_analytics: {
        Args: {
          p_link_id: number
          p_column: string
        }
        Returns: undefined
      }
      increment_rotation_count: {
        Args: {
          link_id: number
        }
        Returns: undefined
      }
    }
    Enums: {
      currency_type: "XAF" | "USD"
      listing_status:
        | "draft"
        | "pending_payment"
        | "pending_approval"
        | "active"
        | "expired"
        | "rejected"
      payment_status: "pending" | "processing" | "completed" | "failed"
      permanent_link_status: "active" | "available"
      user_role: "seller" | "buyer" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
