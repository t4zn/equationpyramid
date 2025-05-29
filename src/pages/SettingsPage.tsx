import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { BackButton } from '@/components/BackButton';
import { supabase } from '@/integrations/supabase/client';
import { Camera, User, ChevronRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Manually adding a subset of country data for demonstration
const countries = [
  { "name": "Afghanistan", "flag": "🇦🇫" },
  { "name": "Albania", "flag": "🇦🇱" },
  { "name": "Algeria", "flag": "🇩🇿" },
  { "name": "Andorra", "flag": "🇦🇩" },
  { "name": "Angola", "flag": "🇦🇴" },
  { "name": "Antigua and Barbuda", "flag": "🇦🇬" },
  { "name": "Argentina", "flag": "🇦🇷" },
  { "name": "Armenia", "flag": "🇦🇲" },
  { "name": "Australia", "flag": "🇦🇺" },
  { "name": "Austria", "flag": "🇦🇹" },
  { "name": "Azerbaijan", "flag": "🇦🇿" },
  { "name": "Bahamas", "flag": "🇧🇸" },
  { "name": "Bahrain", "flag": "🇧🇭" },
  { "name": "Bangladesh", "flag": "🇧🇩" },
  { "name": "Barbados", "flag": "🇧🇧" },
  { "name": "Belarus", "flag": "🇧🇾" },
  { "name": "Belgium", "flag": "🇧🇪" },
  { "name": "Belize", "flag": "🇧🇿" },
  { "name": "Benin", "flag": "🇧🇯" },
  { "name": "Bhutan", "flag": "🇧🇹" },
  { "name": "Bolivia", "flag": "🇧🇴" },
  { "name": "Bosnia and Herzegovina", "flag": "🇧🇦" },
  { "name": "Botswana", "flag": "🇧🇼" },
  { "name": "Brazil", "flag": "🇧🇷" },
  { "name": "Brunei", "flag": "🇧🇳" },
  { "name": "Bulgaria", "flag": "🇧🇬" },
  { "name": "Burkina Faso", "flag": "🇧🇫" },
  { "name": "Burundi", "flag": "🇧🇮" },
  { "name": "Cabo Verde", "flag": "🇨🇻" },
  { "name": "Cambodia", "flag": "🇰🇭" },
  { "name": "Cameroon", "flag": "🇨🇲" },
  { "name": "Canada", "flag": "🇨🇦" },
  { "name": "Central African Republic", "flag": "🇨🇫" },
  { "name": "Chad", "flag": "🇹🇩" },
  { "name": "Chile", "flag": "🇨🇱" },
  { "name": "China", "flag": "🇨🇳" },
  { "name": "Colombia", "flag": "🇨🇴" },
  { "name": "Comoros", "flag": "🇰🇲" },
  { "name": "Congo", "flag": "🇨🇬" },
  { "name": "Costa Rica", "flag": "🇨🇷" },
  { "name": "Croatia", "flag": "🇭🇷" },
  { "name": "Cuba", "flag": "🇨🇺" },
  { "name": "Cyprus", "flag": "🇨🇾" },
  { "name": "Czech Republic", "flag": "🇨🇿" },
  { "name": "Denmark", "flag": "🇩🇰" },
  { "name": "Djibouti", "flag": "🇩🇯" },
  { "name": "Dominica", "flag": "🇩🇲" },
  { "name": "Dominican Republic", "flag": "🇩🇴" },
  { "name": "Ecuador", "flag": "🇪🇨" },
  { "name": "Egypt", "flag": "🇪🇬" },
  { "name": "El Salvador", "flag": "🇸🇻" },
  { "name": "Equatorial Guinea", "flag": "🇬🇶" },
  { "name": "Eritrea", "flag": "🇪🇷" },
  { "name": "Estonia", "flag": "🇪🇪" },
  { "name": "Eswatini", "flag": "🇸🇿" },
  { "name": "Ethiopia", "flag": "🇪🇹" },
  { "name": "Fiji", "flag": "🇫🇯" },
  { "name": "Finland", "flag": "🇫🇮" },
  { "name": "France", "flag": "🇫🇷" },
  { "name": "Gabon", "flag": "🇬🇦" },
  { "name": "Gambia", "flag": "🇬🇲" },
  { "name": "Georgia", "flag": "🇬🇪" },
  { "name": "Germany", "flag": "🇩🇪" },
  { "name": "Ghana", "flag": "🇬🇭" },
  { "name": "Greece", "flag": "🇬🇷" },
  { "name": "Grenada", "flag": "🇬🇩" },
  { "name": "Guatemala", "flag": "🇬🇹" },
  { "name": "Guinea", "flag": "🇬🇳" },
  { "name": "Guinea-Bissau", "flag": "🇬🇼" },
  { "name": "Guyana", "flag": "🇬🇾" },
  { "name": "Haiti", "flag": "🇭🇹" },
  { "name": "Honduras", "flag": "🇭🇳" },
  { "name": "Hungary", "flag": "🇭🇺" },
  { "name": "Iceland", "flag": "🇮🇸" },
  { "name": "India", "flag": "🇮🇳" },
  { "name": "Indonesia", "flag": "🇮🇩" },
  { "name": "Iran", "flag": "🇮🇷" },
  { "name": "Iraq", "flag": "🇮🇶" },
  { "name": "Ireland", "flag": "🇮🇪" },
  { "name": "Israel", "flag": "🇮🇱" },
  { "name": "Italy", "flag": "🇮🇹" },
  { "name": "Jamaica", "flag": "🇯🇲" },
  { "name": "Japan", "flag": "🇯🇵" },
  { "name": "Jordan", "flag": "🇯🇴" },
  { "name": "Kazakhstan", "flag": "🇰🇿" },
  { "name": "Kenya", "flag": "🇰🇪" },
  { "name": "Kiribati", "flag": "🇰🇮" },
  { "name": "Kuwait", "flag": "🇰🇼" },
  { "name": "Kyrgyzstan", "flag": "🇰🇬" },
  { "name": "Laos", "flag": "🇱🇦" },
  { "name": "Latvia", "flag": "🇱🇻" },
  { "name": "Lebanon", "flag": "🇱🇧" },
  { "name": "Lesotho", "flag": "🇱🇸" },
  { "name": "Liberia", "flag": "🇱🇷" },
  { "name": "Libya", "flag": "🇱🇾" },
  { "name": "Liechtenstein", "flag": "🇱🇮" },
  { "name": "Lithuania", "flag": "🇱🇹" },
  { "name": "Luxembourg", "flag": "🇱🇺" },
  { "name": "Madagascar", "flag": "🇲🇬" },
  { "name": "Malawi", "flag": "🇲🇼" },
  { "name": "Malaysia", "flag": "🇲🇾" },
  { "name": "Maldives", "flag": "🇲🇻" },
  { "name": "Mali", "flag": "🇲🇱" },
  { "name": "Malta", "flag": "🇲🇹" },
  { "name": "Marshall Islands", "flag": "🇲🇭" },
  { "name": "Mauritania", "flag": "🇲🇷" },
  { "name": "Mauritius", "flag": "🇲🇺" },
  { "name": "Mexico", "flag": "🇲🇽" },
  { "name": "Micronesia", "flag": "🇫🇲" },
  { "name": "Moldova", "flag": "🇲🇩" },
  { "name": "Monaco", "flag": "🇲🇨" },
  { "name": "Mongolia", "flag": "🇲🇳" },
  { "name": "Montenegro", "flag": "🇲🇪" },
  { "name": "Morocco", "flag": "🇲🇦" },
  { "name": "Mozambique", "flag": "🇲🇿" },
  { "name": "Myanmar", "flag": "🇲🇲" },
  { "name": "Namibia", "flag": "🇳🇦" },
  { "name": "Nauru", "flag": "🇳🇷" },
  { "name": "Nepal", "flag": "🇳🇵" },
  { "name": "Netherlands", "flag": "🇳🇱" },
  { "name": "New Zealand", "flag": "🇳🇿" },
  { "name": "Nicaragua", "flag": "🇳🇮" },
  { "name": "Niger", "flag": "🇳🇪" },
  { "name": "Nigeria", "flag": "🇳🇬" },
  { "name": "North Korea", "flag": "🇰🇵" },
  { "name": "North Macedonia", "flag": "🇲🇰" },
  { "name": "Norway", "flag": "🇳🇴" },
  { "name": "Oman", "flag": "🇴🇲" },
  { "name": "Pakistan", "flag": "🇵🇰" },
  { "name": "Palau", "flag": "🇵🇼" },
  { "name": "Palestine", "flag": "🇵🇸" },
  { "name": "Panama", "flag": "🇵🇦" },
  { "name": "Papua New Guinea", "flag": "🇵🇬" },
  { "name": "Paraguay", "flag": "🇵🇾" },
  { "name": "Peru", "flag": "🇵🇪" },
  { "name": "Philippines", "flag": "🇵🇭" },
  { "name": "Poland", "flag": "🇵🇱" },
  { "name": "Portugal", "flag": "🇵🇹" },
  { "name": "Qatar", "flag": "🇶🇦" },
  { "name": "Romania", "flag": "🇷🇴" },
  { "name": "Russia", "flag": "🇷🇺" },
  { "name": "Rwanda", "flag": "🇷🇼" },
  { "name": "Saint Kitts and Nevis", "flag": "🇰🇳" },
  { "name": "Saint Lucia", "flag": "🇱🇨" },
  { "name": "Saint Vincent and the Grenadines", "flag": "🇻🇨" },
  { "name": "Samoa", "flag": "🇼🇸" },
  { "name": "San Marino", "flag": "🇸🇲" },
  { "name": "Sao Tome and Principe", "flag": "🇸🇹" },
  { "name": "Saudi Arabia", "flag": "🇸🇦" },
  { "name": "Senegal", "flag": "🇸🇳" },
  { "name": "Serbia", "flag": "🇷🇸" },
  { "name": "Seychelles", "flag": "🇸🇨" },
  { "name": "Sierra Leone", "flag": "🇸🇱" },
  { "name": "Singapore", "flag": "🇸🇬" },
  { "name": "Slovakia", "flag": "🇸🇰" },
  { "name": "Slovenia", "flag": "🇸🇮" },
  { "name": "Solomon Islands", "flag": "🇸🇧" },
  { "name": "Somalia", "flag": "🇸🇴" },
  { "name": "South Africa", "flag": "🇿🇦" },
  { "name": "South Korea", "flag": "🇰🇷" },
  { "name": "South Sudan", "flag": "🇸🇸" },
  { "name": "Spain", "flag": "🇪🇸" },
  { "name": "Sri Lanka", "flag": "🇱🇰" },
  { "name": "Sudan", "flag": "🇸🇩" },
  { "name": "Suriname", "flag": "🇸🇷" },
  { "name": "Sweden", "flag": "🇸🇪" },
  { "name": "Switzerland", "flag": "🇨🇭" },
  { "name": "Syria", "flag": "🇸🇾" },
  { "name": "Taiwan", "flag": "🇹🇼" },
  { "name": "Tajikistan", "flag": "🇹🇯" },
  { "name": "Tanzania", "flag": "🇹🇿" },
  { "name": "Thailand", "flag": "🇹🇭" },
  { "name": "Timor-Leste", "flag": "🇹🇱" },
  { "name": "Togo", "flag": "🇹🇬" },
  { "name": "Tonga", "flag": "🇹🇴" },
  { "name": "Trinidad and Tobago", "flag": "🇹🇹" },
  { "name": "Tunisia", "flag": "🇹🇳" },
  { "name": "Turkey", "flag": "🇹🇷" },
  { "name": "Turkmenistan", "flag": "🇹🇲" },
  { "name": "Tuvalu", "flag": "🇹🇻" },
  { "name": "Uganda", "flag": "🇺🇬" },
  { "name": "Ukraine", "flag": "🇺🇦" },
  { "name": "United Arab Emirates", "flag": "🇦🇪" },
  { "name": "United Kingdom", "flag": "🇬🇧" },
  { "name": "United States", "flag": "🇺🇸" },
  { "name": "Uruguay", "flag": "🇺🇾" },
  { "name": "Uzbekistan", "flag": "🇺🇿" },
  { "name": "Vanuatu", "flag": "🇻🇺" },
  { "name": "Vatican City", "flag": "🇻🇦" },
  { "name": "Venezuela", "flag": "🇻🇪" },
  { "name": "Vietnam", "flag": "🇻🇳" },
  { "name": "Yemen", "flag": "🇾🇪" },
  { "name": "Zambia", "flag": "🇿🇲" },
  { "name": "Zimbabwe", "flag": "🇿🇼" }
].sort((a, b) => a.name.localeCompare(b.name));

const SettingsPage = () => {
  const navigate = useNavigate();
  const { authState, signOut } = useAuth();
  const { toast } = useToast();
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [username, setUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [savedCountry, setSavedCountry] = useState<{ name: string; flag: string } | null>(null);

  useEffect(() => {
    if (authState.user) {
      // Fetch user profile data
      const fetchProfile = async () => {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('username, avatar_url, country')
          .eq('id', authState.user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
          // Handle error appropriately, maybe set default state or show a message
          return;
        }

        if (profile) {
          setUsername(profile.username || '');
          setAvatarUrl(profile.avatar_url);
          // Find the country object from the full list based on saved country name
          const countryData = countries.find(c => c.name === profile.country);
          if (countryData) {
            setSelectedCountry(countryData);
            setSavedCountry(countryData);
          }
        }
      };

      fetchProfile();
    } else {
      // Clear state if user logs out while on settings page
      setUsername('');
      setAvatarUrl(null);
      setSelectedCountry(countries[0]);
      setSavedCountry(null);
    }
  }, [authState.user]); // Depend on authState.user to refetch when user changes

  const handleCountrySelect = async (country: { name: string; flag: string }) => {
    setSelectedCountry(country);
    setShowCountryPicker(false);
    setSearchQuery(''); // Clear search query on selection

    if (authState.user && savedCountry?.name !== country.name) {
      // Save selected country to profile
      const { error } = await supabase
        .from('profiles')
        .update({ country: country.name })
        .eq('id', authState.user.id);

      if (error) {
        console.error('Error updating country:', error);
        toast({
          title: "Error",
          description: "Failed to update country",
          variant: "destructive"
        });
      } else {
        setSavedCountry(country);
        toast({
          title: "Success",
          description: "Country updated successfully"
        });
      }
    }
  };

  // Debounce timer for username updates
  const [usernameUpdateTimer, setUsernameUpdateTimer] = useState<NodeJS.Timeout | null>(null);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUsername = e.target.value;
    setUsername(newUsername);

    // Clear previous timer to debounce
    if (usernameUpdateTimer) {
      clearTimeout(usernameUpdateTimer);
    }

    // Set a new timer to update username after 1 second of no typing
    const newTimer = setTimeout(async () => {
      if (authState.user) {
        const { error } = await supabase
          .from('profiles')
          .update({ username: newUsername })
          .eq('id', authState.user.id);

        if (error) {
          console.error('Error updating username:', error);
          toast({
            title: "Error",
            description: "Failed to update username",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Success",
            description: "Username updated successfully"
          });
        }
      }
    }, 1000); // 1 second debounce delay

    setUsernameUpdateTimer(newTimer);
  };

   // Clear debounce timer on component unmount
  useEffect(() => {
    return () => {
      if (usernameUpdateTimer) {
        clearTimeout(usernameUpdateTimer);
      }
    };
  }, [usernameUpdateTimer]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !authState.user) return;

    try {
      setIsUploading(true);

      // Upload image to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${authState.user.id}/${Math.random()}.${fileExt}`;
      const { data, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', authState.user.id);

      if (updateError) throw updateError;

      setAvatarUrl(publicUrl);
      toast({
        title: "Success",
        description: "Profile picture updated successfully"
      });
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update profile picture",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    toast({
      title: "Signed Out",
      description: "You have been successfully logged out.",
    });
    navigate('/login');
  };

  // TODO: Implement actual functionality for these.
  const handleTermsClick = () => {
    console.log('Terms and Conditions clicked');
    // Ideally, navigate to a /terms page or open a modal with the terms.
    // Example: navigate('/terms');
     toast({
        title: "Terms and Conditions",
        description: "Placeholder: Link to Terms and Conditions will go here.",
      });
  };

  const handleChangePasswordClick = () => {
    console.log('Change Password clicked');
    // This should likely open a modal or navigate to a form to enter
    // the current password and new password, then call Supabase Auth update.
    // Example: supabase.auth.updateUser({ password: newPassword });
     toast({
        title: "Change Password",
        description: "Placeholder: Functionality to change password will be implemented here.",
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#232323] to-[#111] flex flex-col items-center justify-start p-4 relative">
      <BackButton onClick={() => navigate('/home')} />
      
      <div className="w-full max-w-md mt-16">
        <Card className="bg-[#333] border-2 border-[#444] shadow-2xl">
          <CardHeader className="bg-[#222] text-white p-3">
            <CardTitle className="text-xl sm:text-2xl font-bold text-center">
              Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            {/* Profile Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Avatar className="w-20 h-20 border-2 border-[#444]">
                    <AvatarImage src={avatarUrl || undefined} />
                    <AvatarFallback className="bg-[#444] text-white">
                      {username?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <label 
                    htmlFor="avatar-upload" 
                    className="absolute bottom-0 right-0 bg-[#444] p-1.5 rounded-full cursor-pointer hover:bg-[#555] transition-colors"
                  >
                    <Camera className="w-4 h-4 text-white" />
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarUpload}
                      disabled={isUploading}
                    />
                  </label>
                </div>
                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder="Enter your name"
                    value={username}
                    onChange={handleUsernameChange}
                    className="bg-[#444] border-[#555] text-white placeholder:text-gray-400"
                  />
                </div>
              </div>
            </div>

            {/* Country Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Country</label>
              <div 
                onClick={() => setShowCountryPicker(true)}
                className="flex items-center justify-between p-2 bg-[#444] rounded-md cursor-pointer hover:bg-[#555] transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-xl">{selectedCountry.flag}</span>
                  <span className="text-white">{selectedCountry.name}</span>
                </div>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Email</span>
              <span className="text-gray-500 text-sm">
                {authState.user?.email || 'Not available'}
              </span>
            </div>

             {/* Account Settings */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Account</label>
              <div 
                className="flex items-center justify-between p-2 bg-[#444] rounded-md cursor-pointer hover:bg-[#555] transition-colors"
                onClick={handleTermsClick}
              >
                <span className="text-white">Terms and conditions</span>
                 <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
               <div 
                className="flex items-center justify-between p-2 bg-[#444] rounded-md cursor-pointer hover:bg-[#555] transition-colors"
                 onClick={handleChangePasswordClick}
              >
                <span className="text-white">Change password</span>
                 <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
               <div 
                className="flex items-center justify-between p-2 bg-[#444] rounded-md cursor-pointer hover:bg-[#555] transition-colors"
                 onClick={handleLogout}
              >
                <span className="text-red-500">Logout</span>
                 <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            </div>

          </CardContent>
        </Card>
      </div>

      {/* Country Picker Modal */}
      {showCountryPicker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#333] rounded-lg w-full max-w-md max-h-[80vh] flex flex-col">
            <div className="p-4 border-b border-[#444]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Select Country</h3>
                <button
                  onClick={() => setShowCountryPicker(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              <Input
                type="text"
                placeholder="Search countries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#444] border-[#555] text-white placeholder:text-gray-400"
              />
            </div>
            <div className="overflow-y-auto flex-1 p-4">
              <div className="space-y-2">
                {countries
                  .filter(country => 
                    country.name.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((country) => (
                    <div
                      key={country.name}
                      onClick={() => handleCountrySelect(country)}
                      className="flex items-center space-x-2 p-2 rounded-md cursor-pointer hover:bg-[#444] transition-colors"
                    >
                      <span className="text-xl">{country.flag}</span>
                      <span className="text-white">{country.name}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
