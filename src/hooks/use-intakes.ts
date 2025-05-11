import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, type Intake } from '@/lib/supabase';
import { startOfDay, endOfDay } from 'date-fns';

// Helper function to get start and end of day in UTC
const getDayBounds = (date: Date) => {
  const start = startOfDay(date);
  const end = endOfDay(date);
  return {
    start: start.toISOString(),
    end: end.toISOString()
  };
};

// Fetch intakes for a specific date and user
export const useIntakesByDate = (date: Date, user_name: string) => {
  const { start, end } = getDayBounds(date);

  return useQuery({
    queryKey: ['intakes', start, user_name],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('intake_logs')
        .select(`
          *,
          supplements (
            id,
            name,
            max_dosage
          )
        `)
        .gte('taken_at', start)
        .lte('taken_at', end)
        .eq('user_name', user_name)
        .order('taken_at', { ascending: false });
      if (error) throw error;
      return data as (Intake & { supplements: { id: string; name: string; max_dosage: number } })[];
    },
    enabled: !!user_name,
  });
};

// Add new intake for a user
export const useAddIntake = (user_name: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newIntake: Omit<Intake, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('intake_logs')
        .insert([{ ...newIntake, user_name }])
        .select()
        .single();
      if (error) throw error;
      return data as Intake;
    },
    onSuccess: (_, variables) => {
      // Invalidate queries for the specific date
      const date = new Date(variables.taken_at);
      const { start } = getDayBounds(date);
      queryClient.invalidateQueries({ queryKey: ['intakes', start, user_name] });
    },
  });
};

// Get today's intakes for a user
export const useTodayIntakes = (user_name: string) => {
  return useIntakesByDate(new Date(), user_name);
}; 