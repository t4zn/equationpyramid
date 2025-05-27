
import React, { useState, useEffect } from 'react';
import { PyramidGrid } from './PyramidGrid';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
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
    const initialPlayers: Player[] = [];
    for (let i = 0; i < playerCount; i++) {
      initialPlayers.push({
        id: `player_${i}`,
        name: `Player ${i + 1}`,
        score: 0,
        isCurrentUser: i === 0
      });
    }
    setPlayers(initialPlayers);
    initializeGame();
  }, [playerCount]);

  const initializeGame = () => {
    const { blocks, targetNumber } = generatePyramid();
    const validCombinations = findValidCombinations(blocks, targetNumber);
    
    // Limit to maximum 4 combinations
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
      
      setFoundCombinations(prev => [...prev, [...gameState.selectedBlocks]]);
      
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-3 flex flex-col">
      {/* Game Over Screen */}
      {gameState.gameStatus === 'completed' && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
          <Card className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-2 border-yellow-400 shadow-2xl max-w-md w-full">
            <div className="text-center text-white p-6">
              <h2 className="text-3xl font-bold text-yellow-400 mb-4">🏁 Game Over! 🏁</h2>
              <div className="space-y-2 mb-4">
                {players.map((player, index) => (
                  <div key={player.id} className="flex justify-between items-center">
                    <span className="text-lg">{player.name}:</span>
                    <span className="text-xl font-bold text-green-400">{player.score} pts</span>
                  </div>
                ))}
              </div>
              <Button 
                onClick={() => navigate('/multiplayer')} 
                className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 hover:from-yellow-300 hover:to-yellow-400 px-6 py-2 text-lg font-semibold w-full"
              >
                🏠 Back to Multiplayer
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Main Game Content */}
      {gameState.gameStatus !== 'completed' && (
        <>
          {/* Room Code Display */}
          {roomId && (
            <Card className="mb-3 p-2 bg-gradient-to-r from-purple-600 to-purple-700 border-purple-500 shadow-lg">
              <div className="text-center text-white">
                <div className="text-xs font-semibold">Room Code</div>
                <div className="text-lg font-bold tracking-wider">{roomId}</div>
              </div>
            </Card>
          )}

          {/* Header with Player Scores */}
          <div className="text-center mb-3">
            <h1 className="text-xl font-bold text-yellow-400 mb-2">Multiplayer Challenge</h1>
            
            <div className={`grid gap-2 mb-3 ${playerCount <= 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
              {players.map((player) => (
                <Card key={player.id} className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 border-blue-500">
                  <div className="text-center text-white">
                    <div className="text-xs font-semibold">{player.name}</div>
                    <div className="text-lg font-bold">{player.score}</div>
                  </div>
                </Card>
              ))}
            </div>
            
            <div className="flex justify-center space-x-4 text-white text-sm">
              <div className="text-center">
                <div className="text-xs text-gray-300">Round</div>
                <div className="text-lg font-bold">{gameState.round}</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-300">Time</div>
                <div className={`text-lg font-bold ${gameState.timeRemaining <= 30 ? 'text-red-400' : ''}`}>
                  {Math.floor(gameState.timeRemaining / 60)}:{(gameState.timeRemaining % 60).toString().padStart(2, '0')}
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-300">Found</div>
                <div className="text-lg font-bold text-green-400">
                  {foundCombinations.length}/{correctCombinations.length}
                </div>
              </div>
            </div>
          </div>

          {/* Target Number */}
          <Card className="mb-3 p-3 bg-gradient-to-r from-yellow-500 to-yellow-600 border-yellow-400 shadow-lg">
            <div className="text-center">
              <div className="text-sm font-bold text-gray-800">🎯 TARGET 🎯</div>
              <div className="text-3xl font-bold text-gray-900">{gameState.targetNumber}</div>
            </div>
          </Card>

          {/* Compact Pyramid */}
          <div className="mb-3 flex justify-center">
            <div className="scale-75 -my-4">
              <PyramidGrid
                blocks={gameState.blocks}
                selectedBlocks={gameState.selectedBlocks}
                onBlockClick={handleBlockClick}
              />
            </div>
          </div>

          {/* Input and Submit */}
          <div className="mb-3">
            <div className="flex items-center space-x-2">
              <Input
                placeholder="abc"
                value={gameState.inputValue}
                onChange={handleInputChange}
                maxLength={3}
                className="bg-gray-700 text-white border-yellow-500 focus:border-yellow-400 text-center text-lg"
                disabled={gameState.gameStatus !== 'playing'}
              />
              <Button
                onClick={submitEquation}
                disabled={gameState.selectedBlocks.length !== 3 || gameState.gameStatus !== 'playing'}
                className="bg-green-600 hover:bg-green-700 text-white px-4"
              >
                Submit
              </Button>
            </div>
          </div>

          {/* Selected Equation Preview */}
          {gameState.selectedBlocks.length > 0 && (
            <Card className="mb-3 p-2 bg-gray-800 border-gray-600">
              <div className="text-center text-white">
                <div className="text-xs text-gray-300">Selected:</div>
                <div className="text-sm font-mono">
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
          <div className="flex space-x-2 mb-3">
            <Button 
              onClick={() => setGameState(prev => ({ ...prev, selectedBlocks: [], inputValue: '' }))}
              variant="outline"
              className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-gray-900 flex-1"
            >
              Clear
            </Button>
            <Button
              onClick={() => navigate('/multiplayer')}
              variant="outline"
              className="border-gray-400 text-gray-400 hover:bg-gray-700 flex-1"
            >
              Back
            </Button>
          </div>

          {/* Found Combinations */}
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
        </>
      )}
    </div>
  );
};
