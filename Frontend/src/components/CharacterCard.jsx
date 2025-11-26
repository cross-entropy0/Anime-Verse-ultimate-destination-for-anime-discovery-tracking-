import { Link } from 'react-router-dom';

const CharacterCard = ({ character }) => {
  const mainVA = character.voice_actors?.find((va) => va.language === 'Japanese');
//   console.log(character);

  return (
    <Link
      to={`/character/${character.character.mal_id}`}
      className="group relative bg-dark-200 rounded-lg overflow-hidden hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 hover:-translate-y-1"
    >
      {/* Character Image */}
      <div className="aspect-[3/4] overflow-hidden">
        <img
          src={character.character.images?.jpg?.image_url}
          alt={character.character.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
      </div>

      {/* Character Info */}
      <div className="p-3">
        <h4 className="font-semibold text-white text-sm mb-1 line-clamp-2">
          {character.character.name}
        </h4>
        
        {/* Role Badge */}
        <span
          className={`inline-block px-2 py-0.5 rounded text-xs font-medium mb-2 ${
            character.role === 'Main'
              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
              : 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
          }`}
        >
          {character.role}
        </span>

        {/* Voice Actor */}
        {mainVA && (
          <div className="flex items-center gap-2 mt-2">
            <img
              src={mainVA.person.images?.jpg?.image_url}
              alt={mainVA.person.name}
              className="w-6 h-6 rounded-full object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-400 truncate">{mainVA.person.name}</p>
              <p className="text-xs text-gray-500">🇯🇵 {mainVA.language}</p>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
};

export default CharacterCard;
