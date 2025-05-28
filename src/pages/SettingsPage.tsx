
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { BackButton } from '@/components/BackButton';
import { supabase } from '@/integrations/supabase/client';
import { Camera, User } from 'lucide-react';

const SettingsPage = () => {
  const { authState } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState(authState.user?.username || '');
  const [avatarUrl, setAvatarUrl] = useState(authState.user?.avatar_url || '');
  const [updating, setUpdating] = useState(false);
  const [uploading, setUploading] = useState(false);

  React.useEffect(() => {
    if (!authState.user && !authState.loading) {
      navigate('/login');
    }
  }, [authState.user, authState.loading, navigate]);

  const handleUpdateProfile = async () => {
    if (!authState.user) return;
    
    try {
      setUpdating(true);
      
      const { error } = await supabase
        .from('profiles')
        .update({ 
          username,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', authState.user.id);
        
      if (error) {
        throw error;
      }
      
    } catch (error: any) {
      console.error('Error updating profile:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${authState.user?.id}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      setAvatarUrl(data.publicUrl);
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center p-4 pt-20 relative">
      <BackButton onClick={() => navigate('/home')} />
      
      <Card className="w-full max-w-md bg-gray-800 border-yellow-500">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-yellow-400">
            Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Avatar className="w-20 h-20">
                <AvatarImage src={avatarUrl} alt="Profile" />
                <AvatarFallback className="bg-gray-600 text-white">
                  <User size={32} />
                </AvatarFallback>
              </Avatar>
              <label className="absolute bottom-0 right-0 bg-yellow-500 hover:bg-yellow-600 text-gray-900 rounded-full p-1 cursor-pointer">
                <Camera size={16} />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>
            {uploading && <p className="text-sm text-gray-400">Uploading...</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200 block">
              Username
            </label>
            <div className="flex space-x-2">
              <Input 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-gray-700 text-white border-gray-600"
                placeholder="Enter username"
              />
              <Button 
                onClick={handleUpdateProfile}
                disabled={updating || !username}
                className="bg-yellow-500 hover:bg-yellow-600 text-gray-900"
              >
                {updating ? 'Updating...' : 'Save'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
