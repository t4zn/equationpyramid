
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BackButtonProps {
  onClick: () => void;
  className?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({ onClick, className = '' }) => {
  return (
    <Button
      onClick={onClick}
      variant="ghost"
      size="icon"
      className={`fixed top-4 left-4 z-50 bg-gray-800/80 hover:bg-gray-700/80 text-white border border-gray-600 ${className}`}
    >
      <ArrowLeft size={20} />
    </Button>
  );
};
