import React, { useState, useEffect } from 'react';
import { PyramidGrid } from './PyramidGrid';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { GameState } from '../types/game';
import { generatePyramid, evaluateEquation, parseLetterInput, findValidCombinations } from '../utils/pyramidGenerator';
import { toast } from '@/hooks/use-toast';

export const GameScreen: React.FC = () => {
  const { authState } = useAuth();
  const navigate = useNavigate();
  
  const [gameState, setGameState] = useState<GameState>({
    blocks: [],
    targetNumber: 0,
    selectedBlocks: [],
    currentEquation: '',
    score: 0,
    timeRemaining: 120,
    gameStatus: 'playing',
    round: 1,
    inputValue: '',
    history: []
  });

  const [correctCombinations, setCorrectCombinations] = useState<number[][]>([]);
  const [foundCombinations, setFoundCombinations] = useState<number[][]>([]);

  useEffect(() => {
    if (!authState.user && !authState.loading) {
      navigate('/login');
    }
  }, [authState.user, authState.loading, navigate]);

  const initializeGame = () => {
    const { blocks, targetNumber } = generatePyramid();
    const validCombinations = findValidCombinations(blocks, targetNumber);
    
    if (validCombinations.length === 0) {
      initializeGame();
      return;
    }
    
    setGameState(prev => ({
      ...prev,
      blocks,
      targetNumber,
      selectedBlocks: [],
      currentEquation: '',
      timeRemaining: 120,
      inputValue: '',
      history: []
    }));
    
    setCorrectCombinations(validCombinations);
    setFoundCombinations([]);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    if (gameState.timeRemaining > 0 && gameState.gameStatus === 'playing') {
      const timer = setTimeout(() => {
        setGameState(prev => ({
          ...prev,
          timeRemaining: prev.timeRemaining - 1
        }));
      }, 1000);
      return () => clearTimeout(timer);
    } else if (gameState.timeRemaining === 0) {
      setGameState(prev => ({ ...prev, gameStatus: 'completed' }));
      toast({
        title: "Time's up!",
        description: `Final score: ${gameState.score}`,
        variant: "destructive"
      });
      
      if (authState.user) {
        saveScore();
      }
    }
  }, [gameState.timeRemaining, gameState.gameStatus]);

  const saveScore = async () => {
    if (!authState.user) return;
    
    try {
      await supabase.from('leaderboards').insert({
        user_id: authState.user.id,
        score: gameState.score,
        rounds_completed: gameState.round - 1
      });
      
      toast({
        title: "Score saved",
        description: "Your score has been saved to the leaderboard",
      });
    } catch (error) {
      console.error('Error saving score:', error);
      toast({
        title: "Failed to save score",
        description: "There was an error saving your score",
        variant: "destructive"
      });
    }
  };

  const handleBlockClick = (index: number) => {
    if (gameState.gameStatus !== 'playing') return;
    
    setGameState(prev => {
      const newSelected = [...prev.selectedBlocks];
      
      if (newSelected.includes(index)) {
        const indexToRemove = newSelected.indexOf(index);
        newSelected.splice(indexToRemove, 1);
      } else if (newSelected.length < 3) {
        newSelected.push(index);
      } else {
        newSelected.shift();
        newSelected.push(index);
      }
      
      const inputValue = newSelected.map(i => prev.blocks[i].label).join('');
      
      return { 
        ...prev, 
        selectedBlocks: newSelected,
        inputValue
      };
    });
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    
    setGameState(prev => {
      const selectedIndices = parseLetterInput(value, prev.blocks);
      const validIndices = selectedIndices.filter(index => index !== -1);
      
      return {
        ...prev,
        inputValue: value,
        selectedBlocks: validIndices
      };
    });
  };

  const submitEquation = () => {
    if (gameState.selectedBlocks.length !== 3) {
      toast({
        title: "Invalid selection",
        description: "Please select exactly 3 blocks",
        variant: "destructive"
      });
      return;
    }

    const result = evaluateEquation(gameState.selectedBlocks, gameState.blocks);
    
    if (!result.isValid) {
      toast({
        title: "Invalid equation",
        description: result.message,
        variant: "destructive"
      });
      
      setGameState(prev => ({ 
        ...prev, 
        score: Math.max(0, prev.score - 5),
        selectedBlocks: [],
        inputValue: '',
        history: [
          ...prev.history,
          {
            equation: result.equation || 'Invalid',
            result: result.result || 0,
            success: false
          }
        ]
      }));
      return;
    }

    if (result.result === gameState.targetNumber) {
      const combinationExists = foundCombinations.some(combo => 
        combo.length === gameState.selectedBlocks.length &&
        combo.every(val => gameState.selectedBlocks.includes(val))
      );
      
      if (combinationExists) {
        toast({
          title: "Already Found!",
          description: "You've already discovered this combination.",
          variant: "destructive"
        });
        
        setGameState(prev => ({ 
          ...prev, 
          selectedBlocks: [],
          inputValue: ''
        }));
        return;
      }
      
      const timeBonus = Math.floor(gameState.timeRemaining / 6);
      const totalPoints = 10 + timeBonus;
      
      setFoundCombinations(prev => [...prev, [...gameState.selectedBlocks]]);
      
      toast({
        title: "Correct!",
        description: `+${totalPoints} points! ${result.equation}`,
        variant: "default"
      });
      
      setGameState(prev => ({ 
        ...prev, 
        score: prev.score + totalPoints,
        selectedBlocks: [],
        inputValue: '',
        history: [
          ...prev.history,
          {
            equation: result.equation || '',
            result: result.result || 0,
            success: true
          }
        ]
      }));
      
      if (foundCombinations.length + 1 >= correctCombinations.length) {
        toast({
          title: "All combinations found!",
          description: "Amazing! You found them all. New puzzle loading...",
        });
        
        setTimeout(() => {
          setGameState(prev => ({ ...prev, round: prev.round + 1 }));
          initializeGame();
        }, 2000);
      }
    } else {
      toast({
        title: "Incorrect",
        description: `${result.equation} ≠ ${gameState.targetNumber}`,
        variant: "destructive"
      });
      
      setGameState(prev => ({ 
        ...prev, 
        score: Math.max(0, prev.score - 5),
        selectedBlocks: [],
        inputValue: '',
        history: [
          ...prev.history,
          {
            equation: result.equation || '',
            result: result.result || 0,
            success: false
          }
        ]
      }));
    }
  };

  const resetGame = () => {
    setGameState(prev => ({
      ...prev,
      score: 0,
      round: 1,
      gameStatus: 'playing',
      selectedBlocks: [],
      inputValue: '',
      history: []
    }));
    setFoundCombinations([]);
    initializeGame();
  };
  
  const nextPuzzle = () => {
    setGameState(prev => ({ ...prev, round: prev.round + 1 }));
    initializeGame();
  };

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-2 flex flex-col overflow-hidden"
      style={{
        backgroundImage: "linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.9)), url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><rect width=\"100\" height=\"100\" fill=\"%23111827\"/><circle cx=\"20\" cy=\"20\" r=\"2\" fill=\"%23fbbf24\" opacity=\"0.6\"/><circle cx=\"80\" cy=\"40\" r=\"1.5\" fill=\"%23fbbf24\" opacity=\"0.4\"/><circle cx=\"40\" cy=\"80\" r=\"2\" fill=\"%23fbbf24\" opacity=\"0.5\"/></svg>')"
      }}
    >
      {/* Game Over Screen - Fixed positioning */}
      {gameState.gameStatus === 'completed' && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
          <Card className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-2 border-yellow-400 shadow-2xl max-w-md w-full">
            <div className="text-center text-white p-8">
              <h2 className="text-4xl font-bold text-yellow-400 mb-6">🏁 Game Over! 🏁</h2>
              <div className="text-2xl mb-3">Final Score: <span className="font-bold text-green-400">{gameState.score}</span></div>
              <div className="text-xl mb-8">Rounds Completed: <span className="font-bold text-blue-400">{gameState.round - 1}</span></div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={resetGame} className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 hover:from-yellow-300 hover:to-yellow-400 px-8 py-3 text-lg font-semibold">
                  🎮 Play Again
                </Button>
                <Button onClick={() => navigate('/home')} variant="outline" className="border-2 border-gray-400 text-gray-400 hover:bg-gray-700 px-8 py-3 text-lg">
                  🏠 Back to Home
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Main Game Content - Only show when game is not completed */}
      {gameState.gameStatus !== 'completed' && (
        <div className="flex-1 flex flex-col h-screen max-h-screen">
          {/* Compact Header */}
          <div className="mb-2">
            <div className="grid grid-cols-4 gap-1 text-white text-xs mb-2">
              <div className="text-center">
                <div className="text-gray-300">Score</div>
                <div className="text-lg font-bold text-green-400">{gameState.score}</div>
              </div>
              <div className="text-center">
                <div className="text-gray-300">Round</div>
                <div className="text-lg font-bold text-blue-400">{gameState.round}</div>
              </div>
              <div className="text-center">
                <div className="text-gray-300">Time</div>
                <div className={`text-lg font-bold ${gameState.timeRemaining <= 30 ? 'text-red-400' : 'text-white'}`}>
                  {Math.floor(gameState.timeRemaining / 60)}:{(gameState.timeRemaining % 60).toString().padStart(2, '0')}
                </div>
              </div>
              <div className="text-center">
                <div className="text-gray-300">Found</div>
                <div className="text-lg font-bold text-purple-400">
                  {foundCombinations.length}/{correctCombinations.length}
                </div>
              </div>
            </div>

            {/* Target Number */}
            <Card className="mb-2 p-3 bg-gradient-to-r from-yellow-500 to-yellow-600 border-2 border-yellow-400">
              <div className="text-center">
                <div className="text-sm font-bold text-gray-800">🎯 TARGET 🎯</div>
                <div className="text-3xl font-bold text-gray-900">{gameState.targetNumber}</div>
              </div>
            </Card>
          </div>

          {/* Pyramid - Compact */}
          <div className="flex-1 flex justify-center items-start mb-2">
            <div className="scale-[0.7] -my-6">
              <PyramidGrid
                blocks={gameState.blocks}
                selectedBlocks={gameState.selectedBlocks}
                onBlockClick={handleBlockClick}
              />
            </div>
          </div>

          {/* Input and Submit */}
          <div className="mb-2">
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Enter letters (abc)"
                value={gameState.inputValue}
                onChange={handleInputChange}
                maxLength={3}
                className="bg-gray-700 text-white border-2 border-yellow-500 focus:border-yellow-400 text-center text-lg h-10"
                disabled={gameState.gameStatus !== 'playing'}
              />
              <Button
                onClick={submitEquation}
                disabled={gameState.selectedBlocks.length !== 3 || gameState.gameStatus !== 'playing'}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-4 h-10"
              >
                Submit
              </Button>
            </div>
          </div>

          {/* Selected Equation Preview */}
          {gameState.selectedBlocks.length > 0 && (
            <Card className="mb-2 p-2 bg-gray-800 border-gray-600">
              <div className="text-center text-white">
                <div className="text-xs text-gray-300">Selected:</div>
                <div className="text-sm font-mono">
                  {gameState.selectedBlocks.map((index, i) => (
                    <span key={index}>
                      {gameState.blocks[index]?.label}({gameState.blocks[index]?.value})
                      {i < gameState.selectedBlocks.length - 1 ? ' + ' : ''}
                    </span>
                  ))}
                  {gameState.selectedBlocks.length === 3 && ' = ?'}
                </div>
              </div>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-2 mb-2">
            <Button 
              onClick={() => setGameState(prev => ({ ...prev, selectedBlocks: [], inputValue: '' }))}
              variant="outline"
              className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-gray-900 flex-1 h-8 text-sm"
            >
              Clear
            </Button>
            <Button
              onClick={nextPuzzle}
              variant="outline"
              className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-gray-900 flex-1 h-8 text-sm"
            >
              Next
            </Button>
            <Button
              onClick={() => navigate('/home')}
              variant="outline"
              className="border-gray-400 text-gray-400 hover:bg-gray-700 flex-1 h-8 text-sm"
            >
              Home
            </Button>
          </div>

          {/* Found Combinations - Compact */}
          {foundCombinations.length > 0 && (
            <Card className="p-2 bg-gray-800 border-gray-600">
              <div className="text-white">
                <div className="text-xs text-gray-300 mb-1">✅ Found:</div>
                <div className="grid grid-cols-4 gap-1">
                  {foundCombinations.map((combo, i) => (
                    <div key={i} className="text-xs text-green-400 font-mono bg-green-900/50 px-1 py-0.5 rounded text-center">
                      {combo.map(index => gameState.blocks[index]?.label).join('')}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};
