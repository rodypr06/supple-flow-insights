import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, type IntakeLog } from '@/lib/supabase';
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

// Fetch intakes for a specific date
export const useIntakesByDate = (date: Date) => {
  const { start, end } = getDayBounds(date);

  return useQuery({
    queryKey: ['intakes', start],
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
        .order('taken_at', { ascending: false });
      
      if (error) throw error;
      return data as (IntakeLog & { supplements: { id: string; name: string; max_dosage: number } })[];
    },
  });
};

// Add new intake
export const useAddIntake = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newIntake: Omit<IntakeLog, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('intake_logs')
        .insert([newIntake])
        .select()
        .single();
      
      if (error) throw error;
      return data as IntakeLog;
    },
    onSuccess: (_, variables) => {
      // Invalidate queries for the specific date
      const date = new Date(variables.taken_at);
      const { start } = getDayBounds(date);
      queryClient.invalidateQueries({ queryKey: ['intakes', start] });
    },
  });
};

// Get today's intakes
export const useTodayIntakes = () => {
  return useIntakesByDate(new Date());
}; 