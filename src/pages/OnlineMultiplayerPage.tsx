import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BackButton } from '@/components/BackButton';
import { OnlineMultiplayerGame } from '@/components/OnlineMultiplayerGame';
import { Wifi, Plus, Clock, Menu, RefreshCw } from 'lucide-react';

// Placeholder types - replace with actual game logic types later
interface Hexagon {
  id: number;
  letter: string;
  operator: string; // Separate field for operator
  number: number; // Separate field for number
  status: 'normal' | 'selected' | 'flash-green' | 'flash-red'; // Added 'selected' status
}

// Function to evaluate a combination with BODMAS based on new rules
const evaluateCombination = (hex1: Hexagon, hex2: Hexagon, hex3: Hexagon): number | null => {
    try {
        // New rule: Ignore the operator of the first hexagon
        const number1 = hex1.number;

        const operator2 = hex2.operator;
        const number2 = hex2.number;

        const operator3 = hex3.operator;
        const number3 = hex3.number;

        // Check for division by zero early
        if ((operator2 === '/' && number2 === 0) || (operator3 === '/' && number3 === 0)) {
            console.error("Division by zero attempted.");
            return null;
        }

        // Evaluate based on BODMAS for the structure number1 operator2 number2 operator3 number3
        let result;

        // Handle multiplication and division first if they appear later in the expression
        if (operator3 === '*' || operator3 === '/') {
            let intermediateResult;
            if (operator3 === '*') intermediateResult = number2 * number3;
            else intermediateResult = number2 / number3;

            // Then apply the second operator
            if (operator2 === '+') result = number1 + intermediateResult;
            else if (operator2 === '-') result = number1 - intermediateResult;
            else if (operator2 === '*' || operator2 === '/') { // Handle cases like num1 + (num2 * num3)
                 if (operator2 === '*') result = number1 * intermediateResult;
                 else result = number1 / intermediateResult;
            } else return null; // Should not happen with valid operators

        } else if (operator2 === '*' || operator2 === '/') {
             // operator3 is + or -
             let intermediateResult;
             if (operator2 === '*') intermediateResult = number2 * number3;
             else intermediateResult = number2 / number3;

             // Then apply the first operator
             if (operator3 === '+') result = number1 + intermediateResult;
             else if (operator3 === '-') result = number1 - intermediateResult;
             else return null; // Should not happen with valid operators

        } else {
            // Both operators are + or -
            let intermediateResult;
            if (operator2 === '+') intermediateResult = number1 + number2;
            else intermediateResult = number1 - number2;

            if (operator3 === '+') result = intermediateResult + number3;
            else if (operator3 === '-') result = intermediateResult - number3;
             else return null; // Should not happen with valid operators
        }

        // Ensure the result is an integer for game purposes
        return Number.isInteger(result) ? result : null;

    } catch (e) {
        console.error("Error evaluating combination:", e);
        return null;
    }
};

// Function to generate a random target number (fallback)
const generateRandomTarget = (): number => {
    // Generate a random target number that can be negative
    return Math.floor(Math.random() * 181) - 90; // Range from -90 to 90
};

