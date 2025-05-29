import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BackButton } from '@/components/BackButton';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Trophy, Medal, Award } from 'lucide-react';

interface LeaderboardEntry {
  id: string;
  username: string;
  score: number;
  created_at: string;
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
      const { data: leaderboardData, error: leaderboardError } = await supabase
        .from('leaderboards')
        .select(`
          *,
          profiles!inner(username)
        `)
        .order('score', { ascending: false })
        .limit(10);

      if (leaderboardError) {
        console.error('Error fetching leaderboard:', leaderboardError);
        setLeaderboard([]);
        return;
      }

      const combinedData = leaderboardData?.map(entry => ({
        ...entry,
        username: entry.profiles?.username || 'Anonymous'
      })) || [];

      setLeaderboard(combinedData);
    } catch (error) {
      console.error('Error in fetchLeaderboard:', error);
      setLeaderboard([]);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="w-5 h-5 text-white" />;
      case 2: return <Medal className="w-5 h-5 text-gray-300" />;
      case 3: return <Award className="w-5 h-5 text-gray-400" />;
      default: return <span className="w-5 h-5 flex items-center justify-center text-gray-400 font-bold text-sm">{rank}</span>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#232323] to-[#111] flex items-center justify-center p-4">
        <div className="text-white text-lg">Loading leaderboards...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#232323] to-[#111] p-2 sm:p-4 relative">
      <BackButton onClick={() => navigate('/home')} />
      
      <div className="max-w-lg mx-auto pt-16">
        <Card className="bg-[#333] border-2 border-[#444] shadow-2xl">
          <CardHeader className="bg-[#222] text-white p-4">
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
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      entry.username === authState.user?.username
                        ? 'bg-[#444]'
                        : 'bg-[#222]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {getRankIcon(index + 1)}
                      <span className="text-white font-medium">{entry.username}</span>
                    </div>
                    <span className="text-white font-bold">{entry.score}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LeaderboardsPage;
