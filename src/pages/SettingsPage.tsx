import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { BackButton } from '@/components/BackButton';
// import { supabase } from '@/integrations/supabase/client'; // Commenting out Supabase imports
import { Camera, User } from 'lucide-react';
// import { useToast } from '@/hooks/use-toast'; // Commenting out useToast

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
  const { authState } = useAuth();
  // const navigate = useNavigate(); // Commenting out useNavigate as navigation is not needed for UI only
  // const { toast = () => {} } = useToast(); // Commenting out useToast and providing a default empty function
  const [username, setUsername] = useState(authState.user?.username || '');
  const [avatarUrl, setAvatarUrl] = useState(authState.user?.avatar_url || '');
  // const [updating, setUpdating] = useState(false); // Commenting out state related to functionality
  // const [uploading, setUploading] = useState(false); // Commenting out state related to functionality
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState({ name: 'Kuwait', flag: '🇰🇼' }); // Initial country
  const [searchQuery, setSearchQuery] = useState('');

  // React.useEffect(() => { // Commenting out effect hook
  //   if (!authState.user && !authState.loading) {
  //     navigate('/login');
  //   }
  // }, [authState.user, authState.loading, navigate]);

  // Commenting out functionality handlers
  // const handleUpdateProfile = async () => { /* ... */ };
  // const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => { /* ... */ };

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setShowCountryPicker(false);
    setSearchQuery('');
  };

  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* <BackButton onClick={() => navigate('/home')} /> Commenting out BackButton */}

      {/* Settings Header */}
      <div className="w-full bg-gray-800 p-4 text-center">
        <h1 className="text-2xl font-bold text-white">Settings</h1>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-grow overflow-y-auto p-4">
        <Card className="w-full max-w-md mx-auto bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-white">
              Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Photo */}
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Photo</span>
              <div className="relative">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={avatarUrl} alt="Profile" />
                  <AvatarFallback className="bg-gray-600 text-white">
                    <User size={24} />
                  </AvatarFallback>
                </Avatar>
                {/* Placeholder for camera icon/upload button */}
                {/* Commenting out the label and input for file upload */}
                {/* <label className="absolute bottom-0 right-0 bg-yellow-500 hover:bg-yellow-600 text-gray-900 rounded-full p-1 cursor-pointer transition-colors">
                   <Camera size={12} />
                   <input
                     type="file"
                     accept="image/*"
                     onChange={handleAvatarUpload}
                     disabled={uploading}
                     className="hidden"
                   />
                </label> */}
                 <div className="absolute bottom-0 right-0 bg-gray-600 hover:bg-gray-500 text-white rounded-full p-1 cursor-pointer transition-colors">
                   <Camera size={12} />
                </div>
              </div>
            </div>

            {/* Name */}
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Name</span>
              <Input
                value={username}
                readOnly // Make readOnly as functionality is removed
                className="bg-gray-700 text-gray-300 border-gray-600 w-1/2"
                placeholder="Ahmad"
              />
            </div>

            {/* Country */}
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Country</span>
              <div 
                className="flex items-center space-x-2 bg-gray-700 text-gray-300 border border-gray-600 rounded-md px-3 py-2 w-1/2 cursor-pointer hover:bg-gray-600 transition-colors"
                onClick={() => setShowCountryPicker(true)}
              >
                <span>{selectedCountry.flag}</span>
                <span>{selectedCountry.name}</span>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Email</span>
              <span className="text-gray-500 text-sm">
                {authState.user?.email || 'kaptantaizun21@gmail.com'} {/* Use placeholder if email is null */}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Appearance Section */}
        <Card className="w-full max-w-md mx-auto mt-6 bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-white">
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {/* Mode */}
            <div className="flex items-center justify-between py-2 border-b border-gray-700">
              <span className="text-gray-300">Mode</span>
              <span className="text-gray-500 flex items-center">
                Dark <span className="ml-1">{'>'}</span>
              </span>
            </div>
            {/* Language */}
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-300">Language</span>
              <span className="text-gray-500 flex items-center">
                English <span className="ml-1">{'>'}</span>
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Account Section */}
        <Card className="w-full max-w-md mx-auto mt-6 bg-gray-800 border-gray-700 mb-20">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-white">
              Account
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {/* Terms and conditions */}
            <div className="flex items-center justify-between py-2 border-b border-gray-700">
              <span className="text-gray-300">Terms and conditions</span>
              <span className="text-gray-500">{'>'}</span>
            </div>
            {/* Change password */}
            <div className="flex items-center justify-between py-2 border-b border-gray-700">
              <span className="text-gray-300">Change password</span>
              <span className="text-gray-500">{'>'}</span>
            </div>
            {/* Remove email */}
            <div className="flex items-center justify-between py-2 border-b border-gray-700">
              <span className="text-gray-300">Remove email</span>
              <span className="text-gray-500">{'>'}</span>
            </div>
            {/* Delete user */}
            <div className="flex items-center justify-between py-2 border-b border-gray-700">
              <span className="text-gray-300">Delete user</span>
              <span className="text-gray-500">{'>'}</span>
            </div>
            {/* Logout */}
            <div className="flex items-center justify-between py-2">
              <span className="text-red-500">Logout</span>
              <span className="text-gray-500">{'>'}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-800 h-16 flex justify-around items-center">
        {/* Home Icon Placeholder */}
        <div className="flex flex-col items-center text-gray-400">
          {/* Replace with actual icon */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m0 0l7 7m-7-7v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="text-xs">Home</span>
        </div>
        {/* Friends Icon Placeholder */}
        <div className="flex flex-col items-center text-gray-400">
          {/* Replace with actual icon */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126.1283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zm-4 4a2 2 0 10-4 0 2 2 0 004 0z" />
          </svg>
          <span className="text-xs">Friends</span>
        </div>
        {/* Leaderboard Icon (Trophy) */}
        <div className="flex flex-col items-center text-gray-400">
          {/* Trophy Icon SVG */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 15.5a3.5 3.5 0 10-3.5 3.5v.5h5v-.5a3.5 3.5 0 10-1.5-3zM16 11V8a4 4 0 00-8 0v3m-4 3h16l-1.5 3H5.5L4 14z" />
          </svg>
          <span className="text-xs">Leaderboard</span>
        </div>
        {/* Settings Icon (Selected) */}
        <div className="flex flex-col items-center text-yellow-500">
          {/* Settings Icon SVG */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-xs">Settings</span>
        </div>
      </div>

      {/* Country Picker Modal */}
      {showCountryPicker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-4 rounded-lg h-3/4 w-3/4 max-w-sm flex flex-col">
            <h2 className="text-xl font-bold text-white mb-4">Select Country</h2>
            <div className="mb-4">
              <Input
                type="text"
                placeholder="Search country..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-gray-700 text-gray-300 border-gray-600 w-full"
              />
            </div>
            <div className="flex-grow overflow-y-auto space-y-2">
              {filteredCountries.map((country) => (
                <div
                  key={country.name}
                  className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-700 cursor-pointer"
                  onClick={() => handleCountrySelect(country)}
                >
                  <span>{country.flag}</span>
                  <span className="text-gray-300">{country.name}</span>
                </div>
              ))}
            </div>
            <button
              className="mt-4 bg-gray-700 text-white p-2 rounded-md hover:bg-gray-600 transition-colors"
              onClick={() => {
                setShowCountryPicker(false);
                setSearchQuery('');
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
