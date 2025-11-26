import { Link } from 'react-router-dom';
import { 
  HeartIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/outline';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    'Browse': [
      { name: 'Top Anime', path: '/anime/top' },
      { name: 'Seasonal Anime', path: '/seasonal' },
      { name: 'Random Anime', path: '/random' },
      { name: 'Top Manga', path: '/manga/top' },
    ],
    'Community': [
      { name: 'Browse Anime', path: '/browse' },
      { name: 'Reviews', path: '/reviews' },
      { name: 'Recommendations', path: '/recommendations' },
    ],
    'Support': [
      { name: 'About', path: '/about' },
      { name: 'Contact', path: '/contact' },
      { name: 'Privacy Policy', path: '/privacy' },
      { name: 'Terms of Service', path: '/terms' },
    ],
  };

  return (
    <footer className="bg-dark-200 border-t border-dark-400 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-1">
            <Link to="/" className="flex items-center space-x-2 group mb-4">
              <img 
                src="/Animeverse.png" 
                alt="AnimeVerse Logo" 
                className="h-10 w-auto"
              />
              <span className="text-xl font-display font-bold text-white">
                Anime<span className="text-gradient">Verse</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm mb-4">
              Your ultimate destination for anime discovery, tracking, and community engagement.
            </p>
            <p className="text-gray-500 text-xs">
              Data provided by{' '}
              <a
                href="https://myanimelist.net"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-secondary transition-colors"
              >
                MyAnimeList
              </a>
            </p>
          </div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-white font-semibold mb-4">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-gray-400 text-sm hover:text-primary transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-dark-400 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-gray-400 text-sm">
            © {currentYear} AnimeVerse. All rights reserved.
          </p>
          
          <div className="flex items-center space-x-4 text-gray-400 text-sm">
            <p className="flex items-center">
              Made with <HeartIcon className="w-4 h-4 text-primary mx-1 animate-pulse" /> for anime fans
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <a
              href="mailto:contact@animesite.com"
              className="text-gray-400 hover:text-primary transition-colors duration-200"
            >
              <EnvelopeIcon className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
