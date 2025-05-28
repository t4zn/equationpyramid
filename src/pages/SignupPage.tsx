import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Lock, ArrowLeft } from 'lucide-react';

const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Add signup logic
    navigate('/choose-username');
  };

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
      <form onSubmit={handleSubmit} className="w-full max-w-md flex flex-col items-center px-4 gap-8">
        <div className="w-full flex flex-col gap-6 mt-8">
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
        </div>
        <Button
          type="submit"
          className="w-full bg-[#222] text-white font-fredoka text-lg rounded-2xl py-4 mt-8 shadow-none"
        >
          Continue
        </Button>
      </form>
    </div>
  );
};

export default SignupPage; 