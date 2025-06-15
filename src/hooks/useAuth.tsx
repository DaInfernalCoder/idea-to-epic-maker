
import { useState, useEffect, createContext, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  signInAsGuest: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for guest mode first
    const guestMode = localStorage.getItem('promptflow_guest_mode');
    if (guestMode === 'true') {
      // Create a mock user for guest mode
      const mockUser = {
        id: 'guest-user',
        email: 'guest@localhost',
        aud: 'authenticated',
        role: 'authenticated',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        app_metadata: {},
        user_metadata: {},
        identities: [],
        factors: []
      } as User;
      
      setUser(mockUser);
      setSession({ 
        access_token: 'guest-token',
        refresh_token: 'guest-refresh',
        expires_in: 3600,
        expires_at: Date.now() / 1000 + 3600,
        token_type: 'bearer',
        user: mockUser
      } as Session);
      setLoading(false);
      return;
    }

    // Set up auth state listener for real authentication
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    // Clear guest mode
    localStorage.removeItem('promptflow_guest_mode');
    
    // Sign out from Supabase if not in guest mode
    if (user?.id !== 'guest-user') {
      await supabase.auth.signOut();
    } else {
      // Manual cleanup for guest mode
      setUser(null);
      setSession(null);
    }
  };

  const signInAsGuest = () => {
    localStorage.setItem('promptflow_guest_mode', 'true');
    
    const mockUser = {
      id: 'guest-user',
      email: 'guest@localhost',
      aud: 'authenticated',
      role: 'authenticated',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      app_metadata: {},
      user_metadata: {},
      identities: [],
      factors: []
    } as User;
    
    setUser(mockUser);
    setSession({ 
      access_token: 'guest-token',
      refresh_token: 'guest-refresh',
      expires_in: 3600,
      expires_at: Date.now() / 1000 + 3600,
      token_type: 'bearer',
      user: mockUser
    } as Session);
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut, signInAsGuest }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
