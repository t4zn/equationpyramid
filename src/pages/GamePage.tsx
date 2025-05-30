import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { RefreshCw, Menu, Clock } from 'lucide-react';

// Placeholder types - replace with actual game logic types later
interface Hexagon {
  id: number;
  letter: string;
  value: string;  // Changed from string | number to just string
  status: 'normal' | 'flash-green' | 'flash-red';
}

// Function to evaluate a combination with BODMAS
const evaluateCombination = (hex1: Hexagon, hex2: Hexagon, hex3: Hexagon): number | null => {
    try {
        // Extract number from the first hexagon (ignore leading operator)
        const number1 = parseFloat(hex1.value.replace(/^[+-/\*]/, ''));

        // Extract operator and number from the second hexagon
        const operator2Match = hex2.value.match(/^([+-/\*])(.*)$/);
        if (!operator2Match) return null; // Invalid format
        const operator2 = operator2Match[1];
        const number2 = parseFloat(operator2Match[2]);

        // Extract operator and number from the third hexagon
        const operator3Match = hex3.value.match(/^([+-/\*])(.*)$/);
        if (!operator3Match) return null; // Invalid format
        const operator3 = operator3Match[1];
        const number3 = parseFloat(operator3Match[2]);

        // Check for division by zero early
        if ((operator2 === '÷' && number2 === 0) || (operator3 === '÷' && number3 === 0)) {
            console.error("Division by zero");
            return null;
        }

        // Evaluate based on BODMAS for the structure number1 operator2 number2 operator3 number3
        let result;

        // Check for multiplication/division first
        if (operator2 === '*' || operator2 === '÷') {
            let intermediateResult;
            if (operator2 === '*') intermediateResult = number1 * number2;
            else intermediateResult = number1 / number2;

            // Then apply the third operator
            if (operator3 === '+') result = intermediateResult + number3;
            else if (operator3 === '-') result = intermediateResult - number3;
            else if (operator3 === '*') result = intermediateResult * number3;
            else if (operator3 === '÷') result = intermediateResult / number3;
             else return null; // Should not happen with valid operators

        } else if (operator3 === '*' || operator3 === '÷') {
             // operator2 is + or -
             let intermediateResult;
             if (operator3 === '*') intermediateResult = number2 * number3;
             else intermediateResult = number2 / number3;

             // Then apply the second operator (which has lower precedence)
             if (operator2 === '+') result = number1 + intermediateResult;
             else if (operator2 === '-') result = number1 - intermediateResult;
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
  // Define possible operator-number pairs with numbers up to 20
  const numbers = Array.from({ length: 20 }, (_, i) => i + 1);
  const operators = ['+', '-', '*', '/'];
  
  const operatorNumberPairs = [];
  for (const op of operators) {
      for (const num of numbers) {
          // Add positive number pairs
          operatorNumberPairs.push(`${op}${num}`);
          // Add negative number pairs, avoiding -0 and division by zero
           if (num !== 0 && !(op === '/' && num === 0)) {
              operatorNumberPairs.push(`${op}-${num}`);
           }
      }
  }
    // Add pairs with 0, avoiding division by zero
    for (const op of ['+', '-', '*']) {
        operatorNumberPairs.push(`${op}0`);
    }

  let hexagons: Hexagon[];
  let target: number;
  let attempts = 0;
  const maxAttempts = 500; // Increased attempts for more complex combinations
  let validCombinations: { combo: Hexagon[], result: number }[] = [];

  do {
      // Generate hexagons with random operator-number pairs
      hexagons = letters.map((letter, index) => {
          return {
              id: index,
              letter: letter,
              value: operatorNumberPairs[Math.floor(Math.random() * operatorNumberPairs.length)],
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
                       // Check if this target already exists
                       const existingTargetIndex = validCombinations.findIndex(vc => vc.result === result);
                       if(existingTargetIndex === -1) {
                           validCombinations.push({ combo, result });
                       } else {
                           // If target exists, add this combo if it's different
                           const existingCombo = validCombinations[existingTargetIndex].combo;
                           const comboIds = combo.map(hex => hex.id).sort().join(',');
                           const existingComboIds = existingCombo.map(hex => hex.id).sort().join(',');
                           if (comboIds !== existingComboIds) {
                               // We found a different combination for an existing target
                               // For simplicity, we'll just count this as a valid combination towards the count
                               // In a real game, you might want to store all combinations for a target
                               if (!validCombinations.some(vc => vc.combo.map(h => h.id).sort().join(',') === comboIds)) {
                                    validCombinations.push({ combo, result }); // Add as a new valid combo entry
                               }
                           }
                       }
                  }
              }
          }
      }
      
      attempts++;
  } while (validCombinations.length < 2 && attempts < maxAttempts); // Ensure at least 2 solvable combinations

  if (validCombinations.length > 0) {
      // Filter combinations into positive and negative results
      const positiveCombinations = validCombinations.filter(vc => vc.result >= 0);
      const negativeCombinations = validCombinations.filter(vc => vc.result < 0);

      // Select target based on 7:3 positive to negative ratio
      const usePositiveTarget = Math.random() < 0.7; // 70% chance for positive

      if (usePositiveTarget && positiveCombinations.length > 0) {
          target = positiveCombinations[Math.floor(Math.random() * positiveCombinations.length)].result;
      } else if (negativeCombinations.length > 0) {
          target = negativeCombinations[Math.floor(Math.random() * negativeCombinations.length)].result;
      } else if (positiveCombinations.length > 0) {
           // Fallback if desired polarity is not available but the other is
           target = positiveCombinations[Math.floor(Math.random() * positiveCombinations.length)].result;
      } else {
          // Fallback if no solvable puzzles found (should be rare with increased attempts)
          console.warn("Could not find any solvable combinations with the desired polarity. Using fallback random target.");
          target = generateRandomTarget(); // Use the old random target function as a fallback
           // Note: In this rare case, the generated hexagons might not match the target if generateRandomTarget is used.
           // We might need a more robust fallback or error handling.
      }

  } else {
      // Fallback if no solvable puzzle is found within attempts
      console.warn("Could not generate a solvable puzzle with at least 2 combinations after", maxAttempts, "attempts. Generating a random target.");
      target = generateRandomTarget(); // Use the old random target function as a fallback
       hexagons = letters.map((letter, index) => { // Also regenerate hexagons as simple numbers in fallback
          const numbers = Array.from({ length: 10 }, (_, i) => i + 1);
           return {
              id: index,
              letter: letter,
              value: numbers[Math.floor(Math.random() * numbers.length)].toString(), // Ensure value is string
              status: 'normal',
          };
       });
  }

   // Log solvable combinations and target for debugging
   console.log("Generated Puzzle:");
   console.log("Hexagons:", hexagons);
   console.log("Target:", target);
   console.log("Valid Combinations found:", validCombinations.length);
   // Optional: Log the valid combinations themselves (can be verbose)
   // console.log("Valid Combinations:", validCombinations);

  return { hexagons, target: target !== undefined ? target : generateRandomTarget() };
};

const GamePage = () => {
  const navigate = useNavigate();
  const [selectedHexagons, setSelectedHexagons] = useState<string[]>([]);
  const [correctCombination, setCorrectCombination] = useState('');
  const [hexagons, setHexagons] = useState<Hexagon[]>([]);
  const [timeLeft, setTimeLeft] = useState(120);
  const [isActive, setIsActive] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [targetNumber, setTargetNumber] = useState<number>(0); // Initialize with 0, set in useEffect
  const [gameStatus, setGameStatus] = useState<'playing' | 'gameOver' | 'roundOver'>('playing'); // Add game status
  const [submissionStatus, setSubmissionStatus] = useState<'initial' | 'correct' | 'incorrect'>('initial'); // To manage color flash

  // Initialize puzzle on component mount and refresh
  const initializePuzzle = () => {
    const { hexagons: newHexagons, target: newTarget } = generateSolvablePuzzle();
    setHexagons(newHexagons);
    setTargetNumber(newTarget);
    setSelectedHexagons([]);
    setCorrectCombination('');
    setSubmissionStatus('initial');
    setTimeLeft(120); // Reset timer on new puzzle
    setIsActive(true);
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
    // Prevent selection if already flashing or game is over
    if (submissionStatus !== 'initial' || gameStatus !== 'playing') return;

    // Limit selection to 3 hexagons
    if (selectedHexagons.length < 3 && !selectedHexagons.includes(hexagon.id.toString())) {
      setSelectedHexagons([...selectedHexagons, hexagon.id.toString()]);
    } else if (selectedHexagons.includes(hexagon.id.toString())) {
      setSelectedHexagons(selectedHexagons.filter(id => id !== hexagon.id.toString()));
    }
  };

  const handleSubmit = () => {
    if (selectedHexagons.length === 3 && gameStatus === 'playing') {
        // Get the data for the selected hexagons based on their string IDs
        const selectedHexData = selectedHexagons
            .map(id => hexagons.find(hex => hex.id.toString() === id))
            .filter((hex): hex is Hexagon => hex !== undefined);
        
        // Ensure we have exactly 3 valid hexagons
        if (selectedHexData.length !== 3) {
            console.error("Could not retrieve data for all selected hexagons.");
            setSubmissionStatus('incorrect'); // Indicate an error state visually
            // Briefly flash red to indicate error
            setHexagons(hexagons.map(hex => 
                selectedHexagons.includes(hex.id.toString()) ? { ...hex, status: 'flash-red' } : hex
            ));
            setTimeout(() => {
                setHexagons(hexagons.map(hex => 
                    selectedHexagons.includes(hex.id.toString()) ? { ...hex, status: 'normal' } : hex
                ));
                 setSelectedHexagons([]);
                 setSubmissionStatus('initial');
            }, 1500); // Reset after 1.5 seconds
            return;
        }

        // The order of selection matters for evaluation (number1 operator2 number2 operator3 number3)
        const [hex1, hex2, hex3] = selectedHexData;

        const calculatedResult = evaluateCombination(hex1, hex2, hex3);

        const isCorrect = calculatedResult !== null && calculatedResult === targetNumber;

        if (isCorrect) {
            // Display combination using the values (e.g., -4 x 2 + 2)
            // Format the combination string
            const combinationString = `${parseFloat(hex1.value.replace(/^[+-/\*]/, ''))} ${hex2.value.match(/^([+-/\*])/)?.[1].replace('*', 'x').replace('/', '÷')} ${parseFloat(hex2.value.replace(/^[+-/\*]/, ''))} ${hex3.value.match(/^([+-/\*])/)?.[1].replace('*', 'x').replace('/', '÷')} ${parseFloat(hex3.value.replace(/^[+-/\*]/, ''))} = ${targetNumber}`;
            setCorrectCombination(combinationString);

            // Update hexagons status to correct and then flash green
            setSubmissionStatus('correct');
            setHexagons(hexagons.map(hex => 
                selectedHexagons.includes(hex.id.toString()) ? { ...hex, status: 'flash-green' } : hex
            ));
            // TODO: Handle score update, next round, etc.
             setTimeout(() => {
               // After flash, decide next state - maybe remove used hexagons?
                setHexagons(hexagons.map(hex => 
                     selectedHexagons.includes(hex.id.toString()) ? { ...hex, status: 'normal' } : hex // Or status: 'used' / remove element
                 ));
                setSelectedHexagons([]);
                setSubmissionStatus('initial');
                // Optionally initialize a new puzzle here if it's a correct submission for a round
                // initializePuzzle();
             }, 1500); // Reset after 1.5 seconds

        } else {
             // Update hexagons status to incorrect and then flash red
             setSubmissionStatus('incorrect');
             setHexagons(hexagons.map(hex => 
                selectedHexagons.includes(hex.id.toString()) ? { ...hex, status: 'flash-red' } : hex
            ));
            // Briefly show incorrect state, then reset
            setTimeout(() => {
                setHexagons(hexagons.map(hex => 
                    selectedHexagons.includes(hex.id.toString()) ? { ...hex, status: 'normal' } : hex
                ));
                 setSelectedHexagons([]); // Reset selection after incorrect attempt
                 setSubmissionStatus('initial');
            }, 1500); // Reset after 1.5 seconds
        }

    } else {
        console.log('Please select exactly 3 hexagons.'); // Provide user feedback (can be a toast or modal)
         // Briefly flash red if less than 3 are selected on submit? Or just rely on disabled button.
    }
  };

  const handleRefresh = () => {
    setIsActive(false); // Pause timer
    initializePuzzle(); // Generate new puzzle
    // setIsActive(true); // Timer restarted in initializePuzzle
  };

  const handleMenu = () => {
    setShowMenu(true); // Show menu modal
    setIsActive(false); // Pause timer when menu is open
  };

  const closeMenu = () => {
    setShowMenu(false); // Hide menu modal
    if (gameStatus === 'playing') {
       setIsActive(true); // Resume timer only if game is playing
    }
  };

  const handleRestart = () => {
      console.log('Restart game');
      closeMenu();
      initializePuzzle(); // Start a new puzzle
      setGameStatus('playing'); // Reset game status
  };

  const handleQuit = () => {
      console.log('Quit game');
      closeMenu();
      navigate('/home'); // Example: navigate back to home page
  };

  // Dynamic class for combination display bubble
  const combinationBubbleClass = correctCombination 
    ? 'bg-nav-active text-black px-3 py-1 rounded-full font-bold' 
    : 'text-xl font-bold';

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex flex-col items-center p-4 text-white font-inter overflow-y-auto pb-20"> {/* Added pb-20 for button spacing */}
      {/* Header */}
      <div className="w-full max-w-sm flex justify-between items-center mb-8 font-inter">
        <div className="text-center">
          <div className="text-lg">Combinations</div>
          {/* Display correct combination only after successful submit in a bubble */}
          <div className={combinationBubbleClass}>{correctCombination || '-'}</div>
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
                         ${selectedHexagons.includes(hex.id.toString()) ? 'border-4 border-nav-active' : hex.status === 'flash-green' ? 'border-4 border-green-500' : hex.status === 'flash-red' ? 'border-4 border-red-500' : 'border-2 border-gray-300'}`}
              onClick={() => handleHexagonClick(hex)}
            >
              <div className="text-xs text-black font-bold font-league-spartan">{hex.letter}</div>
              <div className="text-lg text-black font-bold font-league-spartan">
                {/* Display * as x and / as ÷ */}
                {hex.value.startsWith('*') ? '<span className="text-xl">x</span>' : hex.value.startsWith('/') ? '<span className="text-xl">÷</span>' : hex.value}
              </div>
            </div>
          ))}
        </div>
        {/* Row 2 */}
        <div className="flex justify-center -mt-4"> {/* Adjust margin to overlap for pyramid effect */}
          {hexagons.slice(1, 3).map(hex => (
            <div
              key={hex.id}
              className={`hexagon w-20 h-[4.6rem] bg-white flex flex-col items-center justify-center m-1 cursor-pointer
                         ${selectedHexagons.includes(hex.id.toString()) ? 'border-4 border-nav-active' : hex.status === 'flash-green' ? 'border-4 border-green-500' : hex.status === 'flash-red' ? 'border-4 border-red-500' : 'border-2 border-gray-300'}`}
              onClick={() => handleHexagonClick(hex)}
            >
               <div className="text-xs text-black font-bold font-league-spartan">{hex.letter}</div>
              <div className="text-lg text-black font-bold font-league-spartan">
                 {/* Display * as x and / as ÷ */}
                {hex.value.startsWith('*') ? '<span className="text-xl">x</span>' : hex.value.startsWith('/') ? '<span className="text-xl">÷</span>' : hex.value}
              </div>
            </div>
          ))}
        </div>
        {/* Row 3 */}
        <div className="flex justify-center -mt-4"> {/* Adjust margin */}
          {hexagons.slice(3, 6).map(hex => (
            <div
              key={hex.id}
              className={`hexagon w-20 h-[4.6rem] bg-white flex flex-col items-center justify-center m-1 cursor-pointer
                         ${selectedHexagons.includes(hex.id.toString()) ? 'border-4 border-nav-active' : hex.status === 'flash-green' ? 'border-4 border-green-500' : hex.status === 'flash-red' ? 'border-4 border-red-500' : 'border-2 border-gray-300'}`}
              onClick={() => handleHexagonClick(hex)}
            >
               <div className="text-xs text-black font-bold font-league-spartan">{hex.letter}</div>
              <div className="text-lg text-black font-bold font-league-spartan">
                 {/* Display * as x and / as ÷ */}
                {hex.value.startsWith('*') ? '<span className="text-xl">x</span>' : hex.value.startsWith('/') ? '<span className="text-xl">÷</span>' : hex.value}
              </div>
            </div>
          ))}
        </div>
        {/* Row 4 */}
        <div className="flex justify-center -mt-4"> {/* Adjust margin */}
          {hexagons.slice(6, 10).map(hex => (
            <div
              key={hex.id}
              className={`hexagon w-20 h-[4.6rem] bg-white flex flex-col items-center justify-center m-1 cursor-pointer
                         ${selectedHexagons.includes(hex.id.toString()) ? 'border-4 border-nav-active' : hex.status === 'flash-green' ? 'border-4 border-green-500' : hex.status === 'flash-red' ? 'border-4 border-red-500' : 'border-2 border-gray-300'}`}
              onClick={() => handleHexagonClick(hex)}
            >
               <div className="text-xs text-black font-bold font-league-spartan">{hex.letter}</div>
              <div className="text-lg text-black font-bold font-league-spartan">
                 {/* Display * as x and / as ÷ */}
                {hex.value.startsWith('*') ? '<span className="text-xl">x</span>' : hex.value.startsWith('/') ? '<span className="text-xl">÷</span>' : hex.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full max-w-md flex justify-between items-center pt-4 pb-4"> {/* Adjusted padding */}
        <div onClick={handleMenu} className="cursor-pointer text-white">
           <Menu size={32} />
        </div>
        <Button
          className="px-8 py-3 rounded-full bg-white text-black text-lg font-semibold"
          onClick={handleSubmit}
          disabled={selectedHexagons.length !== 3 || submissionStatus !== 'initial'}
        >
          Submit
        </Button>
        <div onClick={handleRefresh} className="cursor-pointer text-white">
           <RefreshCw size={32} />
        </div>
      </div>

      {showMenu && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
              <div className="bg-[#232323] p-6 rounded-lg shadow-lg text-white">
                  <h2 className="text-xl font-bold mb-4">Game Menu</h2>
                  <div className="space-y-4">
                      <Button className="w-full bg-white text-black" onClick={handleRestart}>Restart</Button>
                      <Button className="w-full bg-white text-black" onClick={closeMenu}>Resume</Button>
                      <Button className="w-full bg-white text-black" onClick={handleQuit}>Quit</Button>
                  </div>
              </div>
          </div>
      )}

       {/* Game Over Modal (Placeholder) */}
       {gameStatus === 'gameOver' && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
              <div className="bg-[#232323] p-6 rounded-lg shadow-lg text-white text-center">
                  <h2 className="text-2xl font-bold mb-4">Game Over!</h2>
                  {/* TODO: Display score or other game over information */}
                  <Button className="w-full bg-white text-black mt-4" onClick={handleRestart}>Play Again</Button>
                  <Button className="w-full bg-white text-black mt-2" onClick={handleQuit}>Back to Home</Button>
              </div>
          </div>
       )}
    </div>
  );
};

export default GamePage; 