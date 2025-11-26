import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { animeService } from '../services/animeService';
import Loader from '../components/Loader';
import { ArrowPathIcon, PlayIcon } from '@heroicons/react/24/solid';

const Random = () => {
  const navigate = useNavigate();
  const [anime, setAnime] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchRandomAnime = async () => {
    try {
      setLoading(true);
      const response = await animeService.getRandomAnime();
      setAnime(response.data);
    } catch (error) {
      console.error('Error fetching random anime:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRandomAnime();
  }, []);

  if (loading) return <Loader fullScreen />;
  if (!anime) return null;

  const backdropUrl = anime.imageUrl || anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url;
  const synopsis = anime.synopsis || 'No synopsis available.';

  return (
    <div className="min-h-screen">
      <div className="relative h-screen w-full overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${backdropUrl})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-black/70"></div>
        </div>

        <div className="relative h-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center">
          <div className="text-6xl mb-6">🎲</div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 drop-shadow-lg">
            {anime.title}
          </h1>
          {anime.titleJapanese && (
            <p className="text-2xl text-gray-300 mb-6">{anime.titleJapanese}</p>
          )}

          <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
            {anime.score && (
              <div className="flex items-center gap-2 bg-yellow-500/20 backdrop-blur-sm px-4 py-2 rounded-full border border-yellow-500/30">
                <span className="text-yellow-400 text-xl">⭐</span>
                <span className="text-white font-bold text-xl">{anime.score.toFixed(1)}</span>
              </div>
            )}
            <span className="text-gray-300 text-lg">📺 {anime.episodes || '?'} episodes</span>
            <span className="text-gray-300 text-lg">📅 {anime.year || 'N/A'}</span>
            <span className="text-gray-300 text-lg">{anime.type || 'TV'}</span>
          </div>

          <p className="text-gray-300 text-lg mb-8 max-w-2xl line-clamp-4">{synopsis}</p>

          {anime.genres && anime.genres.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center mb-10">
              {anime.genres.slice(0, 5).map((genre, index) => (
                <span
                  key={typeof genre === 'string' ? `${genre}-${index}` : genre.mal_id || index}
                  className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white"
                >
                  {typeof genre === 'string' ? genre : genre.name}
                </span>
              ))}
            </div>
          )}

          <div className="flex gap-4">
            <button
              onClick={() => navigate(`/anime/${anime.malId}`)}
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <PlayIcon className="w-6 h-6" />
              <span>View Details</span>
            </button>
            <button
              onClick={fetchRandomAnime}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 border border-white/20"
            >
              <ArrowPathIcon className="w-6 h-6" />
              <span>Roll Again</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Random;
