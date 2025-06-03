import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, Clock, Users } from 'lucide-react';

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

const LocalMultiplayerPage = () => {
  const navigate = useNavigate();
  const [selectedHexagons, setSelectedHexagons] = useState<string[]>([]);
  const [correctCombination, setCorrectCombination] = useState(''); // State for correct combination
  const [hexagons, setHexagons] = useState<HexagonData[]>([]); // Initialize as empty array
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes in seconds
  const [isActive, setIsActive] = useState(true); // Timer active state
  const timerRef = useRef<NodeJS.Timeout | null>(null); // Ref for timer interval
  const [showMenu, setShowMenu] = useState(false); // State for menu modal
  const [targetNumber, setTargetNumber] = useState<number>(generateRandomTarget()); // State for target number
  const [roomCode, setRoomCode] = useState('ABCD'); // Placeholder for room code
  const [gameStatus, setGameStatus] = useState<'playing' | 'gameOver'>('playing'); // Game status state

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
      console.log('Restart local multiplayer game');
      closeMenu();
      // You would likely need to reset game state for all players here
      setSelectedHexagons([]);
      setCorrectCombination('');
      setHexagons(generateRandomHexagons());
      setTargetNumber(generateRandomTarget());
      setTimeLeft(120);
      setIsActive(true);
  };

  const handleQuit = () => {
      // TODO: Implement quit logic for multiplayer
      console.log('Quit local multiplayer game');
      closeMenu();
      navigate('/home'); // Example: navigate back to home page
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex flex-col items-center p-4 text-white font-inter overflow-y-auto pb-20"> {/* Added pb-20 for button spacing */}
      {/* Header */}
      <div className="w-full max-w-sm flex justify-between items-center mb-8 font-inter">
        <div className="text-center">
          <div className="text-lg">Combinations</div>
          {/* Display correct combination only after successful submit */}

          {/* Top section - moved down to avoid overlap */}
          <div className="pt-12">
            {/* Top bar */}
            <div className="flex justify-between items-start">
              <div className="text-base font-medium text-center w-20">Score
                <div className="text-xl text-amber-400 font-bold">0</div>
              </div>
              <div className="text-base font-medium text-center w-20">Target
                <div className="text-2xl text-amber-400 font-bold">{targetNumber}</div>
              </div>
              <div className="text-base font-medium text-right w-20">Time
                <div className="text-xl font-bold flex items-center justify-end">
                  <Clock className="mr-1" size={16} />
                  {formatTime(timeLeft)}
                </div>
              </div>
            </div>
            
            <div className="text-sm mt-2 flex justify-between">
              <div>Room: {roomCode}</div>
              <div>Combinations: 0</div>
            </div>
          </div>

          {/* Hexagon Pyramid Layout - Middle section with flex-grow to take available space */}
          <div className="flex flex-col items-center justify-center flex-grow my-2">
            {/* Row 1 */}
            <div className="flex justify-center">
              {hexagons.slice(0, 1).map(hex => (
                <div
                  key={hex.id}
                  className={`hexagon w-16 h-16 bg-white flex flex-col items-center justify-center m-1 cursor-pointer shadow-md
                             ${selectedHexagons.includes(hex.id) ? 'border-4 border-amber-500' : hex.status === 'correct' ? 'border-4 border-green-500' : hex.status === 'incorrect' ? 'border-4 border-red-500' : 'border-2 border-gray-300'}`}
                  onClick={() => handleHexagonClick(hex)}
                >
                  <div className="text-xs text-black font-bold font-league-spartan">{hex.letter}</div>
                  <div className="text-lg text-black font-bold font-league-spartan">{hex.value}</div>
                </div>
              ))}
            </div>
            {/* Row 2 */}
            <div className="flex justify-center -mt-2">
              {hexagons.slice(1, 3).map(hex => (
                <div
                  key={hex.id}
                  className={`hexagon w-16 h-16 bg-white flex flex-col items-center justify-center m-1 cursor-pointer shadow-md
                             ${selectedHexagons.includes(hex.id) ? 'border-4 border-amber-500' : hex.status === 'correct' ? 'border-4 border-green-500' : hex.status === 'incorrect' ? 'border-4 border-red-500' : 'border-2 border-gray-300'}`}
                  onClick={() => handleHexagonClick(hex)}
                >
                  <div className="text-xs text-black font-bold font-league-spartan">{hex.letter}</div>
                  <div className="text-lg text-black font-bold font-league-spartan">{hex.value}</div>
                </div>
              ))}
            </div>
            {/* Row 3 */}
            <div className="flex justify-center -mt-2">
              {hexagons.slice(3, 6).map(hex => (
                <div
                  key={hex.id}
                  className={`hexagon w-16 h-16 bg-white flex flex-col items-center justify-center m-1 cursor-pointer shadow-md
                             ${selectedHexagons.includes(hex.id) ? 'border-4 border-amber-500' : hex.status === 'correct' ? 'border-4 border-green-500' : hex.status === 'incorrect' ? 'border-4 border-red-500' : 'border-2 border-gray-300'}`}
                  onClick={() => handleHexagonClick(hex)}
                >
                  <div className="text-xs text-black font-bold font-league-spartan">{hex.letter}</div>
                  <div className="text-lg text-black font-bold font-league-spartan">{hex.value}</div>
                </div>
              ))}
            </div>
            {/* Row 4 */}
            <div className="flex justify-center -mt-2">
              {hexagons.slice(6, 10).map(hex => (
                <div
                  key={hex.id}
                  className={`hexagon w-16 h-16 bg-white flex flex-col items-center justify-center m-1 cursor-pointer shadow-md
                             ${selectedHexagons.includes(hex.id) ? 'border-4 border-amber-500' : hex.status === 'correct' ? 'border-4 border-green-500' : hex.status === 'incorrect' ? 'border-4 border-red-500' : 'border-2 border-gray-300'}`}
                  onClick={() => handleHexagonClick(hex)}
                >
                  <div className="text-xs text-black font-bold font-league-spartan">{hex.letter}</div>
                  <div className="text-lg text-black font-bold font-league-spartan">{hex.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom controls */}
          <div className="pb-8 flex flex-col gap-3">
            {/* Combinations display */}
            {correctCombination && (
              <div className="text-center text-green-400 text-sm font-medium bg-green-900/20 py-2 px-4 rounded-lg">
                Last Correct: {correctCombination}
              </div>
            )}
            
            {/* Submit button */}
            <div className="flex justify-center">
              <Button
                onClick={handleSubmit}
                className={`px-8 py-3 text-lg font-medium rounded-xl shadow-lg transition-all duration-200 ${selectedHexagons.length === 3 ? 'bg-amber-500 text-black hover:bg-amber-400' : 'bg-gray-700 text-gray-300'}`}
                disabled={selectedHexagons.length !== 3}
              >
                Submit
              </Button>
            </div>
          </div>

          {/* Menu button is now at the top of the component */}
        </div>
      )}

      {/* Game Over Screen */}
      {gameStatus === 'gameOver' && (
          <div className="fixed inset-0 w-full h-full flex flex-col items-center justify-center px-6 py-10"> 
              <div className="flex flex-col items-center justify-center flex-grow">
                  <div className="mb-2 text-amber-400 text-xl font-medium">Game Over!</div>
                  <div className="text-3xl font-bold mb-8">Final Score: 0</div>
                  
                  <div className="flex flex-col gap-4 items-center">
                      <div className="text-green-400 text-lg mb-2">Combinations Found: 0</div>
                  </div>
              </div>
              
              {/* Game over actions - fixed at bottom */}
              <div className="w-full max-w-md pb-8">
                  <div className="flex justify-center gap-4 w-full"> 
                      <Button onClick={handleRestart} className="w-full px-6 py-4 text-lg font-medium bg-amber-500 text-black rounded-xl shadow-lg hover:bg-amber-400 transition-all duration-200">Play Again</Button>
                      <Button onClick={handleQuit} className="w-full px-6 py-4 text-lg font-medium bg-gray-700 text-white rounded-xl shadow-lg hover:bg-gray-600 transition-all duration-200">Main Menu</Button>
                  </div>
              </div>
          </div>
      )}

      {/* Menu Overlay */}
      {showMenu && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/70 flex items-center justify-center z-10">
          <div className="bg-gray-800 p-8 rounded-xl shadow-xl w-full max-w-sm mx-4">
            <h2 className="text-2xl font-bold mb-2 text-white">Menu</h2>
            <p className="text-gray-400 mb-4">Room Code: {roomCode}</p>
            <div className="text-amber-400 text-lg mb-4">Current Score: 0</div>
            
            <div className="space-y-3">
              <Button onClick={closeMenu} className="w-full px-4 py-3 text-lg bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-all duration-200">
                Resume
              </Button>
              <Button onClick={handleRestart} className="w-full px-4 py-3 text-lg bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-all duration-200">
                Restart
              </Button>
              <Button onClick={handleQuit} className="w-full px-4 py-3 text-lg bg-amber-500 hover:bg-amber-400 text-black rounded-xl transition-all duration-200">
                Quit
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocalMultiplayerPage;
