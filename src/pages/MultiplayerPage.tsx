
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Clock, Users, Trophy, ChevronLeft } from 'lucide-react';

interface RoomInfo {
  id: string;
  name: string;
  players: number;
  status: 'waiting' | 'playing' | 'completed';
}

const MultiplayerPage = () => {
  const navigate = useNavigate();
  const { authState } = useAuth();
  const [activeSection, setActiveSection] = useState<'main' | 'localMultiplayer' | 'onlineQuickMatch' | 'privateRoom' | 'joinRoom'>('main');
  const [roomName, setRoomName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [availableRooms, setAvailableRooms] = useState<RoomInfo[]>([]);
  const [createRoomDialogOpen, setCreateRoomDialogOpen] = useState(false);
  const [joinRoomDialogOpen, setJoinRoomDialogOpen] = useState(false);
  const [localPlayerCount, setLocalPlayerCount] = useState(2);
  
  const handleMultiplayerAction = (action: string) => {
    if (!authState.user) {
      toast({
        title: "Authentication Required",
        description: "Please login to use multiplayer features.",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }
    
    switch(action) {
      case 'local':
        setActiveSection('localMultiplayer');
        break;
      case 'online':
        // Simulate fetching available rooms
        const mockRooms: RoomInfo[] = [
          { id: 'r1', name: 'Quick Match #1', players: 3, status: 'waiting' },
          { id: 'r2', name: 'Tournament Room', players: 5, status: 'playing' },
          { id: 'r3', name: 'Beginners Only', players: 2, status: 'waiting' },
        ];
        setAvailableRooms(mockRooms);
        setActiveSection('onlineQuickMatch');
        break;
      case 'create':
        setActiveSection('privateRoom');
        setCreateRoomDialogOpen(true);
        break;
      case 'join':
        setActiveSection('joinRoom');
        setJoinRoomDialogOpen(true);
        break;
      default:
        toast({
          title: "Coming Soon",
          description: "This multiplayer feature will be available soon!",
        });
    }
  };
  
  const createPrivateRoom = () => {
    if (!roomName.trim()) {
      toast({
        title: "Room Name Required",
        description: "Please enter a name for your private room.",
        variant: "destructive",
      });
      return;
    }
    
    // Generate random room code
    const generatedRoomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    setRoomCode(generatedRoomCode);
    
    toast({
      title: "Room Created",
      description: `Your private room "${roomName}" has been created. Code: ${generatedRoomCode}`,
    });
    
    setCreateRoomDialogOpen(false);
    // In a real app, we would create the room in the database
  };
  
  const joinPrivateRoom = () => {
    if (!roomCode.trim()) {
      toast({
        title: "Room Code Required",
        description: "Please enter the room code to join.",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, we would check if the room exists and try to join it
    toast({
      title: "Joining Room...",
      description: "Attempting to connect to the private room.",
    });
    
    // Simulate an error for demonstration purposes
    setTimeout(() => {
      toast({
        title: "Room Not Found",
        description: "The room code you entered doesn't exist or the game has already started.",
        variant: "destructive",
      });
    }, 1500);
    
    setJoinRoomDialogOpen(false);
  };
  
  const startLocalMultiplayerGame = () => {
    toast({
      title: "Starting Local Multiplayer",
      description: `Starting game with ${localPlayerCount} players.`,
    });
    // In a real app, we would navigate to the game screen with local multiplayer settings
  };
  
  const joinOnlineQuickMatch = (roomId: string) => {
    toast({
      title: "Joining Quick Match",
      description: "Connecting to the multiplayer server...",
    });
    // In a real app, we would join the selected room
  };
  
  const renderMainMenu = () => (
    <Card className="w-full max-w-md bg-gray-800 border-yellow-500">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center text-yellow-400">
          Multiplayer Modes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Button 
            onClick={() => handleMultiplayerAction('local')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 flex items-center justify-center"
          >
            <Users className="mr-2" size={20} />
            Local Multiplayer
          </Button>
          
          <Button 
            onClick={() => handleMultiplayerAction('online')}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 flex items-center justify-center"
          >
            <Trophy className="mr-2" size={20} />
            Online Quick Match
          </Button>
          
          <Button 
            onClick={() => handleMultiplayerAction('create')}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 flex items-center justify-center"
          >
            Create Private Room
          </Button>
          
          <Button 
            onClick={() => handleMultiplayerAction('join')}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 flex items-center justify-center"
          >
            Join Private Room
          </Button>
        </div>
        
        <div className="pt-4 flex justify-center">
          <Button 
            onClick={() => navigate('/home')} 
            variant="outline"
            className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-gray-900"
          >
            Back to Home
          </Button>
        </div>
      </CardContent>
    </Card>
  );
  
  const renderLocalMultiplayer = () => (
    <Card className="w-full max-w-md bg-gray-800 border-yellow-500">
      <CardHeader>
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className="mr-2" 
            onClick={() => setActiveSection('main')}
          >
            <ChevronLeft className="h-5 w-5 text-yellow-400" />
          </Button>
          <CardTitle className="text-2xl font-bold text-yellow-400">
            Local Multiplayer
          </CardTitle>
        </div>
        <CardDescription className="text-gray-300">
          Play on the same device taking turns
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-white mb-2">Number of Players:</h3>
          <div className="flex space-x-2">
            {[2, 3, 4].map(count => (
              <Button 
                key={count}
                variant={localPlayerCount === count ? "default" : "outline"}
                className={localPlayerCount === count 
                  ? "bg-yellow-500 text-black flex-1" 
                  : "border-gray-500 text-gray-300 flex-1"}
                onClick={() => setLocalPlayerCount(count)}
              >
                {count}
              </Button>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-white mb-2">Game Options:</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between bg-gray-700 p-3 rounded-md">
              <span className="text-white">Time per player:</span>
              <span className="text-yellow-400 font-semibold">2 minutes</span>
            </div>
            <div className="flex items-center justify-between bg-gray-700 p-3 rounded-md">
              <span className="text-white">Win condition:</span>
              <span className="text-yellow-400 font-semibold">Highest score</span>
            </div>
          </div>
        </div>
        
        <Button
          onClick={startLocalMultiplayerGame}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 mt-4"
        >
          Start Game
        </Button>
        
        <Button 
          onClick={() => setActiveSection('main')} 
          variant="outline"
          className="w-full border-gray-500 text-gray-300 hover:bg-gray-700 mt-2"
        >
          Back
        </Button>
      </CardContent>
    </Card>
  );
  
  const renderOnlineQuickMatch = () => (
    <Card className="w-full max-w-md bg-gray-800 border-yellow-500">
      <CardHeader>
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className="mr-2" 
            onClick={() => setActiveSection('main')}
          >
            <ChevronLeft className="h-5 w-5 text-yellow-400" />
          </Button>
          <CardTitle className="text-2xl font-bold text-yellow-400">
            Online Quick Match
          </CardTitle>
        </div>
        <CardDescription className="text-gray-300">
          Join an available online game
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          {availableRooms.map(room => (
            <div key={room.id} className="bg-gray-700 p-3 rounded-md flex justify-between items-center">
              <div>
                <h3 className="text-white font-medium">{room.name}</h3>
                <p className="text-sm text-gray-300">Players: {room.players}</p>
              </div>
              <Button
                onClick={() => joinOnlineQuickMatch(room.id)}
                disabled={room.status !== 'waiting'}
                className={room.status === 'waiting' 
                  ? "bg-green-600 hover:bg-green-700" 
                  : "bg-gray-600 cursor-not-allowed"}
              >
                {room.status === 'waiting' ? 'Join' : 'In Progress'}
              </Button>
            </div>
          ))}
          
          {availableRooms.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <p>No active rooms found.</p>
              <p className="text-sm mt-2">Try again later or create your own room.</p>
            </div>
          )}
        </div>
        
        <Button
          onClick={() => {
            toast({
              title: "Searching for Match",
              description: "Looking for available players...",
            });
            // In a real app, we would search for a random match
          }}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
        >
          Quick Join Any Game
        </Button>
        
        <Button 
          onClick={() => setActiveSection('main')} 
          variant="outline"
          className="w-full border-gray-500 text-gray-300 hover:bg-gray-700"
        >
          Back
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat flex flex-col items-center p-4 pt-8"
      style={{
        backgroundImage: "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><rect width=\"100\" height=\"100\" fill=\"%23333\"/><circle cx=\"20\" cy=\"20\" r=\"1\" fill=\"%23444\"/><circle cx=\"80\" cy=\"40\" r=\"1\" fill=\"%23444\"/><circle cx=\"40\" cy=\"80\" r=\"1\" fill=\"%23444\"/></svg>')"
      }}
    >
      {activeSection === 'main' && renderMainMenu()}
      {activeSection === 'localMultiplayer' && renderLocalMultiplayer()}
      {activeSection === 'onlineQuickMatch' && renderOnlineQuickMatch()}
      
      {/* Create Room Dialog */}
      <Dialog open={createRoomDialogOpen} onOpenChange={setCreateRoomDialogOpen}>
        <DialogContent className="bg-gray-800 text-white border-yellow-500">
          <DialogHeader>
            <DialogTitle className="text-yellow-400">Create Private Room</DialogTitle>
            <DialogDescription className="text-gray-300">
              Give your room a name. Other players can join with your room code.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-sm text-gray-300">Room Name</label>
              <Input
                placeholder="My Awesome Game"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-300">Max Players</label>
              <div className="flex space-x-2">
                {[2, 3, 4, 5].map(count => (
                  <Button 
                    key={count}
                    variant="outline"
                    className="border-gray-500 text-gray-300 flex-1"
                  >
                    {count}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setCreateRoomDialogOpen(false)}
              className="border-gray-500 text-gray-300"
            >
              Cancel
            </Button>
            <Button 
              onClick={createPrivateRoom}
              className="bg-yellow-500 text-black hover:bg-yellow-400"
            >
              Create Room
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Join Room Dialog */}
      <Dialog open={joinRoomDialogOpen} onOpenChange={setJoinRoomDialogOpen}>
        <DialogContent className="bg-gray-800 text-white border-yellow-500">
          <DialogHeader>
            <DialogTitle className="text-yellow-400">Join Private Room</DialogTitle>
            <DialogDescription className="text-gray-300">
              Enter the room code provided by the room creator.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-sm text-gray-300">Room Code</label>
              <Input
                placeholder="Enter 6-character code"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                className="bg-gray-700 border-gray-600 text-white text-center tracking-widest text-lg font-mono"
                maxLength={6}
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setJoinRoomDialogOpen(false)}
              className="border-gray-500 text-gray-300"
            >
              Cancel
            </Button>
            <Button 
              onClick={joinPrivateRoom}
              className="bg-yellow-500 text-black hover:bg-yellow-400"
            >
              Join Room
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MultiplayerPage;
