
import React, { useState, useEffect } from 'react';
import { PyramidGrid } from './PyramidGrid';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BackButton } from '@/components/BackButton';
import { CorrectCombinations } from '@/components/CorrectCombinations';
import { generatePyramid, evaluateEquation, parseLetterInput } from '@/utils/pyramidGenerator';
import { Block } from '@/types/game';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { RefreshCw, Target } from 'lucide-react';

const GameScreen = () => {
  const navigate = useNavigate();
  const { authState } = useAuth();
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [targetNumber, setTargetNumber] = useState(0);
  const [selectedBlocks, setSelectedBlocks] = useState<number[]>([]);
  const [currentRound, setCurrentRound] = useState(1);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [letterInput, setLetterInput] = useState('');
  const [feedback, setFeedback] = useState('');
  const [correctCombinations, setCorrectCombinations] = useState<string[]>([]);

  useEffect(() => {
    generateNewPyramid();
  }, []);

  const generateNewPyramid = () => {
    const pyramid = generatePyramid();
    setBlocks(pyramid.blocks);
    setTargetNumber(pyramid.targetNumber);
    setSelectedBlocks([]);
    setLetterInput('');
    setFeedback('');
  };

  const handleBlockClick = (index: number) => {
    if (selectedBlocks.includes(index)) {
      setSelectedBlocks(selectedBlocks.filter(i => i !== index));
    } else if (selectedBlocks.length < 3) {
      setSelectedBlocks([...selectedBlocks, index]);
    }
  };

  const handleSubmit = () => {
    if (selectedBlocks.length !== 3) {
      setFeedback('Please select exactly 3 blocks');
      return;
    }

    const result = evaluateEquation(selectedBlocks, blocks);
    
    if (!result.isValid) {
      setFeedback(result.message || 'Invalid equation');
      return;
    }

    if (result.result === targetNumber) {
      const newScore = score + (10 * currentRound);
      setScore(newScore);
      setCorrectCombinations([...correctCombinations, result.equation || '']);
      setFeedback(`Correct! +${10 * currentRound} points`);
      
      setTimeout(() => {
        if (currentRound >= 10) {
          endGame(newScore);
        } else {
          setCurrentRound(currentRound + 1);
          generateNewPyramid();
        }
      }, 1500);
    } else {
      setFeedback(`Incorrect. Got ${result.result}, needed ${targetNumber}`);
    }
  };

  const handleLetterSubmit = () => {
    const indices = parseLetterInput(letterInput, blocks);
    if (indices.includes(-1)) {
      setFeedback('Invalid letters. Use a-j only.');
      return;
    }
    if (indices.length !== 3) {
      setFeedback('Please enter exactly 3 letters');
      return;
    }
    setSelectedBlocks(indices);
    handleSubmit();
  };

  const endGame = async (finalScore: number) => {
    setGameOver(true);
    
    if (authState.user) {
      try {
        await supabase
          .from('leaderboards')
          .insert({
            user_id: authState.user.id,
            score: finalScore,
            rounds_completed: currentRound
          });
      } catch (error) {
        console.error('Error saving score:', error);
      }
    }
  };

  const resetGame = () => {
    setCurrentRound(1);
    setScore(0);
    setGameOver(false);
    setCorrectCombinations([]);
    generateNewPyramid();
  };

  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4 relative">
        <BackButton onClick={() => navigate('/home')} />
        
        <Card className="w-full max-w-md bg-gray-800 border-yellow-500 border-2">
          <CardHeader className="bg-gradient-to-r from-yellow-600 to-yellow-500 text-black">
            <CardTitle className="text-center text-2xl font-bold">Game Over!</CardTitle>
          </CardHeader>
          <CardContent className="p-6 text-center space-y-4">
            <div className="text-white">
              <div className="text-3xl font-bold text-green-400 mb-2">{score}</div>
              <div className="text-lg">Final Score</div>
              <div className="text-gray-300">Rounds Completed: {currentRound - 1}</div>
            </div>
            <div className="space-y-2">
              <Button 
                onClick={resetGame}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                Play Again
              </Button>
              <Button 
                onClick={() => navigate('/leaderboards')}
                variant="outline"
                className="w-full border-yellow-500 text-yellow-400 hover:bg-yellow-500/10"
              >
                View Leaderboards
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-2 relative">
      <BackButton onClick={() => navigate('/home')} />
      
      <div className="max-w-6xl mx-auto pt-12">
        {/* Mobile Layout */}
        <div className="lg:hidden space-y-3">
          {/* Game Stats - Mobile */}
          <div className="grid grid-cols-3 gap-2">
            <Card className="bg-gray-800 border-blue-500">
              <CardContent className="p-2 text-center">
                <div className="text-blue-400 text-xs font-semibold">Round</div>
                <div className="text-white text-lg font-bold">{currentRound}/10</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800 border-green-500">
              <CardContent className="p-2 text-center">
                <div className="text-green-400 text-xs font-semibold">Score</div>
                <div className="text-white text-lg font-bold">{score}</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800 border-yellow-500 relative">
              <CardContent className="p-2 text-center">
                <div className="text-yellow-400 text-xs font-semibold flex items-center justify-center">
                  <Target size={12} className="mr-1" />
                  Target
                </div>
                <div className="text-white text-lg font-bold">{targetNumber}</div>
              </CardContent>
              <Button
                onClick={generateNewPyramid}
                size="icon"
                variant="ghost"
                className="absolute -top-1 -right-1 h-6 w-6 bg-gray-700 hover:bg-gray-600 text-yellow-400"
              >
                <RefreshCw size={12} />
              </Button>
            </Card>
          </div>

          {/* Correct Combinations - Mobile Top */}
          <CorrectCombinations combinations={correctCombinations} />

          {/* Pyramid Grid - Mobile */}
          <Card className="bg-gray-800 border-purple-500">
            <CardContent className="p-3">
              <PyramidGrid
                blocks={blocks}
                selectedBlocks={selectedBlocks}
                onBlockClick={handleBlockClick}
              />
            </CardContent>
          </Card>

          {/* Controls - Mobile */}
          <Card className="bg-gray-800 border-gray-600">
            <CardContent className="p-3 space-y-3">
              <div className="flex gap-2">
                <Input
                  value={letterInput}
                  onChange={(e) => setLetterInput(e.target.value)}
                  placeholder="Enter 3 letters"
                  className="bg-gray-700 text-white border-gray-600 text-center text-sm"
                  maxLength={3}
                />
                <Button
                  onClick={handleLetterSubmit}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 text-sm"
                >
                  Submit
                </Button>
              </div>
              
              <Button
                onClick={handleSubmit}
                disabled={selectedBlocks.length !== 3}
                className="w-full bg-green-600 hover:bg-green-700 text-white text-sm"
              >
                Submit Selection ({selectedBlocks.length}/3)
              </Button>

              {feedback && (
                <div className={`text-center font-semibold text-sm ${
                  feedback.includes('Correct') ? 'text-green-400' : 'text-red-400'
                }`}>
                  {feedback}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:grid lg:grid-cols-4 gap-4">
          {/* Game Area */}
          <div className="lg:col-span-3 space-y-4">
            {/* Game Stats */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="bg-gray-800 border-blue-500">
                <CardContent className="p-3 text-center">
                  <div className="text-blue-400 text-sm font-semibold">Round</div>
                  <div className="text-white text-xl font-bold">{currentRound}/10</div>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-800 border-green-500">
                <CardContent className="p-3 text-center">
                  <div className="text-green-400 text-sm font-semibold">Score</div>
                  <div className="text-white text-xl font-bold">{score}</div>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-800 border-yellow-500 relative">
                <CardContent className="p-3 text-center">
                  <div className="text-yellow-400 text-sm font-semibold flex items-center justify-center">
                    <Target size={16} className="mr-1" />
                    Target
                  </div>
                  <div className="text-white text-xl font-bold">{targetNumber}</div>
                </CardContent>
                <Button
                  onClick={generateNewPyramid}
                  size="icon"
                  variant="ghost"
                  className="absolute -top-2 -right-2 h-8 w-8 bg-gray-700 hover:bg-gray-600 text-yellow-400"
                >
                  <RefreshCw size={16} />
                </Button>
              </Card>
            </div>

            {/* Pyramid Grid */}
            <Card className="bg-gray-800 border-purple-500">
              <CardContent className="p-6">
                <PyramidGrid
                  blocks={blocks}
                  selectedBlocks={selectedBlocks}
                  onBlockClick={handleBlockClick}
                />
              </CardContent>
            </Card>

            {/* Controls */}
            <Card className="bg-gray-800 border-gray-600">
              <CardContent className="p-4 space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={letterInput}
                    onChange={(e) => setLetterInput(e.target.value)}
                    placeholder="Enter 3 letters (e.g., abc)"
                    className="bg-gray-700 text-white border-gray-600 text-center"
                    maxLength={3}
                  />
                  <Button
                    onClick={handleLetterSubmit}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6"
                  >
                    Submit Letters
                  </Button>
                </div>
                
                <Button
                  onClick={handleSubmit}
                  disabled={selectedBlocks.length !== 3}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  Submit Selection ({selectedBlocks.length}/3)
                </Button>

                {feedback && (
                  <div className={`text-center font-semibold ${
                    feedback.includes('Correct') ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {feedback}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Correct Combinations Sidebar */}
          <div className="lg:col-span-1">
            <CorrectCombinations combinations={correctCombinations} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameScreen;
