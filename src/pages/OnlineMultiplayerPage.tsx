
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BackButton } from '@/components/BackButton';
import { OnlineMultiplayerGame } from '@/components/OnlineMultiplayerGame';
import { Wifi, Plus, LogIn } from 'lucide-react';

const OnlineMultiplayerPage = () => {
  const navigate = useNavigate();
  const [gameStarted, setGameStarted] = useState(false);
  const [roomId, setRoomId] = useState('');
  const [joinRoomId, setJoinRoomId] = useState('');
  const [playerCount, setPlayerCount] = useState(2);

  const createRoom = () => {
    const newRoomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    setRoomId(newRoomId);
    setGameStarted(true);
  };

  const joinRoom = () => {
    if (joinRoomId.trim()) {
      setRoomId(joinRoomId.trim().toUpperCase());
      setGameStarted(true);
    }
  };

  if (gameStarted) {
    return <OnlineMultiplayerGame roomId={roomId} playerCount={playerCount} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center justify-center p-4 relative">
      <BackButton onClick={() => navigate('/multiplayer')} />
      
      <Card className="w-full max-w-md bg-gray-800 border-green-500">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-green-400 flex items-center justify-center">
            <Wifi className="mr-2" size={24} />
            Online Multiplayer
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Create Room Section */}
          <div className="space-y-4">
            <div className="text-center text-gray-300 text-lg font-semibold">
              Create Room
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
                        ? 'bg-green-600 hover:bg-green-700 text-white' 
                        : 'border-green-500 text-green-400 hover:bg-green-500/10'
                    }`}
                  >
                    {count}
                  </Button>
                ))}
              </div>
            </div>
            
            <Button 
              onClick={createRoom}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 flex items-center justify-center"
            >
              <Plus className="mr-2" size={20} />
              Create Room
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-600" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-gray-800 px-2 text-gray-400">Or</span>
            </div>
          </div>

          {/* Join Room Section */}
          <div className="space-y-4">
            <div className="text-center text-gray-300 text-lg font-semibold">
              Join Room
            </div>
            
            <div className="space-y-3">
              <Input
                value={joinRoomId}
                onChange={(e) => setJoinRoomId(e.target.value.toUpperCase())}
                placeholder="Enter room code"
                className="bg-gray-700 text-white border-gray-600 text-center text-lg tracking-widest"
                maxLength={6}
              />
              
              <Button 
                onClick={joinRoom}
                disabled={!joinRoomId.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 flex items-center justify-center"
              >
                <LogIn className="mr-2" size={20} />
                Join Room
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnlineMultiplayerPage;
