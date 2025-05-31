import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { RefreshCw, Menu, Clock } from 'lucide-react';

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

const GamePage = () => {
  const navigate = useNavigate();
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
  };

  useEffect(() => {
    initializePuzzle();
  }, []);

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

  const handleRefresh = () => {
    initializePuzzle(); // Generate a new puzzle
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
    navigate('/'); // Navigate to home page
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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white font-inter p-1">
      {/* Game UI */}
      {!showMenu && gameStatus === 'playing' && (
        <div className="w-full max-w-[360px] px-1">
          {/* Top bar */}
          <div className="flex justify-between items-center mb-1">
            <div className="text-sm font-inter">Combinations: {usedCombinations.size}</div>
            <div className="text-lg text-orange-500 font-inter">Target: {targetNumber}</div>
            <div className="text-sm flex items-center font-inter">
              <Clock className="mr-1 text-white" size={16} />
              {formatTime(timeLeft)}
            </div>
          </div>

          {/* Hexagon Pyramid Layout */}
          <div className="flex flex-col items-center mb-1">
            {/* Row 1 */}
            <div className="flex justify-center">
              {hexagons.find(hex => hex.letter === 'A') && (
                <div
                  key={hexagons.find(hex => hex.letter === 'A')!.id}
                  className="hexagon m-0.5 p-2 text-center cursor-pointer bg-white w-14 h-16 relative"
                  style={{
                    clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'
                  }}
                  onClick={() => handleHexagonClick(hexagons.find(hex => hex.letter === 'A')!)}
                >
                  <div className={`text-sm font-league-spartan ${hexagons.find(hex => hex.letter === 'A')!.status === 'selected' ? 'text-yellow-600' : hexagons.find(hex => hex.letter === 'A')!.status === 'flash-green' ? 'text-green-500 animate-pulse' : hexagons.find(hex => hex.letter === 'A')!.status === 'flash-red' ? 'text-red-500 animate-pulse' : 'text-black'}`}>A</div>
                  <div className={`text-base font-bold font-league-spartan ${hexagons.find(hex => hex.letter === 'A')!.status === 'selected' ? 'text-yellow-600' : hexagons.find(hex => hex.letter === 'A')!.status === 'flash-green' ? 'text-green-500 animate-pulse' : hexagons.find(hex => hex.letter === 'A')!.status === 'flash-red' ? 'text-red-500 animate-pulse' : 'text-black'}`}>
                    {hexagons.find(hex => hex.letter === 'A')!.operator === '*' ? 'x' : hexagons.find(hex => hex.letter === 'A')!.operator === '/' ? '÷' : hexagons.find(hex => hex.letter === 'A')!.operator}{hexagons.find(hex => hex.letter === 'A')!.number}
                  </div>
                </div>
              )}
            </div>
            {/* Row 2 */}
            <div className="flex justify-center -mt-2">
              {['B', 'C'].map(letter => hexagons.find(hex => hex.letter === letter) && (
                <div
                  key={hexagons.find(hex => hex.letter === letter)!.id}
                  className="hexagon m-0.5 p-2 text-center cursor-pointer bg-white w-14 h-16 relative"
                  style={{
                    clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'
                  }}
                  onClick={() => handleHexagonClick(hexagons.find(hex => hex.letter === letter)!)}
                >
                  <div className={`text-sm font-league-spartan ${hexagons.find(hex => hex.letter === letter)!.status === 'selected' ? 'text-yellow-600' : hexagons.find(hex => hex.letter === letter)!.status === 'flash-green' ? 'text-green-500 animate-pulse' : hexagons.find(hex => hex.letter === letter)!.status === 'flash-red' ? 'text-red-500 animate-pulse' : 'text-black'}`}>{letter}</div>
                  <div className={`text-base font-bold font-league-spartan ${hexagons.find(hex => hex.letter === letter)!.status === 'selected' ? 'text-yellow-600' : hexagons.find(hex => hex.letter === letter)!.status === 'flash-green' ? 'text-green-500 animate-pulse' : hexagons.find(hex => hex.letter === letter)!.status === 'flash-red' ? 'text-red-500 animate-pulse' : 'text-black'}`}>
                    {hexagons.find(hex => hex.letter === letter)!.operator === '*' ? 'x' : hexagons.find(hex => hex.letter === letter)!.operator === '/' ? '÷' : hexagons.find(hex => hex.letter === letter)!.operator}{hexagons.find(hex => hex.letter === letter)!.number}
                  </div>
                </div>
              ))}
            </div>
            {/* Row 3 */}
            <div className="flex justify-center -mt-2">
              {['D', 'E', 'F'].map(letter => hexagons.find(hex => hex.letter === letter) && (
                <div
                  key={hexagons.find(hex => hex.letter === letter)!.id}
                  className="hexagon m-0.5 p-2 text-center cursor-pointer bg-white w-14 h-16 relative"
                  style={{
                    clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'
                  }}
                  onClick={() => handleHexagonClick(hexagons.find(hex => hex.letter === letter)!)}
                >
                  <div className={`text-sm font-league-spartan ${hexagons.find(hex => hex.letter === letter)!.status === 'selected' ? 'text-yellow-600' : hexagons.find(hex => hex.letter === letter)!.status === 'flash-green' ? 'text-green-500 animate-pulse' : hexagons.find(hex => hex.letter === letter)!.status === 'flash-red' ? 'text-red-500 animate-pulse' : 'text-black'}`}>{letter}</div>
                  <div className={`text-base font-bold font-league-spartan ${hexagons.find(hex => hex.letter === letter)!.status === 'selected' ? 'text-yellow-600' : hexagons.find(hex => hex.letter === letter)!.status === 'flash-green' ? 'text-green-500 animate-pulse' : hexagons.find(hex => hex.letter === letter)!.status === 'flash-red' ? 'text-red-500 animate-pulse' : 'text-black'}`}>
                    {hexagons.find(hex => hex.letter === letter)!.operator === '*' ? 'x' : hexagons.find(hex => hex.letter === letter)!.operator === '/' ? '÷' : hexagons.find(hex => hex.letter === letter)!.operator}{hexagons.find(hex => hex.letter === letter)!.number}
                  </div>
                </div>
              ))}
            </div>
            {/* Row 4 */}
            <div className="flex justify-center -mt-2">
              {['G', 'H', 'I', 'J'].map(letter => hexagons.find(hex => hex.letter === letter) && (
                <div
                  key={hexagons.find(hex => hex.letter === letter)!.id}
                  className="hexagon m-0.5 p-2 text-center cursor-pointer bg-white w-14 h-16 relative"
                  style={{
                    clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'
                  }}
                  onClick={() => handleHexagonClick(hexagons.find(hex => hex.letter === letter)!)}
                >
                  <div className={`text-sm font-league-spartan ${hexagons.find(hex => hex.letter === letter)!.status === 'selected' ? 'text-yellow-600' : hexagons.find(hex => hex.letter === letter)!.status === 'flash-green' ? 'text-green-500 animate-pulse' : hexagons.find(hex => hex.letter === letter)!.status === 'flash-red' ? 'text-red-500 animate-pulse' : 'text-black'}`}>{letter}</div>
                  <div className={`text-base font-bold font-league-spartan ${hexagons.find(hex => hex.letter === letter)!.status === 'selected' ? 'text-yellow-600' : hexagons.find(hex => hex.letter === letter)!.status === 'flash-green' ? 'text-green-500 animate-pulse' : hexagons.find(hex => hex.letter === letter)!.status === 'flash-red' ? 'text-red-500 animate-pulse' : 'text-black'}`}>
                    {hexagons.find(hex => hex.letter === letter)!.operator === '*' ? 'x' : hexagons.find(hex => hex.letter === letter)!.operator === '/' ? '÷' : hexagons.find(hex => hex.letter === letter)!.operator}{hexagons.find(hex => hex.letter === letter)!.number}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom bar with Submit and Refresh */}
          <div className="flex justify-between items-center mt-2">
            <Button
              onClick={handleSubmit}
              className="px-4 py-1 text-sm bg-white text-black rounded-full shadow-lg hover:bg-gray-200"
              disabled={selectedHexagonIds.length !== 3}
            >
              Submit
            </Button>
            <div className="text-sm flex items-center cursor-pointer text-white" onClick={handleRefresh}>
              <RefreshCw className="mr-1" size={18} />
            </div>
          </div>

          {/* Display score */}
          <div className="text-sm text-center mt-1 font-inter">Score: {score}</div>

          {/* Display correct combination when found */}
          {correctCombination && (
            <div className="text-center mt-0.5 text-green-400 font-inter text-xs">Last Correct: {correctCombination}</div>
          )}

          {/* Menu Button */}
          <div className="absolute top-1 right-1">
            <Button onClick={handleMenu} className="p-1 bg-gray-700 rounded-md">
              <Menu size={18} />
            </Button>
          </div>
        </div>
      )}

      {/* Game Over Screen */}
      {gameStatus === 'gameOver' && (
          <div className="text-center text-2xl font-bold text-white font-inter"> {/* Apply Inter font */}
              Game Over! Final Score: {score}
              {/* Add options to Restart or Quit from here */}
              <div className="mt-4 flex justify-center space-x-4 font-inter"> {/* Apply Inter font */}
                   <Button onClick={handleRestart} className="px-8 py-3 text-lg bg-white text-black rounded-full shadow-lg hover:bg-gray-200">Restart</Button>
                   <Button onClick={handleQuit} className="px-8 py-3 text-lg bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600">Quit</Button>
              </div>
          </div>
      )}

      {/* Menu Overlay */}
      {showMenu && (
        <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center"> {/* Ensure menu overlay background is black */}
          <div className="bg-gray-800 p-8 rounded-lg shadow-lg font-inter"> {/* Apply Inter font */}
            <h2 className="text-2xl font-bold mb-4">Menu</h2>
            <ul className="space-y-4">
              <li>
                <Button onClick={closeMenu} className="w-full px-4 py-2 text-lg bg-gray-700 rounded-md hover:bg-gray-600">Resume</Button>
              </li>
              <li>
                <Button onClick={handleRestart} className="w-full px-4 py-2 text-lg bg-gray-700 rounded-md hover:bg-gray-600">Restart</Button>
              </li>
              <li>
                <Button onClick={handleQuit} className="w-full px-4 py-2 text-lg bg-red-500 rounded-md hover:bg-red-600">Quit</Button>
              </li>
              {/* Add Multiplayer options here later */}
            </ul>
          </div>
        </div>
      )}

    </div>
  );
};

export default GamePage; 
