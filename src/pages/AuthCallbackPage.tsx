import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const AuthCallbackPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }

        if (session) {
          // Check if user already exists in profiles table
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profileError && profileError.code !== 'PGRST116') {
            throw profileError;
          }

          if (!profile) {
            // Create new profile for Google user
            const { error: insertError } = await supabase
              .from('profiles')
              .insert([
                {
                  id: session.user.id,
                  username: session.user.email?.split('@')[0] || null,
                  avatar_url: session.user.user_metadata?.avatar_url || null,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString()
                }
              ]);

            if (insertError) {
              throw insertError;
            }
          }

          toast({
            title: "Welcome!",
            description: "You've successfully signed in with Google",
          });

          navigate('/home');
        }
      } catch (error: any) {
        console.error('Error handling auth callback:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to complete authentication",
          variant: "destructive"
        });
        navigate('/login');
      }
    };

    handleAuthCallback();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#232323] to-[#111]">
      <div className="text-white text-center">
        <h1 className="text-2xl font-bold mb-4">Completing sign in...</h1>
        <p className="text-gray-400">Please wait while we set up your account.</p>
      </div>
    </div>
  );
};

export default AuthCallbackPage; 