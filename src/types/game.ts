
export interface Block {
  value: string;
  type: 'number' | 'operator';
  numericValue?: number;
  label: string; // Letter label (a-j)
}

export interface GameState {
  blocks: Block[];
  targetNumber: number;
  selectedBlocks: number[];
  currentEquation: string;
  score: number;
  timeRemaining: number;
  gameStatus: 'playing' | 'paused' | 'completed';
  round: number;
  inputValue: string; // For letter-based input
  history: {
    equation: string;
    result: number;
    success: boolean;
  }[];
}

export interface EquationResult {
  isValid: boolean;
  result?: number;
  equation?: string;
  message: string;
}
