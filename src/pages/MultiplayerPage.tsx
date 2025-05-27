
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Clock, Users, Trophy, ChevronLeft, Play } from 'lucide-react';
import { LocalMultiplayerGame } from '@/components/LocalMultiplayerGame';
import { OnlineMultiplayerGame } from '@/components/OnlineMultiplayerGame';

interface RoomInfo {
  id: string;
  name: string;
  players: number;
  maxPlayers: number;
  status: 'waiting' | 'playing' | 'completed';
}

const MultiplayerPage = () => {
  const navigate = useNavigate();
  const { authState } = useAuth();
  const [activeSection, setActiveSection] = useState<'main' | 'localGame' | 'onlineGame' | 'onlineRooms'>('main');
  const [roomName, setRoomName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [availableRooms, setAvailableRooms] = useState<RoomInfo[]>([]);
  const [createRoomDialogOpen, setCreateRoomDialogOpen] = useState(false);
  const [joinRoomDialogOpen, setJoinRoomDialogOpen] = useState(false);
  const [localPlayerCount, setLocalPlayerCount] = useState(2);
  const [maxPlayers, setMaxPlayers] = useState(2);
  const [currentRoomId, setCurrentRoomId] = useState('');
  
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
        setActiveSection('localGame');
        break;
      case 'online':
        // Generate mock rooms with realistic data
        const mockRooms: RoomInfo[] = [
          { id: 'r1', name: 'Quick Match Room #1', players: 3, maxPlayers: 4, status: 'waiting' },
          { id: 'r2', name: 'Tournament Championship', players: 4, maxPlayers: 4, status: 'playing' },
          { id: 'r3', name: 'Beginners Welcome', players: 1, maxPlayers: 3, status: 'waiting' },
          { id: 'r4', name: 'Speed Challenge', players: 2, maxPlayers: 4, status: 'waiting' },
          { id: 'r5', name: 'Math Masters Only', players: 2, maxPlayers: 2, status: 'playing' },
        ];
        setAvailableRooms(mockRooms);
        setActiveSection('onlineRooms');
        break;
      case 'create':
        setCreateRoomDialogOpen(true);
        break;
      case 'join':
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
    
    const generatedRoomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    setRoomCode(generatedRoomCode);
    setCurrentRoomId(generatedRoomCode);
    
    toast({
      title: "Room Created Successfully!",
      description: `Room "${roomName}" created. Code: ${generatedRoomCode}`,
    });
    
    setCreateRoomDialogOpen(false);
    setActiveSection('onlineGame');
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
    
    // Simulate room validation
    toast({
      title: "Joining Room...",
      description: "Connecting to the private room.",
    });
    
    setTimeout(() => {
      setCurrentRoomId(roomCode);
      setJoinRoomDialogOpen(false);
      setActiveSection('onlineGame');
      toast({
        title: "Successfully Joined!",
        description: `Connected to room ${roomCode}`,
      });
    }, 1500);
  };
  
  const startLocalMultiplayerGame = () => {
    setActiveSection('localGame');
  };
  
  const joinOnlineQuickMatch = (roomId: string) => {
    const room = availableRooms.find(r => r.id === roomId);
    if (!room || room.status !== 'waiting') {
      toast({
        title: "Cannot Join Room",
        description: "Room is full or game already started.",
        variant: "destructive",
      });
      return;
    }
    
    setCurrentRoomId(roomId);
    setActiveSection('onlineGame');
    toast({
      title: "Joined Quick Match!",
      description: `Connected to ${room.name}`,
    });
  };
  
  const renderMainMenu = () => (
    <Card className="w-full max-w-lg bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-2 border-yellow-500 shadow-2xl">
      <CardHeader className="bg-gradient-to-r from-yellow-600 to-yellow-500 text-black">
        <CardTitle className="text-3xl font-bold text-center flex items-center justify-center">
          <Users className="mr-3" size={32} />
          Multiplayer Arena
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        <div className="space-y-4">
          <Button 
            onClick={() => handleMultiplayerAction('local')}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 text-lg flex items-center justify-center shadow-lg transform hover:scale-105 transition-all"
          >
            <Users className="mr-3" size={24} />
            Local Multiplayer
            <span className="ml-auto text-sm opacity-75">Same Device</span>
          </Button>
          
          <Button 
            onClick={() => handleMultiplayerAction('online')}
            className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-4 text-lg flex items-center justify-center shadow-lg transform hover:scale-105 transition-all"
          >
            <Trophy className="mr-3" size={24} />
            Quick Match Online
            <span className="ml-auto text-sm opacity-75">Find Players</span>
          </Button>
          
          <div className="grid grid-cols-2 gap-3">
            <Button 
              onClick={() => handleMultiplayerAction('create')}
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-3 flex flex-col items-center shadow-lg transform hover:scale-105 transition-all"
            >
              <Play className="mb-1" size={20} />
              Create Room
            </Button>
            
            <Button 
              onClick={() => handleMultiplayerAction('join')}
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-3 flex flex-col items-center shadow-lg transform hover:scale-105 transition-all"
            >
              <Users className="mb-1" size={20} />
              Join Room
            </Button>
          </div>
        </div>
        
        <div className="pt-4 flex justify-center">
          <Button 
            onClick={() => navigate('/home')} 
            variant="outline"
            className="border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-gray-900 px-8 py-2 font-semibold"
          >
            ← Back to Home
          </Button>
        </div>
      </CardContent>
    </Card>
  );
  
  const renderOnlineRooms = () => (
    <Card className="w-full max-w-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-2 border-yellow-500 shadow-2xl">
      <CardHeader className="bg-gradient-to-r from-green-600 to-green-500 text-white">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className="mr-3 text-white hover:bg-white/20" 
            onClick={() => setActiveSection('main')}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <CardTitle className="text-2xl font-bold">
            Online Quick Match
          </CardTitle>
        </div>
        <CardDescription className="text-green-100">
          Join an available online game room
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        <div className="space-y-3">
          {availableRooms.map(room => (
            <div key={room.id} className="bg-gradient-to-r from-gray-800 to-gray-700 p-4 rounded-lg border border-gray-600 hover:border-yellow-500 transition-all">
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <h3 className="text-white font-semibold text-lg">{room.name}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-300 mt-1">
                    <span className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {room.players}/{room.maxPlayers} players
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      room.status === 'waiting' ? 'bg-green-600 text-white' :
                      room.status === 'playing' ? 'bg-orange-600 text-white' :
                      'bg-gray-600 text-white'
                    }`}>
                      {room.status === 'waiting' ? 'Open' : 
                       room.status === 'playing' ? 'In Progress' : 'Completed'}
                    </span>
                  </div>
                </div>
                <Button
                  onClick={() => joinOnlineQuickMatch(room.id)}
                  disabled={room.status !== 'waiting' || room.players >= room.maxPlayers}
                  className={room.status === 'waiting' && room.players < room.maxPlayers
                    ? "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800" 
                    : "bg-gray-600 cursor-not-allowed"}
                >
                  {room.status === 'waiting' && room.players < room.maxPlayers ? 'Join' : 
                   room.status === 'playing' ? 'In Progress' : 'Full'}
                </Button>
              </div>
            </div>
          ))}
          
          {availableRooms.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <Trophy className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-xl mb-2">No active rooms found</p>
              <p className="text-sm">Try again later or create your own room</p>
            </div>
          )}
        </div>
        
        <Button
          onClick={() => {
            const randomRoom = availableRooms.find(r => r.status === 'waiting' && r.players < r.maxPlayers);
            if (randomRoom) {
              joinOnlineQuickMatch(randomRoom.id);
            } else {
              toast({
                title: "No Available Rooms",
                description: "All rooms are full or in progress. Try creating your own!",
                variant: "destructive",
              });
            }
          }}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 text-lg"
        >
          Quick Join Any Available Room
        </Button>
        
        <Button 
          onClick={() => setActiveSection('main')} 
          variant="outline"
          className="w-full border-2 border-gray-500 text-gray-300 hover:bg-gray-700"
        >
          Back to Menu
        </Button>
      </CardContent>
    </Card>
  );

  // Render active game screen
  if (activeSection === 'localGame') {
    return <LocalMultiplayerGame playerCount={localPlayerCount} />;
  }
  
  if (activeSection === 'onlineGame') {
    return <OnlineMultiplayerGame roomId={currentRoomId} playerCount={4} />;
  }

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat flex flex-col items-center p-4 pt-8"
      style={{
        backgroundImage: "linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.9)), url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><rect width=\"100\" height=\"100\" fill=\"%23111827\"/><circle cx=\"20\" cy=\"20\" r=\"2\" fill=\"%23fbbf24\" opacity=\"0.6\"/><circle cx=\"80\" cy=\"40\" r=\"1.5\" fill=\"%23fbbf24\" opacity=\"0.4\"/><circle cx=\"40\" cy=\"80\" r=\"2\" fill=\"%23fbbf24\" opacity=\"0.5\"/><circle cx=\"60\" cy=\"20\" r=\"1\" fill=\"%23fbbf24\" opacity=\"0.3\"/><circle cx=\"10\" cy=\"60\" r=\"1.5\" fill=\"%23fbbf24\" opacity=\"0.4\"/></svg>')"
      }}
    >
      {activeSection === 'main' && renderMainMenu()}
      {activeSection === 'onlineRooms' && renderOnlineRooms()}
      
      {/* Create Room Dialog */}
      <Dialog open={createRoomDialogOpen} onOpenChange={setCreateRoomDialogOpen}>
        <DialogContent className="bg-gradient-to-br from-gray-900 to-gray-800 text-white border-2 border-yellow-500">
          <DialogHeader>
            <DialogTitle className="text-2xl text-yellow-400">Create Private Room</DialogTitle>
            <DialogDescription className="text-gray-300 text-base">
              Create your own game room and invite friends with a room code
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-300">Room Name</label>
              <Input
                placeholder="My Awesome Pyramid Challenge"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white focus:border-yellow-500 text-lg"
              />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-300">Maximum Players</label>
              <div className="grid grid-cols-4 gap-2">
                {[2, 3, 4, 5].map(count => (
                  <Button 
                    key={count}
                    onClick={() => setMaxPlayers(count)}
                    variant={maxPlayers === count ? "default" : "outline"}
                    className={maxPlayers === count 
                      ? "bg-yellow-500 text-black border-yellow-400" 
                      : "border-gray-500 text-gray-300 hover:border-yellow-500"}
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
              className="border-gray-500 text-gray-300 hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button 
              onClick={createPrivateRoom}
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black hover:from-yellow-400 hover:to-yellow-500 font-semibold"
            >
              Create Room
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Join Room Dialog */}
      <Dialog open={joinRoomDialogOpen} onOpenChange={setJoinRoomDialogOpen}>
        <DialogContent className="bg-gradient-to-br from-gray-900 to-gray-800 text-white border-2 border-yellow-500">
          <DialogHeader>
            <DialogTitle className="text-2xl text-yellow-400">Join Private Room</DialogTitle>
            <DialogDescription className="text-gray-300 text-base">
              Enter the 6-character room code shared by your friend
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-300">Room Code</label>
              <Input
                placeholder="ABC123"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                className="bg-gray-700 border-gray-600 text-white text-center tracking-widest text-2xl font-mono focus:border-yellow-500"
                maxLength={6}
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setJoinRoomDialogOpen(false)}
              className="border-gray-500 text-gray-300 hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button 
              onClick={joinPrivateRoom}
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black hover:from-yellow-400 hover:to-yellow-500 font-semibold"
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
