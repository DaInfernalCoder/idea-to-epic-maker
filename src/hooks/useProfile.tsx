
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

interface UserProfile {
  id: string;
  how_heard_about_us: string | null;
  preferred_contact_method: 'phone' | 'twitter' | 'email' | null;
  created_at: string;
  updated_at: string;
}

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      setProfile(null);
      setLoading(false);
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        return;
      }

      if (data) {
        // Cast the preferred_contact_method to the correct type
        const profileData: UserProfile = {
          ...data,
          preferred_contact_method: data.preferred_contact_method as 'phone' | 'twitter' | 'email' | null
        };
        setProfile(profileData);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Pick<UserProfile, 'how_heard_about_us' | 'preferred_contact_method'>>) => {
    if (!user) return false;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          ...updates,
        })
        .select()
        .single();

      if (error) {
        console.error('Error updating profile:', error);
        return false;
      }

      if (data) {
        // Cast the preferred_contact_method to the correct type
        const profileData: UserProfile = {
          ...data,
          preferred_contact_method: data.preferred_contact_method as 'phone' | 'twitter' | 'email' | null
        };
        setProfile(profileData);
      }
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      return false;
    }
  };

  return {
    profile,
    loading,
    updateProfile,
    refetch: fetchProfile,
  };
}
