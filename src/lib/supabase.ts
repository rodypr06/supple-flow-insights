import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database tables
export type Supplement = {
  id: string;
  created_at: string;
  name: string;
  max_dosage: number;
  milligrams: number;
  image_url?: string;
};

export type Intake = {
  id: string;
  created_at: string;
  supplement_id: string;
  quantity: number;
  taken_at: string;
};

export type SupplementFact = {
  id: string;
  supplement_id: string;
  fact: string;
  source: string;
  created_at: string;
}; 