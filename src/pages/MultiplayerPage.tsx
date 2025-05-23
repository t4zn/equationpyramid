
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

const MultiplayerPage = () => {
  const navigate = useNavigate();

  const handleMultiplayerAction = () => {
    toast({
      title: "Coming Soon",
      description: "Multiplayer functionality will be available in a future update!",
    });
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat flex flex-col items-center p-4 pt-8"
      style={{
        backgroundImage: "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><rect width=\"100\" height=\"100\" fill=\"%23333\"/><circle cx=\"20\" cy=\"20\" r=\"1\" fill=\"%23444\"/><circle cx=\"80\" cy=\"40\" r=\"1\" fill=\"%23444\"/><circle cx=\"40\" cy=\"80\" r=\"1\" fill=\"%23444\"/></svg>')"
      }}
    >
      <Card className="w-full max-w-md bg-gray-800 border-yellow-500">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-yellow-400">
            Multiplayer Modes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Button 
              onClick={handleMultiplayerAction}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
            >
              Local Multiplayer
            </Button>
            
            <Button 
              onClick={handleMultiplayerAction}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3"
            >
              Online Quick Match
            </Button>
            
            <Button 
              onClick={handleMultiplayerAction}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3"
            >
              Create Private Room
            </Button>
            
            <Button 
              onClick={handleMultiplayerAction}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3"
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
    </div>
  );
};

export default MultiplayerPage;
