
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const HomePage = () => {
  const { authState, signOut } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!authState.user && !authState.loading) {
      navigate('/login');
    }
  }, [authState.user, authState.loading, navigate]);

  const menuOptions = [
    { title: 'Start Game', action: () => navigate('/game') },
    { title: 'Multiplayer Options', action: () => navigate('/multiplayer') },
    { title: 'Settings', action: () => navigate('/settings') },
    { title: 'How to Play', action: () => navigate('/howtoplay') },
    { title: 'Leaderboards', action: () => navigate('/leaderboards') },
  ];

  if (authState.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800">
        <p className="text-white text-xl">Loading...</p>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center p-4"
      style={{
        backgroundImage: "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><rect width=\"100\" height=\"100\" fill=\"%23333\"/><circle cx=\"20\" cy=\"20\" r=\"1\" fill=\"%23444\"/><circle cx=\"80\" cy=\"40\" r=\"1\" fill=\"%23444\"/><circle cx=\"40\" cy=\"80\" r=\"1\" fill=\"%23444\"/></svg>')"
      }}
    >
      <header className="text-center mb-10">
        <h1 className="text-4xl font-bold text-yellow-400 mb-2">Equation Pyramid Challenge</h1>
        {authState.user && (
          <p className="text-gray-300">
            Welcome, <span className="text-yellow-300">{authState.user.username || 'Player'}</span>!
          </p>
        )}
      </header>

      <Card className="w-full max-w-md bg-gray-800 border-yellow-500 p-6">
        <div className="flex flex-col space-y-3">
          {menuOptions.map((option, index) => (
            <Button
              key={index}
              onClick={option.action}
              className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-4 text-lg"
            >
              {option.title}
            </Button>
          ))}
          
          <Button
            onClick={signOut}
            variant="outline"
            className="mt-8 border-red-500 text-red-400 hover:bg-red-900 hover:text-white"
          >
            Sign Out
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default HomePage;
