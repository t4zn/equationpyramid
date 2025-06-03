import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
// import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Menu, Clock, Users } from 'lucide-react'; // Removed RefreshCw icon
// import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'; // Remove card components
// import { BackButton } from '@/components/BackButton'; // Remove BackButton

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
          <div className="text-xl font-bold">{correctCombination || '-'}</div>
        </div>
        <div className="text-center">
          <div className="text-lg">Target</div>
          <div className="text-4xl font-bold text-nav-active">{targetNumber}</div> {/* Display random target */}
        </div>
        <div className="text-center flex items-center">
          {/* Time Icon */}
           <Clock size={24} className="mr-1 text-white" /> {/* Clock icon */}
          <div className="text-xl font-bold">{formatTime(timeLeft)}</div> {/* Display formatted time */}
        </div>
      </div>

      {/* Game Area (Hexagonal Pyramid) */}
      <div className="flex flex-col items-center justify-center flex-grow py-8">
        {/* Apply the 'hexagon' class here */}
        {/* Row 1 */}
        <div className="flex justify-center">
          {hexagons.slice(0, 1).map(hex => (
            <div
              key={hex.id}
              className={`hexagon w-20 h-[4.6rem] bg-white flex flex-col items-center justify-center m-1 cursor-pointer
                         ${selectedHexagons.includes(hex.id) ? 'border-4 border-nav-active' : hex.status === 'correct' ? 'border-4 border-green-500' : hex.status === 'incorrect' ? 'border-4 border-red-500' : 'border-2 border-gray-300'}`}
              onClick={() => handleHexagonClick(hex)}
            >
              <div className="text-xs text-black font-bold font-league-spartan">{hex.letter}</div>
              <div className="text-lg text-black font-bold font-league-spartan">{hex.value}</div>
            </div>
          ))}
        </div>
        {/* Row 2 */}
        <div className="flex justify-center -mt-4"> {/* Adjust margin to overlap for pyramid effect */}
          {hexagons.slice(1, 3).map(hex => (
            <div
              key={hex.id}
              className={`hexagon w-20 h-[4.6rem] bg-white flex flex-col items-center justify-center m-1 cursor-pointer
                         ${selectedHexagons.includes(hex.id) ? 'border-4 border-nav-active' : hex.status === 'correct' ? 'border-4 border-green-500' : hex.status === 'incorrect' ? 'border-4 border-red-500' : 'border-2 border-gray-300'}`}
              onClick={() => handleHexagonClick(hex)}
            >
               <div className="text-xs text-black font-bold font-league-spartan">{hex.letter}</div>
              <div className="text-lg text-black font-bold font-league-spartan">{hex.value}</div>
            </div>
          ))}
        </div>
        {/* Row 3 */}
        <div className="flex justify-center -mt-4"> {/* Adjust margin */}
          {hexagons.slice(3, 6).map(hex => (
            <div
              key={hex.id}
              className={`hexagon w-20 h-[4.6rem] bg-white flex flex-col items-center justify-center m-1 cursor-pointer
                         ${selectedHexagons.includes(hex.id) ? 'border-4 border-nav-active' : hex.status === 'correct' ? 'border-4 border-green-500' : hex.status === 'incorrect' ? 'border-4 border-red-500' : 'border-2 border-gray-300'}`}
              onClick={() => handleHexagonClick(hex)}
            >
               <div className="text-xs text-black font-bold font-league-spartan">{hex.letter}</div>
              <div className="text-lg text-black font-bold font-league-spartan">{hex.value}</div>
            </div>
          ))}
        </div>
        {/* Row 4 */}
        <div className="flex justify-center -mt-4"> {/* Adjust margin */}
          {hexagons.slice(6, 10).map(hex => (
            <div
              key={hex.id}
              className={`hexagon w-20 h-[4.6rem] bg-white flex flex-col items-center justify-center m-1 cursor-pointer
                         ${selectedHexagons.includes(hex.id) ? 'border-4 border-nav-active' : hex.status === 'correct' ? 'border-4 border-green-500' : hex.status === 'incorrect' ? 'border-4 border-red-500' : 'border-2 border-gray-300'}`}
              onClick={() => handleHexagonClick(hex)}
            >
               <div className="text-xs text-black font-bold font-league-spartan">{hex.letter}</div>
              <div className="text-lg text-black font-bold font-league-spartan">{hex.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer/Controls */}
      <div className="w-full max-w-md flex justify-between items-center pt-4 pb-4"> {/* Adjusted padding */}
        {/* Menu Icon */}
        <div onClick={handleMenu} className="cursor-pointer text-white">
           <Menu size={32} />
        </div>
        {/* Submit Button */}
        <Button
          className="px-8 py-3 rounded-full bg-white text-black text-lg font-semibold"
          onClick={handleSubmit}
          disabled={selectedHexagons.length !== 3} // Disable if not 3 selected
        >
          Submit
        </Button>
        {/* Refresh Icon (Removed for multiplayer) */}
        {/* <div onClick={handleRefresh} className="cursor-pointer text-white"><RefreshCw size={32} /></div> */}
      </div>

      {/* Menu Modal (Placeholder) */}
      {showMenu && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
              <div className="bg-[#232323] p-6 rounded-lg shadow-lg text-white">
                  <h2 className="text-xl font-bold mb-4">Game Menu</h2>
                   {/* Room Code for Multiplayer (Placeholder) */}
                   <p className="text-gray-400 mb-4">Room Code: {roomCode}</p>
                  <div className="space-y-4">
                      <Button className="w-full bg-white text-black" onClick={handleRestart}>Restart</Button>
                      <Button className="w-full bg-white text-black" onClick={closeMenu}>Resume</Button>
                      <Button className="w-full bg-white text-black" onClick={handleQuit}>Quit</Button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default LocalMultiplayerPage;
