import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { animeService } from '../services/animeService';
import InfoSidebar from '../components/InfoSidebar';
import ImageGallery from '../components/ImageGallery';
import CharacterCard from '../components/CharacterCard';
import Carousel from '../components/Carousel';
import AnimeCard from '../components/AnimeCard';
import Loader from '../components/Loader';
import AddToWatchlistModal from '../components/AddToWatchlistModal';
import { PlusIcon, HeartIcon, ShareIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid, PlayIcon } from '@heroicons/react/24/solid';

const AnimeDetails = () => {
  const { id } = useParams();
  const [anime, setAnime] = useState(null);
  const [characters, setCharacters] = useState([]);
  const [staff, setStaff] = useState([]);
  const [pictures, setPictures] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFullSynopsis, setShowFullSynopsis] = useState(false);
  const [showStaff, setShowStaff] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchAnimeDetails = async () => {
      try {
        setLoading(true);

        // Fetch main anime data
        const animeData = await animeService.getById(id);
        setAnime(animeData.data);

        // Fetch characters
        const charactersData = await animeService.getCharacters(id);
        setCharacters(charactersData.data || []);

        // Fetch staff
        const staffData = await animeService.getStaff(id);
        setStaff(staffData.data || []);

        // Fetch pictures
        const picturesData = await animeService.getPictures(id);
        setPictures(picturesData.data || []);

        // Fetch recommendations
        const recsData = await animeService.getRecommendations(id);
        setRecommendations(recsData.data?.slice(0, 10) || []);

        // Fetch reviews
        const reviewsData = await animeService.getReviews(id);
        setReviews(reviewsData.data?.slice(0, 5) || []);
      } catch (error) {
        console.error('Error fetching anime details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnimeDetails();
  }, [id]);

  if (loading) {
    return <Loader fullScreen />;
  }

  if (!anime) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😢</div>
          <h2 className="text-2xl font-bold text-white mb-2">Anime Not Found</h2>
          <p className="text-gray-400 mb-6">The anime you're looking for doesn't exist.</p>
          <Link to="/browse" className="text-primary hover:text-primary/80">
            Browse Anime →
          </Link>
        </div>
      </div>
    );
  }

  const backdropUrl = anime.imageUrl || anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url;
  const trailerUrl = anime.trailerUrl || anime.trailer?.embed_url;
  const synopsis = anime.synopsis || 'No synopsis available.';
  const shouldTruncateSynopsis = synopsis.length > 300;

  return (
    <div className="min-h-screen">
      {/* Hero Header Section */}
      <div className="relative h-[400px] w-full overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${backdropUrl})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f23] via-transparent to-transparent"></div>
        </div>

        {/* Content Overlay */}
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-end pb-8">
          <div className="flex items-end gap-6">
            {/* Poster Thumbnail */}
            <img
              src={backdropUrl}
              alt={anime.title}
              className="hidden md:block w-48 h-72 object-cover rounded-lg shadow-2xl border-4 border-white/10"
            />

            {/* Title and Quick Stats */}
            <div className="flex-1 mb-2">
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg">
                {anime.title}
              </h1>
              {anime.title_japanese && anime.title_japanese !== anime.title && (
                <p className="text-lg text-gray-300 mb-4">{anime.title_japanese}</p>
              )}

              {/* Quick Stats Row */}
              <div className="flex flex-wrap items-center gap-3 mb-4">
                {anime.score && (
                  <div className="flex items-center gap-1 bg-yellow-500/20 backdrop-blur-sm px-3 py-1.5 rounded-full border border-yellow-500/30">
                    <span className="text-yellow-400">⭐</span>
                    <span className="text-white font-semibold">{anime.score.toFixed(1)}</span>
                  </div>
                )}
                <span className="text-gray-300">📺 {anime.episodes || '?'} eps</span>
                <span className="text-gray-300">📅 {anime.year || 'N/A'}</span>
                {anime.status && (
                  <span className="px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-sm">
                    {anime.status}
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <button 
                  onClick={() => setShowModal(true)}
                  className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  <PlusIcon className="w-5 h-5" />
                  <span>Add to List</span>
                </button>
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-5 py-2.5 rounded-lg font-semibold transition-all duration-300 border border-white/20"
                >
                  {isFavorite ? (
                    <HeartIconSolid className="w-5 h-5 text-red-500" />
                  ) : (
                    <HeartIcon className="w-5 h-5" />
                  )}
                  <span>Favorite</span>
                </button>
                <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-2.5 rounded-lg transition-all duration-300 border border-white/20">
                  <ShareIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Two-Column Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Synopsis Card */}
            <section className="bg-dark-200 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Synopsis</h2>
              <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                {shouldTruncateSynopsis && !showFullSynopsis
                  ? synopsis.slice(0, 300) + '...'
                  : synopsis}
              </p>
              {shouldTruncateSynopsis && (
                <button
                  onClick={() => setShowFullSynopsis(!showFullSynopsis)}
                  className="mt-4 text-primary hover:text-primary/80 font-medium flex items-center gap-1"
                >
                  {showFullSynopsis ? 'Show Less' : 'Read More'}
                  {showFullSynopsis ? (
                    <ChevronUpIcon className="w-4 h-4" />
                  ) : (
                    <ChevronDownIcon className="w-4 h-4" />
                  )}
                </button>
              )}

              {anime.background && (
                <div className="mt-6 pt-6 border-t border-gray-700/50">
                  <h3 className="text-lg font-semibold text-white mb-3">Background</h3>
                  <p className="text-gray-300 leading-relaxed">{anime.background}</p>
                </div>
              )}
            </section>

            {/* Trailer Card */}
            {trailerUrl && (
              <section className="bg-dark-200 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-white mb-4">Trailer</h2>
                <div className="aspect-video rounded-lg overflow-hidden bg-black">
                  <iframe
                    src={trailerUrl}
                    title="Anime Trailer"
                    className="w-full h-full"
                    allowFullScreen
                  ></iframe>
                </div>
              </section>
            )}

            {/* Pictures/Screenshots Section */}
            {pictures.length > 0 && (
              <section className="bg-dark-200 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-white mb-4">Pictures & Artwork</h2>
                <ImageGallery images={pictures} />
              </section>
            )}

            {/* Characters Section */}
            {characters.length > 0 && (
              <section className="bg-dark-200 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-white mb-4">Characters</h2>
                <Carousel
                  items={characters.slice(0, 12)}
                  slidesToShow={5}
                  renderItem={(character) => <CharacterCard character={character} />}
                />
              </section>
            )}

            {/* Staff Section (Collapsible) */}
            {staff.length > 0 && (
              <section className="bg-dark-200 rounded-lg p-6">
                <button
                  onClick={() => setShowStaff(!showStaff)}
                  className="w-full flex items-center justify-between text-2xl font-bold text-white mb-4 hover:text-gray-300 transition-colors"
                >
                  <span>Staff & Production ({staff.length})</span>
                  {showStaff ? (
                    <ChevronUpIcon className="w-6 h-6" />
                  ) : (
                    <ChevronDownIcon className="w-6 h-6" />
                  )}
                </button>
                {showStaff && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {staff.map((member, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-dark-100 rounded-lg">
                        <img
                          src={member.person.images?.jpg?.image_url}
                          alt={member.person.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-white text-sm">{member.person.name}</p>
                          <p className="text-xs text-gray-400">{member.positions.join(', ')}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* MAL Reviews Section */}
            {reviews.length > 0 && (
              <section className="bg-dark-200 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <h2 className="text-2xl font-bold text-white">Reviews from MyAnimeList</h2>
                  <img src="https://cdn.myanimelist.net/img/sp/icon/apple-touch-icon-256.png" alt="MAL" className="w-6 h-6" />
                </div>
                <div className="space-y-4">
                  {reviews.map((review, index) => (
                    <div key={index} className="p-4 bg-dark-100 rounded-lg">
                      <div className="flex items-center gap-3 mb-3">
                        <img
                          src={review.user.images?.jpg?.image_url || 'https://via.placeholder.com/40'}
                          alt={review.user.username}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-white">{review.user.username}</p>
                          <p className="text-xs text-gray-400">
                            {new Date(review.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-400">⭐</span>
                          <span className="text-white font-semibold">{review.score}/10</span>
                        </div>
                      </div>
                      <p className="text-gray-300 text-sm line-clamp-4">{review.review}</p>
                      {review.reactions?.overall && (
                        <p className="text-xs text-gray-500 mt-2">
                          👍 {review.reactions.overall} found helpful
                        </p>
                      )}
                    </div>
                  ))}
                </div>
                <a
                  href={`https://myanimelist.net/anime/${id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center mt-4 text-primary hover:text-primary/80 font-medium"
                >
                  View All Reviews on MyAnimeList →
                </a>
              </section>
            )}

            {/* Recommendations Section */}
            {recommendations.length > 0 && (
              <section className="bg-dark-200 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-white mb-4">You Might Also Like</h2>
                <Carousel
                  items={recommendations}
                  slidesToShow={5}
                  renderItem={(rec) => <AnimeCard anime={rec.entry} />}
                />
              </section>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1">
            <InfoSidebar anime={anime} />
          </div>
        </div>
      </div>

      <AddToWatchlistModal
        anime={anime}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={() => setShowModal(false)}
      />
    </div>
  );
};

export default AnimeDetails;
