import { useState, useEffect } from 'react';
import { animeService } from '../services/animeService';
import AnimeGrid from '../components/AnimeGrid';
import Loader from '../components/Loader';

const Recommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        // Get top anime as recommendations
        const response = await animeService.getTopAnime({ limit: 30 });
        if (response.success && response.data) {
          setRecommendations(response.data);
        }
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  if (loading) return <Loader fullScreen />;

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Recommended for You
          </h1>
          <p className="text-gray-400">
            Based on popular and top-rated anime
          </p>
        </div>

        <AnimeGrid anime={recommendations} columns={5} />
      </div>
    </div>
  );
};

export default Recommendations;