// Function to generate random hexagons and a solvable target
const generateSolvablePuzzle = (): { hexagons: Hexagon[], target: number } => {
  const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  // Define possible numbers and operators with only positive numbers
  const numbers = Array.from({ length: 10 }, (_, i) => i + 1); // Range from 1 to 10
  const operators = ['+', '-', '*', '/'];
  
  let hexagons: Hexagon[];
  let target: number;
  let attempts = 0;
  const maxAttempts = 1000;
  let validCombinations: { combo: Hexagon[], result: number }[] = [];

  do {
      // Generate hexagons with random operator and number pairs
      hexagons = letters.map((letter, index) => {
          const randomOperator = operators[Math.floor(Math.random() * operators.length)];
          const randomNumber = numbers[Math.floor(Math.random() * numbers.length)];
          return {
              id: index,
              letter: letter,
              operator: randomOperator,
              number: randomNumber,
              status: 'normal',
          };
      });
      
      validCombinations = [];

      // Brute force to find combinations of 3 that result in an integer target
      for (let i = 0; i < hexagons.length; i++) {
          for (let j = 0; j < hexagons.length; j++) {
              if (i === j) continue; // Ensure unique hexagons
              for (let k = 0; k < hexagons.length; k++) {
                  if (k === i || k === j) continue; // Ensure unique hexagons

                  const combo = [hexagons[i], hexagons[j], hexagons[k]];
                  const result = evaluateCombination(combo[0], combo[1], combo[2]);

                  if (result !== null && Number.isInteger(result)) {
                       // Store the combination and result
                       const comboIds = combo.map(hex => hex.id).sort().join(',');
                       // Check if this exact combination (regardless of order) has already been added
                       if (!validCombinations.some(vc => vc.combo.map(h => h.id).sort().join(',') === comboIds)) {
                            validCombinations.push({ combo, result });
                       }
                  }
              }
          }
      }
      
      attempts++;
  } while (validCombinations.length < 5 && attempts < maxAttempts); // Ensure at least 5 solvable combinations

  if (validCombinations.length > 0) {
      // Select a random target from the results of valid combinations
      const randomCombination = validCombinations[Math.floor(Math.random() * validCombinations.length)];
      target = randomCombination.result;

  } else {
      // Fallback if no solvable puzzle is found within attempts
      console.warn("Could not generate a solvable puzzle with at least 5 combinations after", maxAttempts, "attempts. Generating a random target.");
      // Generate hexagons with random operator-number pairs (fallback with numbers up to 10 and simple operators)
       hexagons = letters.map((letter, index) => {
          const fallbackNumbers = Array.from({ length: 10 }, (_, i) => i + 1);
           const fallbackOperators = ['+', '-', '*', '/'];
           return {
              id: index,
              letter: letter,
              operator: fallbackOperators[Math.floor(Math.random() * fallbackOperators.length)],
              number: fallbackNumbers[Math.floor(Math.random() * fallbackNumbers.length)],
              status: 'normal',
          };
       });
       // Generate a random target number as a fallback
      target = generateRandomTarget();
  }

   // Log solvable combinations and target for debugging
   console.log("Generated Puzzle:");
   console.log("Hexagons:", hexagons);
   console.log("Target:", target);
   console.log("Valid Combinations found:", validCombinations.length);

  return { hexagons, target };
};

