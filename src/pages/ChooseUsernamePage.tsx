import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User, Plus, ArrowLeft } from 'lucide-react';

const ChooseUsernamePage = () => {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Add username logic
    navigate('/home');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#232323] to-[#111] px-4 relative">
      <Button
        type="button"
        onClick={() => navigate('/signup')}
        className="absolute top-8 left-8 text-white opacity-80 hover:opacity-100 z-10"
        variant="ghost"
        size="icon"
      >
        <ArrowLeft className="w-6 h-6" />
      </Button>
      <form onSubmit={handleSubmit} className="w-full max-w-md flex flex-col items-center px-4 gap-8">
        <div className="text-center mt-8 mb-4">
          <h1 className="font-league-spartan text-3xl md:text-4xl font-bold text-white mb-2">Choose a username</h1>
          <p className="font-poppins text-white text-opacity-80 text-base">This is what your friends and other players<br />will see when you play</p>
        </div>
        <div className="w-full flex items-center gap-4 mt-8 mb-8">
          <div className="w-16 h-16 rounded-2xl bg-[#666] flex items-center justify-center">
            <Plus className="text-white opacity-80 w-8 h-8" />
          </div>
          <div className="relative flex-1">
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
        </div>
        <Button
          type="submit"
          className="w-full bg-[#222] text-white font-fredoka text-lg rounded-2xl py-4 mt-8 shadow-none"
        >
          Create Account
        </Button>
      </form>
    </div>
  );
};

export default ChooseUsernamePage; 