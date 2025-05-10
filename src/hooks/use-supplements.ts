import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, type Supplement } from '@/lib/supabase';

// Fetch all supplements
export const useSupplements = () => {
  return useQuery({
    queryKey: ['supplements'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('supplements')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Supplement[];
    },
  });
};

// Add new supplement
export const useAddSupplement = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newSupplement: Omit<Supplement, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('supplements')
        .insert([newSupplement])
        .select()
        .single();
      
      if (error) throw error;
      return data as Supplement;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supplements'] });
    },
  });
};

// Get supplement by ID
export const useSupplement = (id: string) => {
  return useQuery({
    queryKey: ['supplements', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('supplements')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as Supplement;
    },
  });
}; 