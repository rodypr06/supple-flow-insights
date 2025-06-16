import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDatabase, Supplement } from '@/lib/local-storage-db';
import { useUserProfile } from '@/App';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

export function useSupplements(userId?: string) {
  const { user } = useUserProfile();
  const queryClient = useQueryClient();
  const targetUser = userId || user;
  const db = getDatabase();

  const {
    data: supplements = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['supplements', targetUser],
    queryFn: async () => {
      if (!targetUser) return [];
      try {
        return db.getSupplements(targetUser);
      } catch (error) {
        throw new Error('Failed to fetch supplements');
      }
    },
    enabled: !!targetUser
  });

  const createMutation = useMutation({
    mutationFn: async (newSupplement: Omit<Supplement, 'id' | 'created_at' | 'updated_at'>) => {
      if (!targetUser) throw new Error('No user selected');
      try {
        return db.createSupplement({ 
          ...newSupplement, 
          id: uuidv4(),
          user_id: targetUser 
        });
      } catch (error) {
        throw new Error('Failed to create supplement');
      }
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
      try {
        const result = db.updateSupplement(id, updates);
        if (!result) throw new Error('Supplement not found');
        return result;
      } catch (error) {
        throw new Error('Failed to update supplement');
      }
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
      try {
        const success = db.deleteSupplement(id);
        if (!success) throw new Error('Supplement not found');
        return success;
      } catch (error) {
        throw new Error('Failed to delete supplement');
      }
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

export function useUpdateSupplement(userId?: string) {
  const { user } = useUserProfile();
  const queryClient = useQueryClient();
  const targetUser = userId || user;

  return useMutation({
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
}

export function useDeleteSupplement(userId?: string) {
  const { user } = useUserProfile();
  const queryClient = useQueryClient();
  const targetUser = userId || user;

  return useMutation({
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
}
