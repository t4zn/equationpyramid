import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { ShoppingCart, Share2 } from 'lucide-react';

const HomePage: React.FC = () => {
  const { authState } = useAuth();
  const navigate = useNavigate();

  const [showOfflineOptions, setShowOfflineOptions] = useState(false);
  const [showOnlineOptions, setShowOnlineOptions] = useState(false);

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#232323] to-[#111] flex flex-col items-center p-4 relative">
      <div className="flex flex-col items-center justify-center mt-16 mb-8">
        <img src="/hex.png" alt="Equation Pyramid" className="mx-auto mb-8 w-40 h-40" />
        <h1 className="font-league-spartan text-5xl font-bold text-white">Numora</h1>
      </div>

      <div className="flex flex-col items-center space-y-6 mb-8 w-full max-w-sm">
        <Button 
          onClick={() => setShowOnlineOptions(!showOnlineOptions)}
          className="w-full bg-gray-700 bg-opacity-60 backdrop-filter backdrop-blur-sm hover:bg-gray-600 hover:bg-opacity-80 text-white font-fredoka text-lg rounded-full py-4 shadow-lg"
        >
          Play online
        </Button>

        {showOnlineOptions && (
          <div className="flex flex-col items-center space-y-4 w-full px-4">
             <Button 
              onClick={() => { /* TODO: Implement find room navigation */ console.log('Find a room clicked'); }}
              className="w-full bg-[#555] hover:bg-[#666] text-white font-fredoka text-base rounded-full py-3 shadow-md"
            >
              Find a room
            </Button>
            <Button 
              onClick={() => navigate('/multiplayer/online')}
              className="w-full bg-[#555] hover:bg-[#666] text-white font-fredoka text-base rounded-full py-3 shadow-md"
            >
              Create a room
            </Button>
            <Button 
              onClick={() => navigate('/join-room')}
              className="w-full bg-[#555] hover:bg-[#666] text-white font-fredoka text-base rounded-full py-3 shadow-md"
            >
              Join a room
            </Button>
          </div>
        )}

        <Button 
          onClick={() => setShowOfflineOptions(!showOfflineOptions)}
          className="w-full bg-gray-700 bg-opacity-60 backdrop-filter backdrop-blur-sm hover:bg-gray-600 hover:bg-opacity-80 text-white font-fredoka text-lg rounded-full py-4 shadow-lg"
        >
          Play offline
        </Button>

        {showOfflineOptions && (
          <div className="flex flex-col items-center space-y-4 w-full px-4">
            <Button 
              onClick={() => navigate('/game')}
              className="w-full bg-[#555] hover:bg-[#666] text-white font-fredoka text-base rounded-full py-3 shadow-md"
            >
              Single Player
            </Button>
            <Button 
              onClick={() => navigate('/multiplayer/local')}
              className="w-full bg-[#555] hover:bg-[#666] text-white font-fredoka text-base rounded-full py-3 shadow-md"
            >
              Multiplayer
            </Button>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-8 mb-24">
        <ShoppingCart className="w-8 h-8 text-gray-400 cursor-pointer hover:text-white transition-colors" onClick={() => { /* TODO: Implement shop navigation */ }} />
        <Share2 className="w-8 h-8 text-gray-400 cursor-pointer hover:text-white transition-colors" onClick={() => { /* TODO: Implement share functionality */ }} />
      </div>
    </div>
  );
};

export default HomePage;
