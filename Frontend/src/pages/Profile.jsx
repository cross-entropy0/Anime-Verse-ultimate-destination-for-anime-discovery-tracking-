import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { watchlistService } from '../services/watchlistService';
import { UserCircleIcon, CameraIcon } from '@heroicons/react/24/solid';

const Profile = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await watchlistService.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    // Implement profile update
    setEditing(false);
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-dark-200 rounded-lg p-8 mb-8">
          <div className="flex items-center gap-6">
            <div className="relative">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.username} className="w-24 h-24 rounded-full object-cover" />
              ) : (
                <UserCircleIcon className="w-24 h-24 text-gray-600" />
              )}
              <button className="absolute bottom-0 right-0 bg-primary hover:bg-primary/90 text-white p-2 rounded-full transition-colors">
                <CameraIcon className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1">
              {editing ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full bg-dark-100 border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-primary"
                    placeholder="Username"
                  />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-dark-100 border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-primary"
                    placeholder="Email"
                  />
                  <div className="flex gap-2">
                    <button onClick={handleSave} className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-semibold">
                      Save Changes
                    </button>
                    <button onClick={() => setEditing(false)} className="bg-dark-100 hover:bg-dark-300 text-white px-4 py-2 rounded-lg">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h1 className="text-3xl font-bold text-white mb-2">{user?.username}</h1>
                  <p className="text-gray-400 mb-4">{user?.email}</p>
                  <button onClick={() => setEditing(true)} className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-semibold">
                    Edit Profile
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-dark-200 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-primary mb-2">{stats?.completed || 0}</div>
            <p className="text-gray-400">Completed</p>
          </div>
          <div className="bg-dark-200 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">{stats?.watching || 0}</div>
            <p className="text-gray-400">Watching</p>
          </div>
          <div className="bg-dark-200 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-yellow-400 mb-2">{stats?.planToWatch || 0}</div>
            <p className="text-gray-400">Plan to Watch</p>
          </div>
          <div className="bg-dark-200 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">{stats?.averageRating ? parseFloat(stats.averageRating).toFixed(1) : 'N/A'}</div>
            <p className="text-gray-400">Avg Rating</p>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-dark-200 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Preferences</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Favorite Genres</label>
              <div className="flex flex-wrap gap-2">
                {['Action', 'Comedy', 'Drama', 'Fantasy', 'Romance', 'Sci-Fi'].map((genre) => (
                  <button
                    key={genre}
                    className="px-3 py-1 bg-dark-100 hover:bg-primary/20 text-gray-300 hover:text-primary rounded-full text-sm transition-colors border border-gray-700 hover:border-primary"
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
