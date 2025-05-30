import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BackButton } from '@/components/BackButton';
import { UserPlus, Check, X, MessageSquare } from 'lucide-react'; // Import icons
// import { supabase } from '@/integrations/supabase/client'; // Assuming you will use supabase
// import { useAuth } from '../contexts/AuthContext'; // Assuming you will use auth context

// Define types for clarity (adjust based on your actual backend structure)
interface UserProfile {
  id: string;
  username: string;
  avatar_url?: string;
}

interface FriendRequest {
  id: string;
  sender: UserProfile;
  receiver: UserProfile;
  status: 'pending' | 'accepted' | 'rejected';
}

const FriendsPage = () => {
  const navigate = useNavigate();
  // const { authState } = useAuth(); // Uncomment if using auth context

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
  const [outgoingRequests, setOutgoingRequests] = useState<FriendRequest[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<FriendRequest[]>([]);
  const [friendsList, setFriendsList] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Placeholder useEffect for fetching initial data (requests and friends)
  useEffect(() => {
    // TODO: Implement fetching logic for initial friend requests and friends list
    // Example (using placeholder data):
    setIncomingRequests([
      { id: 'req1', sender: { id: 'user2', username: 'FriendUser' }, receiver: { id: 'user1', username: 'CurrentUser' }, status: 'pending' },
    ]);
    setFriendsList([
      { id: 'user3', username: 'BestFriend' },
    ]);
  }, []); // Add dependencies like authState.user when implementing fetch logic

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    setLoading(true);
    setError(null);
    // TODO: Implement search logic using Supabase or your backend
    // Example (using placeholder data):
    console.log(`Searching for user: ${searchQuery}`);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    setSearchResults([
      { id: 'user4', username: 'FoundUser' },
      { id: 'user5', username: 'AnotherUser' },
    ].filter(user => user.username.toLowerCase().includes(searchQuery.toLowerCase())));
    setLoading(false);
  };

  const sendFriendRequest = async (userId: string) => {
    // TODO: Implement sending friend request logic
    console.log(`Sending friend request to user ID: ${userId}`);
    // After successful request, update outgoingRequests state
  };

  const acceptFriendRequest = async (requestId: string) => {
    // TODO: Implement accepting friend request logic
    console.log(`Accepting friend request ID: ${requestId}`);
    // After successful acceptance, update friendsList and remove from incomingRequests
  };

  const rejectFriendRequest = async (requestId: string) => {
    // TODO: Implement rejecting friend request logic
    console.log(`Rejecting friend request ID: ${requestId}`);
    // After successful rejection, remove from incomingRequests
  };

   const startChat = (friendId: string) => {
    // TODO: Implement chat initiation logic (e.g., navigate to a chat page)
    console.log(`Starting chat with friend ID: ${friendId}`);
    // Example: navigate(`/chat/${friendId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#232323] to-[#111] flex flex-col items-center p-4 relative">
      <BackButton onClick={() => navigate('/home')} />
      
      <Card className="w-full max-w-md bg-[#333] border-2 border-[#444] shadow-2xl mt-16">
        <CardHeader className="bg-[#222] text-white p-6">
          <CardTitle className="text-2xl font-bold text-center">Friends</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          {/* Search Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-300">Find Friends</h3>
            <div className="flex space-x-2">
              <Input
                type="text"
                placeholder="Enter username"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-grow bg-[#444] border-[#555] text-white placeholder:text-gray-400"
              />
              <Button onClick={handleSearch} disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white">
                {loading ? 'Searching...' : 'Search'}
              </Button>
            </div>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

            {searchResults.length > 0 && (
              <div className="space-y-2 mt-4">
                <h4 className="text-md font-semibold text-gray-400">Search Results:</h4>
                {searchResults.map(user => (
                  <div key={user.id} className="flex items-center justify-between bg-[#444] p-3 rounded-md">
                    <span className="text-white">{user.username}</span>
                    {/* TODO: Check if request is already sent or if they are already friends */}
                    <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => sendFriendRequest(user.id)}>
                      <UserPlus className="mr-1" size={16} /> Send Request
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Incoming Requests Section */}
          {incomingRequests.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-300">Incoming Requests</h3>
               <div className="space-y-2">
                {incomingRequests.map(request => (
                  <div key={request.id} className="flex items-center justify-between bg-[#444] p-3 rounded-md">
                    <span className="text-white">{request.sender.username}</span>
                    <div className="flex space-x-2">
                       <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => acceptFriendRequest(request.id)}>
                        <Check size={16} /> Accept
                      </Button>
                       <Button size="sm" variant="outline" className="border-red-500 text-red-500 hover:bg-red-900" onClick={() => rejectFriendRequest(request.id)}>
                        <X size={16} /> Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Friends List Section */}
          {friendsList.length > 0 && (
             <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-300">My Friends</h3>
               <div className="space-y-2">
                {friendsList.map(friend => (
                  <div key={friend.id} className="flex items-center justify-between bg-[#444] p-3 rounded-md">
                    <span className="text-white">{friend.username}</span>
                    {/* TODO: Navigate to chat or show chat options */}
                     <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => startChat(friend.id)}>
                        <MessageSquare className="mr-1" size={16} /> Chat
                      </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

           {/* Message if no friends or requests */}
            {searchResults.length === 0 && incomingRequests.length === 0 && friendsList.length === 0 && !error && !loading && searchQuery === '' && (
               <p className="text-center text-gray-500">Search for users to add them as friends.</p>
            )}

        </CardContent>
      </Card>
    </div>
  );
};

export default FriendsPage; 