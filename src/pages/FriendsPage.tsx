import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { UserPlus, Check, X, MessageSquare, Search } from 'lucide-react'; // Import icons and Search icon
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
  const [activeTab, setActiveTab] = useState('friends'); // State for toggle buttons

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
      {/* Removed BackButton */}
      
      {/* Title */}
      <h1 className="text-4xl font-bold text-white mt-8 mb-8">Friends</h1>

      {/* Toggle Buttons */}
      <div className="flex space-x-4 mb-6">
        <Button
          className={
            `px-8 py-3 rounded-full text-lg font-semibold 
             ${activeTab === 'friends'
                ? 'bg-white text-black border border-white'
                : 'bg-gray-700 text-gray-300 border border-gray-700'
            }`
          }
          onClick={() => setActiveTab('friends')}
        >
          Friends
        </Button>
        <Button
          className={
            `px-8 py-3 rounded-full text-lg font-semibold 
             ${activeTab === 'requests'
                ? 'bg-white text-black border border-white'
                : 'bg-gray-700 text-gray-300 border border-gray-700'
            }`
          }
          onClick={() => setActiveTab('requests')}
        >
          Requests
        </Button>
      </div>

      {/* Content based on active tab */}
      <div className="w-full max-w-md">
        {activeTab === 'friends' && (
          <div className="space-y-6">
            {/* Search Section */}
            <div className="flex items-center bg-gray-700 rounded-full px-4 py-2 space-x-2">
              <Search className="text-gray-400" size={24} />
              <Input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-grow bg-transparent border-none text-white placeholder:text-gray-400 focus:ring-0 focus:outline-none"
              />
            </div>

            {/* Search Results or Friends List (placeholder) */}
             {searchResults.length > 0 ? (
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
            ) : friendsList.length > 0 ? (
               <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-300">My Friends</h3>
                 <div className="space-y-2">
                  {friendsList.map(friend => (
                    <div key={friend.id} className="flex items-center justify-between bg-[#444] p-3 rounded-md">
                      <span className="text-white">{friend.username}</span>
                      {/* TODO: Navigate to chat or show chat options */}
                       <Button size="sm" className="bg-gray-600 hover:bg-gray-700 text-white" onClick={() => startChat(friend.id)}>
                          <MessageSquare className="mr-1 text-nav-active" size={16} /> Chat
                        </Button>
                    </div>
                  ))}
                </div>
              </div>
            ) : !error && !loading && searchQuery === '' && (
                 <p className="text-center text-gray-500">Search for users to add them as friends.</p>
              )}

          </div>
        )}

        {activeTab === 'requests' && (
          <div className="space-y-6">
            {/* Incoming Requests Section */}
            {incomingRequests.length > 0 ? (
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
            ) : (
               <p className="text-center text-gray-500">No incoming friend requests.</p>
            )}
          </div>
        )}

      </div>

      {/* Add Friend Button (Fixed at bottom) */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-full max-w-xs">
        <Button className="w-full py-3 rounded-full bg-white text-black text-lg font-semibold">
          + Add friend
        </Button>
      </div>

    </div>
  );
};

export default FriendsPage; 