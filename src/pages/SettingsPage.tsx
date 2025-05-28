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
import { useToast } from '@/hooks/use-toast';

const SettingsPage = () => {
  const { authState } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
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

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
      
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
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
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Error",
          description: "Please select an image file.",
          variant: "destructive",
        });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "File size must be less than 5MB.",
          variant: "destructive",
        });
        return;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${authState.user?.id}-${Math.random()}.${fileExt}`;

      // First, try to create the avatars bucket if it doesn't exist
      try {
        // Check if bucket exists
        const { data: buckets, error: listError } = await supabase
          .storage
          .listBuckets();

        if (listError) {
          throw new Error('Failed to list buckets');
        }

        const avatarsBucket = buckets?.find(b => b.name === 'avatars');

        if (!avatarsBucket) {
          // Create bucket if it doesn't exist
          const { error: createError } = await supabase
            .storage
            .createBucket('avatars', {
              public: true,
              allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif'],
              fileSizeLimit: 5242880 // 5MB in bytes
            });

          if (createError) {
            throw new Error('Failed to create avatars bucket');
          }

          // Set bucket policy to public
          const { error: policyError } = await supabase
            .storage
            .from('avatars')
            .createSignedUrl('dummy.txt', 1);

          if (policyError) {
            console.warn('Warning: Could not set bucket policy:', policyError);
          }
        }
      } catch (error) {
        console.error('Error checking/creating bucket:', error);
        throw new Error('Failed to access storage');
      }

      // Upload the file
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      if (!urlData?.publicUrl) {
        throw new Error('Failed to get public URL');
      }

      // Update the profile with the new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          avatar_url: urlData.publicUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', authState.user?.id);

      if (updateError) {
        throw new Error('Failed to update profile with new avatar');
      }

      setAvatarUrl(urlData.publicUrl);
      
      toast({
        title: "Avatar uploaded",
        description: "Your avatar has been successfully uploaded and saved.",
      });

    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to upload avatar. Please try again.",
        variant: "destructive",
      });
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
              <label className="absolute bottom-0 right-0 bg-yellow-500 hover:bg-yellow-600 text-gray-900 rounded-full p-1 cursor-pointer transition-colors">
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

          <div className="pt-4">
            <div className="text-sm text-gray-400">
              Email: {authState.user?.email}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
