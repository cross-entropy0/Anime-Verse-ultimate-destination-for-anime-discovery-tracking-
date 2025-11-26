import { Link } from 'react-router-dom';
import { 
  HeartIcon, 
  RocketLaunchIcon, 
  UserGroupIcon,
  SparklesIcon 
} from '@heroicons/react/24/outline';

const About = () => {
  const features = [
    {
      icon: RocketLaunchIcon,
      title: 'Discover New Anime',
      description: 'Explore thousands of anime titles with our powerful search and filtering system. Find your next favorite series effortlessly.'
    },
    {
      icon: HeartIcon,
      title: 'Track Your Progress',
      description: 'Keep track of what you\'re watching, completed series, and your plan-to-watch list. Never lose track of your anime journey.'
    },
    {
      icon: UserGroupIcon,
      title: 'Join the Community',
      description: 'Share your thoughts, read reviews, and connect with fellow anime enthusiasts from around the world.'
    },
    {
      icon: SparklesIcon,
      title: 'Personalized Recommendations',
      description: 'Get tailored anime recommendations based on your watch history and preferences. Discover hidden gems you\'ll love.'
    }
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-4">
            About <span className="text-gradient">AnimeVerse</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Your ultimate destination for anime discovery, tracking, and community engagement.
          </p>
        </div>

        {/* Story Section */}
        <div className="bg-dark-200 rounded-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-white mb-6">Our Story</h2>
          <div className="space-y-4 text-gray-300 leading-relaxed">
            <p>
              AnimeVerse was born from a passion for anime and a desire to create the perfect platform for fans to discover, track, and share their love for Japanese animation. We understand that finding your next favorite anime can be overwhelming with thousands of titles available.
            </p>
            <p>
              That's why we built AnimeVerse - a comprehensive platform that combines powerful discovery tools, intuitive tracking features, and a vibrant community all in one place. Whether you're a seasoned otaku or just starting your anime journey, AnimeVerse is designed to enhance your viewing experience.
            </p>
            <p>
              Powered by data from MyAnimeList, we provide accurate and up-to-date information on anime series, movies, and OVAs. Our goal is to make anime discovery as enjoyable as watching anime itself.
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">What We Offer</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-dark-200 rounded-lg p-6 hover:bg-dark-300 transition-colors duration-300"
              >
                <feature.icon className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg p-8 mb-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">10K+</div>
              <p className="text-gray-300">Anime Titles</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-secondary mb-2">5K+</div>
              <p className="text-gray-300">Manga Titles</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">24/7</div>
              <p className="text-gray-300">Access</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-secondary mb-2">100%</div>
              <p className="text-gray-300">Free</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-dark-200 rounded-lg p-12">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Your Journey?</h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Join AnimeVerse today and discover your next favorite anime. Track your progress, get recommendations, and connect with the community.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/register"
              className="px-8 py-3 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-lg hover:shadow-glow-md transform hover:scale-105 transition-all duration-200"
            >
              Get Started
            </Link>
            <Link
              to="/browse"
              className="px-8 py-3 bg-dark-300 text-white font-semibold rounded-lg hover:bg-dark-400 transition-colors duration-200"
            >
              Browse Anime
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
