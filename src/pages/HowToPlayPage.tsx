import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BackButton } from '@/components/BackButton';

const HowToPlayPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#232323] to-[#111] flex flex-col items-center p-4 relative">
      <BackButton onClick={() => navigate('/home')} />
      
      <Card className="w-full max-w-2xl bg-[#333] border-2 border-[#444] shadow-2xl mt-16">
        <CardHeader className="bg-[#222] text-white p-6">
          <CardTitle className="text-3xl font-bold text-center">
            How to Play
          </CardTitle>
        </CardHeader>
        <CardContent className="text-gray-300 space-y-6 p-6">
          <section className="space-y-2">
            <h2 className="text-xl font-bold text-white">Game Objective</h2>
            <p className="text-gray-300">
              Form valid equations using exactly 3 blocks to reach the target number shown at the top of the screen.
            </p>
          </section>
          
          <section className="space-y-2">
            <h2 className="text-xl font-bold text-white">The Pyramid</h2>
            <p className="text-gray-300">
              Each game presents a pyramid of hexagonal blocks. Each block has:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-gray-300">
              <li>A letter label (a-j)</li>
              <li>Either a number or an operation with a number</li>
            </ul>
          </section>
          
          <section className="space-y-2">
            <h2 className="text-xl font-bold text-white">Rules</h2>
            <ul className="list-disc pl-6 space-y-1 text-gray-300">
              <li>Select exactly 3 blocks to form an equation</li>
              <li>The equation must be mathematically valid</li>
              <li>The result must equal the target number</li>
              <li>You can use any combination of operations (+, -, ×, ÷)</li>
            </ul>
          </section>
          
          <section className="space-y-2">
            <h2 className="text-xl font-bold text-white">Scoring</h2>
            <ul className="list-disc pl-6 space-y-1 text-gray-300">
              <li><span className="font-semibold text-white">Correct equation:</span> +10 points</li>
              <li><span className="font-semibold text-white">Incorrect equation:</span> -5 points</li>
              <li><span className="font-semibold text-white">Time bonus:</span> +1 to +5 points based on remaining time</li>
            </ul>
          </section>
          
          <section className="space-y-2">
            <h2 className="text-xl font-bold text-white">Game Flow</h2>
            <ol className="list-decimal pl-6 space-y-2 text-gray-300">
              <li>A pyramid and target number are generated</li>
              <li>You have 30 seconds to find a valid equation</li>
              <li>If successful, a new pyramid is generated</li>
              <li>If time runs out, the game ends</li>
            </ol>
          </section>
          
          <div className="pt-4 flex justify-center">
            <Button 
              onClick={() => navigate('/home')} 
              className="bg-[#444] hover:bg-[#555] text-white"
            >
              Back to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HowToPlayPage;
