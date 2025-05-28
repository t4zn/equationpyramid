
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
    // Simple navigation for now since logout method doesn't exist
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center justify-center p-2 sm:p-4">
      {/* Welcome Card - Mobile Optimized */}
      <Card className="w-full max-w-sm bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-2 border-yellow-500 shadow-2xl mb-4">
        <CardHeader className="bg-gradient-to-r from-yellow-600 to-yellow-500 text-black p-4">
          <CardTitle className="text-xl sm:text-2xl font-bold text-center">
            🔢 Equation Pyramid 🔢
          </CardTitle>
          <div className="text-center text-sm sm:text-base font-semibold">
            Welcome, {authState.user?.email?.split('@')[0] || 'Player'}!
          </div>
        </CardHeader>
        <CardContent className="space-y-3 p-4">
          {/* Main Game Modes */}
          <div className="space-y-3">
            <Button 
              onClick={() => navigate('/game')}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 text-lg flex items-center justify-center shadow-lg transform hover:scale-105 transition-all"
            >
              <Play className="mr-2" size={20} />
              Single Player
            </Button>
            
            <Button 
              onClick={() => navigate('/multiplayer')}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-3 text-lg flex items-center justify-center shadow-lg transform hover:scale-105 transition-all"
            >
              <Users className="mr-2" size={20} />
              Multiplayer
            </Button>
          </div>

          {/* Secondary Options */}
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-600">
            <Button 
              onClick={() => navigate('/leaderboards')}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 flex flex-col items-center shadow-lg transform hover:scale-105 transition-all"
            >
              <Trophy className="mb-1" size={20} />
              <span className="text-sm">Leaderboards</span>
            </Button>
            
            <Button 
              onClick={() => navigate('/how-to-play')}
              className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white py-3 flex flex-col items-center shadow-lg transform hover:scale-105 transition-all"
            >
              <HelpCircle className="mb-1" size={20} />
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
              <Settings className="mb-1" size={18} />
              <span className="text-sm">Settings</span>
            </Button>
            
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="border-2 border-red-500 text-red-400 hover:bg-red-900/20 py-3 flex flex-col items-center"
            >
              <LogOut className="mb-1" size={18} />
              <span className="text-sm">Logout</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Game Stats Card */}
      <Card className="w-full max-w-sm bg-gradient-to-br from-gray-800 to-gray-700 border border-gray-600 shadow-lg">
        <CardContent className="p-3">
          <div className="text-center text-white">
            <div className="text-sm text-gray-300 mb-1">🎮 Ready for a Challenge? 🎮</div>
            <div className="text-xs text-gray-400">
              Combine blocks to reach the target number!
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HomePage;
