import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { db, Profile } from '@/lib/supabase';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

export function useUserProfiles() {
  const queryClient = useQueryClient();

  const {
    data: profiles = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['profiles'],
    queryFn: async () => {
      const { data, error } = await db.profiles.getAll();
      if (error) throw error;
      return data;
    }
  });

  const createMutation = useMutation({
    mutationFn: (username: string) => db.profiles.create(username),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
      toast.success('Profile created successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create profile: ${error.message}`);
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Profile> }) =>
      db.profiles.update(id, updates),
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
  const { error } = await supabase
    .from("user_profiles")
    .insert([{ user_name }]);
  if (error) throw error;
} 