
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface LeaderboardEntry {
  id: string;
  score: number;
  rounds_completed: number;
  created_at: string;
  profiles?: {
    username: string;
  };
}

const LeaderboardsPage = () => {
  const navigate = useNavigate();
  const { authState } = useAuth();
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authState.user && !authState.loading) {
      navigate('/login');
    }
  }, [authState.user, authState.loading, navigate]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        // Get leaderboard data with profile information
        const { data, error } = await supabase
          .from('leaderboards')
          .select('*, profiles:user_id(username)')
          .order('score', { ascending: false })
          .limit(50);

        if (error) {
          throw error;
        }

        setLeaderboardData(data || []);
      } catch (error) {
        console.error('Error fetching leaderboard data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load leaderboard data.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat flex flex-col items-center p-4 pt-8"
      style={{
        backgroundImage: "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><rect width=\"100\" height=\"100\" fill=\"%23333\"/><circle cx=\"20\" cy=\"20\" r=\"1\" fill=\"%23444\"/><circle cx=\"80\" cy=\"40\" r=\"1\" fill=\"%23444\"/><circle cx=\"40\" cy=\"80\" r=\"1\" fill=\"%23444\"/></svg>')"
      }}
    >
      <Card className="w-full max-w-3xl bg-gray-800 border-yellow-500">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-yellow-400">
            Top Scores
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-4">
              <p className="text-white">Loading leaderboard data...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-white">
                <thead>
                  <tr className="border-b border-gray-600">
                    <th className="px-4 py-2 text-left">Rank</th>
                    <th className="px-4 py-2 text-left">Player</th>
                    <th className="px-4 py-2 text-right">Score</th>
                    <th className="px-4 py-2 text-right">Rounds</th>
                    <th className="px-4 py-2 text-right">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboardData.map((entry, index) => (
                    <tr key={entry.id} className={`border-b border-gray-700 ${index < 3 ? 'bg-gray-700' : ''}`}>
                      <td className="px-4 py-2">
                        <span className={`font-bold ${
                          index === 0 ? 'text-yellow-400' : 
                          index === 1 ? 'text-gray-300' : 
                          index === 2 ? 'text-yellow-700' : ''
                        }`}>
                          {index + 1}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        {entry.profiles?.username || 'Unknown Player'}
                      </td>
                      <td className="px-4 py-2 text-right font-mono">
                        {entry.score}
                      </td>
                      <td className="px-4 py-2 text-right">
                        {entry.rounds_completed}
                      </td>
                      <td className="px-4 py-2 text-right text-xs">
                        {new Date(entry.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                  {leaderboardData.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                        No scores recorded yet. Be the first to play!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
          
          <div className="mt-6 flex justify-center">
            <button 
              onClick={() => navigate('/home')}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded"
            >
              Back to Home
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeaderboardsPage;
