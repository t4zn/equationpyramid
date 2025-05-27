
import React from 'react';
import { MultiplayerGameScreen } from './MultiplayerGameScreen';

interface OnlineMultiplayerGameProps {
  roomId: string;
  playerCount: number;
}

export const OnlineMultiplayerGame: React.FC<OnlineMultiplayerGameProps> = ({ 
  roomId, 
  playerCount 
}) => {
  return <MultiplayerGameScreen gameMode="online" playerCount={playerCount} roomId={roomId} />;
};
