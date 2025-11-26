import { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { watchlistService } from '../services/watchlistService';
import { useAuth } from '../context/AuthContext';

const AddToWatchlistModal = ({ anime, isOpen, onClose, onSuccess }) => {
  const { isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    status: 'plan-to-watch',
    episodesWatched: 0,
    userRating: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [existingEntry, setExistingEntry] = useState(null);

  useEffect(() => {
    if (isOpen && anime) {
      checkExisting();
    }
  }, [isOpen, anime]);

  const checkExisting = async () => {
    try {
      const entry = await watchlistService.checkInWatchlist(anime.malId || anime.mal_id);
      if (entry) {
        setExistingEntry(entry);
        setFormData({
          status: entry.status,
          episodesWatched: entry.episodesWatched || 0,
          userRating: entry.userRating || 0,
        });
      }
    } catch (err) {
      console.error('Error checking watchlist:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (existingEntry) {
        // Update existing entry
        await watchlistService.updateWatchlistItem(existingEntry._id, formData);
      } else {
        // Add new entry
        await watchlistService.addToWatchlist({
          malId: anime.malId || anime.mal_id,
          ...formData,
        });
      }
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update watchlist');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Remove from watchlist?')) return;
    
    try {
      await watchlistService.removeFromWatchlist(existingEntry._id);
      onSuccess?.();
      onClose();
    } catch (err) {
      setError('Failed to remove from watchlist');
    }
  };

  if (!isOpen) return null;
  if (!isAuthenticated) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-dark-200 rounded-lg max-w-md w-full p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            {existingEntry ? 'Update Watchlist' : 'Add to Watchlist'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-dark-300 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full bg-dark-300 border border-dark-400 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="watching">📺 Watching</option>
              <option value="completed">✔️ Completed</option>
              <option value="plan-to-watch">📝 Plan to Watch</option>
              <option value="dropped">🚫 Dropped</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Episodes Watched
            </label>
            <input
              type="number"
              min="0"
              max={anime?.episodes || 9999}
              value={formData.episodesWatched}
              onChange={(e) => setFormData({ ...formData, episodesWatched: parseInt(e.target.value) || 0 })}
              className="w-full bg-dark-300 border border-dark-400 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Your Rating (0-10)
            </label>
            <input
              type="number"
              min="0"
              max="10"
              step="0.5"
              value={formData.userRating}
              onChange={(e) => setFormData({ ...formData, userRating: parseFloat(e.target.value) || 0 })}
              className="w-full bg-dark-300 border border-dark-400 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50"
            >
              {loading ? 'Saving...' : existingEntry ? 'Update' : 'Add to List'}
            </button>
            {existingEntry && (
              <button
                type="button"
                onClick={handleDelete}
                className="px-6 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-semibold py-3 rounded-lg transition-all"
              >
                Remove
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddToWatchlistModal;
