export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      churches: {
        Row: {
          id: string
          igreja: string
          bairro: string
          zona: string
          contatos: string | null
          instagram: string | null
          missa_seg: string | null
          missa_ter: string | null
          missa_qua: string | null
          missa_qui: string | null
          missa_sex: string | null
          missa_sab: string | null
          missa_dom: string | null
          confissao_seg: string | null
          confissao_ter: string | null
          confissao_qua: string | null
          confissao_qui: string | null
          confissao_sex: string | null
          confissao_sab: string | null
          confissao_dom: string | null
          adoracao_seg: string | null
          adoracao_ter: string | null
          adoracao_qua: string | null
          adoracao_qui: string | null
          adoracao_sex: string | null
          adoracao_sab: string | null
          adoracao_dom: string | null
          image_url: string | null
          noticias: string | null
          created_at: string
        }
        Insert: {
          id?: string
          igreja: string
          bairro?: string
          zona?: string
          contatos?: string | null
          instagram?: string | null
          missa_seg?: string | null
          missa_ter?: string | null
          missa_qua?: string | null
          missa_qui?: string | null
          missa_sex?: string | null
          missa_sab?: string | null
          missa_dom?: string | null
          confissao_seg?: string | null
          confissao_ter?: string | null
          confissao_qua?: string | null
          confissao_qui?: string | null
          confissao_sex?: string | null
          confissao_sab?: string | null
          confissao_dom?: string | null
          adoracao_seg?: string | null
          adoracao_ter?: string | null
          adoracao_qua?: string | null
          adoracao_qui?: string | null
          adoracao_sex?: string | null
          adoracao_sab?: string | null
          adoracao_dom?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          igreja?: string
          bairro?: string
          zona?: string
          contatos?: string | null
          instagram?: string | null
          missa_seg?: string | null
          missa_ter?: string | null
          missa_qua?: string | null
          missa_qui?: string | null
          missa_sex?: string | null
          missa_sab?: string | null
          missa_dom?: string | null
          confissao_seg?: string | null
          confissao_ter?: string | null
          confissao_qua?: string | null
          confissao_qui?: string | null
          confissao_sex?: string | null
          confissao_sab?: string | null
          confissao_dom?: string | null
          adoracao_seg?: string | null
          adoracao_ter?: string | null
          adoracao_qua?: string | null
          adoracao_qui?: string | null
          adoracao_sex?: string | null
          adoracao_sab?: string | null
          adoracao_dom?: string | null
          created_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          id: string
          email: string
          role: string
          created_at: string
        }
        Insert: {
          id: string
          email: string
          role?: string
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          role?: string
          created_at?: string
        }
        Relationships: []
      }
      church_editors: {
        Row: {
          id: string
          user_id: string
          church_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          church_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          church_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "church_editors_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "church_editors_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          }
        ]
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
    Enums: {},
  },
} as const
