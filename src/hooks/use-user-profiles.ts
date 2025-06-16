import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDatabase, Profile } from '@/lib/local-storage-db';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

export function useUserProfiles() {
  const queryClient = useQueryClient();
  const db = getDatabase();

  const {
    data: profiles = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['profiles'],
    queryFn: async () => {
      try {
        return db.getProfiles();
      } catch (error) {
        throw new Error('Failed to fetch profiles');
      }
    }
  });

  const createMutation = useMutation({
    mutationFn: async (username: string) => {
      try {
        return db.createProfile({
          id: uuidv4(),
          username
        });
      } catch (error) {
        throw new Error('Failed to create profile');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
      toast.success('Profile created successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create profile: ${error.message}`);
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Profile> }) => {
      try {
        const result = db.updateProfile(id, updates);
        if (!result) throw new Error('Profile not found');
        return result;
      } catch (error) {
        throw new Error('Failed to update profile');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
      toast.success('Profile updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update profile: ${error.message}`);
    }
  });

  return {
    profiles,
    isLoading,
    error,
    createProfile: createMutation.mutate,
    updateProfile: updateMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending
  };
}

export async function addUserProfile(user_name: string) {
  const db = getDatabase();
  try {
    db.createProfile({
      id: uuidv4(),
      username: user_name
    });
  } catch (error) {
    throw new Error('Failed to add user profile');
  }
} 