
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Play, Users, Trophy, HelpCircle, Settings, LogOut } from 'lucide-react';

const HomePage: React.FC = () => {
  const { authState, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center p-4"
      style={{
        backgroundImage: "linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.9)), url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><rect width=\"100\" height=\"100\" fill=\"%23111827\"/><circle cx=\"20\" cy=\"20\" r=\"2\" fill=\"%23fbbf24\" opacity=\"0.6\"/><circle cx=\"80\" cy=\"40\" r=\"1.5\" fill=\"%23fbbf24\" opacity=\"0.4\"/><circle cx=\"40\" cy=\"80\" r=\"2\" fill=\"%23fbbf24\" opacity=\"0.5\"/><circle cx=\"60\" cy=\"20\" r=\"1\" fill=\"%23fbbf24\" opacity=\"0.3\"/><circle cx=\"10\" cy=\"60\" r=\"1.5\" fill=\"%23fbbf24\" opacity=\"0.4\"/></svg>')"
      }}
    >
      {/* Welcome Card */}
      <Card className="w-full max-w-lg bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-2 border-yellow-500 shadow-2xl mb-6">
        <CardHeader className="bg-gradient-to-r from-yellow-600 to-yellow-500 text-black">
          <CardTitle className="text-3xl font-bold text-center">
            🔢 Equation Pyramid 🔢
          </CardTitle>
          <div className="text-center text-lg font-semibold">
            Welcome, {authState.user?.email?.split('@')[0] || 'Player'}!
          </div>
        </CardHeader>
        <CardContent className="space-y-4 p-6">
          {/* Main Game Modes */}
          <div className="space-y-3">
            <Button 
              onClick={() => navigate('/game')}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-4 text-xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-all"
            >
              <Play className="mr-3" size={28} />
              Single Player
              <span className="ml-auto text-sm opacity-75">Start Game</span>
            </Button>
            
            <Button 
              onClick={() => navigate('/multiplayer')}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-4 text-xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-all"
            >
              <Users className="mr-3" size={28} />
              Multiplayer
              <span className="ml-auto text-sm opacity-75">Play with Friends</span>
            </Button>
          </div>

          {/* Secondary Options */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-600">
            <Button 
              onClick={() => navigate('/leaderboards')}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 flex flex-col items-center shadow-lg transform hover:scale-105 transition-all"
            >
              <Trophy className="mb-1" size={24} />
              <span className="text-sm">Leaderboards</span>
            </Button>
            
            <Button 
              onClick={() => navigate('/how-to-play')}
              className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white py-3 flex flex-col items-center shadow-lg transform hover:scale-105 transition-all"
            >
              <HelpCircle className="mb-1" size={24} />
              <span className="text-sm">How to Play</span>
            </Button>
          </div>

          {/* Settings and Logout */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <Button 
              onClick={() => navigate('/settings')}
              variant="outline"
              className="border-2 border-gray-500 text-gray-300 hover:bg-gray-700 py-3 flex flex-col items-center"
            >
              <Settings className="mb-1" size={20} />
              <span className="text-sm">Settings</span>
            </Button>
            
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="border-2 border-red-500 text-red-400 hover:bg-red-900/20 py-3 flex flex-col items-center"
            >
              <LogOut className="mb-1" size={20} />
              <span className="text-sm">Logout</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Game Stats Card */}
      <Card className="w-full max-w-lg bg-gradient-to-br from-gray-800 to-gray-700 border border-gray-600 shadow-lg">
        <CardContent className="p-4">
          <div className="text-center text-white">
            <div className="text-sm text-gray-300 mb-2">🎮 Ready for a Challenge? 🎮</div>
            <div className="text-xs text-gray-400">
              Combine blocks to reach the target number and climb the leaderboards!
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HomePage;
