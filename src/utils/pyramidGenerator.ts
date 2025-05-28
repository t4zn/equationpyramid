import { Block } from '../types/game';

const operators = ['+', '-', '×', '÷'];
const baseNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export const generatePyramid = () => {
  let attempts = 0;
  const maxAttempts = 50;
  
  while (attempts < maxAttempts) {
    const blocks: Block[] = [];
    const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
    
    // Generate all 10 blocks with operator+number format
    const operatorCounts = { '+': 0, '-': 0, '×': 0, '÷': 0 };
    
    for (let i = 0; i < 10; i++) {
      const number = baseNumbers[Math.floor(Math.random() * baseNumbers.length)];
      
      // Ensure at least one of each operator
      let operator;
      if (i < 4) {
        operator = operators[i];
      } else {
        // For remaining blocks, pick randomly but prefer less used operators
        const availableOps = operators.filter(op => operatorCounts[op] < 3);
        operator = availableOps.length > 0 
          ? availableOps[Math.floor(Math.random() * availableOps.length)]
          : operators[Math.floor(Math.random() * operators.length)];
      }
      
      operatorCounts[operator]++;
      
      blocks.push({
        value: `${operator}${number}`,
        type: 'number',
        numericValue: operator === '-' ? -number : 
                     operator === '+' ? number :
                     operator === '×' ? number :
                     operator === '÷' ? number : number,
        label: letters[i]
      });
    }
    
    // Generate target number
    const targetNumber = Math.floor(Math.random() * 41) + 10;
    
    // Check if we can find valid combinations
    const validCombinations = findValidCombinations(blocks, targetNumber);
    
    if (validCombinations.length >= 2 && validCombinations.length <= 4) {
      return { blocks, targetNumber };
    }
    
    attempts++;
  }
  
  // Fallback
  return generateFallbackPyramid();
};

const generateFallbackPyramid = () => {
  const blocks: Block[] = [
    { value: '+5', type: 'number', numericValue: 5, label: 'a' },
    { value: '-3', type: 'number', numericValue: -3, label: 'b' },
    { value: '×2', type: 'number', numericValue: 2, label: 'c' },
    { value: '÷4', type: 'number', numericValue: 4, label: 'd' },
    { value: '+7', type: 'number', numericValue: 7, label: 'e' },
    { value: '-1', type: 'number', numericValue: -1, label: 'f' },
    { value: '×3', type: 'number', numericValue: 3, label: 'g' },
    { value: '+2', type: 'number', numericValue: 2, label: 'h' },
    { value: '+6', type: 'number', numericValue: 6, label: 'i' },
    { value: '+1', type: 'number', numericValue: 1, label: 'j' }
  ];
  
  return { blocks, targetNumber: 15 };
};

export const findValidCombinations = (blocks: Block[], target: number): number[][] => {
  const validCombinations: number[][] = [];
  
  for (let i = 0; i < blocks.length; i++) {
    for (let j = 0; j < blocks.length; j++) {
      for (let k = 0; k < blocks.length; k++) {
        if (i !== j && j !== k && i !== k) {
          const result = evaluateEquation([i, j, k], blocks);
          if (result.isValid && result.result === target) {
            validCombinations.push([i, j, k]);
            if (validCombinations.length >= 4) {
              return validCombinations;
            }
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
  
  const result = (first.numericValue || 0) + (second.numericValue || 0) + (third.numericValue || 0);
  
  const equation = `${first.label}(${first.value}) + ${second.label}(${second.value}) + ${third.label}(${third.value}) = ${result}`;
  
  return {
    isValid: true,
    result: Math.round(result * 100) / 100,
    equation,
    message: 'Valid equation!'
  };
};

export const parseLetterInput = (input: string, blocks: Block[]): number[] => {
  const letters = input.toLowerCase().replace(/[^a-j]/g, '').split('');
  const uniqueLetters = [...new Set(letters)];
  
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
