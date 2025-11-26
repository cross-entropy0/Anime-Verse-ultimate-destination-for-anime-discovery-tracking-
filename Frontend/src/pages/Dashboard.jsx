import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { watchlistService } from '../services/watchlistService';
import { animeService } from '../services/animeService';
import AnimeCard from '../components/AnimeCard';
import Carousel from '../components/Carousel';
import SectionHeader from '../components/SectionHeader';
import Loader from '../components/Loader';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const [recentlyWatched, setRecentlyWatched] = useState([]);
  const [continueWatching, setContinueWatching] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch stats
      const statsRes = await watchlistService.getStats();
      setStats(statsRes.data);

      // Fetch continue watching (watching status)
      const watchingRes = await watchlistService.getWatchlist({ status: 'watching', limit: 10 });
      setContinueWatching(watchingRes.data || []);

      // Fetch recently completed
      const completedRes = await watchlistService.getWatchlist({ status: 'completed', limit: 10 });
      setRecentlyWatched(completedRes.data || []);

      // Fetch recommendations (top anime)
      const recsRes = await animeService.getTopAnime({ limit: 10 });
      setRecommendations(recsRes.data || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Welcome back, {user?.username}! 👋
          </h1>
          <p className="text-gray-400">Here's what's happening with your anime</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 rounded-lg p-6">
            <div className="text-3xl font-bold text-primary mb-2">{stats?.completed || 0}</div>
            <p className="text-gray-300">Completed</p>
          </div>
          <div className="bg-gradient-to-br from-blue-500/20 to-blue-500/5 border border-blue-500/30 rounded-lg p-6">
            <div className="text-3xl font-bold text-blue-400 mb-2">{stats?.watching || 0}</div>
            <p className="text-gray-300">Watching</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-500/5 border border-yellow-500/30 rounded-lg p-6">
            <div className="text-3xl font-bold text-yellow-400 mb-2">{stats?.planToWatch || 0}</div>
            <p className="text-gray-300">Plan to Watch</p>
          </div>
          <div className="bg-gradient-to-br from-green-500/20 to-green-500/5 border border-green-500/30 rounded-lg p-6">
            <div className="text-3xl font-bold text-green-400 mb-2">
              {stats?.averageRating > 0 ? stats.averageRating : 'N/A'}
            </div>
            <p className="text-gray-300">Avg Rating</p>
          </div>
        </div>

        {/* Continue Watching */}
        {continueWatching.length > 0 && (
          <section className="mb-12">
            <SectionHeader
              title="Continue Watching"
              subtitle="Pick up where you left off"
              linkTo="/watchlist"
              linkText="View Watchlist"
            />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {continueWatching.slice(0, 5).map((item) => (
                <div key={item._id}>
                  <AnimeCard anime={item.anime} />
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                      <span>Episode {item.episodesWatched || 0}</span>
                      <span>{item.anime?.episodes || '?'}</span>
                    </div>
                    <div className="w-full bg-dark-300 rounded-full h-1.5">
                      <div
                        className="bg-primary h-1.5 rounded-full"
                        style={{ width: `${(item.episodesWatched / (item.anime?.episodes || 1)) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Recently Completed */}
        {recentlyWatched.length > 0 && (
          <section className="mb-12">
            <SectionHeader
              title="Recently Completed"
              subtitle="Your finished anime"
            />
            <Carousel
              items={recentlyWatched}
              slidesToShow={5}
              renderItem={(item) => <AnimeCard anime={item.anime} />}
            />
          </section>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <section>
            <SectionHeader
              title="Recommended for You"
              subtitle="Based on your preferences"
              linkTo="/browse"
            />
            <Carousel
              items={recommendations}
              slidesToShow={5}
              renderItem={(anime) => <AnimeCard anime={anime} />}
            />
          </section>
        )}

        {/* Empty State */}
        {continueWatching.length === 0 && recentlyWatched.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🍿</div>
            <h3 className="text-2xl font-semibold text-white mb-2">Your Dashboard is Empty</h3>
            <p className="text-gray-400 mb-6">Start watching anime to see your activity here</p>
            <Link
              to="/browse"
              className="inline-block bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-semibold"
            >
              Explore Anime
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
