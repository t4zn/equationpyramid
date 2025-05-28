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
import { Target, Crown, Users, Timer } from 'lucide-react';

interface Player {
  id: string;
  username: string;
  score: number;
  isCurrentPlayer?: boolean;
}

interface MultiplayerGameScreenProps {
  gameMode: 'local' | 'online';
  playerCount: number;
  roomId?: string;
}

const MultiplayerGameScreen: React.FC<MultiplayerGameScreenProps> = ({ 
  gameMode, 
  playerCount,
  roomId
}) => {
  const navigate = useNavigate();
  const { authState } = useAuth();
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [targetNumber, setTargetNumber] = useState(0);
  const [selectedBlocks, setSelectedBlocks] = useState<number[]>([]);
  const [currentRound, setCurrentRound] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [letterInput, setLetterInput] = useState('');
  const [feedback, setFeedback] = useState('');
  const [allPlayersCombinations, setAllPlayersCombinations] = useState<{ username: string; combination: string }[]>([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes in seconds
  const [timerActive, setTimerActive] = useState(true);

  // Create mock players for demonstration
  const [players] = useState<Player[]>(() => {
    const mockPlayers: Player[] = [];
    for (let i = 0; i < playerCount; i++) {
      mockPlayers.push({
        id: i === 0 && authState.user ? authState.user.id : `player-${i}`,
        username: i === 0 && authState.user?.username ? authState.user.username : `Player ${i + 1}`,
        score: 0
      });
    }
    return mockPlayers;
  });

  useEffect(() => {
    generateNewPyramid();
  }, []);

  // Timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (timerActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setTimerActive(false);
            setGameOver(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [timerActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

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

    const currentPlayer = players[currentPlayerIndex];
    
    if (result.result === targetNumber) {
      setAllPlayersCombinations([
        ...allPlayersCombinations, 
        { username: currentPlayer.username, combination: result.equation || '' }
      ]);
      
      players[currentPlayerIndex].score += (10 * currentRound);
      
      setFeedback(`${currentPlayer.username} scored! +${10 * currentRound} points`);
      
      setTimeout(() => {
        if (currentRound >= 10) {
          setGameOver(true);
        } else {
          setCurrentRound(currentRound + 1);
          generateNewPyramid();
        }
      }, 1500);
    } else {
      setFeedback(`${currentPlayer.username}: Got ${result.result}, needed ${targetNumber}`);
      
      setTimeout(() => {
        setCurrentPlayerIndex((currentPlayerIndex + 1) % players.length);
        setSelectedBlocks([]);
        setLetterInput('');
        setFeedback('');
      }, 1000);
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

  const resetGame = () => {
    setCurrentRound(1);
    setGameOver(false);
    setAllPlayersCombinations([]);
    setCurrentPlayerIndex(0);
    setTimeLeft(120);
    setTimerActive(true);
    players.forEach(player => player.score = 0);
    generateNewPyramid();
  };

  const getWinner = () => {
    return players.reduce((prev, current) => 
      prev.score > current.score ? prev : current
    );
  };

  if (gameOver) {
    const winner = getWinner();
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4 relative">
        <BackButton onClick={() => navigate('/multiplayer')} />
        
        <Card className="w-full max-w-md bg-gray-800 border-yellow-500 border-2">
          <CardHeader className="bg-gradient-to-r from-yellow-600 to-yellow-500 text-black">
            <CardTitle className="text-center text-2xl font-bold flex items-center justify-center">
              <Crown className="mr-2" size={24} />
              Game Over!
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 text-center space-y-4">
            <div className="text-white">
              <div className="text-2xl font-bold text-yellow-400 mb-2">{winner.username} Wins!</div>
              <div className="space-y-2">
                {players.map((player, index) => (
                  <div key={player.id} className={`flex justify-between ${
                    player.id === winner.id ? 'text-yellow-400 font-bold' : 'text-gray-300'
                  }`}>
                    <span>{player.username}</span>
                    <span>{player.score} points</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Button 
                onClick={resetGame}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                Play Again
              </Button>
              <Button 
                onClick={() => navigate('/multiplayer')}
                variant="outline"
                className="w-full border-purple-500 text-purple-400 hover:bg-purple-500/10"
              >
                Back to Multiplayer Menu
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentPlayer = players[currentPlayerIndex];
  const isMyTurn = gameMode === 'local' || currentPlayer?.id === authState.user?.id;

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-2 relative overflow-hidden">
      <BackButton onClick={() => navigate('/multiplayer')} />
      
      <div className="h-full max-w-6xl mx-auto pt-12 flex flex-col">
        {/* Mobile Layout */}
        <div className="lg:hidden flex flex-col h-full space-y-2">
          {/* Game Stats - Mobile */}
          <div className="grid grid-cols-3 gap-2">
            <Card className="bg-gray-800 border-blue-500">
              <CardContent className="p-2 text-center">
                <div className="text-blue-400 text-xs font-semibold">Round</div>
                <div className="text-white text-lg font-bold">{currentRound}/10</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800 border-yellow-500">
              <CardContent className="p-2 text-center">
                <div className="text-yellow-400 text-xs font-semibold flex items-center justify-center">
                  <Target size={12} className="mr-1" />
                  Target
                </div>
                <div className="text-white text-lg font-bold">{targetNumber}</div>
              </CardContent>
            </Card>

            <Card className={`bg-gray-800 ${timeLeft <= 30 ? 'border-red-500' : 'border-purple-500'}`}>
              <CardContent className="p-2 text-center">
                <div className="text-purple-400 text-xs font-semibold flex items-center justify-center">
                  <Timer size={12} className="mr-1" />
                  Time
                </div>
                <div className={`text-lg font-bold ${timeLeft <= 30 ? 'text-red-400' : 'text-white'}`}>
                  {formatTime(timeLeft)}
                </div>
              </CardContent>
            </Card>
          </div>

          {gameMode === 'online' && roomId && (
            <Card className="bg-gray-800 border-purple-500">
              <CardContent className="p-2 text-center">
                <div className="text-purple-400 text-xs font-semibold">Room Code</div>
                <div className="text-white text-lg font-bold">{roomId}</div>
              </CardContent>
            </Card>
          )}

          {/* Current Player Indicator - Mobile */}
          <Card className={`border-2 ${isMyTurn ? 'border-green-500 bg-green-900/20' : 'border-gray-600 bg-gray-800'}`}>
            <CardContent className="p-2 text-center">
              <div className={`text-sm font-bold ${isMyTurn ? 'text-green-400' : 'text-gray-300'}`}>
                {gameMode === 'local' ? `${currentPlayer?.username}'s Turn` : 
                 isMyTurn ? "Your Turn!" : `${currentPlayer?.username}'s Turn`}
              </div>
            </CardContent>
          </Card>

          {/* Players Scores - Mobile */}
          <div className="flex-1 min-h-0">
            <Card className="bg-gray-800 border-gray-600 h-full">
              <CardContent className="p-2">
                <div className="text-gray-400 text-xs font-semibold mb-2 flex items-center">
                  <Users size={12} className="mr-1" />
                  Players
                </div>
                <div className="space-y-1">
                  {players.map((player) => (
                    <div key={player.id} className={`flex justify-between items-center ${
                      player.id === currentPlayer?.id ? 'text-green-400' : 'text-gray-300'
                    }`}>
                      <span className="text-sm">{player.username}</span>
                      <span className="text-sm font-bold">{player.score}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Pyramid Grid - Mobile */}
          <Card className="bg-gray-800 border-purple-500">
            <CardContent className="p-2">
              <PyramidGrid
                blocks={blocks}
                selectedBlocks={selectedBlocks}
                onBlockClick={handleBlockClick}
              />
            </CardContent>
          </Card>

          {/* Controls - Mobile */}
          {isMyTurn && (
            <Card className="bg-gray-800 border-gray-600">
              <CardContent className="p-2 space-y-2">
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
                    feedback.includes('scored') ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {feedback}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Desktop Layout - keep existing desktop code structure */}
        <div className="hidden lg:grid lg:grid-cols-4 gap-4">
          {/* Desktop game area - keeping existing structure but with proper responsive design */}
          <div className="lg:col-span-3 space-y-4">
            {/* Game Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <Card className="bg-gray-800 border-blue-500">
                <CardContent className="p-3 text-center">
                  <div className="text-blue-400 text-sm font-semibold">Round</div>
                  <div className="text-white text-xl font-bold">{currentRound}/10</div>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-800 border-yellow-500">
                <CardContent className="p-3 text-center">
                  <div className="text-yellow-400 text-sm font-semibold flex items-center justify-center">
                    <Target size={16} className="mr-1" />
                    Target
                  </div>
                  <div className="text-white text-xl font-bold">{targetNumber}</div>
                </CardContent>
              </Card>

              {gameMode === 'online' && roomId && (
                <Card className="bg-gray-800 border-purple-500 sm:col-span-2">
                  <CardContent className="p-3 text-center">
                    <div className="text-purple-400 text-sm font-semibold">Room Code</div>
                    <div className="text-white text-lg font-bold">{roomId}</div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Current Player Indicator */}
            <Card className={`border-2 ${isMyTurn ? 'border-green-500 bg-green-900/20' : 'border-gray-600 bg-gray-800'}`}>
              <CardContent className="p-4 text-center">
                <div className={`text-lg font-bold ${isMyTurn ? 'text-green-400' : 'text-gray-300'}`}>
                  {isMyTurn ? "Your Turn!" : `${currentPlayer?.username}'s Turn`}
                </div>
              </CardContent>
            </Card>

            {/* Players Scores */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {players.map((player, index) => (
                <Card key={player.id} className={`bg-gray-800 border-2 ${
                  index === currentPlayerIndex ? 'border-green-500' : 'border-gray-600'
                }`}>
                  <CardContent className="p-3 text-center">
                    <div className="text-gray-300 text-sm font-semibold flex items-center justify-center">
                      <Users size={16} className="mr-1" />
                      {player.username}
                    </div>
                    <div className="text-white text-xl font-bold">{player.score}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pyramid Grid */}
            <Card className="bg-gray-800 border-purple-500">
              <CardContent className="p-4 sm:p-6">
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
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input
                    value={letterInput}
                    onChange={(e) => setLetterInput(e.target.value)}
                    placeholder="Enter 3 letters (e.g., abc)"
                    className="bg-gray-700 text-white border-gray-600 text-center"
                    maxLength={3}
                    disabled={!isMyTurn}
                  />
                  <Button
                    onClick={handleLetterSubmit}
                    disabled={!isMyTurn}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6"
                  >
                    Submit Letters
                  </Button>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    onClick={handleSubmit}
                    disabled={selectedBlocks.length !== 3 || !isMyTurn}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  >
                    Submit Selection ({selectedBlocks.length}/3)
                  </Button>
                </div>

                {feedback && (
                  <div className={`text-center font-semibold ${
                    feedback.includes('scored') ? 'text-green-400' : 
                    feedback.includes('Wait') ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {feedback}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Correct Combinations Sidebar */}
          <div className="lg:col-span-1">
            <CorrectCombinations 
              combinations={[]} 
              isMultiplayer={true}
              allPlayersCombinations={allPlayersCombinations}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiplayerGameScreen;
