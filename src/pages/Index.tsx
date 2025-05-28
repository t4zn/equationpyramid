
import React, { useEffect } from 'react';
import GameScreen from '../components/GameScreen';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const { authState } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is not authenticated and not loading, redirect to login
    if (!authState.user && !authState.loading) {
      navigate('/login');
    } else if (authState.user && window.location.pathname === '/') {
      // If user is authenticated and at root path, redirect to home
      navigate('/home');
    }
  }, [authState.user, authState.loading, navigate]);

  // Show GameScreen if the user is explicitly at the /game path
  if (authState.user && window.location.pathname === '/game') {
    return <GameScreen />;
  }

  // Loading state while auth is being determined
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800">
      <p className="text-white text-xl">Loading...</p>
    </div>
  );
};

export default Index;
