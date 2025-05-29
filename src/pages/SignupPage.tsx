import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Lock, User, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const { authState, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      await signUp(email, password, username);
      // The AuthContext will handle the success/error messages
    } catch (error) {
      // Error is already handled in AuthContext
      console.error('Signup error:', error);
    }
  };

  // Redirect if already logged in
  React.useEffect(() => {
    if (authState.user) {
      navigate('/home');
    }
  }, [authState.user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#232323] to-[#111] px-4 relative">
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
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
          <div className="relative w-full">
            <Input
              type="text"
              placeholder="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="bg-[#666] text-white font-poppins text-lg rounded-2xl py-4 pl-14 placeholder-white placeholder-opacity-80 border-none shadow-none"
              required
            />
            <User className="absolute left-5 top-1/2 -translate-y-1/2 text-white opacity-80 w-6 h-6" />
          </div>
          <div className="relative w-full">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="bg-[#666] text-white font-poppins text-lg rounded-2xl py-4 pl-14 placeholder-white placeholder-opacity-80 border-none shadow-none"
              required
            />
            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-white opacity-80 w-6 h-6" />
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
          <div className="relative w-full">
            <Input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className="bg-[#666] text-white font-poppins text-lg rounded-2xl py-4 pl-14 placeholder-white placeholder-opacity-80 border-none shadow-none"
              required
            />
            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-white opacity-80 w-6 h-6" />
          </div>

          <Button
            type="submit"
            className="w-full bg-[#222] text-white font-fredoka text-lg rounded-2xl py-4 shadow-none"
            disabled={authState.loading}
          >
            {authState.loading ? 'Creating Account...' : 'Create Account'}
          </Button>

          {authState.error && (
            <p className="text-red-400 text-sm text-center mt-4">{authState.error}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default SignupPage; 