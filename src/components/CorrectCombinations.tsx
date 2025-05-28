
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

interface CorrectCombinationsProps {
  combinations: string[];
  isMultiplayer?: boolean;
  allPlayersCombinations?: { username: string; combination: string }[];
}

export const CorrectCombinations: React.FC<CorrectCombinationsProps> = ({ 
  combinations, 
  isMultiplayer = false,
  allPlayersCombinations = []
}) => {
  return (
    <Card className="bg-gray-800/90 border-green-500 border-2 max-h-80 overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-green-400 text-sm flex items-center">
          <CheckCircle size={16} className="mr-2" />
          {isMultiplayer ? 'All Correct Solutions' : 'Your Correct Solutions'}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 max-h-60 overflow-y-auto">
        {isMultiplayer ? (
          <div className="space-y-2">
            {allPlayersCombinations.length === 0 ? (
              <p className="text-gray-400 text-xs">No solutions found yet...</p>
            ) : (
              allPlayersCombinations.map((item, index) => (
                <div key={index} className="bg-gray-700/50 p-2 rounded text-xs">
                  <div className="text-blue-400 font-semibold">{item.username}</div>
                  <div className="text-green-300 font-mono">{item.combination}</div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-1">
            {combinations.length === 0 ? (
              <p className="text-gray-400 text-xs">No correct solutions yet...</p>
            ) : (
              combinations.map((combination, index) => (
                <div key={index} className="text-green-300 text-xs font-mono bg-gray-700/50 p-2 rounded">
                  {combination}
                </div>
              ))
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
