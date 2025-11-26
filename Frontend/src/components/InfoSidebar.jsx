import { Link } from 'react-router-dom';

const InfoSidebar = ({ anime }) => {
  if (!anime) return null;

  const InfoRow = ({ label, value }) => {
    if (!value) return null;
    return (
      <div className="py-2 border-b border-gray-700/50">
        <dt className="text-sm text-gray-400 mb-1">{label}</dt>
        <dd className="text-sm text-white font-medium">{value}</dd>
      </div>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'currently airing':
      case 'airing':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'finished airing':
      case 'completed':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'not yet aired':
      case 'upcoming':
        return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  return (
    <div className="bg-dark-200 rounded-lg p-6 sticky top-24">
      <h3 className="text-xl font-bold text-white mb-4">Information</h3>
      
      <dl className="space-y-1">
        <InfoRow label="Type" value={anime.type} />
        <InfoRow label="Episodes" value={anime.episodes || '?'} />
        
        {anime.status && (
          <div className="py-2 border-b border-gray-700/50">
            <dt className="text-sm text-gray-400 mb-1">Status</dt>
            <dd>
              <span className={`inline-block px-2 py-1 rounded text-xs font-medium border ${getStatusColor(anime.status)}`}>
                {anime.status}
              </span>
            </dd>
          </div>
        )}
        
        <InfoRow 
          label="Aired" 
          value={
            anime.aired?.from 
              ? `${formatDate(anime.aired.from)}${anime.aired.to ? ` to ${formatDate(anime.aired.to)}` : ' to ?'}`
              : null
          } 
        />
        
        {anime.broadcast?.string && (
          <InfoRow label="Broadcast" value={anime.broadcast.string} />
        )}
        
        <InfoRow 
          label="Season" 
          value={
            anime.season && anime.year 
              ? `${anime.season.charAt(0).toUpperCase() + anime.season.slice(1)} ${anime.year}`
              : null
          } 
        />
        
        <InfoRow label="Duration" value={anime.duration} />
        <InfoRow label="Source" value={anime.source} />
        
        {anime.studios && anime.studios.length > 0 && (
          <div className="py-2 border-b border-gray-700/50">
            <dt className="text-sm text-gray-400 mb-1">Studios</dt>
            <dd className="text-sm text-white">
              {anime.studios.map((studio, index) => (
                <span key={studio.mal_id || `studio-${index}`}>
                  {studio.name}
                  {index < anime.studios.length - 1 && ', '}
                </span>
              ))}
            </dd>
          </div>
        )}
        
        {anime.producers && anime.producers.length > 0 && (
          <div className="py-2 border-b border-gray-700/50">
            <dt className="text-sm text-gray-400 mb-1">Producers</dt>
            <dd className="text-sm text-white">
              {anime.producers.slice(0, 3).map((producer, index) => (
                <span key={producer.mal_id || `producer-${index}`}>
                  {producer.name}
                  {index < Math.min(2, anime.producers.length - 1) && ', '}
                </span>
              ))}
              {anime.producers.length > 3 && ` +${anime.producers.length - 3} more`}
            </dd>
          </div>
        )}
        
        {anime.licensors && anime.licensors.length > 0 && anime.licensors[0].name !== 'None found' && (
          <div className="py-2 border-b border-gray-700/50">
            <dt className="text-sm text-gray-400 mb-1">Licensors</dt>
            <dd className="text-sm text-white">
              {anime.licensors.map((licensor, index) => (
                <span key={licensor.mal_id || `licensor-${index}`}>
                  {licensor.name}
                  {index < anime.licensors.length - 1 && ', '}
                </span>
              ))}
            </dd>
          </div>
        )}
        
        <InfoRow label="Rating" value={anime.rating} />
      </dl>

      {/* Genres */}
      {anime.genres && anime.genres.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-700/50">
          <h4 className="text-sm text-gray-400 mb-2">Genres</h4>
          <div className="flex flex-wrap gap-2">
            {anime.genres.map((genre) => (
              <Link
                key={genre.mal_id}
                to={`/browse?genre=${genre.mal_id}`}
                className="px-2 py-1 bg-primary/20 hover:bg-primary/30 text-primary text-xs rounded border border-primary/30 transition-colors"
              >
                {genre}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Themes */}
      {anime.themes && anime.themes.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm text-gray-400 mb-2">Themes</h4>
          <div className="flex flex-wrap gap-2">
            {anime.themes.map((theme) => (
              <span
                key={theme.mal_id}
                className="px-2 py-1 bg-secondary/20 text-secondary text-xs rounded border border-secondary/30"
              >
                {theme}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Demographics */}
      {anime.demographics && anime.demographics.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm text-gray-400 mb-2">Demographic</h4>
          <div className="flex flex-wrap gap-2">
            {anime.demographics.map((demo) => (
              <span
                key={demo.mal_id}
                className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded border border-purple-500/30"
              >
                {demo}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Score Stats */}
      <div className="mt-6 pt-4 border-t border-gray-700/50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">Score</span>
          <span className="text-2xl font-bold text-yellow-400">
            ⭐ {anime.score ? anime.score.toFixed(2) : 'N/A'}
          </span>
        </div>
        {anime.scored_by && (
          <p className="text-xs text-gray-500">{anime.scored_by.toLocaleString()} users</p>
        )}
        {anime.rank && (
          <p className="text-sm text-gray-400 mt-2">Ranked #{anime.rank}</p>
        )}
        {anime.popularity && (
          <p className="text-sm text-gray-400">Popularity #{anime.popularity}</p>
        )}
      </div>
    </div>
  );
};

export default InfoSidebar;
