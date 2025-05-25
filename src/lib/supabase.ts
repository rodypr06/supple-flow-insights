import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database tables
export type Profile = {
  id: string;
  username: string;
  created_at: string;
  updated_at: string;
};

export type Supplement = {
  id: string;
  name: string;
  description: string;
  dosage_unit: string;
  recommended_dosage: number;
  max_dosage: number;
  capsule_mg?: number;
  user_id: string;
  created_at: string;
  updated_at: string;
};

export type Intake = {
  id: string;
  supplement_id: string;
  user_id: string;
  dosage: number;
  taken_at: string;
  notes: string;
  created_at: string;
};

// Database operations
export const db = {
  // Profile operations
  profiles: {
    async getAll() {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return { data, error: null };
    },

    async get(userId: string) {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      return data as Profile;
    },

    async create(username: string) {
      const { data, error } = await supabase
        .from('profiles')
        .insert([{ username }])
        .select()
        .single();
      
      if (error) throw error;
      return data as Profile;
    },

    async update(userId: string, updates: Partial<Profile>) {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();
      
      if (error) throw error;
      return data as Profile;
    }
  },

  // Supplement operations
  supplements: {
    async list(userId: string) {
      const { data, error } = await supabase
        .from('supplements')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Supplement[];
    },

    async create(supplement: Omit<Supplement, 'id' | 'created_at' | 'updated_at'>) {
      const { data, error } = await supabase
        .from('supplements')
        .insert([supplement])
        .select()
        .single();
      
      if (error) throw error;
      return data as Supplement;
    },

    async update(id: string, updates: Partial<Supplement>) {
      const { data, error } = await supabase
        .from('supplements')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data as Supplement;
    },

    async delete(id: string) {
      const { error } = await supabase
        .from('supplements')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    }
  },

  // Intake operations
  intakes: {
    async list(userId: string, startDate?: string, endDate?: string) {
      let query = supabase
        .from('intakes')
        .select('*, supplements(*)')
        .eq('user_id', userId)
        .order('taken_at', { ascending: false });

      if (startDate) {
        query = query.gte('taken_at', startDate);
      }
      if (endDate) {
        query = query.lte('taken_at', endDate);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data as (Intake & { supplements: Supplement })[];
    },

    async create(intake: Omit<Intake, 'id' | 'created_at'>) {
      const { data, error } = await supabase
        .from('intakes')
        .insert([intake])
        .select('*, supplements(*)')
        .single();
      
      if (error) throw error;
      return data as Intake & { supplements: Supplement };
    },

    async delete(id: string) {
      const { error } = await supabase
        .from('intakes')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    }
  }
}; 