import { Block } from '../types/game';

const operators = ['+', '-', '×', '÷'];
const numbers = [-11, -10, -9, -5, -3, -1, +1, +3, +4, +5, +6, +7, +9, +11];

export const generatePyramid = () => {
  let attempts = 0;
  const maxAttempts = 50;
  
  while (attempts < maxAttempts) {
    const numbers: number[] = [];
    const operators: string[] = [];
    
    // Generate 7 numbers (1-9)
    for (let i = 0; i < 7; i++) {
      numbers.push(Math.floor(Math.random() * 9) + 1);
    }
    
    // Generate 3 operators with better distribution
    const operatorPool = ['+', '+', '-', '-', '*', '/'];
    for (let i = 0; i < 3; i++) {
      const randomIndex = Math.floor(Math.random() * operatorPool.length);
      operators.push(operatorPool[randomIndex]);
      operatorPool.splice(randomIndex, 1);
    }
    
    // Create blocks with letter labels
    const blocks: Block[] = [];
    const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
    
    // Add number blocks (7 numbers)
    for (let i = 0; i < numbers.length; i++) {
      blocks.push({
        value: numbers[i].toString(),
        type: 'number',
        numericValue: numbers[i],
        label: letters[i]
      });
    }
    
    // Add operator blocks (3 operators)
    for (let i = 0; i < operators.length; i++) {
      blocks.push({
        value: operators[i],
        type: 'operator',
        label: letters[7 + i]
      });
    }
    
    // Generate target number (10-50 range for better gameplay)
    const targetNumber = Math.floor(Math.random() * 41) + 10;
    
    // Check if we can find valid combinations
    const validCombinations = findValidCombinations(blocks, targetNumber);
    
    // Accept if we have 2-4 combinations
    if (validCombinations.length >= 2 && validCombinations.length <= 4) {
      return { blocks, targetNumber };
    }
    
    attempts++;
  }
  
  // Fallback if no good combination found
  console.log('Using fallback pyramid generation');
  return generateFallbackPyramid();
};

const generateFallbackPyramid = () => {
  const blocks: Block[] = [
    { value: '5', type: 'number', numericValue: 5, label: 'a' },
    { value: '3', type: 'number', numericValue: 3, label: 'b' },
    { value: '2', type: 'number', numericValue: 2, label: 'c' },
    { value: '4', type: 'number', numericValue: 4, label: 'd' },
    { value: '6', type: 'number', numericValue: 6, label: 'e' },
    { value: '1', type: 'number', numericValue: 1, label: 'f' },
    { value: '7', type: 'number', numericValue: 7, label: 'g' },
    { value: '+', type: 'operator', label: 'h' },
    { value: '-', type: 'operator', label: 'i' },
    { value: '*', type: 'operator', label: 'j' }
  ];
  
  return { blocks, targetNumber: 8 }; // 5 + 3 = 8, 6 + 2 = 8, etc.
};

export const findValidCombinations = (blocks: Block[], target: number): number[][] => {
  const validCombinations: number[][] = [];
  
  // Check all possible 3-block combinations
  for (let i = 0; i < blocks.length; i++) {
    for (let j = 0; j < blocks.length; j++) {
      for (let k = 0; k < blocks.length; k++) {
        if (i !== j && j !== k && i !== k) {
          const result = evaluateEquation([i, j, k], blocks);
          if (result.isValid && result.result === target) {
            validCombinations.push([i, j, k]);
          }
        }
      }
    }
  }
  
  return validCombinations;
};

export const evaluateEquation = (selectedIndices: number[], blocks: Block[]) => {
  if (selectedIndices.length !== 3) {
    return { isValid: false, message: 'Select exactly 3 blocks' };
  }
  
  const [first, second, third] = selectedIndices.map(i => blocks[i]);
  
  // Apply the "first block operator inapplicability" rule
  const firstValue = Math.abs(first.numericValue || 0);
  const secondValue = second.numericValue || 0;
  const thirdValue = third.numericValue || 0;
  
  // Extract operator from second block
  const secondOp = second.value.charAt(0);
  const thirdOp = third.value.charAt(0);
  
  try {
    let result = firstValue;
    
    // Apply second block operation
    if (secondOp === '+') {
      result = result + Math.abs(secondValue);
    } else if (secondOp === '-') {
      result = result - Math.abs(secondValue);
    } else if (secondOp === '×') {
      result = result * Math.abs(secondValue);
    } else if (secondOp === '÷') {
      if (Math.abs(secondValue) === 0) {
        return { isValid: false, message: 'Division by zero!' };
      }
      result = result / Math.abs(secondValue);
    } else {
      // If second block is a number, just add it
      result = result + secondValue;
    }
    
    // Apply third block operation
    if (thirdOp === '+') {
      result = result + Math.abs(thirdValue);
    } else if (thirdOp === '-') {
      result = result - Math.abs(thirdValue);
    } else if (thirdOp === '×') {
      result = result * Math.abs(thirdValue);
    } else if (thirdOp === '÷') {
      if (Math.abs(thirdValue) === 0) {
        return { isValid: false, message: 'Division by zero!' };
      }
      result = result / Math.abs(thirdValue);
    } else {
      // If third block is a number, just add it
      result = result + thirdValue;
    }
    
    const equation = `${first.label}(${first.value}) ${second.label}(${second.value}) ${third.label}(${third.value}) = ${result}`;
    
    return {
      isValid: true,
      result: Math.round(result * 100) / 100, // Round to 2 decimal places
      equation,
      message: 'Valid equation!'
    };
  } catch (error) {
    return { isValid: false, message: 'Invalid equation' };
  }
};

// Convert letter input to block indices
export const parseLetterInput = (input: string, blocks: Block[]): number[] => {
  const letters = input.toLowerCase().replace(/[^a-j]/g, '').split('');
  const uniqueLetters = [...new Set(letters)]; // Remove duplicates
  
  if (uniqueLetters.length > 3) {
    return uniqueLetters.slice(0, 3).map(letter => {
      const index = blocks.findIndex(block => block.label === letter);
      return index !== -1 ? index : -1;
    });
  }
  
  return uniqueLetters.map(letter => {
    const index = blocks.findIndex(block => block.label === letter);
    return index !== -1 ? index : -1;
  });
};
