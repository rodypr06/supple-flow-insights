import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDatabase, Intake } from '@/lib/local-storage-db';
import { useUserProfile } from '@/App';
import { toast } from 'sonner';
import { startOfDay, endOfDay } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

export function useIntakes(startDate?: string, endDate?: string) {
  const { user } = useUserProfile();
  const queryClient = useQueryClient();
  const db = getDatabase();

  const {
    data: intakes = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['intakes', user, startDate, endDate],
    queryFn: async () => {
      if (!user) return [];
      try {
        return db.getIntakes(user, {
          startDate,
          endDate
        });
      } catch (error) {
        throw new Error('Failed to fetch intakes');
      }
    },
    enabled: !!user
  });

  const createMutation = useMutation({
    mutationFn: async (newIntake: Omit<Intake, 'id' | 'created_at'>) => {
      if (!user) throw new Error('No user selected');
      try {
        return db.createIntake({ 
          ...newIntake, 
          id: uuidv4(),
          user_id: user 
        });
      } catch (error) {
        throw new Error('Failed to create intake');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['intakes', user] });
      toast.success('Intake logged successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to log intake: ${error.message}`);
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Omit<Intake, 'id' | 'created_at' | 'user_id'>> }) => {
      try {
        const currentIntake = db.getIntakes(user || '').find(i => i.id === id);
        if (!currentIntake) throw new Error('Intake not found');
        
        // Update the intake by replacing it
        db.deleteIntake(id);
        return db.createIntake({
          ...currentIntake,
          ...updates,
          id,
          user_id: currentIntake.user_id
        });
      } catch (error) {
        throw new Error('Failed to update intake');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['intakes', user] });
      toast.success('Intake updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update intake: ${error.message}`);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      try {
        const success = db.deleteIntake(id);
        if (!success) throw new Error('Intake not found');
        return success;
      } catch (error) {
        throw new Error('Failed to delete intake');
      }
    },
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
    updateIntake: updateMutation.mutate,
    deleteIntake: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
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