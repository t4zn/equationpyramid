import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Lock, User, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const LoginFormPage = () => {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const { authState, signIn, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn(emailOrUsername, password);
  };

  const handleGoogleSignIn = async () => {
    await signInWithGoogle();
  };

  // Redirect if already logged in
  React.useEffect(() => {
    if (authState.user) {
      navigate('/home');
    }
  }, [authState.user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#232323] to-[#111] px-4 relative">
      {/* Back button with arrow icon */}
      <Button
        type="button"
        onClick={() => navigate('/')}
        className="absolute top-8 left-8 text-white opacity-80 hover:opacity-100 z-10"
        variant="ghost"
        size="icon"
      >
        <ArrowLeft className="w-6 h-6" />
      </Button>
      <div className="w-full max-w-md flex flex-col items-center">
        <Button
          type="button"
          onClick={handleGoogleSignIn}
          className="w-full bg-[#444] text-white font-fredoka text-lg rounded-2xl py-4 flex items-center justify-center gap-3 shadow-none mb-8"
          disabled={authState.loading}
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-6 h-6" />
          {authState.loading ? 'Signing in...' : 'Log in with Google'}
        </Button>

        <div className="flex items-center w-full my-4">
          <div className="flex-1 h-px bg-gray-600" />
          <span className="mx-4 text-gray-400 font-poppins text-sm">or log in with</span>
          <div className="flex-1 h-px bg-gray-600" />
        </div>

        <form onSubmit={handleSubmit} className="w-full flex flex-col items-center gap-6 mt-8">
          <div className="relative w-full">
            <Input
              type="text"
              placeholder="Username or Email"
              value={emailOrUsername}
              onChange={e => setEmailOrUsername(e.target.value)}
              className="bg-[#666] text-white font-poppins text-lg rounded-2xl py-4 pl-14 placeholder-white placeholder-opacity-80 border-none shadow-none"
              required
            />
            <User className="absolute left-5 top-1/2 -translate-y-1/2 text-white opacity-80 w-6 h-6" />
          </div>
          <div className="relative w-full">
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="bg-[#666] text-white font-poppins text-lg rounded-2xl py-4 pl-14 placeholder-white placeholder-opacity-80 border-none shadow-none"
              required
            />
            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-white opacity-80 w-6 h-6" />
          </div>

          <button type="button" onClick={() => { /* TODO: Forgot password logic */ }} className="self-end text-white font-fredoka text-sm opacity-80 hover:underline mb-6">Forgot Password?</button>

          <Button
            type="submit"
            className="w-full bg-[#222] text-white font-fredoka text-lg rounded-2xl py-4 shadow-none"
            disabled={authState.loading}
          >
            {authState.loading ? 'Logging In...' : 'Log in'}
          </Button>

           {authState.error && (
              <p className="text-red-400 text-sm text-center mt-4">{authState.error}</p>
            )}
        </form>
      </div>
    </div>
  );
};

export default LoginFormPage; 