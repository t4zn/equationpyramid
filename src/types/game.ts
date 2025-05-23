
export interface Block {
  value: string;
  type: 'number' | 'operator';
  numericValue?: number;
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
}

export interface EquationResult {
  isValid: boolean;
  result?: number;
  equation?: string;
  message: string;
}
