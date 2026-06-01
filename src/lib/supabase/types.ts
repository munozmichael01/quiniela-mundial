export type Role = "admin" | "user";
export type MatchStatus = "scheduled" | "live" | "finished";

type NoRelationships = never[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          nombre: string;
          alias: string;
          role: Role;
          email: string;
          paid: boolean;
          created_at: string;
        };
        Insert: {
          id: string;
          nombre: string;
          alias: string;
          role?: Role;
          email: string;
          paid?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          nombre?: string;
          alias?: string;
          role?: Role;
          email?: string;
          paid?: boolean;
          created_at?: string;
        };
        Relationships: NoRelationships;
      };
      matches: {
        Row: {
          id: number;
          group: string;
          home: string;
          away: string;
          home_flag: string | null;
          away_flag: string | null;
          date: string;
          status: MatchStatus;
          external_id: number | null;
        };
        Insert: {
          group: string;
          home: string;
          away: string;
          home_flag?: string | null;
          away_flag?: string | null;
          date: string;
          status?: MatchStatus;
          external_id?: number | null;
        };
        Update: {
          group?: string;
          home?: string;
          away?: string;
          home_flag?: string | null;
          away_flag?: string | null;
          date?: string;
          status?: MatchStatus;
          external_id?: number | null;
        };
        Relationships: NoRelationships;
      };
      predictions: {
        Row: {
          id: number;
          user_id: string;
          match_id: number;
          home_score: number;
          away_score: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          match_id: number;
          home_score: number;
          away_score: number;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          match_id?: number;
          home_score?: number;
          away_score?: number;
          updated_at?: string;
        };
        Relationships: NoRelationships;
      };
      results: {
        Row: {
          match_id: number;
          home_score: number;
          away_score: number;
          updated_at: string;
        };
        Insert: {
          match_id: number;
          home_score: number;
          away_score: number;
          updated_at?: string;
        };
        Update: {
          match_id?: number;
          home_score?: number;
          away_score?: number;
          updated_at?: string;
        };
        Relationships: NoRelationships;
      };
      bonuses: {
        Row: {
          id: number;
          user_id: string;
          campeon: string | null;
          subcampeon: string | null;
          goleador: string | null;
          mvp: string | null;
          portero: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          campeon?: string | null;
          subcampeon?: string | null;
          goleador?: string | null;
          mvp?: string | null;
          portero?: string | null;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          campeon?: string | null;
          subcampeon?: string | null;
          goleador?: string | null;
          mvp?: string | null;
          portero?: string | null;
          updated_at?: string;
        };
        Relationships: NoRelationships;
      };
      bonus_results: {
        Row: {
          id: number;
          campeon: string | null;
          subcampeon: string | null;
          goleador: string | null;
          mvp: string | null;
          portero: string | null;
          updated_at: string;
        };
        Insert: {
          id?: number;
          campeon?: string | null;
          subcampeon?: string | null;
          goleador?: string | null;
          mvp?: string | null;
          portero?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: number;
          campeon?: string | null;
          subcampeon?: string | null;
          goleador?: string | null;
          mvp?: string | null;
          portero?: string | null;
          updated_at?: string;
        };
        Relationships: NoRelationships;
      };
      phase_settings: {
        Row: {
          id: string;
          is_open: boolean;
          updated_at: string;
        };
        Insert: {
          id: string;
          is_open?: boolean;
          updated_at?: string;
        };
        Update: {
          id?: string;
          is_open?: boolean;
          updated_at?: string;
        };
        Relationships: NoRelationships;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
