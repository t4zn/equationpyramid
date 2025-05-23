
import React from 'react';
import { cn } from '@/lib/utils';

interface HexagonBlockProps {
  value: string;
  label: string;
  isSelected: boolean;
  selectionOrder?: number;
  onClick: () => void;
  className?: string;
}

export const HexagonBlock: React.FC<HexagonBlockProps> = ({
  value,
  label,
  isSelected,
  selectionOrder,
  onClick,
  className
}) => {
  return (
    <div
      className={cn(
        "relative w-16 h-16 cursor-pointer transition-all duration-200",
        "hover:scale-105 hover:shadow-lg",
        className
      )}
      onClick={onClick}
    >
      {/* Hexagon SVG */}
      <svg 
        viewBox="0 0 100 100" 
        className="w-full h-full"
      >
        <polygon
          points="50,5 85,25 85,75 50,95 15,75 15,25"
          className={cn(
            "transition-all duration-200",
            isSelected 
              ? "fill-yellow-400 stroke-yellow-500 stroke-2" 
              : "fill-gray-100 stroke-gray-300 stroke-1 hover:fill-gray-200"
          )}
        />
      </svg>
      
      {/* Letter label */}
      <div className="absolute top-1 left-2 z-10">
        <span className="text-xs font-bold text-gray-900 bg-gray-300 px-1 rounded">
          {label}
        </span>
      </div>
      
      {/* Value content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={cn(
          "text-sm font-bold transition-colors duration-200",
          isSelected ? "text-gray-900" : "text-gray-700"
        )}>
          {value}
        </span>
      </div>
      
      {/* Selection order indicator */}
      {isSelected && selectionOrder && (
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-600 text-white text-xs rounded-full flex items-center justify-center font-bold">
          {selectionOrder}
        </div>
      )}
    </div>
  );
};
