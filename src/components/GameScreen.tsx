
import React, { useState, useEffect } from 'react';
import { PyramidGrid } from './PyramidGrid';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { GameState } from '../types/game';
import { generatePyramid, evaluateEquation, findValidCombinations } from '../utils/pyramidGenerator';
import { toast } from '@/hooks/use-toast';

export const GameScreen: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    blocks: [],
    targetNumber: 0,
    selectedBlocks: [],
    currentEquation: '',
    score: 0,
    timeRemaining: 30,
    gameStatus: 'playing',
    round: 1
  });

  const initializeGame = () => {
    const { blocks, targetNumber } = generatePyramid();
    
    // Ensure there's at least one valid combination
    const validCombinations = findValidCombinations(blocks, targetNumber);
    
    if (validCombinations.length === 0) {
      // Regenerate if no valid combinations
      initializeGame();
      return;
    }
    
    setGameState(prev => ({
      ...prev,
      blocks,
      targetNumber,
      selectedBlocks: [],
      currentEquation: '',
      timeRemaining: 30
    }));
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
    }
  }, [gameState.timeRemaining, gameState.gameStatus]);

  const handleBlockClick = (index: number) => {
    if (gameState.gameStatus !== 'playing') return;
    
    setGameState(prev => {
      const newSelected = [...prev.selectedBlocks];
      
      if (newSelected.includes(index)) {
        // Remove block from selection
        const indexToRemove = newSelected.indexOf(index);
        newSelected.splice(indexToRemove, 1);
      } else if (newSelected.length < 3) {
        // Add block to selection
        newSelected.push(index);
      } else {
        // Replace first selected block
        newSelected.shift();
        newSelected.push(index);
      }
      
      return { ...prev, selectedBlocks: newSelected };
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
        selectedBlocks: []
      }));
      return;
    }

    if (result.result === gameState.targetNumber) {
      const timeBonus = Math.floor(gameState.timeRemaining / 6); // Up to 5 bonus points
      const totalPoints = 10 + timeBonus;
      
      toast({
        title: "Correct!",
        description: `+${totalPoints} points! ${result.equation}`,
        variant: "default"
      });
      
      setGameState(prev => ({ 
        ...prev, 
        score: prev.score + totalPoints,
        selectedBlocks: [],
        round: prev.round + 1
      }));
      
      // Generate new pyramid after a short delay
      setTimeout(() => {
        initializeGame();
      }, 1500);
    } else {
      toast({
        title: "Incorrect",
        description: `${result.equation} ≠ ${gameState.targetNumber}`,
        variant: "destructive"
      });
      
      setGameState(prev => ({ 
        ...prev, 
        score: Math.max(0, prev.score - 5),
        selectedBlocks: []
      }));
    }
  };

  const resetGame = () => {
    setGameState(prev => ({
      ...prev,
      score: 0,
      round: 1,
      gameStatus: 'playing',
      selectedBlocks: []
    }));
    initializeGame();
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center p-4"
      style={{
        backgroundImage: "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><rect width=\"100\" height=\"100\" fill=\"%23333\"/><circle cx=\"20\" cy=\"20\" r=\"1\" fill=\"%23444\"/><circle cx=\"80\" cy=\"40\" r=\"1\" fill=\"%23444\"/><circle cx=\"40\" cy=\"80\" r=\"1\" fill=\"%23444\"/></svg>')"
      }}
    >
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-yellow-400 mb-2">Equation Pyramid Challenge</h1>
        <div className="flex justify-center space-x-6 text-white">
          <div className="text-center">
            <div className="text-sm text-gray-300">Score</div>
            <div className="text-xl font-bold">{gameState.score}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-300">Round</div>
            <div className="text-xl font-bold">{gameState.round}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-300">Time</div>
            <div className={`text-xl font-bold ${gameState.timeRemaining <= 10 ? 'text-red-400' : ''}`}>
              {gameState.timeRemaining}s
            </div>
          </div>
        </div>
      </div>

      {/* Target Number */}
      <Card className="mb-6 p-4 bg-yellow-400 border-yellow-500">
        <div className="text-center">
          <div className="text-sm font-semibold text-gray-800">TARGET</div>
          <div className="text-3xl font-bold text-gray-900">{gameState.targetNumber}</div>
        </div>
      </Card>

      {/* Pyramid */}
      <div className="mb-6">
        <PyramidGrid
          blocks={gameState.blocks}
          selectedBlocks={gameState.selectedBlocks}
          onBlockClick={handleBlockClick}
        />
      </div>

      {/* Selected Equation Preview */}
      {gameState.selectedBlocks.length > 0 && (
        <Card className="mb-4 p-3 bg-gray-800 border-gray-600">
          <div className="text-center text-white">
            <div className="text-sm text-gray-300">Selected Equation:</div>
            <div className="text-lg font-mono">
              {gameState.selectedBlocks.map((index, i) => (
                <span key={index}>
                  {gameState.blocks[index]?.value}
                  {i < gameState.selectedBlocks.length - 1 ? ' ' : ''}
                </span>
              ))}
              {gameState.selectedBlocks.length === 3 && ' = ?'}
            </div>
          </div>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <Button 
          onClick={submitEquation}
          disabled={gameState.selectedBlocks.length !== 3 || gameState.gameStatus !== 'playing'}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2"
        >
          Submit Equation
        </Button>
        <Button 
          onClick={() => setGameState(prev => ({ ...prev, selectedBlocks: [] }))}
          variant="outline"
          className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-gray-900"
        >
          Clear Selection
        </Button>
      </div>

      {/* Game Over Screen */}
      {gameState.gameStatus === 'completed' && (
        <Card className="absolute inset-4 bg-gray-900 border-yellow-400 flex flex-col items-center justify-center">
          <div className="text-center text-white">
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">Game Over!</h2>
            <div className="text-lg mb-2">Final Score: <span className="font-bold">{gameState.score}</span></div>
            <div className="text-lg mb-6">Rounds Completed: <span className="font-bold">{gameState.round - 1}</span></div>
            <Button onClick={resetGame} className="bg-yellow-400 text-gray-900 hover:bg-yellow-500">
              Play Again
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};
