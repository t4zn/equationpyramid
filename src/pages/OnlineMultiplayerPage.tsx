import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BackButton } from '@/components/BackButton';
import { OnlineMultiplayerGame } from '@/components/OnlineMultiplayerGame';
import { Wifi, Plus } from 'lucide-react';

const OnlineMultiplayerPage = () => {
  const navigate = useNavigate();
  const [gameStarted, setGameStarted] = useState(false);
  const [roomId, setRoomId] = useState('');
  const [playerCount, setPlayerCount] = useState(2);

  const createRoom = () => {
    const newRoomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    setRoomId(newRoomId);
    setGameStarted(true);
  };

  if (gameStarted) {
    return <OnlineMultiplayerGame roomId={roomId} playerCount={playerCount} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#232323] to-[#111] flex flex-col items-center justify-center p-4 relative">
      <BackButton onClick={() => navigate('/home')} />
      
      <Card className="w-full max-w-md bg-[#333] border-2 border-[#444] shadow-2xl">
        <CardHeader className="bg-[#222] text-white p-6">
          <CardTitle className="text-2xl font-bold text-center flex items-center justify-center">
            <Wifi className="mr-2" size={24} />
            Create Online Room
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          {/* Create Room Section */}
          <div className="space-y-4">
            <div className="text-center text-gray-300 text-lg font-semibold">
              Configure Room
            </div>
            
            <div className="space-y-3">
              <div className="text-sm text-gray-400">Number of players:</div>
              <div className="grid grid-cols-3 gap-2">
                {[2, 3, 4].map((count) => (
                  <Button
                    key={count}
                    onClick={() => setPlayerCount(count)}
                    variant={playerCount === count ? "default" : "outline"}
                    size="sm"
                    className={`${
                      playerCount === count 
                        ? 'bg-[#444] hover:bg-[#555] text-white' 
                        : 'border-[#444] text-gray-300 hover:bg-[#444]'
                    }`}
                  >
                    {count}
                  </Button>
                ))}
              </div>
            </div>
            
            <Button 
              onClick={createRoom}
              className="w-full bg-[#444] hover:bg-[#555] text-white py-3 flex items-center justify-center"
            >
              <Plus className="mr-2" size={20} />
              Create Room
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnlineMultiplayerPage;
