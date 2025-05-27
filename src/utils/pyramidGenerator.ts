import { Block } from '../types/game';

const operators = ['+', '-', '×', '÷'];
const numbers = [-11, -10, -9, -5, -3, -1, +1, +3, +4, +5, +6, +7, +9, +11];

export const generatePyramid = (): { blocks: Block[], targetNumber: number } => {
  const blocks: Block[] = [];
  
  // Generate 10 blocks for the pyramid (4 + 3 + 2 + 1)
  const shuffledNumbers = [...numbers].sort(() => Math.random() - 0.5);
  
  // Force more multiplication and division operators
  // Create an array with guaranteed × and ÷ operators
  const guaranteedOperators = ['×', '×', '÷', '÷', '+', '-']; // 2 each of × and ÷, 1 each of + and -
  const additionalOperators = ['+', '-', '×', '÷']; // Additional operators to fill
  
  // Shuffle both arrays
  const shuffledGuaranteed = guaranteedOperators.sort(() => Math.random() - 0.5);
  const shuffledAdditional = additionalOperators.sort(() => Math.random() - 0.5);
  
  // Combine for final operator array
  const finalOperators = [...shuffledGuaranteed, ...shuffledAdditional].slice(0, 4);
  
  // Letter labels a-j for blocks
  const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
  
  // Define pyramid structure with row information
  const pyramidStructure = [
    { row: 1, positions: [0] },
    { row: 2, positions: [1, 2] },
    { row: 3, positions: [3, 4, 5] },
    { row: 4, positions: [6, 7, 8, 9] }
  ];
  
  // Ensure operators are distributed across different rows
  const operatorPositions = [];
  
  // Place one operator in each row to ensure distribution
  for (let rowInfo of pyramidStructure) {
    if (operatorPositions.length < 4) {
      const randomPosInRow = rowInfo.positions[Math.floor(Math.random() * rowInfo.positions.length)];
      // Avoid duplicates
      if (!operatorPositions.includes(randomPosInRow)) {
        operatorPositions.push(randomPosInRow);
      }
    }
  }
  
  // If we need more operators, add them randomly from remaining positions
  while (operatorPositions.length < 4) {
    const randomPos = Math.floor(Math.random() * 10);
    if (!operatorPositions.includes(randomPos)) {
      operatorPositions.push(randomPos);
    }
  }
  
  // Create blocks with better distribution
  for (let i = 0; i < 10; i++) {
    const operatorIndex = operatorPositions.indexOf(i);
    
    if (operatorIndex !== -1) {
      // This position should be an operator
      const operator = finalOperators[operatorIndex];
      const num = Math.abs(shuffledNumbers[i % shuffledNumbers.length]);
      blocks.push({
        value: `${operator}${num}`,
        type: 'operator',
        numericValue: num,
        label: letters[i]
      });
    } else {
      // This position should be a number
      const num = shuffledNumbers[i % shuffledNumbers.length];
      blocks.push({
        value: num > 0 ? `+${num}` : `${num}`,
        type: 'number',
        numericValue: num,
        label: letters[i]
      });
    }
  }
  
  // Generate target number
  const targetNumber = Math.floor(Math.random() * 30) - 10; // Range from -10 to 19
  
  // Check if there's at least one valid combination
  const validCombinations = findValidCombinations(blocks, targetNumber);
  
  // If no valid combinations, recursively regenerate
  if (validCombinations.length === 0) {
    return generatePyramid();
  }
  
  console.log('Generated pyramid with operators:', 
    blocks.filter(b => b.type === 'operator').map(b => b.value),
    'Valid combinations:', validCombinations.length
  );
  
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
