import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BackButton } from '@/components/BackButton';
import { OnlineMultiplayerGame } from '@/components/OnlineMultiplayerGame';
import { Wifi, LogIn } from 'lucide-react';

const JoinRoomPage = () => {
  const navigate = useNavigate();
  const [gameStarted, setGameStarted] = useState(false);
  const [roomId, setRoomId] = useState('');
  const [joinRoomId, setJoinRoomId] = useState('');

  const joinRoom = () => {
    if (joinRoomId.trim()) {
      setRoomId(joinRoomId.trim().toUpperCase());
      setGameStarted(true);
    }
  };

  if (gameStarted) {
    // Assuming OnlineMultiplayerGame component can handle joining with a roomId
    return <OnlineMultiplayerGame roomId={roomId} playerCount={2} />; // Assuming default player count or handle dynamically
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#232323] to-[#111] flex flex-col items-center justify-center p-4 relative">
      <BackButton onClick={() => navigate('/home')} />
      
      <Card className="w-full max-w-md bg-[#333] border-2 border-[#444] shadow-2xl">
        <CardHeader className="bg-[#222] text-white p-6">
          <CardTitle className="text-2xl font-bold text-center flex items-center justify-center">
            <Wifi className="mr-2" size={24} />
            Join Online Room
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          {/* Join Room Section - moved from OnlineMultiplayerPage */}
          <div className="space-y-4">
            <div className="text-center text-gray-300 text-lg font-semibold">
              Enter Room Code
            </div>
            
            <div className="space-y-3">
              <Input
                value={joinRoomId}
                onChange={(e) => setJoinRoomId(e.target.value.toUpperCase())}
                placeholder="Enter room code"
                className="bg-[#444] text-white border-[#444] text-center text-lg tracking-widest"
                maxLength={6}
              />
              
              <Button 
                onClick={joinRoom}
                disabled={!joinRoomId.trim()}
                className="w-full bg-[#444] hover:bg-[#555] text-white py-3 flex items-center justify-center"
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

export default JoinRoomPage; 