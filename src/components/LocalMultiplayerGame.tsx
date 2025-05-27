
import React from 'react';
import { MultiplayerGameScreen } from './MultiplayerGameScreen';

interface LocalMultiplayerGameProps {
  playerCount: number;
}

export const LocalMultiplayerGame: React.FC<LocalMultiplayerGameProps> = ({ playerCount }) => {
  return <MultiplayerGameScreen gameMode="local" playerCount={playerCount} />;
};
