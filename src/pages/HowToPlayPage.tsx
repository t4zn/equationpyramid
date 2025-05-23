
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const HowToPlayPage = () => {
  const navigate = useNavigate();

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat flex flex-col items-center p-4 pt-8"
      style={{
        backgroundImage: "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><rect width=\"100\" height=\"100\" fill=\"%23333\"/><circle cx=\"20\" cy=\"20\" r=\"1\" fill=\"%23444\"/><circle cx=\"80\" cy=\"40\" r=\"1\" fill=\"%23444\"/><circle cx=\"40\" cy=\"80\" r=\"1\" fill=\"%23444\"/></svg>')"
      }}
    >
      <Card className="w-full max-w-3xl bg-gray-800 border-yellow-500">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-yellow-400">
            How to Play
          </CardTitle>
        </CardHeader>
        <CardContent className="text-gray-300 space-y-6">
          <section className="space-y-2">
            <h2 className="text-xl font-bold text-yellow-300">Game Objective</h2>
            <p>
              Form valid equations using exactly 3 blocks to reach the target number shown at the top of the screen.
            </p>
          </section>
          
          <section className="space-y-2">
            <h2 className="text-xl font-bold text-yellow-300">The Pyramid</h2>
            <p>
              Each game presents a pyramid of hexagonal blocks. Each block has:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>A letter label (a-j)</li>
              <li>Either a number or an operation with a number</li>
            </ul>
          </section>
          
          <section className="space-y-2">
            <h2 className="text-xl font-bold text-yellow-300">Creating Equations</h2>
            <p>
              Select 3 blocks to form an equation:
            </p>
            <ol className="list-decimal pl-6 space-y-2">
              <li>
                <span className="font-semibold text-white">First Block:</span> Only the number value is used, any operator is ignored.
              </li>
              <li>
                <span className="font-semibold text-white">Second Block:</span> Both operator and number are applied to the first block's value.
              </li>
              <li>
                <span className="font-semibold text-white">Third Block:</span> Both operator and number are applied to the running total.
              </li>
            </ol>
            <p className="mt-2">
              <span className="font-semibold text-white">Example:</span> If you select blocks with values "÷9", "+7", "×3"
              <br />
              The equation is evaluated as: 9 + 7 × 3 = 30
              <br />
              (The division operator in the first block is ignored)
            </p>
          </section>
          
          <section className="space-y-2">
            <h2 className="text-xl font-bold text-yellow-300">How to Select Blocks</h2>
            <p>You have two ways to select blocks:</p>
            <ol className="list-decimal pl-6 space-y-1">
              <li><span className="font-semibold text-white">Click/Tap:</span> Click directly on blocks to select them.</li>
              <li><span className="font-semibold text-white">Type Letters:</span> Enter the letter labels (e.g., "aef") in the input box.</li>
            </ol>
          </section>
          
          <section className="space-y-2">
            <h2 className="text-xl font-bold text-yellow-300">Scoring</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li><span className="font-semibold text-white">Correct equation:</span> +10 points</li>
              <li><span className="font-semibold text-white">Incorrect equation:</span> -5 points</li>
              <li><span className="font-semibold text-white">Time bonus:</span> +1 to +5 points based on remaining time</li>
            </ul>
          </section>
          
          <section className="space-y-2">
            <h2 className="text-xl font-bold text-yellow-300">Game Flow</h2>
            <ol className="list-decimal pl-6 space-y-2">
              <li>A pyramid and target number are generated</li>
              <li>You have 30 seconds to find a valid equation</li>
              <li>If successful, a new pyramid is generated</li>
              <li>If time runs out, the game ends</li>
            </ol>
          </section>
          
          <div className="pt-4 flex justify-center">
            <Button 
              onClick={() => navigate('/home')} 
              className="bg-yellow-500 hover:bg-yellow-600 text-gray-900"
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
