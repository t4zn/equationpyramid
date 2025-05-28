
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BackButton } from '@/components/BackButton';
import { LocalMultiplayerGame } from '@/components/LocalMultiplayerGame';
import { Users } from 'lucide-react';

const LocalMultiplayerPage = () => {
  const navigate = useNavigate();
  const [gameStarted, setGameStarted] = useState(false);
  const [playerCount, setPlayerCount] = useState(2);

  if (gameStarted) {
    return <LocalMultiplayerGame playerCount={playerCount} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center justify-center p-4 relative">
      <BackButton onClick={() => navigate('/multiplayer')} />
      
      <Card className="w-full max-w-md bg-gray-800 border-blue-500">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-blue-400 flex items-center justify-center">
            <Users className="mr-2" size={24} />
            Local Multiplayer
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="text-center text-gray-300">
              Select number of players:
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {[2, 3, 4].map((count) => (
                <Button
                  key={count}
                  onClick={() => setPlayerCount(count)}
                  variant={playerCount === count ? "default" : "outline"}
                  className={`py-3 ${
                    playerCount === count 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                      : 'border-blue-500 text-blue-400 hover:bg-blue-500/10'
                  }`}
                >
                  {count} Players
                </Button>
              ))}
            </div>
          </div>
          
          <Button 
            onClick={() => setGameStarted(true)}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg"
          >
            Start Game
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default LocalMultiplayerPage;
