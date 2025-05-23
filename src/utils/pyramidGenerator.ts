
import { Block } from '../types/game';

const operators = ['+', '-', '×', '÷'];
const numbers = [-11, -10, -9, +1, +3, +4, +5, +6, +7, +9];

export const generatePyramid = (): { blocks: Block[], targetNumber: number } => {
  // Create a mix of number and operator blocks
  const blocks: Block[] = [];
  
  // Generate 10 blocks for the pyramid (4 + 3 + 2 + 1)
  const shuffledNumbers = [...numbers].sort(() => Math.random() - 0.5);
  
  // Balance operators: ensure equal distribution of + - × ÷
  const balancedOperators = ['+', '+', '+', '-', '-', '-', '×', '÷', '×', '÷']
    .sort(() => Math.random() - 0.5);
  
  // Letter labels a-j for blocks
  const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
  
  // Mix numbers and operators (roughly 60% numbers, 40% operators)
  for (let i = 0; i < 10; i++) {
    if (i < 6) {
      // Number block
      const num = shuffledNumbers[i % shuffledNumbers.length];
      blocks.push({
        value: num > 0 ? `+${num}` : `${num}`,
        type: 'number',
        numericValue: num,
        label: letters[i]
      });
    } else {
      // Operator block with a number
      const num = shuffledNumbers[i % shuffledNumbers.length];
      const op = balancedOperators[i - 6];
      blocks.push({
        value: `${op}${Math.abs(num)}`,
        type: 'operator',
        numericValue: num,
        label: letters[i]
      });
    }
  }
  
  // Generate target number
  const targetNumber = Math.floor(Math.random() * 20) - 5; // Range from -5 to 14
  
  // Check if there's at least one valid combination
  const validCombinations = findValidCombinations(blocks, targetNumber);
  
  // If no valid combinations, recursively regenerate
  if (validCombinations.length === 0) {
    return generatePyramid();
  }
  
  return { blocks, targetNumber };
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
