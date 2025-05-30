import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BackButton } from '@/components/BackButton';
import { OnlineMultiplayerGame } from '@/components/OnlineMultiplayerGame';
import { Wifi, Plus, Clock, Menu } from 'lucide-react';

// Placeholder types - replace with actual game logic types later
interface HexagonData {
  id: string;
  letter: string;
  value: string | number;
  status?: 'initial' | 'correct' | 'incorrect'; // Add status for color change
}

// Function to generate random hexagons (placeholder implementation)
const generateRandomHexagons = (): HexagonData[] => {
  const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  // Example values - replace with your actual number/operator generation logic
  const values = ['+1', '-1', '×2', '÷2', '+5', '-5', '×10', '÷10', '+3', '-3']; // Example values
  const newHexagons: HexagonData[] = letters.map(letter => ({
    id: letter,
    letter: letter,
    value: values[Math.floor(Math.random() * values.length)], // Random value
    status: 'initial',
  }));
  // Ensure 10 hexagons are generated
  while (newHexagons.length < 10) {
      const letter = String.fromCharCode(65 + newHexagons.length); // Generate next letter
      newHexagons.push({
          id: letter,
          letter: letter,
          value: values[Math.floor(Math.random() * values.length)],
          status: 'initial',
      });
  }
  return newHexagons.slice(0, 10); // Ensure exactly 10
};

// Function to generate a random target number (placeholder)
const generateRandomTarget = (): number => {
    // Generate a random target number within a reasonable range (e.g., 10 to 100)
    return Math.floor(Math.random() * 91) + 10; 
};

const OnlineMultiplayerPage = () => {
  const navigate = useNavigate();
  const [gameStarted, setGameStarted] = useState(false);
  const [roomId, setRoomId] = useState('');
  const [playerCount, setPlayerCount] = useState(2);
  const [selectedHexagons, setSelectedHexagons] = useState<string[]>([]);
  const [correctCombination, setCorrectCombination] = useState(''); // State for correct combination
  const [hexagons, setHexagons] = useState<HexagonData[]>([]); // Initialize as empty array
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes in seconds
  const [isActive, setIsActive] = useState(true); // Timer active state
  const timerRef = useRef<NodeJS.Timeout | null>(null); // Ref for timer interval
  const [showMenu, setShowMenu] = useState(false); // State for menu modal
  const [targetNumber, setTargetNumber] = useState<number>(generateRandomTarget()); // State for target number
  const [roomCode, setRoomCode] = useState('EFGH'); // Placeholder for room code - replace with actual room code logic

  const createRoom = () => {
    const newRoomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    setRoomId(newRoomId);
    setGameStarted(true);
  };

  // Initialize hexagons and target on component mount
  useEffect(() => {
    setHexagons(generateRandomHexagons());
    setTargetNumber(generateRandomTarget()); // Generate target on initial load
  }, []);

  // Timer logic
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      // TODO: Handle game over logic (time's up)
    } else if (!isActive && timerRef.current) {
       clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isActive, timeLeft]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleHexagonClick = (hexagon: HexagonData) => {
    // Limit selection to 3 hexagons
    if (selectedHexagons.length < 3 && !selectedHexagons.includes(hexagon.id)) {
      setSelectedHexagons([...selectedHexagons, hexagon.id]);
    } else if (selectedHexagons.includes(hexagon.id)) {
      setSelectedHexagons(selectedHexagons.filter(id => id !== hexagon.id));
    }
  };

  const handleSubmit = () => {
    if (selectedHexagons.length === 3) {
        const selectedHexData = selectedHexagons.map(id => hexagons.find(hex => hex.id === id)).filter((hex): hex is HexagonData => hex !== undefined);

        // TODO: Implement actual evaluation logic based on selectedHexData and target
        // For now, a placeholder check (randomly correct or incorrect)
        const isCorrect = Math.random() > 0.5;

        if (isCorrect) {
            // Display combination only on correct submit
            setCorrectCombination(selectedHexData.map(hex => hex.letter).join(''));
            // Update hexagons status to correct
            setHexagons(hexagons.map(hex => 
                selectedHexagons.includes(hex.id) ? { ...hex, status: 'correct' } : hex
            ));
            // TODO: Handle score update, next round, etc.
        } else {
             // Update hexagons status to incorrect
             setHexagons(hexagons.map(hex => 
                selectedHexagons.includes(hex.id) ? { ...hex, status: 'incorrect' } : hex
            ));
            // Briefly show incorrect state, then reset
            setTimeout(() => {
                setHexagons(hexagons.map(hex => 
                    selectedHexagons.includes(hex.id) ? { ...hex, status: 'initial' } : hex
                ));
                 setSelectedHexagons([]); // Reset selection after incorrect attempt
            }, 1500); // Reset after 1.5 seconds
        }

    } else {
        console.log('Please select exactly 3 hexagons.'); // Provide user feedback (can be a toast or modal)
    }
  };

  const handleMenu = () => {
    setShowMenu(true); // Show menu modal
    setIsActive(false); // Pause timer when menu is open
  };

  const closeMenu = () => {
    setShowMenu(false); // Hide menu modal
    setIsActive(true); // Resume timer when menu is closed
  };

  const handleRestart = () => {
      // TODO: Implement restart logic for multiplayer
      console.log('Restart online multiplayer game');
      closeMenu();
      // You would likely need to reset game state and sync with other players
      setSelectedHexagons([]);
      setCorrectCombination('');
      setHexagons(generateRandomHexagons());
      setTargetNumber(generateRandomTarget());
      setTimeLeft(120);
      setIsActive(true);
  };

  const handleQuit = () => {
      // TODO: Implement quit logic for multiplayer
      console.log('Quit online multiplayer game');
      closeMenu();
      navigate('/home'); // Example: navigate back to home page
  };

  if (gameStarted) {
    return <OnlineMultiplayerGame roomId={roomId} playerCount={playerCount} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#232323] to-[#111] flex flex-col items-center justify-center p-4 relative">
      <BackButton onClick={() => navigate('/home')} />
      
      <Card className="w-full max-w-md bg-[#333] border-2 border-[#444] shadow-2xl">
        <CardHeader className="bg-[#222] text-white p-6">
          <CardTitle className="text-2xl font-bold text-center flex items-center justify-center">
            <Wifi className="mr-2" size={24} />
            Create Online Room
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          {/* Create Room Section */}
          <div className="space-y-4">
            <div className="text-center text-gray-300 text-lg font-semibold">
              Configure Room
            </div>
            
            <div className="space-y-3">
              <div className="text-sm text-gray-400">Number of players:</div>
              <div className="grid grid-cols-3 gap-2">
                {[2, 3, 4].map((count) => (
                  <Button
                    key={count}
                    onClick={() => setPlayerCount(count)}
                    variant={playerCount === count ? "default" : "outline"}
                    size="sm"
                    className={`${
                      playerCount === count 
                        ? 'bg-[#444] hover:bg-[#555] text-white' 
                        : 'border-[#444] text-gray-300 hover:bg-[#444]'
                    }`}
                  >
                    {count}
                  </Button>
                ))}
              </div>
            </div>
            
            <Button 
              onClick={createRoom}
              className="w-full bg-[#444] hover:bg-[#555] text-white py-3 flex items-center justify-center"
            >
              <Plus className="mr-2" size={20} />
              Create Room
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnlineMultiplayerPage;
