import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BackButton } from '@/components/BackButton';
import { Users, Gamepad2, Wifi } from 'lucide-react';

const MultiplayerPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#232323] to-[#111] flex flex-col items-center justify-center p-4 relative">
      <BackButton onClick={() => navigate('/home')} />
      
      <Card className="w-full max-w-md bg-[#333] border-2 border-[#444] shadow-2xl">
        <CardHeader className="bg-[#222] text-white p-6">
          <CardTitle className="text-2xl font-bold text-center flex items-center justify-center">
            <Users className="mr-3" size={28} />
            Multiplayer Mode
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <Button 
            onClick={() => navigate('/multiplayer/local')}
            className="w-full bg-[#444] hover:bg-[#555] text-white py-4 text-lg flex items-center justify-center shadow-none"
          >
            <Gamepad2 className="mr-3" size={24} />
            Local Multiplayer
          </Button>
          
          <Button 
            onClick={() => navigate('/multiplayer/online')}
            className="w-full bg-[#444] hover:bg-[#555] text-white py-4 text-lg flex items-center justify-center shadow-none"
          >
            <Wifi className="mr-3" size={24} />
            Online Multiplayer
          </Button>
          
          <div className="text-center text-gray-400 text-sm">
            Challenge friends in real-time puzzle battles!
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MultiplayerPage;
