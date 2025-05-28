
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Trophy, Medal, Award, Home } from 'lucide-react';

interface LeaderboardEntry {
  id: string;
  score: number;
  rounds_completed: number;
  created_at: string;
  user_id: string;
  username?: string;
}

const LeaderboardsPage = () => {
  const navigate = useNavigate();
  const { authState } = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      // First get leaderboards
      const { data: leaderboardData, error: leaderboardError } = await supabase
        .from('leaderboards')
        .select('*')
        .order('score', { ascending: false })
        .limit(10);

      if (leaderboardError) {
        console.error('Error fetching leaderboard:', leaderboardError);
        setLeaderboard([]);
        return;
      }

      // Then get profiles for usernames
      const userIds = leaderboardData?.map(entry => entry.user_id) || [];
      if (userIds.length > 0) {
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, username')
          .in('id', userIds);

        if (profilesError) {
          console.error('Error fetching profiles:', profilesError);
        }

        // Combine the data
        const combinedData = leaderboardData?.map(entry => ({
          ...entry,
          username: profilesData?.find(profile => profile.id === entry.user_id)?.username || 'Anonymous'
        })) || [];

        setLeaderboard(combinedData);
      } else {
        setLeaderboard([]);
      }
    } catch (error) {
      console.error('Error in fetchLeaderboard:', error);
      setLeaderboard([]);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 2: return <Medal className="w-5 h-5 text-gray-400" />;
      case 3: return <Award className="w-5 h-5 text-amber-600" />;
      default: return <span className="w-5 h-5 flex items-center justify-center text-gray-400 font-bold text-sm">{rank}</span>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
        <div className="text-white text-lg">Loading leaderboards...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-2 sm:p-4">
      <div className="max-w-lg mx-auto">
        <Card className="bg-gradient-to-br from-gray-800 to-gray-700 border-2 border-yellow-500 shadow-2xl">
          <CardHeader className="bg-gradient-to-r from-yellow-600 to-yellow-500 text-black p-4">
            <CardTitle className="text-xl sm:text-2xl font-bold text-center flex items-center justify-center">
              <Trophy className="mr-2" size={24} />
              Leaderboards
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            {leaderboard.length === 0 ? (
              <div className="text-center text-gray-300 py-6">
                <Trophy className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                <p className="text-lg">No scores yet!</p>
                <p className="text-gray-400 text-sm">Be the first to set a high score.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {leaderboard.map((entry, index) => (
                  <div
                    key={entry.id}
                    className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                      index === 0
                        ? 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border-yellow-500'
                        : index === 1
                        ? 'bg-gradient-to-r from-gray-400/20 to-gray-500/20 border-gray-400'
                        : index === 2
                        ? 'bg-gradient-to-r from-amber-600/20 to-amber-700/20 border-amber-600'
                        : 'bg-gray-800/50 border-gray-600'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      {getRankIcon(index + 1)}
                      <div>
                        <div className="text-white font-semibold text-sm sm:text-base">
                          {entry.username}
                        </div>
                        <div className="text-gray-300 text-xs">
                          {entry.rounds_completed} rounds
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg sm:text-xl font-bold text-green-400">
                        {entry.score}
                      </div>
                      <div className="text-xs text-gray-400">
                        {new Date(entry.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="mt-6 flex justify-center">
              <Button
                onClick={() => navigate('/home')}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-2 text-base font-semibold flex items-center w-full sm:w-auto"
              >
                <Home className="mr-2" size={18} />
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LeaderboardsPage;
