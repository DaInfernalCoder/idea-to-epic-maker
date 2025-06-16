
import { useState, useEffect, createContext, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  signInAsGuest: () => void;
  isGuest: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    // Check for guest mode first
    const guestMode = localStorage.getItem('promptflow_guest_mode');
    if (guestMode === 'true') {
      // Create a mock user for guest mode with limitations
      const mockUser = {
        id: 'guest-user',
        email: 'guest@localhost',
        aud: 'authenticated',
        role: 'authenticated',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        app_metadata: {},
        user_metadata: { is_guest: true },
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
      setIsGuest(true);
      setLoading(false);

      // Set session expiration for guest mode (24 hours)
      const guestExpiry = localStorage.getItem('promptflow_guest_expiry');
      if (!guestExpiry) {
        const expiry = Date.now() + (24 * 60 * 60 * 1000); // 24 hours
        localStorage.setItem('promptflow_guest_expiry', expiry.toString());
      } else if (Date.now() > parseInt(guestExpiry)) {
        // Guest session expired, clear it
        localStorage.removeItem('promptflow_guest_mode');
        localStorage.removeItem('promptflow_guest_expiry');
        setUser(null);
        setSession(null);
        setIsGuest(false);
      }
      return;
    }

    // Set up auth state listener for real authentication
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsGuest(false);
        setLoading(false);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsGuest(false);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    // Clear guest mode
    localStorage.removeItem('promptflow_guest_mode');
    localStorage.removeItem('promptflow_guest_expiry');
    
    // Sign out from Supabase if not in guest mode
    if (user?.id !== 'guest-user') {
      await supabase.auth.signOut();
    } else {
      // Manual cleanup for guest mode
      setUser(null);
      setSession(null);
      setIsGuest(false);
    }
  };

  const signInAsGuest = () => {
    localStorage.setItem('promptflow_guest_mode', 'true');
    const expiry = Date.now() + (24 * 60 * 60 * 1000); // 24 hours
    localStorage.setItem('promptflow_guest_expiry', expiry.toString());
    
    const mockUser = {
      id: 'guest-user',
      email: 'guest@localhost',
      aud: 'authenticated',
      role: 'authenticated',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      app_metadata: {},
      user_metadata: { is_guest: true },
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
    setIsGuest(true);
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut, signInAsGuest, isGuest }}>
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
