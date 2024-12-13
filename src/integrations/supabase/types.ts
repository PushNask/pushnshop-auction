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
      admin_roles: {
        Row: {
          created_at: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      admin_stats: {
        Row: {
          active_sellers: number
          created_at: string
          currency: string
          id: string
          total_products: number
          total_revenue: number
          updated_at: string
        }
        Insert: {
          active_sellers?: number
          created_at?: string
          currency?: string
          id?: string
          total_products?: number
          total_revenue?: number
          updated_at?: string
        }
        Update: {
          active_sellers?: number
          created_at?: string
          currency?: string
          id?: string
          total_products?: number
          total_revenue?: number
          updated_at?: string
        }
        Relationships: []
      }
      permanent_links: {
        Row: {
          created_at: string
          id: number
          status: string
          updated_at: string
          url: string
        }
        Insert: {
          created_at?: string
          id: number
          status?: string
          updated_at?: string
          url: string
        }
        Update: {
          created_at?: string
          id?: number
          status?: string
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      product_images: {
        Row: {
          created_at: string
          id: string
          order_index: number
          product_id: string | null
          url: string
        }
        Insert: {
          created_at?: string
          id?: string
          order_index?: number
          product_id?: string | null
          url: string
        }
        Update: {
          created_at?: string
          id?: string
          order_index?: number
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
          created_at: string
          currency: string
          description: string | null
          expires_at: string | null
          id: string
          payment_status: string | null
          permanent_link_id: number | null
          price: number
          quantity: number
          seller_id: string | null
          status: string
          title: string
          updated_at: string
          view_count: number
          whatsapp_clicks: number
        }
        Insert: {
          created_at?: string
          currency?: string
          description?: string | null
          expires_at?: string | null
          id?: string
          payment_status?: string | null
          permanent_link_id?: number | null
          price: number
          quantity?: number
          seller_id?: string | null
          status?: string
          title: string
          updated_at?: string
          view_count?: number
          whatsapp_clicks?: number
        }
        Update: {
          created_at?: string
          currency?: string
          description?: string | null
          expires_at?: string | null
          id?: string
          payment_status?: string | null
          permanent_link_id?: number | null
          price?: number
          quantity?: number
          seller_id?: string | null
          status?: string
          title?: string
          updated_at?: string
          view_count?: number
          whatsapp_clicks?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
          whatsapp_number: string | null
        }
        Insert: {
          created_at?: string
          full_name?: string | null
          id: string
          updated_at?: string
          whatsapp_number?: string | null
        }
        Update: {
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          whatsapp_number?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
