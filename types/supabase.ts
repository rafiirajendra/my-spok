import type { Role } from "@/types/app";

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          created_at: string;
          description: string | null;
          id: string;
          name: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          id?: string;
          name: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          id?: string;
          name?: string;
        };
        Relationships: [];
      };
      levels: {
        Row: {
          category_id: string;
          created_at: string;
          id: string;
          name: string;
          order_number: number;
        };
        Insert: {
          category_id: string;
          created_at?: string;
          id?: string;
          name: string;
          order_number: number;
        };
        Update: {
          category_id?: string;
          created_at?: string;
          id?: string;
          name?: string;
          order_number?: number;
        };
        Relationships: [
          {
            foreignKeyName: "levels_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ];
      };
      words: {
        Row: {
          created_at: string;
          gif_url: string | null;
          id: string;
          level_id: string;
          word: string;
        };
        Insert: {
          created_at?: string;
          gif_url?: string | null;
          id?: string;
          level_id: string;
          word: string;
        };
        Update: {
          created_at?: string;
          gif_url?: string | null;
          id?: string;
          level_id?: string;
          word?: string;
        };
        Relationships: [
          {
            foreignKeyName: "words_level_id_fkey";
            columns: ["level_id"];
            isOneToOne: false;
            referencedRelation: "levels";
            referencedColumns: ["id"];
          },
        ];
      };
      exercises: {
        Row: {
          created_at: string;
          id: string;
          instruction: string | null;
          level_id: string;
          title: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          instruction?: string | null;
          level_id: string;
          title: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          instruction?: string | null;
          level_id?: string;
          title?: string;
        };
        Relationships: [
          {
            foreignKeyName: "exercises_level_id_fkey";
            columns: ["level_id"];
            isOneToOne: false;
            referencedRelation: "levels";
            referencedColumns: ["id"];
          },
        ];
      };
      exercise_items: {
        Row: {
          created_at: string;
          exercise_id: string;
          id: string;
          order_number: number;
          sentence_answer: string;
          words_options: Json;
        };
        Insert: {
          created_at?: string;
          exercise_id: string;
          id?: string;
          order_number: number;
          sentence_answer: string;
          words_options: Json;
        };
        Update: {
          created_at?: string;
          exercise_id?: string;
          id?: string;
          order_number?: number;
          sentence_answer?: string;
          words_options?: Json;
        };
        Relationships: [
          {
            foreignKeyName: "exercise_items_exercise_id_fkey";
            columns: ["exercise_id"];
            isOneToOne: false;
            referencedRelation: "exercises";
            referencedColumns: ["id"];
          },
        ];
      };
      student_sessions: {
        Row: {
          category_id: string;
          created_at: string;
          id: string;
          level_id: string;
          student_class: string | null;
          student_name: string;
        };
        Insert: {
          category_id: string;
          created_at?: string;
          id?: string;
          level_id: string;
          student_class?: string | null;
          student_name: string;
        };
        Update: {
          category_id?: string;
          created_at?: string;
          id?: string;
          level_id?: string;
          student_class?: string | null;
          student_name?: string;
        };
        Relationships: [
          {
            foreignKeyName: "student_sessions_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "student_sessions_level_id_fkey";
            columns: ["level_id"];
            isOneToOne: false;
            referencedRelation: "levels";
            referencedColumns: ["id"];
          },
        ];
      };
      attempts: {
        Row: {
          correct_answers: number;
          created_at: string;
          exercise_id: string;
          finished_at: string | null;
          id: string;
          score: number;
          started_at: string;
          student_session_id: string;
          total_questions: number;
        };
        Insert: {
          correct_answers?: number;
          created_at?: string;
          exercise_id: string;
          finished_at?: string | null;
          id?: string;
          score: number;
          started_at?: string;
          student_session_id: string;
          total_questions: number;
        };
        Update: {
          correct_answers?: number;
          created_at?: string;
          exercise_id?: string;
          finished_at?: string | null;
          id?: string;
          score?: number;
          started_at?: string;
          student_session_id?: string;
          total_questions?: number;
        };
        Relationships: [
          {
            foreignKeyName: "attempts_exercise_id_fkey";
            columns: ["exercise_id"];
            isOneToOne: false;
            referencedRelation: "exercises";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "attempts_student_session_id_fkey";
            columns: ["student_session_id"];
            isOneToOne: false;
            referencedRelation: "student_sessions";
            referencedColumns: ["id"];
          },
        ];
      };
      attempt_answers: {
        Row: {
          attempt_id: string;
          created_at: string;
          exercise_item_id: string;
          id: string;
          is_correct: boolean;
          student_answer: string;
        };
        Insert: {
          attempt_id: string;
          created_at?: string;
          exercise_item_id: string;
          id?: string;
          is_correct: boolean;
          student_answer: string;
        };
        Update: {
          attempt_id?: string;
          created_at?: string;
          exercise_item_id?: string;
          id?: string;
          is_correct?: boolean;
          student_answer?: string;
        };
        Relationships: [
          {
            foreignKeyName: "attempt_answers_attempt_id_fkey";
            columns: ["attempt_id"];
            isOneToOne: false;
            referencedRelation: "attempts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "attempt_answers_exercise_item_id_fkey";
            columns: ["exercise_item_id"];
            isOneToOne: false;
            referencedRelation: "exercise_items";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          created_at: string;
          email: string;
          full_name: string | null;
          id: string;
          role: Role;
        };
        Insert: {
          created_at?: string;
          email: string;
          full_name?: string | null;
          id: string;
          role?: Role;
        };
        Update: {
          created_at?: string;
          email?: string;
          full_name?: string | null;
          id?: string;
          role?: Role;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: Role;
    };
  };
};
