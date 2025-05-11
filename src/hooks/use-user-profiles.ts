import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export function useUserProfiles() {
  return useQuery({
    queryKey: ["user_profiles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_profiles")
        .select("user_name")
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data?.map((row) => row.user_name) || [];
    },
  });
}

export async function addUserProfile(user_name: string) {
  const { error } = await supabase
    .from("user_profiles")
    .insert([{ user_name }]);
  if (error) throw error;
} 