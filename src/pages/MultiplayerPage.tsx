
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BackButton } from '@/components/BackButton';
import { Users, Gamepad2, Wifi } from 'lucide-react';

const MultiplayerPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center justify-center p-4 relative">
      <BackButton onClick={() => navigate('/home')} />
      
      <Card className="w-full max-w-md bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-2 border-purple-500 shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-500 text-white p-6">
          <CardTitle className="text-2xl font-bold text-center flex items-center justify-center">
            <Users className="mr-3" size={28} />
            Multiplayer Mode
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <Button 
            onClick={() => navigate('/multiplayer/local')}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 text-lg flex items-center justify-center shadow-lg transform hover:scale-105 transition-all"
          >
            <Gamepad2 className="mr-3" size={24} />
            Local Multiplayer
          </Button>
          
          <Button 
            onClick={() => navigate('/multiplayer/online')}
            className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-4 text-lg flex items-center justify-center shadow-lg transform hover:scale-105 transition-all"
          >
            <Wifi className="mr-3" size={24} />
            Online Multiplayer
          </Button>
          
          <div className="text-center text-gray-400 text-sm mt-6">
            Challenge friends in real-time puzzle battles!
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MultiplayerPage;
