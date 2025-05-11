import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, type Supplement } from '@/lib/supabase';

// Fetch all supplements for a user
export const useSupplements = (user_name: string) => {
  return useQuery({
    queryKey: ['supplements', user_name],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('supplements')
        .select('*')
        .eq('user_name', user_name)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Supplement[];
    },
    enabled: !!user_name,
  });
};

// Add new supplement for a user
export const useAddSupplement = (user_name: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newSupplement: Omit<Supplement, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('supplements')
        .insert([{ ...newSupplement, user_name }])
        .select()
        .single();
      if (error) throw error;
      return data as Supplement;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supplements', user_name] });
    },
  });
};

// Get supplement by ID for a user
export const useSupplement = (id: string, user_name: string) => {
  return useQuery({
    queryKey: ['supplements', id, user_name],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('supplements')
        .select('*')
        .eq('id', id)
        .eq('user_name', user_name)
        .single();
      if (error) throw error;
      return data as Supplement;
    },
    enabled: !!id && !!user_name,
  });
};

// Update supplement for a user
export const useUpdateSupplement = (user_name: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (update: Partial<Supplement> & { id: string }) => {
      const { id, ...fields } = update;
      const { data, error } = await supabase
        .from('supplements')
        .update({ ...fields })
        .eq('id', id)
        .eq('user_name', user_name)
        .select()
        .single();
      if (error) throw error;
      return data as Supplement;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supplements', user_name] });
    },
  });
}; 