const OnlineMultiplayerPage = () => {
  const navigate = useNavigate();
  const [gameStarted, setGameStarted] = useState(false);
  const [roomId, setRoomId] = useState('');
  const [playerCount, setPlayerCount] = useState(2);
  const [selectedHexagonIds, setSelectedHexagonIds] = useState<number[]>([]); // Track selected hexagon IDs
  const [correctCombination, setCorrectCombination] = useState(''); // Still used for displaying the found combination
  const [hexagons, setHexagons] = useState<Hexagon[]>([]);
  const [timeLeft, setTimeLeft] = useState(120);
  const [isActive, setIsActive] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [targetNumber, setTargetNumber] = useState<number>(0);
  const [gameStatus, setGameStatus] = useState<'playing' | 'gameOver' | 'roundOver'>('playing');
  const [submissionStatus, setSubmissionStatus] = useState<'initial' | 'correct' | 'incorrect'>('initial');
  const [score, setScore] = useState(0); // New state for score
  const [usedCombinations, setUsedCombinations] = useState<Set<string>>(new Set()); // Track used combinations by sorted Hexagon IDs
  const [roomCode, setRoomCode] = useState('EFGH'); // Placeholder for room code - replace with actual room code logic

  const createRoom = () => {
    const newRoomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    setRoomId(newRoomId);
    setGameStarted(true);
  };

  // Initialize puzzle on component mount and refresh
  const initializePuzzle = () => {
    const { hexagons: newHexagons, target: newTarget } = generateSolvablePuzzle();
    setHexagons(newHexagons.map(hex => ({ ...hex, status: 'normal' }))); // Ensure hexagons are normal initially
    setTargetNumber(newTarget);
    setSelectedHexagonIds([]);
    setCorrectCombination('');
    setSubmissionStatus('initial');
    setTimeLeft(120); // Reset timer on new puzzle
    setIsActive(true);
    setScore(0); // Reset score on new puzzle
    setUsedCombinations(new Set()); // Reset used combinations
    setGameStatus('playing'); // Reset game status to playing
  };

  useEffect(() => {
    // Only initialize puzzle if game has started (relevant for multiplayer lobby)
    if (gameStarted) {
        initializePuzzle();
    }
  }, [gameStarted]); // Re-run effect when gameStarted changes

  // Timer logic
  useEffect(() => {
    if (isActive && timeLeft > 0 && gameStatus === 'playing') {
      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0 && gameStatus === 'playing') {
      setIsActive(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      setGameStatus('gameOver'); // Set game over status
      // TODO: Handle game over logic
    } else if (!isActive && timerRef.current) {
       clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isActive, timeLeft, gameStatus]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleHexagonClick = (hexagon: Hexagon) => {
    setSelectedHexagonIds(prevSelected => {
      const isSelected = prevSelected.includes(hexagon.id);
      let newSelected;
      if (isSelected) {
        // Deselect if already selected
        newSelected = prevSelected.filter(id => id !== hexagon.id);
      } else {
        // Select if less than 3 are already selected
        if (prevSelected.length < 3) {
          newSelected = [...prevSelected, hexagon.id];
        } else {
          // If 3 are already selected, deselect the first one and add the new one
          newSelected = [...prevSelected.slice(1), hexagon.id];
        }
      }
      // Update hexagon statuses based on selection
      setHexagons(hexagons.map(hex => ({
        ...hex,
        status: newSelected.includes(hex.id) ? 'selected' : 'normal',
      })));
      return newSelected;
    });
  };

  const handleSubmit = () => {
    if (selectedHexagonIds.length !== 3) {
      console.warn("Please select exactly 3 hexagons.");
      return; // Do nothing if not exactly 3 hexagons are selected
    }

    const selectedHexagons = selectedHexagonIds.map(id => hexagons.find(hex => hex.id === id)!);
    const sortedSelectedIds = selectedHexagonIds.sort().join(',');

    if (usedCombinations.has(sortedSelectedIds)) {
        console.log("Combination already used.");
        setScore(prevScore => prevScore - 5);
        setSubmissionStatus('incorrect'); // Flash red for incorrect
         setTimeout(() => setSubmissionStatus('initial'), 1500); // Reset flash after 1.5 seconds
         setSelectedHexagonIds([]); // Deselect hexagons after submission
         setHexagons(hexagons.map(hex => ({ ...hex, status: 'normal' }))); // Reset hexagon status
        return;
    }

    // Evaluate the combination
    const result = evaluateCombination(selectedHexagons[0], selectedHexagons[1], selectedHexagons[2]);

    if (result !== null && result === targetNumber) {
      console.log("Correct combination!");
      setScore(prevScore => prevScore + 10);
      setUsedCombinations(prevUsed => new Set(prevUsed).add(sortedSelectedIds)); // Mark combination as used
      setSubmissionStatus('correct'); // Flash green for correct
      // Keep hexagons green for a moment, then reset to normal
      setHexagons(hexagons.map(hex => ({
        ...hex,
        status: selectedHexagonIds.includes(hex.id) ? 'flash-green' : 'normal',
      })));
      setTimeout(() => {
        setSubmissionStatus('initial');
        setHexagons(hexagons.map(hex => ({
          ...hex,
          status: 'normal',
        })));
      }, 1500); // Reset flash after 1.5 seconds
       // Optionally update correctCombination display
       setCorrectCombination(`${selectedHexagons[0].number} ${selectedHexagons[1].operator}${selectedHexagons[1].number} ${selectedHexagons[2].operator}${selectedHexagons[2].number} = ${targetNumber}`);

    } else {
      console.log("Incorrect combination.");
      setScore(prevScore => prevScore - 5);
      setSubmissionStatus('incorrect'); // Flash red for incorrect
      // Keep hexagons red for a moment, then reset to normal
       setHexagons(hexagons.map(hex => ({
        ...hex,
        status: selectedHexagonIds.includes(hex.id) ? 'flash-red' : 'normal',
      })));
      setTimeout(() => {
        setSubmissionStatus('initial');
         setHexagons(hexagons.map(hex => ({
          ...hex,
          status: 'normal',
        })));
      }, 1500); // Reset flash after 1.5 seconds
    }

    setSelectedHexagonIds([]); // Deselect hexagons after submission
  };

  const handleMenu = () => {
    setIsActive(false); // Pause timer when menu is open
    setShowMenu(true);
  };

  const closeMenu = () => {
    setIsActive(true); // Resume timer when menu is closed
    setShowMenu(false);
  };

  const handleRestart = () => {
    closeMenu(); // Close menu
    initializePuzzle(); // Start a new game
  };

  const handleQuit = () => {
    navigate('/home'); // Navigate to home page instead of login page
  };

   // Effect to handle game over when timer reaches 0
    useEffect(() => {
        if (timeLeft === 0 && gameStatus === 'playing') {
            setIsActive(false); // Pause timer
            setGameStatus('gameOver');
            console.log("Game Over!");
            // Implement game over actions (e.g., show a game over screen, record score)
        }
    }, [timeLeft, gameStatus]);

  // Render lobby or game UI based on gameStarted state
  if (!gameStarted) {
      return (
          <div className="min-h-screen bg-gradient-to-br from-[#232323] to-[#111] flex flex-col items-center justify-center p-4 relative">
            {/* <BackButton onClick={() => navigate('/home')} /> */}
            
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
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white font-inter">
      {/* Game UI */}
      {!showMenu && gameStatus === 'playing' && (
        <div className="w-full h-full flex flex-col justify-between px-4 py-2 fixed inset-0">
          {/* Menu Button - transparent background */}
          <div className="absolute top-4 left-4 z-10">
            <button onClick={handleMenu} className="p-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg transition-all duration-200">
              <Menu size={24} className="text-white" />
            </button>
          </div>

          {/* Top section - moved down to avoid overlap */}
          <div className="pt-12">
            {/* Top bar */}
            <div className="flex justify-between items-start">
              <div className="text-base font-medium text-center w-20">Score
                <div className="text-xl text-amber-400 font-bold">{score}</div>
              </div>
              <div className="text-base font-medium text-center w-20">Target
                <div className="text-2xl text-amber-400 font-bold">{targetNumber}</div>
              </div>
              <div className="text-base font-medium text-right w-20">
                {/* Player Turn Display (Placeholder) */}
                <div className="text-sm text-white">Player Turn</div>
                <div className="text-xl font-bold flex items-center justify-end">
                  <Clock className="mr-1" size={16} />
                  {formatTime(timeLeft)}
                </div>
              </div>
            </div>
          </div>

          {/* Hexagon Pyramid Layout - Middle section with flex-grow to take available space */}
          <div className="flex flex-col items-center justify-center flex-grow my-2 pb-12">
            {/* Row 1 */}
            <div className="flex justify-center">
              {hexagons.find(hex => hex.letter === 'A') && (
                <div
                  key={hexagons.find(hex => hex.letter === 'A')!.id}
                  className="hexagon m-0.5 flex justify-center items-center cursor-pointer bg-white w-[70px] h-[70px] relative shadow-none"
                  style={{
                    clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'
                  }}
                  onClick={() => handleHexagonClick(hexagons.find(hex => hex.letter === 'A')!)}
                >
                   <div className={`text-sm font-normal font-['League Spartan'] absolute top-1 ${hexagons.find(hex => hex.letter === 'A')!.status === 'selected' ? 'text-amber-400' : hexagons.find(hex => hex.letter === 'A')!.status === 'flash-green' ? 'text-green-600 animate-pulse' : hexagons.find(hex => hex.letter === 'A')!.status === 'flash-red' ? 'text-red-600 animate-pulse' : 'text-black'}`}>A</div>
                  <div className={`text-3xl font-semibold font-['League Spartan'] ${hexagons.find(hex => hex.letter === 'A')!.status === 'selected' ? 'text-amber-400' : hexagons.find(hex => hex.letter === 'A')!.status === 'flash-green' ? 'text-green-600 animate-pulse' : hexagons.find(hex => hex.letter === 'A')!.status === 'flash-red' ? 'text-red-600 animate-pulse' : 'text-black'}`}>
                    <span className="text-2xl mr-0.5">
                      {hexagons.find(hex => hex.letter === 'A')!.operator === '*' ? 'x' : hexagons.find(hex => hex.letter === 'A')!.operator === '/' ? '÷' : hexagons.find(hex => hex.letter === 'A')!.operator}
                    </span>
                    {hexagons.find(hex => hex.letter === 'A')!.number}
                  </div>
                </div>
              )}
            </div>
            {/* Row 2 */}
            <div className="flex justify-center -mt-4">
              {['B', 'C'].map(letter => hexagons.find(hex => hex.letter === letter) && (
                <div
                  key={hexagons.find(hex => hex.letter === letter)!.id}
                  className="hexagon m-0.5 flex justify-center items-center cursor-pointer bg-white w-[70px] h-[70px] relative shadow-none"
                  style={{
                    clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'
                  }}
                  onClick={() => handleHexagonClick(hexagons.find(hex => hex.letter === letter)!)}
                >
                   <div className={`text-sm font-normal font-['League Spartan'] absolute top-1 ${hexagons.find(hex => hex.letter === letter)!.status === 'selected' ? 'text-amber-400' : hexagons.find(hex => hex.letter === letter)!.status === 'flash-green' ? 'text-green-600 animate-pulse' : hexagons.find(hex => hex.letter === letter)!.status === 'flash-red' ? 'text-red-600 animate-pulse' : 'text-black'}`}>{letter}</div>
                  <div className={`text-3xl font-semibold font-['League Spartan'] ${hexagons.find(hex => hex.letter === letter)!.status === 'selected' ? 'text-amber-400' : hexagons.find(hex => hex.letter === letter)!.status === 'flash-green' ? 'text-green-600 animate-pulse' : hexagons.find(hex => hex.letter === letter)!.status === 'flash-red' ? 'text-red-600 animate-pulse' : 'text-black'}`}>
                     <span className="text-2xl mr-0.5">
                      {hexagons.find(hex => hex.letter === letter)!.operator === '*' ? 'x' : hexagons.find(hex => hex.letter === letter)!.operator === '/' ? '÷' : hexagons.find(hex => hex.letter === letter)!.operator}
                    </span>
                    {hexagons.find(hex => hex.letter === letter)!.number}
                  </div>
                </div>
              ))}
            </div>
            {/* Row 3 */}
            <div className="flex justify-center -mt-4">
              {['D', 'E', 'F'].map(letter => hexagons.find(hex => hex.letter === letter) && (
                <div
                  key={hexagons.find(hex => hex.letter === letter)!.id}
                  className="hexagon m-0.5 flex justify-center items-center cursor-pointer bg-white w-[70px] h-[70px] relative shadow-none"
                  style={{
                    clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'
                  }}
                  onClick={() => handleHexagonClick(hexagons.find(hex => hex.letter === letter)!)}
                >
                   <div className={`text-sm font-normal font-['League Spartan'] absolute top-1 ${hexagons.find(hex => hex.letter === letter)!.status === 'selected' ? 'text-amber-400' : hexagons.find(hex => hex.letter === letter)!.status === 'flash-green' ? 'text-green-600 animate-pulse' : hexagons.find(hex => hex.letter === letter)!.status === 'flash-red' ? 'text-red-600 animate-pulse' : 'text-black'}`}>{letter}</div>
                  <div className={`text-3xl font-semibold font-['League Spartan'] ${hexagons.find(hex => hex.letter === letter)!.status === 'selected' ? 'text-amber-400' : hexagons.find(hex => hex.letter === letter)!.status === 'flash-green' ? 'text-green-600 animate-pulse' : hexagons.find(hex => hex.letter === letter)!.status === 'flash-red' ? 'text-red-600 animate-pulse' : 'text-black'}`}>
                     <span className="text-2xl mr-0.5">
                      {hexagons.find(hex => hex.letter === letter)!.operator === '*' ? 'x' : hexagons.find(hex => hex.letter === letter)!.operator === '/' ? '÷' : hexagons.find(hex => hex.letter === letter)!.operator}
                    </span>
                    {hexagons.find(hex => hex.letter === letter)!.number}
                  </div>
                </div>
              ))}
            </div>
            {/* Row 4 */}
            <div className="flex justify-center -mt-4">
              {['G', 'H', 'I', 'J'].map(letter => hexagons.find(hex => hex.letter === letter) && (
                <div
                  key={hexagons.find(hex => hex.letter === letter)!.id}
                  className="hexagon m-0.5 flex justify-center items-center cursor-pointer bg-white w-[70px] h-[70px] relative shadow-none"
                  style={{
                    clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'
                  }}
                  onClick={() => handleHexagonClick(hexagons.find(hex => hex.letter === letter)!)}
                >
                   <div className={`text-sm font-normal font-['League Spartan'] absolute top-1 ${hexagons.find(hex => hex.letter === letter)!.status === 'selected' ? 'text-amber-400' : hexagons.find(hex => hex.letter === letter)!.status === 'flash-green' ? 'text-green-600 animate-pulse' : hexagons.find(hex => hex.letter === letter)!.status === 'flash-red' ? 'text-red-600 animate-pulse' : 'text-black'}`}>{letter}</div>
                  <div className={`text-3xl font-semibold font-['League Spartan'] ${hexagons.find(hex => hex.letter === letter)!.status === 'selected' ? 'text-amber-400' : hexagons.find(hex => hex.letter === letter)!.status === 'flash-green' ? 'text-green-600 animate-pulse' : hexagons.find(hex => hex.letter === letter)!.status === 'flash-red' ? 'text-red-600 animate-pulse' : 'text-black'}`}>
                     <span className="text-2xl mr-0.5">
                      {hexagons.find(hex => hex.letter === letter)!.operator === '*' ? 'x' : hexagons.find(hex => hex.letter === letter)!.operator === '/' ? '÷' : hexagons.find(hex => hex.letter === letter)!.operator}
                    </span>
                    {hexagons.find(hex => hex.letter === letter)!.number}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom controls */}
          <div className="w-full flex flex-col px-4 pb-8">
            {/* Left section: Combinations display */}
            <div className="w-full flex flex-col items-start gap-1 -mt-16 mb-4">
              <div className="text-sm text-white font-inter">Combinations</div>
              {correctCombination && (
                <div className="text-center text-gray-800 text-lg font-semibold bg-amber-400 py-1 px-3 rounded-md font-inter min-w-[80px]">
                  {/* Display letters of the correct combination */}
                  {selectedHexagonIds.length === 3 && hexagons.length > 0 && 
                    selectedHexagonIds.map(id => hexagons.find(hex => hex.id === id)?.letter).join('')
                  }
                </div>
              )}
            </div>

            {/* Submit button - centered */}
            <Button
              onClick={handleSubmit}
              className={`px-6 py-3 text-sm font-medium rounded-full shadow-lg transition-all duration-200 w-fit mx-auto ${selectedHexagonIds.length === 3 ? 'bg-white text-black hover:bg-gray-200' : 'bg-gray-600 text-gray-300'}`}
              disabled={selectedHexagonIds.length !== 3}
            >
              Submit
            </Button>
          </div>

          {/* Menu button is now at the top of the component */}
        </div>
      )}

      {/* Game Over Screen */}
      {gameStatus === 'gameOver' && (
          <div className="fixed inset-0 w-full h-full flex flex-col items-center justify-center px-6 py-10"> 
              <div className="flex flex-col items-center justify-center flex-grow">
                  <div className="mb-2 text-amber-400 text-xl font-medium">Game Over!</div>
                  <div className="text-3xl font-bold mb-8">Final Score: {score}</div>
                  
                  <div className="flex flex-col gap-4 items-center">
                      <div className="text-green-400 text-lg mb-2">Combinations Found: {usedCombinations.size}</div>
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
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50"> 
          <div className="bg-gray-600/70 p-8 rounded-2xl shadow-2xl max-w-xs w-full mx-4"> 
            <h2 className="text-2xl font-bold mb-6 text-amber-400 text-center">Game Menu</h2>
            
            {/* Room Code Display - Moved to top */}
            {roomCode && (
              <div className="mb-6 p-4 bg-gray-800/50 rounded-xl border border-amber-400/30">
                <div className="text-center text-gray-400 text-sm mb-2">Room Code</div>
                <div className="text-center text-amber-400 text-2xl font-mono tracking-wider">{roomCode}</div>
              </div>
            )}

            <div className="flex flex-col gap-3">
              <Button 
                onClick={closeMenu} 
                className="w-full px-5 py-3 text-base font-medium bg-gray-600 text-white rounded-xl hover:bg-gray-500 transition-all duration-200"
              >
                Resume Game
              </Button>
              <Button 
                onClick={handleQuit} 
                className="w-full px-5 py-3 text-base font-medium bg-gray-600 text-white rounded-xl hover:bg-gray-500 transition-all duration-200"
              >
                Main Menu
              </Button>
              
              <div className="mt-4 pt-4 border-t border-gray-700 text-center text-sm text-gray-400">
                Current Score: {score}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default OnlineMultiplayerPage;
