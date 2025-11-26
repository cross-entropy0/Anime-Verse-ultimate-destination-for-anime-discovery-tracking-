import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { characterService } from '../services/characterService';
import ImageGallery from '../components/ImageGallery';
import AnimeCard from '../components/AnimeCard';
import Loader from '../components/Loader';

const CharacterDetails = () => {
  const { id } = useParams();
  const [character, setCharacter] = useState(null);
  const [pictures, setPictures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFullBio, setShowFullBio] = useState(false);

  useEffect(() => {
    const fetchCharacterData = async () => {
      try {
        setLoading(true);
        const charData = await characterService.getCharacterById(id);
        setCharacter(charData.data);
        // console.log(charData.data);

        const picsData = await characterService.getCharacterPictures(id);
        setPictures(picsData.data || []);
      } catch (error) {
        console.error('Error fetching character:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCharacterData();
  }, [id]);

  if (loading) return <Loader fullScreen />;
  if (!character) return <div className="min-h-screen flex items-center justify-center text-white">Character not found</div>;

  const bio = character.about || 'No biography available.';
  const shouldTruncate = bio.length > 500;

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div>
            <div className=" bg-dark-200 rounded-lg p-6 sticky top-24">
              <img
                src={character.images?.jpg?.image_url || character?.imageUrl}
                alt={character.name}
                className="w-full rounded-lg mb-4"
              />
              <h1 className="text-2xl font-bold text-white mb-2">{character.name}</h1>
              {character.name_kanji && <p className="text-gray-400 mb-4">{character.name_kanji}</p>}
              {character.nicknames && character.nicknames.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-400 mb-2">Nicknames</h3>
                  {character.nicknames.map((nickname, i) => (
                    <span key={i} className="inline-block bg-dark-100 px-2 py-1 rounded text-sm text-gray-300 mr-2 mb-2">
                      {nickname}
                    </span>
                  ))}
                </div>
              )}
              {character.favorites && (
                <p className="text-gray-400 text-sm">❤️ {character.favorites.toLocaleString()} favorites</p>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Biography */}
            <section className="bg-dark-200 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-white mb-4">About</h2>
              <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                {shouldTruncate && !showFullBio ? bio.slice(0, 500) + '...' : bio}
              </p>
              {shouldTruncate && (
                <button
                  onClick={() => setShowFullBio(!showFullBio)}
                  className="mt-4 text-primary hover:text-primary/80 font-medium"
                >
                  {showFullBio ? 'Show Less' : 'Read More'}
                </button>
              )}
            </section>

            {/* Voice Actors */}
            {character.voices && character.voices.length > 0 && (
              <section className="bg-dark-200 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-white mb-4">Voice Actors</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {character.voices.map((va, index) => (
                    <div key={index} className="flex items-center gap-3 bg-dark-100 p-3 rounded-lg">
                      <img
                        src={va.person.images?.jpg?.image_url}
                        alt={va.person.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-semibold text-white">{va.person.name}</p>
                        <p className="text-sm text-gray-400">{va.language}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Anime Appearances */}
            {character.anime && character.anime.length > 0 && (
              <section className="bg-dark-200 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-white mb-4">Anime Appearances</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {character.anime.slice(0, 8).map((anime) => (
                    <AnimeCard key={anime.anime.mal_id} anime={anime.anime} />
                  ))}
                </div>
              </section>
            )}

            {/* Pictures */}
            {pictures.length > 0 && (
              <section className="bg-dark-200 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-white mb-4">Pictures</h2>
                <ImageGallery images={pictures} />
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterDetails;
