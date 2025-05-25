import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { db, Intake } from '@/lib/supabase';
import { useUserProfile } from '@/App';
import { toast } from 'sonner';
import { startOfDay, endOfDay } from 'date-fns';

export function useIntakes(startDate?: string, endDate?: string) {
  const { user } = useUserProfile();
  const queryClient = useQueryClient();

  const {
    data: intakes = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['intakes', user, startDate, endDate],
    queryFn: () => db.intakes.list(user, startDate, endDate),
    enabled: !!user
  });

  const createMutation = useMutation({
    mutationFn: (newIntake: Omit<Intake, 'id' | 'created_at'>) =>
      db.intakes.create({ ...newIntake, user_id: user }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['intakes', user] });
      toast.success('Intake logged successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to log intake: ${error.message}`);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => db.intakes.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['intakes', user] });
      toast.success('Intake deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete intake: ${error.message}`);
    }
  });

  return {
    intakes,
    isLoading,
    error,
    createIntake: createMutation.mutate,
    deleteIntake: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isDeleting: deleteMutation.isPending
  };
}

// Helper hook for getting today's intakes
export function useTodayIntakes() {
  const today = new Date();
  return useIntakes(
    startOfDay(today).toISOString(),
    endOfDay(today).toISOString()
  );
}

// Helper hook for getting intakes for a specific date
export function useIntakesByDate(date: Date) {
  return useIntakes(
    startOfDay(date).toISOString(),
    endOfDay(date).toISOString()
  );
} 