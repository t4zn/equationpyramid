
import React from 'react';
import { HexagonBlock } from './HexagonBlock';
import { Block } from '../types/game';

interface PyramidGridProps {
  blocks: Block[];
  selectedBlocks: number[];
  onBlockClick: (index: number) => void;
}

export const PyramidGrid: React.FC<PyramidGridProps> = ({
  blocks,
  selectedBlocks,
  onBlockClick
}) => {
  const pyramidRows = [
    [0], // Top row
    [1, 2], // Second row
    [3, 4, 5], // Third row
    [6, 7, 8, 9] // Bottom row
  ];

  return (
    <div className="flex flex-col items-center space-y-2 p-4">
      {pyramidRows.map((row, rowIndex) => (
        <div 
          key={rowIndex} 
          className="flex space-x-1"
          style={{ 
            marginLeft: `${(3 - rowIndex) * 0.5}rem` 
          }}
        >
          {row.map((blockIndex) => (
            <HexagonBlock
              key={blockIndex}
              value={blocks[blockIndex]?.value || ''}
              isSelected={selectedBlocks.includes(blockIndex)}
              selectionOrder={selectedBlocks.indexOf(blockIndex) + 1 || undefined}
              onClick={() => onBlockClick(blockIndex)}
            />
          ))}
        </div>
      ))}
    </div>
  );
};
