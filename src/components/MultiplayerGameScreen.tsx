
import React, { useState, useEffect } from 'react';
import { PyramidGrid } from './PyramidGrid';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { GameState } from '../types/game';
import { generatePyramid, evaluateEquation, parseLetterInput, findValidCombinations } from '../utils/pyramidGenerator';
import { toast } from '@/hooks/use-toast';

interface MultiplayerGameProps {
  gameMode: 'local' | 'online';
  playerCount: number;
  roomId?: string;
}

interface Player {
  id: string;
  name: string;
  score: number;
  isCurrentUser?: boolean;
}

export const MultiplayerGameScreen: React.FC<MultiplayerGameProps> = ({ 
  gameMode, 
  playerCount, 
  roomId 
}) => {
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

  const [players, setPlayers] = useState<Player[]>([]);
  const [correctCombinations, setCorrectCombinations] = useState<number[][]>([]);
  const [foundCombinations, setFoundCombinations] = useState<number[][]>([]);

  useEffect(() => {
    // Initialize players based on actual playerCount
    const initialPlayers: Player[] = [];
    for (let i = 0; i < playerCount; i++) {
      initialPlayers.push({
        id: `player_${i}`,
        name: gameMode === 'local' ? `Player ${i + 1}` : `Player ${i + 1}`,
        score: 0,
        isCurrentUser: i === 0 // First player is current user for simplicity
      });
    }
    setPlayers(initialPlayers);
    initializeGame();
  }, [playerCount]);

  const initializeGame = () => {
    const { blocks, targetNumber } = generatePyramid();
    const validCombinations = findValidCombinations(blocks, targetNumber);
    
    // Limit combinations to maximum 4
    const limitedCombinations = validCombinations.slice(0, 4);
    
    if (limitedCombinations.length === 0) {
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
    
    setCorrectCombinations(limitedCombinations);
    setFoundCombinations([]);
  };

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
      endGame();
    }
  }, [gameState.timeRemaining, gameState.gameStatus]);

  const endGame = () => {
    setGameState(prev => ({ ...prev, gameStatus: 'completed' }));
    
    // Find winner
    const winner = players.reduce((prev, current) => 
      prev.score > current.score ? prev : current
    );
    
    toast({
      title: "Game Over!",
      description: `Winner: ${winner.name} with ${winner.score} points!`,
    });
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
      // Check if this combination was already found
      const combinationExists = foundCombinations.some(combo => 
        combo.length === gameState.selectedBlocks.length &&
        combo.every(val => gameState.selectedBlocks.includes(val))
      );
      
      if (combinationExists) {
        toast({
          title: "Already Found!",
          description: "This combination was already discovered.",
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
      
      // Add to found combinations
      setFoundCombinations(prev => [...prev, [...gameState.selectedBlocks]]);
      
      // Update current user's score (first player for local multiplayer)
      setPlayers(prev => prev.map((player, index) => 
        player.isCurrentUser || index === 0
          ? { ...player, score: player.score + totalPoints }
          : player
      ));
      
      toast({
        title: "Correct!",
        description: `+${totalPoints} points! ${result.equation}`,
        variant: "default"
      });
      
      setGameState(prev => ({ 
        ...prev, 
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
      
      // Check if all combinations found
      if (foundCombinations.length + 1 >= correctCombinations.length) {
        toast({
          title: "All combinations found!",
          description: "Moving to next round...",
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

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center p-4"
      style={{
        backgroundImage: "linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.9)), url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><rect width=\"100\" height=\"100\" fill=\"%231a1a2e\"/><circle cx=\"20\" cy=\"20\" r=\"2\" fill=\"%23ffd700\" opacity=\"0.6\"/><circle cx=\"80\" cy=\"40\" r=\"1.5\" fill=\"%23ffd700\" opacity=\"0.4\"/><circle cx=\"40\" cy=\"80\" r=\"2\" fill=\"%23ffd700\" opacity=\"0.5\"/></svg>')"
      }}
    >
      {/* Game Over Screen */}
      {gameState.gameStatus === 'completed' && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
          <Card className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-2 border-yellow-400 shadow-2xl max-w-md w-full">
            <div className="text-center text-white p-8">
              <h2 className="text-4xl font-bold text-yellow-400 mb-6">🏁 Game Over! 🏁</h2>
              <div className="space-y-3 mb-6">
                {players.map((player, index) => (
                  <div key={player.id} className="flex justify-between items-center">
                    <span className="text-lg">{player.name}:</span>
                    <span className="text-xl font-bold text-green-400">{player.score} pts</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-4">
                <Button 
                  onClick={() => navigate('/multiplayer')} 
                  className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 hover:from-yellow-300 hover:to-yellow-400 px-8 py-3 text-lg font-semibold"
                >
                  🏠 Back to Multiplayer
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Main Game Content */}
      {gameState.gameStatus !== 'completed' && (
        <>
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-yellow-400 mb-4">Real-Time Multiplayer Challenge</h1>
            
            {/* Player Scores - Real-time display */}
            <div className={`grid gap-4 mb-4 ${playerCount === 2 ? 'grid-cols-2' : playerCount === 3 ? 'grid-cols-3' : 'grid-cols-2 md:grid-cols-4'}`}>
              {players.map((player) => (
                <Card key={player.id} className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 border-blue-500">
                  <div className="text-center text-white">
                    <div className="text-sm font-semibold">{player.name}</div>
                    <div className="text-xl font-bold">{player.score}</div>
                  </div>
                </Card>
              ))}
            </div>
            
            <div className="flex justify-center space-x-6 text-white">
              <div className="text-center">
                <div className="text-sm text-gray-300">Round</div>
                <div className="text-xl font-bold">{gameState.round}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-300">Time</div>
                <div className={`text-xl font-bold ${gameState.timeRemaining <= 30 ? 'text-red-400' : ''}`}>
                  {Math.floor(gameState.timeRemaining / 60)}:{(gameState.timeRemaining % 60).toString().padStart(2, '0')}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-300">Combinations</div>
                <div className="text-xl font-bold text-green-400">
                  {foundCombinations.length}/{correctCombinations.length}
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

          {/* Letter Input */}
          <div className="w-full max-w-md mb-4">
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Enter block letters (e.g., 'abc')"
                value={gameState.inputValue}
                onChange={handleInputChange}
                maxLength={3}
                className="bg-gray-700 text-white border-yellow-500 focus:border-yellow-400"
                disabled={gameState.gameStatus !== 'playing'}
              />
              <Button
                onClick={submitEquation}
                disabled={gameState.selectedBlocks.length !== 3 || gameState.gameStatus !== 'playing'}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Submit
              </Button>
            </div>
          </div>

          {/* Selected Equation Preview */}
          {gameState.selectedBlocks.length > 0 && (
            <Card className="mb-4 p-3 bg-gray-800 border-gray-600 w-full max-w-md">
              <div className="text-center text-white">
                <div className="text-sm text-gray-300">Selected Equation:</div>
                <div className="text-lg font-mono">
                  {gameState.selectedBlocks.map((index, i) => (
                    <span key={index}>
                      {gameState.blocks[index]?.label}({gameState.blocks[index]?.value})
                      {i < gameState.selectedBlocks.length - 1 ? ' ' : ''}
                    </span>
                  ))}
                  {gameState.selectedBlocks.length === 3 && ' = ?'}
                </div>
              </div>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-4 mb-4">
            <Button 
              onClick={() => setGameState(prev => ({ ...prev, selectedBlocks: [], inputValue: '' }))}
              variant="outline"
              className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-gray-900"
            >
              Clear Selection
            </Button>
          </div>
          
          <Button
            onClick={() => navigate('/multiplayer')}
            variant="outline"
            className="border-gray-400 text-gray-400 hover:bg-gray-700"
          >
            Back to Multiplayer Menu
          </Button>

          {/* Found Combinations */}
          {foundCombinations.length > 0 && (
            <Card className="mt-4 p-3 bg-gray-800 border-gray-600 w-full max-w-md">
              <div className="text-white">
                <div className="text-sm text-gray-300 mb-2">Found Combinations:</div>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {foundCombinations.map((combo, i) => (
                    <div key={i} className="text-sm text-green-400 font-mono">
                      {combo.map(index => gameState.blocks[index]?.label).join('')}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
};
