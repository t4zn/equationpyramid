
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
        "relative w-20 h-24 cursor-pointer transition-all duration-300 pt-4",
        "hover:scale-110 hover:shadow-2xl transform-gpu",
        className
      )}
      onClick={onClick}
    >
      {/* Letter label above hexagon - Enhanced styling */}
      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 z-20">
        <div className="relative">
          <span className="text-lg font-black bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-yellow-400 px-3 py-2 rounded-full border-3 border-yellow-500 shadow-lg backdrop-blur-sm">
            {label.toUpperCase()}
          </span>
          {/* Glow effect */}
          <div className="absolute inset-0 bg-yellow-400/20 rounded-full blur-sm -z-10"></div>
        </div>
      </div>
      
      {/* Hexagon SVG with enhanced styling */}
      <svg 
        viewBox="0 0 100 100" 
        className="w-full h-full drop-shadow-xl"
      >
        {/* Shadow/glow effect */}
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <linearGradient id="selectedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{stopColor:"#fbbf24", stopOpacity:1}} />
            <stop offset="100%" style={{stopColor:"#f59e0b", stopOpacity:1}} />
          </linearGradient>
          <linearGradient id="normalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{stopColor:"#4b5563", stopOpacity:1}} />
            <stop offset="100%" style={{stopColor:"#374151", stopOpacity:1}} />
          </linearGradient>
        </defs>
        
        <polygon
          points="50,8 82,28 82,72 50,92 18,72 18,28"
          className={cn(
            "transition-all duration-300",
            isSelected 
              ? "stroke-yellow-300 stroke-4" 
              : "stroke-gray-500 stroke-2 hover:stroke-gray-400"
          )}
          fill={isSelected ? "url(#selectedGradient)" : "url(#normalGradient)"}
          filter={isSelected ? "url(#glow)" : "none"}
        />
      </svg>
      
      {/* Value content with enhanced styling */}
      <div className="absolute inset-0 top-6 flex items-center justify-center">
        <span className={cn(
          "text-lg font-black transition-all duration-300 drop-shadow-md",
          isSelected ? "text-black scale-110" : "text-white"
        )}>
          {value}
        </span>
      </div>
      
      {/* Selection order indicator with enhanced styling */}
      {isSelected && selectionOrder && (
        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm rounded-full flex items-center justify-center font-bold border-3 border-white shadow-lg animate-pulse">
          {selectionOrder}
        </div>
      )}
      
      {/* Hover effect ring */}
      <div className={cn(
        "absolute inset-0 top-4 rounded-full transition-all duration-300 pointer-events-none",
        "ring-0 ring-yellow-400/0",
        !isSelected && "hover:ring-2 hover:ring-yellow-400/50"
      )}></div>
    </div>
  );
};
