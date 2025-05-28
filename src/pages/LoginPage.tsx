import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const LoginPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-[#232323] to-[#111] p-4 relative">
      {/* Top bar: Title container and Log in button */}
      <div className="w-full max-w-md flex flex-col items-center relative mb-24 mt-8">
        <span className="font-league-spartan text-base tracking-wide text-white text-center block w-full">EQUATION PYRAMID</span>
        {/* Log in button absolutely positioned */}
        <Button
          onClick={() => navigate('/login')}
          className="absolute top-0 right-0 bg-[#333] text-white font-fredoka rounded-full px-4 py-1 shadow-none text-sm z-10"
        >
          Log in
        </Button>
      </div>

      <div className="w-full max-w-md flex flex-col items-center text-center px-4">
        {/* Slogan and Hex Image */}
        <h1 className="font-league-spartan text-4xl md:text-5xl font-bold text-white mb-12">Pick and Click,<br />Solve It Quick!</h1>
        <img src="/hex.png" alt="Equation Pyramid" className="mx-auto my-8 w-32 h-32" />

        {/* Auth Buttons */}
        <div className="w-full flex flex-col items-center gap-4 mt-24">
          <Button
            type="button"
            onClick={() => navigate('/signup')}
            className="w-full bg-[#444] text-white font-fredoka text-lg rounded-2xl py-4 shadow-none"
          >
            Get Started
          </Button>
          <div className="flex items-center w-full my-2">
            <div className="flex-1 h-px bg-gray-600" />
            <span className="mx-4 text-gray-400 font-poppins text-sm">OR</span>
            <div className="flex-1 h-px bg-gray-600" />
          </div>
          <Button
            type="button"
            onClick={() => alert('Google sign-in coming soon!')}
            className="w-full bg-[#444] text-white font-fredoka text-lg rounded-2xl py-4 flex items-center justify-center gap-3 shadow-none"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-6 h-6" />
            Continue with Google
          </Button>
        </div>
        <button
          className="mt-8 text-white font-fredoka text-lg opacity-90 hover:underline"
          onClick={() => navigate('/home')}
        >
          Play as Guest
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
