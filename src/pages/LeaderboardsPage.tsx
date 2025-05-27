
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
  username?: string;
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
        // Get leaderboard data with profile information using a join
        const { data, error } = await supabase
          .from('leaderboards')
          .select(`
            id,
            score,
            rounds_completed,
            created_at,
            user_id,
            profiles!inner(username)
          `)
          .order('score', { ascending: false })
          .limit(50);

        if (error) {
          throw error;
        }

        // Transform the data to match our interface
        const transformedData = (data || []).map(item => ({
          id: item.id,
          score: item.score,
          rounds_completed: item.rounds_completed,
          created_at: item.created_at,
          username: item.profiles?.username || 'Unknown Player'
        }));

        setLeaderboardData(transformedData);
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
        backgroundImage: "linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.9)), url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><rect width=\"100\" height=\"100\" fill=\"%231a1a2e\"/><circle cx=\"20\" cy=\"20\" r=\"2\" fill=\"%23ffd700\" opacity=\"0.6\"/><circle cx=\"80\" cy=\"40\" r=\"1.5\" fill=\"%23ffd700\" opacity=\"0.4\"/><circle cx=\"40\" cy=\"80\" r=\"2\" fill=\"%23ffd700\" opacity=\"0.5\"/><circle cx=\"60\" cy=\"20\" r=\"1\" fill=\"%23ffd700\" opacity=\"0.3\"/><circle cx=\"10\" cy=\"60\" r=\"1.5\" fill=\"%23ffd700\" opacity=\"0.4\"/></svg>')"
      }}
    >
      <Card className="w-full max-w-4xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-2 border-yellow-500 shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-yellow-600 to-yellow-500 text-black">
          <CardTitle className="text-3xl font-bold text-center">
            🏆 Hall of Champions 🏆
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {loading ? (
            <div className="flex justify-center items-center p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
              <p className="text-white ml-4 text-lg">Loading champions...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-white">
                <thead>
                  <tr className="border-b-2 border-yellow-500">
                    <th className="px-6 py-4 text-left text-yellow-400 font-bold">Rank</th>
                    <th className="px-6 py-4 text-left text-yellow-400 font-bold">Champion</th>
                    <th className="px-6 py-4 text-right text-yellow-400 font-bold">Score</th>
                    <th className="px-6 py-4 text-right text-yellow-400 font-bold">Rounds</th>
                    <th className="px-6 py-4 text-right text-yellow-400 font-bold">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboardData.map((entry, index) => (
                    <tr key={entry.id} className={`border-b border-gray-700 hover:bg-gray-700/50 transition-colors ${index < 3 ? 'bg-gradient-to-r from-yellow-900/20 to-transparent' : ''}`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {index === 0 && <span className="text-2xl mr-2">🥇</span>}
                          {index === 1 && <span className="text-2xl mr-2">🥈</span>}
                          {index === 2 && <span className="text-2xl mr-2">🥉</span>}
                          <span className={`font-bold text-lg ${
                            index === 0 ? 'text-yellow-400' : 
                            index === 1 ? 'text-gray-300' : 
                            index === 2 ? 'text-yellow-600' : 'text-white'
                          }`}>
                            #{index + 1}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-lg">
                          {entry.username}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="font-mono text-xl font-bold text-green-400">
                          {entry.score.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-blue-400 font-semibold">
                          {entry.rounds_completed}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-sm text-gray-400">
                        {new Date(entry.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                  {leaderboardData.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center">
                        <div className="text-gray-400">
                          <div className="text-6xl mb-4">🎯</div>
                          <div className="text-xl">No champions yet!</div>
                          <div className="text-sm mt-2">Be the first to conquer the pyramid!</div>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
          
          <div className="mt-8 flex justify-center">
            <button 
              onClick={() => navigate('/home')}
              className="bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              ← Back to Home
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeaderboardsPage;
