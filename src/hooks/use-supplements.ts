import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { db, Supplement } from '@/lib/supabase';
import { useUserProfile } from '@/App';
import { toast } from 'sonner';

export function useSupplements(userId?: string) {
  const { user } = useUserProfile();
  const queryClient = useQueryClient();
  const targetUser = userId || user;

  const {
    data: supplements = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['supplements', targetUser],
    queryFn: async () => {
      const result = await db.supplements.list(targetUser);
      return result;
    },
    enabled: !!targetUser
  });

  const createMutation = useMutation({
    mutationFn: async (newSupplement: Omit<Supplement, 'id' | 'created_at' | 'updated_at'>) => {
      const result = await db.supplements.create({ ...newSupplement, user_id: targetUser });
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supplements', targetUser] });
      toast.success('Supplement added successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to add supplement: ${error.message}`);
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Supplement> }) => {
      const result = await db.supplements.update(id, updates);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supplements', targetUser] });
      toast.success('Supplement updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update supplement: ${error.message}`);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await db.supplements.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supplements', targetUser] });
      toast.success('Supplement deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete supplement: ${error.message}`);
    }
  });

  return {
    supplements,
    isLoading,
    error,
    createSupplement: createMutation.mutate,
    updateSupplement: updateMutation.mutate,
    deleteSupplement: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending
  };
} 