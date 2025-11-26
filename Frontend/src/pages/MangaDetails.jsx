import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { mangaService } from '../services/mangaService';
import ImageGallery from '../components/ImageGallery';
import CharacterCard from '../components/CharacterCard';
import Loader from '../components/Loader';
import { PlusIcon, HeartIcon, ShareIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid, StarIcon } from '@heroicons/react/24/solid';

const MangaDetails = () => {
  const { id } = useParams();
  const [manga, setManga] = useState(null);
  const [characters, setCharacters] = useState([]);
  const [pictures, setPictures] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFullSynopsis, setShowFullSynopsis] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchMangaDetails = async () => {
      try {
        setLoading(true);

        const mangaData = await mangaService.getById(id);
        setManga(mangaData.data);

        const charactersData = await mangaService.getCharacters(id);
        setCharacters(charactersData.data || []);

        const picturesData = await mangaService.getPictures(id);
        setPictures(picturesData.data || []);

        const recsData = await mangaService.getRecommendations(id);
        setRecommendations(recsData.data?.slice(0, 10) || []);
      } catch (error) {
        console.error('Error fetching manga details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMangaDetails();
  }, [id]);

  if (loading) return <Loader fullScreen />;

  if (!manga) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😢</div>
          <h2 className="text-2xl font-bold text-white mb-2">Manga Not Found</h2>
          <p className="text-gray-400 mb-6">The manga you're looking for doesn't exist.</p>
          <Link to="/manga" className="text-primary hover:text-primary/80">
            Browse Manga →
          </Link>
        </div>
      </div>
    );
  }

  const imageUrl = manga.imageUrl || manga.images?.jpg?.large_image_url || manga.images?.jpg?.image_url;
  const synopsis = manga.synopsis || 'No synopsis available.';
  const shouldTruncateSynopsis = synopsis.length > 300;

  return (
    <div className="min-h-screen">
      {/* Hero Header */}
      <div className="relative h-[400px] w-full overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${imageUrl})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f23] via-transparent to-transparent"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex items-end h-full pb-12 gap-6">
            <img src={imageUrl} alt={manga.title} className="hidden md:block w-48 rounded-lg shadow-2xl" />
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg">{manga.title}</h1>
              {manga.titleJapanese && <p className="text-xl text-gray-300 mb-4">{manga.titleJapanese}</p>}
              <div className="flex flex-wrap items-center gap-4">
                {manga.score && (
                  <div className="flex items-center gap-2 bg-yellow-500/20 backdrop-blur-sm px-3 py-1 rounded-full border border-yellow-500/30">
                    <StarIcon className="w-5 h-5 text-yellow-400" />
                    <span className="text-white font-bold">{manga.score.toFixed(2)}</span>
                  </div>
                )}
                <span className="text-gray-300">{manga.type || 'Manga'}</span>
                {manga.chapters && <span className="text-gray-300">📖 {manga.chapters} chapters</span>}
                {manga.volumes && <span className="text-gray-300">📚 {manga.volumes} volumes</span>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Action Buttons */}
            <div className="flex gap-3">
              <button className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-semibold transition-all">
                <PlusIcon className="w-5 h-5" />
                <span>Add to List</span>
              </button>
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold ${
                  isFavorite ? 'bg-red-500 text-white' : 'bg-dark-200 text-white'
                }`}
              >
                {isFavorite ? <HeartIconSolid className="w-5 h-5" /> : <HeartIcon className="w-5 h-5" />}
              </button>
            </div>

            {/* Synopsis */}
            <div className="bg-dark-200 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Synopsis</h2>
              <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                {showFullSynopsis || !shouldTruncateSynopsis ? synopsis : `${synopsis.slice(0, 300)}...`}
              </p>
              {shouldTruncateSynopsis && (
                <button onClick={() => setShowFullSynopsis(!showFullSynopsis)} className="text-primary mt-3 flex items-center gap-1">
                  {showFullSynopsis ? <><span>Show Less</span><ChevronUpIcon className="w-4 h-4" /></> : <><span>Read More</span><ChevronDownIcon className="w-4 h-4" /></>}
                </button>
              )}
            </div>

            {/* Pictures */}
            {pictures.length > 0 && (
              <div className="bg-dark-200 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-white mb-4">Pictures</h2>
                <ImageGallery images={pictures} />
              </div>
            )}

            {/* Characters */}
            {characters.length > 0 && (
              <div className="bg-dark-200 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-white mb-4">Characters</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {characters.slice(0, 12).map((char) => (
                    <CharacterCard key={char.character.mal_id} character={char} />
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {recommendations.length > 0 && (
              <div className="bg-dark-200 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-white mb-4">You Might Also Like</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {recommendations.map((rec) => (
                    <Link key={rec.entry.mal_id} to={`/manga/${rec.entry.mal_id}`} className="group">
                      <img 
                        src={rec.entry.images?.jpg?.image_url} 
                        alt={rec.entry.title} 
                        className="w-full rounded-lg group-hover:scale-105 transition-transform"
                      />
                      <p className="text-sm text-white mt-2 truncate">{rec.entry.title}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Info Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-dark-200 rounded-lg p-6 sticky top-24">
              <h3 className="text-xl font-bold text-white mb-4">Information</h3>
              <dl className="space-y-3">
                <div><dt className="text-sm text-gray-400">Type</dt><dd className="text-white font-medium">{manga.type}</dd></div>
                <div><dt className="text-sm text-gray-400">Chapters</dt><dd className="text-white font-medium">{manga.chapters || '?'}</dd></div>
                <div><dt className="text-sm text-gray-400">Volumes</dt><dd className="text-white font-medium">{manga.volumes || '?'}</dd></div>
                <div><dt className="text-sm text-gray-400">Status</dt><dd className="text-white font-medium">{manga.status}</dd></div>
              </dl>

              {manga.genres && manga.genres.length > 0 && (
                <div className="mt-6 pt-4 border-t border-gray-700/50">
                  <h4 className="text-sm text-gray-400 mb-2">Genres</h4>
                  <div className="flex flex-wrap gap-2">
                    {manga.genres.map((g, index) => (
                      <span key={typeof g === 'string' ? `${g}-${index}` : g.mal_id} className="px-2 py-1 bg-primary/20 text-primary text-xs rounded">{typeof g === 'string' ? g : g.name}</span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6 pt-4 border-t border-gray-700/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Score</span>
                  <span className="text-2xl font-bold text-yellow-400">⭐ {manga.score ? manga.score.toFixed(2) : 'N/A'}</span>
                </div>
                {manga.scoredBy && <p className="text-xs text-gray-500">{manga.scoredBy.toLocaleString()} users</p>}
                {manga.rank && <p className="text-sm text-gray-400 mt-2">Ranked #{manga.rank}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MangaDetails;
