import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Play, Users, Trophy, HelpCircle, Settings, LogOut } from 'lucide-react';

const HomePage: React.FC = () => {
  const { authState } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#232323] to-[#111] flex flex-col items-center justify-center p-2">
      <Card className="w-full max-w-sm bg-[#333] border-2 border-[#444] shadow-2xl">
        <CardHeader className="bg-[#222] text-white p-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl sm:text-2xl font-bold">
              Numora
            </CardTitle>
            <Button 
              onClick={handleLogout}
              className="bg-[#444] hover:bg-[#555] text-white px-2 py-1.5 h-auto"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
          <div className="text-center text-xs sm:text-sm font-semibold text-gray-300 mt-1">
            Master the equation pyramid!
          </div>
        </CardHeader>
        <CardContent className="space-y-2 p-3">
          <div className="space-y-2">
            <Button 
              onClick={() => navigate('/game')}
              className="w-full bg-[#444] hover:bg-[#555] text-white py-2 text-base flex items-center justify-center shadow-none"
            >
              <Play className="mr-2 flex-shrink-0" size={18} />
              <span>Single Player</span>
            </Button>
            
            <Button 
              onClick={() => navigate('/multiplayer')}
              className="w-full bg-[#444] hover:bg-[#555] text-white py-2 text-base flex items-center justify-center shadow-none"
            >
              <Users className="mr-2 flex-shrink-0" size={18} />
              <span>Multiplayer</span>
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button 
              onClick={() => navigate('/leaderboards')}
              className="bg-[#444] hover:bg-[#555] text-white py-2 px-2 flex flex-col items-center justify-center shadow-none min-h-[60px]"
            >
              <Trophy className="mb-0.5 flex-shrink-0" size={16} />
              <span className="text-xs text-center leading-tight">Leaderboards</span>
            </Button>
            
            <Button 
              onClick={() => navigate('/how-to-play')}
              className="bg-[#444] hover:bg-[#555] text-white py-2 px-2 flex flex-col items-center justify-center shadow-none min-h-[60px]"
            >
              <HelpCircle className="mb-0.5 flex-shrink-0" size={16} />
              <span className="text-xs text-center leading-tight">How to Play</span>
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button 
              onClick={() => navigate('/settings')}
              className="bg-[#444] hover:bg-[#555] text-white py-2 px-2 flex flex-col items-center justify-center shadow-none min-h-[60px]"
            >
              <Settings className="mb-0.5 flex-shrink-0" size={16} />
              <span className="text-xs text-center leading-tight">Settings</span>
            </Button>
          </div>

          <div className="text-center text-white pt-1">
            <div className="text-xs text-gray-300">🎮 Ready for a Challenge? 🎮</div>
            <div className="text-[10px] text-gray-400">
              Combine blocks to reach the target number!
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HomePage;
