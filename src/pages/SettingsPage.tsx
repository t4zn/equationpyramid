
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const SettingsPage = () => {
  const { authState } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState(authState.user?.username || '');
  const [updating, setUpdating] = useState(false);

  React.useEffect(() => {
    // Redirect if not logged in
    if (!authState.user && !authState.loading) {
      navigate('/login');
    }
  }, [authState.user, authState.loading, navigate]);

  const handleUpdateUsername = async () => {
    if (!authState.user) return;
    
    try {
      setUpdating(true);
      
      // Update username in profiles table
      const { error } = await supabase
        .from('profiles')
        .update({ 
          username,
          updated_at: new Date().toISOString()
        })
        .eq('id', authState.user.id);
        
      if (error) {
        throw error;
      }
      
      toast({
        title: "Username updated",
        description: "Your username has been successfully updated",
      });
      
    } catch (error: any) {
      console.error('Error updating username:', error);
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat flex flex-col items-center p-4 pt-8"
      style={{
        backgroundImage: "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><rect width=\"100\" height=\"100\" fill=\"%23333\"/><circle cx=\"20\" cy=\"20\" r=\"1\" fill=\"%23444\"/><circle cx=\"80\" cy=\"40\" r=\"1\" fill=\"%23444\"/><circle cx=\"40\" cy=\"80\" r=\"1\" fill=\"%23444\"/></svg>')"
      }}
    >
      <Card className="w-full max-w-md bg-gray-800 border-yellow-500">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-yellow-400">
            Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200 block">
              Username
            </label>
            <div className="flex space-x-2">
              <Input 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-gray-700 text-white border-gray-600"
              />
              <Button 
                onClick={handleUpdateUsername}
                disabled={updating || !username || username === authState.user?.username}
                className="bg-yellow-500 hover:bg-yellow-600 text-gray-900"
              >
                {updating ? 'Updating...' : 'Update'}
              </Button>
            </div>
          </div>
          
          {/* Additional settings could be added here */}
          
          <div className="pt-4 flex justify-center">
            <Button 
              onClick={() => navigate('/home')} 
              className="bg-yellow-500 hover:bg-yellow-600 text-gray-900"
            >
              Back to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
