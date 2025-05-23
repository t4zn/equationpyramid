
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface LeaderboardEntry {
  id: string;
  username: string;
  score: number;
  rounds_completed: number;
  created_at: string;
}

const LeaderboardsPage = () => {
  const { authState } = useAuth();
  const navigate = useNavigate();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Redirect if not logged in
    if (!authState.user && !authState.loading) {
      navigate('/login');
    }
  }, [authState.user, authState.loading, navigate]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        
        // Join leaderboards with profiles to get usernames
        const { data, error } = await supabase
          .from('leaderboards')
          .select(`
            id,
            score,
            rounds_completed,
            created_at,
            profiles:user_id (username)
          `)
          .order('score', { ascending: false })
          .limit(20);
          
        if (error) {
          throw error;
        }
        
        // Transform the data to flatten the structure
        const formattedData = data.map(entry => ({
          id: entry.id,
          username: entry.profiles?.username || 'Unknown Player',
          score: entry.score,
          rounds_completed: entry.rounds_completed,
          created_at: entry.created_at
        }));
        
        setLeaderboard(formattedData);
      } catch (err: any) {
        console.error('Error fetching leaderboard:', err);
        setError(err.message || 'Failed to fetch leaderboard');
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
      <Card className="w-full max-w-4xl bg-gray-800 border-yellow-500">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-yellow-400">
            Leaderboards
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-300">Loading leaderboard data...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-400">{error}</p>
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-300">No scores recorded yet. Be the first!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-gray-900 rounded-lg overflow-hidden">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Rank
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Player
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Rounds
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {leaderboard.map((entry, index) => (
                    <tr 
                      key={entry.id} 
                      className={index < 3 ? 'bg-yellow-900 bg-opacity-30' : ''}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm ${index < 3 ? 'text-yellow-400 font-bold' : 'text-gray-300'}`}>
                          #{index + 1}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white">
                          {entry.username}
                          {authState.user?.username === entry.username && (
                            <span className="ml-2 text-xs text-yellow-400">(You)</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">{entry.score}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">{entry.rounds_completed}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">
                          {new Date(entry.created_at).toLocaleDateString()}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          <div className="mt-6 flex justify-center">
            <Button 
              onClick={() => navigate('/home')} 
              className="bg-yellow-500 hover:bg-yellow-600 text-gray-900"
            >
              Back to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeaderboardsPage;
