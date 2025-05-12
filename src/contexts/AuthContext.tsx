
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase, getCurrentUser, isUserAdmin } from '@/lib/supabase';
import { AuthState, UserProfile } from '@/types/auth';
import { toast } from 'sonner';

interface AuthContextProps {
  authState: AuthState;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextProps>({
  authState: { user: null, isAdmin: false, isLoading: true },
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null }),
  signOut: async () => {},
  updateProfile: async () => ({ error: null }),
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAdmin: false,
    isLoading: true,
  });

  // Fetch user profile data from profiles table
  const fetchUserProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }

    return data as UserProfile;
  };

  // Load user on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const { user } = await getCurrentUser();
        if (!user) {
          setAuthState({ user: null, isAdmin: false, isLoading: false });
          return;
        }

        // Get user profile with role information
        const profile = await fetchUserProfile(user.id);
        const admin = await isUserAdmin();

        setAuthState({
          user: profile,
          isAdmin: admin,
          isLoading: false,
        });
      } catch (error) {
        console.error('Error loading user:', error);
        setAuthState({ user: null, isAdmin: false, isLoading: false });
      }
    };

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const profile = await fetchUserProfile(session.user.id);
          const admin = await isUserAdmin();
          
          setAuthState({
            user: profile,
            isAdmin: admin,
            isLoading: false,
          });
        } else if (event === 'SIGNED_OUT') {
          setAuthState({ user: null, isAdmin: false, isLoading: false });
        }
      }
    );

    loadUser();

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        toast.error('Login failed: ' + error.message);
        return { error };
      }
      
      toast.success('Successfully logged in');
      return { error: null };
    } catch (error) {
      toast.error('Login failed');
      return { error: error as Error };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            role: 'user' // Default role for new users
          }
        }
      });
      
      if (error) {
        toast.error('Registration failed: ' + error.message);
        return { error };
      }
      
      toast.success('Registration successful! Please check your email for verification.');
      return { error: null };
    } catch (error) {
      toast.error('Registration failed');
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    toast.success('Logged out successfully');
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    try {
      if (!authState.user) {
        return { error: new Error('No user logged in') };
      }

      const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', authState.user.id);

      if (error) {
        toast.error('Failed to update profile: ' + error.message);
        return { error };
      }

      // Refresh user data
      const profile = await fetchUserProfile(authState.user.id);
      setAuthState(prev => ({ ...prev, user: profile }));
      
      toast.success('Profile updated successfully');
      return { error: null };
    } catch (error) {
      toast.error('Failed to update profile');
      return { error: error as Error };
    }
  };

  return (
    <AuthContext.Provider value={{ authState, signIn, signUp, signOut, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
