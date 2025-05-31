import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, RefreshCw } from 'lucide-react';

interface HexagonData {
  id: string;
  letter: string;
  value: string | number;
  status?: 'initial' | 'selected' | 'correct' | 'incorrect';
}

const GamePage = () => {
  const navigate = useNavigate();
  const [score, setScore] = useState(10);
  const [target, setTarget] = useState(20);
  const [timeLeft, setTimeLeft] = useState(120);
  const [combinations, setCombinations] = useState<string[]>([]);
  const [selectedHexagons, setSelectedHexagons] = useState<string[]>([]);
  const [showMenu, setShowMenu] = useState(false);

  // Timer formatting
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Example hexagons data
  const hexagons: HexagonData[] = [
    { id: 'A', letter: 'A', value: '+1' },
    { id: 'B', letter: 'B', value: '÷4' },
    { id: 'C', letter: 'C', value: '×3' },
    { id: 'D', letter: 'D', value: '-10' },
    { id: 'E', letter: 'E', value: '÷5' },
    { id: 'F', letter: 'F', value: '×6' },
    { id: 'G', letter: 'G', value: '-11' },
    { id: 'H', letter: 'H', value: '+7' },
    { id: 'I', letter: 'I', value: '÷9' },
    { id: 'J', letter: 'J', value: '+9' },
  ];

  const handleHexagonClick = (hexagon: HexagonData) => {
    if (selectedHexagons.includes(hexagon.id)) {
      setSelectedHexagons(prev => prev.filter(id => id !== hexagon.id));
    } else if (selectedHexagons.length < 3) {
      setSelectedHexagons(prev => [...prev, hexagon.id]);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center p-4">
      {/* Top Bar */}
      <div className="w-full flex justify-between items-center mb-8">
        <Button variant="ghost" className="text-white" onClick={() => setShowMenu(true)}>
          <Menu className="w-6 h-6" />
        </Button>
      </div>

      {/* Game Stats */}
      <div className="w-full flex justify-between items-center mb-8 font-inter">
        <div className="text-center">
          <div className="text-white text-sm">Score</div>
          <div className="text-[#DAA520] text-2xl font-bold">{score}</div>
        </div>
        <div className="text-center">
          <div className="text-white text-sm">Target</div>
          <div className="text-[#DAA520] text-2xl font-bold">{target}</div>
        </div>
        <div className="text-center">
          <div className="text-white text-sm">Time</div>
          <div className="text-white text-2xl font-bold">{formatTime(timeLeft)}</div>
        </div>
      </div>

      {/* Hexagon Grid */}
      <div className="flex flex-col items-center gap-[-8px] mb-8">
        {/* Row 1 */}
        <div className="flex justify-center">
          <button
            onClick={() => handleHexagonClick(hexagons[0])}
            className="w-16 h-16 bg-white flex flex-col items-center justify-center transform rotate-0 hover:scale-105 transition-transform"
            style={{
              clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
              margin: '0 -4px'
            }}
          >
            <span className="font-league-spartan text-xs text-black">{hexagons[0].letter}</span>
            <span className="font-league-spartan text-lg text-black">{hexagons[0].value}</span>
          </button>
        </div>

        {/* Row 2 */}
        <div className="flex justify-center -mt-3">
          {hexagons.slice(1, 3).map(hex => (
            <button
              key={hex.id}
              onClick={() => handleHexagonClick(hex)}
              className="w-16 h-16 bg-white flex flex-col items-center justify-center transform hover:scale-105 transition-transform"
              style={{
                clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                margin: '0 -4px'
              }}
            >
              <span className="font-league-spartan text-xs text-black">{hex.letter}</span>
              <span className="font-league-spartan text-lg text-black">{hex.value}</span>
            </button>
          ))}
        </div>

        {/* Row 3 */}
        <div className="flex justify-center -mt-3">
          {hexagons.slice(3, 6).map(hex => (
            <button
              key={hex.id}
              onClick={() => handleHexagonClick(hex)}
              className="w-16 h-16 bg-white flex flex-col items-center justify-center transform hover:scale-105 transition-transform"
              style={{
                clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                margin: '0 -4px'
              }}
            >
              <span className="font-league-spartan text-xs text-black">{hex.letter}</span>
              <span className="font-league-spartan text-lg text-black">{hex.value}</span>
            </button>
          ))}
        </div>

        {/* Row 4 */}
        <div className="flex justify-center -mt-3">
          {hexagons.slice(6, 10).map(hex => (
            <button
              key={hex.id}
              onClick={() => handleHexagonClick(hex)}
              className="w-16 h-16 bg-white flex flex-col items-center justify-center transform hover:scale-105 transition-transform"
              style={{
                clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                margin: '0 -4px'
              }}
            >
              <span className="font-league-spartan text-xs text-black">{hex.letter}</span>
              <span className="font-league-spartan text-lg text-black">{hex.value}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Combinations */}
      <div className="w-full mb-4">
        <div className="text-white font-inter mb-2">Combinations</div>
        <div className="flex flex-wrap gap-2">
          {combinations.map((combo, index) => (
            <span
              key={index}
              className="bg-[#DAA520] text-black px-3 py-1 rounded-full text-sm font-inter"
            >
              {combo}
            </span>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <div className="w-full flex justify-between items-center mt-4">
        <Button
          className="w-32 h-10 bg-white text-black rounded-full font-inter"
          onClick={() => {/* Handle submit */}}
        >
          Submit
        </Button>
        <Button
          variant="ghost"
          className="text-white"
          onClick={() => {/* Handle refresh */}}
        >
          <RefreshCw className="w-6 h-6" />
        </Button>
      </div>

      {/* Menu Modal */}
      {showMenu && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-80">
            <h2 className="text-xl font-bold mb-4">Menu</h2>
            <div className="space-y-3">
              <Button
                className="w-full"
                onClick={() => setShowMenu(false)}
              >
                Resume
              </Button>
              <Button
                className="w-full"
                onClick={() => {/* Handle restart */}}
              >
                Restart
              </Button>
              <Button
                className="w-full"
                onClick={() => navigate('/home')}
              >
                Quit
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GamePage;