
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
        "relative w-16 h-20 cursor-pointer transition-all duration-200 pt-6",
        "hover:scale-105 hover:shadow-lg",
        className
      )}
      onClick={onClick}
    >
      {/* Letter label above hexagon */}
      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
        <span className="text-sm font-bold bg-gray-800 text-yellow-400 px-2 py-1 rounded-full border-2 border-yellow-500">
          {label.toUpperCase()}
        </span>
      </div>
      
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
              ? "fill-yellow-500 stroke-yellow-300 stroke-2" 
              : "fill-gray-700 stroke-gray-500 stroke-1 hover:fill-gray-600"
          )}
        />
      </svg>
      
      {/* Value content */}
      <div className="absolute inset-0 top-8 flex items-center justify-center">
        <span className={cn(
          "text-base font-bold transition-colors duration-200",
          isSelected ? "text-black" : "text-white"
        )}>
          {value}
        </span>
      </div>
      
      {/* Selection order indicator */}
      {isSelected && selectionOrder && (
        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center font-bold border-2 border-white">
          {selectionOrder}
        </div>
      )}
    </div>
  );
};
