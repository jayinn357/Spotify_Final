import { useState, useEffect } from 'react';

// Interfaces
interface Artist {
  id: number;
  name: string;
  real_name: string | null;
  specialty: string | null;
  role: string | null;
  description: string | null;
}

interface AboutOrigin {
  id: number;
  title: string;
  content: string;
  quote: string | null;
  image_url: string;
  order: number;
}

interface AboutAchievement {
  id: number;
  title: string;
  description: string;
  image_url: string;
  order: number;
}

interface AboutFooter {
  id: number;
  profile_name: string;
  profile_image_url: string;
  main_description: string;
  quote: string;
}

interface TrackMessage {
  id: number;
  track_id: number;
  message: string;
  Track?: {
    id: number;
    title: string;
  };
}

interface TrackWithoutAudio {
  id: number;
  title: string;
  spotify_track_id: string;
  artist?: {
    name: string;
  };
}

type TabType = 'artists' | 'origins' | 'achievements' | 'footer' | 'messages' | 'audios';

export default function CRUDPage() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('artists');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Data states
  const [artists, setArtists] = useState<Artist[]>([]);
  const [origins, setOrigins] = useState<AboutOrigin[]>([]);
  const [achievements, setAchievements] = useState<AboutAchievement[]>([]);
  const [footerItems, setFooterItems] = useState<AboutFooter[]>([]);
  const [trackMessages, setTrackMessages] = useState<TrackMessage[]>([]);
  const [tracksWithoutAudio, setTracksWithoutAudio] = useState<TrackWithoutAudio[]>([]);
  const [tracksWithoutMessages, setTracksWithoutMessages] = useState<TrackWithoutAudio[]>([]);
  const [selectedTrackForMessage, setSelectedTrackForMessage] = useState<number | null>(null);
  const [selectedTrackForAudio, setSelectedTrackForAudio] = useState<number | null>(null);

  // Editing states
  const [editingArtist, setEditingArtist] = useState<Artist | null>(null);
  const [editingOrigin, setEditingOrigin] = useState<AboutOrigin | null>(null);
  const [editingAchievement, setEditingAchievement] = useState<AboutAchievement | null>(null);
  const [editingFooter, setEditingFooter] = useState<AboutFooter | null>(null);
  const [editingMessage, setEditingMessage] = useState<TrackMessage | null>(null);

  // Modal states for creating new items
  const [showOriginModal, setShowOriginModal] = useState(false);
  const [showAchievementModal, setShowAchievementModal] = useState(false);
  const [newOrigin, setNewOrigin] = useState({
    title: '',
    content: '',
    quote: '',
    image_url: '',
    order: 1
  });
  const [newAchievement, setNewAchievement] = useState({
    title: '',
    description: '',
    image_url: '',
    order: 1
  });

  // Upload states
  const [uploadingOriginImage, setUploadingOriginImage] = useState(false);
  const [uploadingAchievementImage, setUploadingAchievementImage] = useState(false);
  const [uploadingFooterImage, setUploadingFooterImage] = useState(false);
  const [uploadingImage, setUploadingImage] = useState<string | null>(null); // Track which item is uploading
  const [uploadingAudio, setUploadingAudio] = useState<number | null>(null); // Track ID being uploaded

  // Modal states for confirmations
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteAction, setDeleteAction] = useState<(() => void) | null>(null);
  const [deleteMessage, setDeleteMessage] = useState('');

  const ADMIN_PASSWORD = 'sb19admin2025'; // Simple passphrase

  // Helper functions for modals
  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setShowSuccessModal(true);
  };

  const confirmDelete = (message: string, action: () => void) => {
    setDeleteMessage(message);
    setDeleteAction(() => action);
    setShowDeleteModal(true);
  };

  const handleDelete = () => {
    if (deleteAction) {
      deleteAction();
    }
    setShowDeleteModal(false);
    setDeleteAction(null);
  };

  const handleUnlock = () => {
    if (password === ADMIN_PASSWORD) {
      setIsUnlocked(true);
      setError('');
      fetchAllData();
    } else {
      setError('Incorrect password');
    }
  };

  const fetchAllData = async () => {
    try {
      const [artistsRes, originsRes, achievementsRes, footerRes, messagesRes, tracksRes, tracksNoMsgRes] = await Promise.all([
        fetch('/api/crud/artists'),
        fetch('/api/crud/about-origins'),
        fetch('/api/crud/about-achievements'),
        fetch('/api/crud/about-footer'),
        fetch('/api/crud/track-messages'),
        fetch('/api/crud/tracks/without-audio'),
        fetch('/api/crud/tracks/without-messages')
      ]);

      const [artistsData, originsData, achievementsData, footerData, messagesData, tracksData, tracksNoMsgData] = await Promise.all([
        artistsRes.json(),
        originsRes.json(),
        achievementsRes.json(),
        footerRes.json(),
        messagesRes.json(),
        tracksRes.json(),
        tracksNoMsgRes.json()
      ]);

      setArtists(artistsData.artists || []);
      setOrigins(originsData.origins || []);
      setAchievements(achievementsData.achievements || []);
      setFooterItems(footerData.footerItems || []);
      setTrackMessages(messagesData.messages || []);
      setTracksWithoutAudio(tracksData.tracks || []);
      setTracksWithoutMessages(tracksNoMsgData.tracks || []);
    } catch (err) {
      setError('Failed to fetch data');
      console.error(err);
    }
  };

  // Audio upload handler
  const handleAudioUpload = async (file: File, track: TrackWithoutAudio) => {
    setUploadingAudio(track.id);

    const formData = new FormData();
    formData.append('audio', file);
    formData.append('artistName', track.artist?.name || 'unknown');

    try {
      const response = await fetch(`/api/crud/tracks/${track.id}/upload-audio`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        showSuccess(`Audio uploaded successfully for "${track.title}"`);
        fetchAllData(); // Refresh the list
      } else {
        setError(data.error || 'Failed to upload audio');
      }
    } catch (error) {
      setError('Error uploading audio');
      console.error(error);
    } finally {
      setUploadingAudio(null);
    }
  };

  // Image upload handler - Generic for all types
  const handleImageUpload = async (file: File, callback: (imageUrl: string) => void) => {
    const formData = new FormData();
    formData.append('image', file);

    setUploadingImage(file.name);

    try {
      const response = await fetch('/api/crud/upload-image', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        showSuccess(`Image uploaded: ${data.filename}`);
        callback(data.imageUrl);
      } else {
        setError(data.error || 'Failed to upload image');
      }
    } catch (error) {
      setError('Error uploading image');
      console.error(error);
    } finally {
      setUploadingImage(null);
    }
  };

  const updateArtist = async (artist: Artist) => {
    try {
      const res = await fetch(`/api/crud/artists/${artist.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(artist)
      });
      if (res.ok) {
        showSuccess('Artist updated successfully');
        fetchAllData();
        setEditingArtist(null);
      } else {
        setError('Failed to update artist');
      }
    } catch (err) {
      setError('Error updating artist');
      console.error(err);
    }
  };

  const updateOrigin = async (origin: AboutOrigin) => {
    try {
      const res = await fetch(`/api/crud/about-origins/${origin.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(origin)
      });
      if (res.ok) {
        showSuccess('Origin section updated successfully');
        fetchAllData();
        setEditingOrigin(null);
      } else {
        setError('Failed to update origin');
      }
    } catch (err) {
      setError('Error updating origin');
      console.error(err);
    }
  };

  const createOrigin = async (origin: Omit<AboutOrigin, 'id'>) => {
    try {
      const res = await fetch('/api/crud/about-origins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(origin)
      });
      if (res.ok) {
        showSuccess('Origin section created successfully');
        fetchAllData();
      } else {
        setError('Failed to create origin');
      }
    } catch (err) {
      setError('Error creating origin');
      console.error(err);
    }
  };

  const deleteOrigin = async (id: number) => {
    try {
      const res = await fetch(`/api/crud/about-origins/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        showSuccess('Origin section deleted successfully');
        fetchAllData();
      } else {
        setError('Failed to delete origin');
      }
    } catch (err) {
      setError('Error deleting origin');
      console.error(err);
    }
  };

  const createAchievement = async (achievement: Omit<AboutAchievement, 'id'>) => {
    try {
      const res = await fetch('/api/crud/about-achievements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(achievement)
      });
      if (res.ok) {
        showSuccess('Achievement created successfully');
        fetchAllData();
      } else {
        setError('Failed to create achievement');
      }
    } catch (err) {
      setError('Error creating achievement');
      console.error(err);
    }
  };

  const updateAchievement = async (achievement: AboutAchievement) => {
    try {
      const res = await fetch(`/api/crud/about-achievements/${achievement.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(achievement)
      });
      if (res.ok) {
        showSuccess('Achievement updated successfully');
        fetchAllData();
        setEditingAchievement(null);
      } else {
        setError('Failed to update achievement');
      }
    } catch (err) {
      setError('Error updating achievement');
      console.error(err);
    }
  };

  const deleteAchievement = async (id: number) => {
    try {
      const res = await fetch(`/api/crud/about-achievements/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        showSuccess('Achievement deleted successfully');
        fetchAllData();
      } else {
        setError('Failed to delete achievement');
      }
    } catch (err) {
      setError('Error deleting achievement');
      console.error(err);
    }
  };

  const updateFooter = async (footer: AboutFooter) => {
    try {
      const res = await fetch(`/api/crud/about-footer/${footer.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(footer)
      });
      if (res.ok) {
        showSuccess('Footer updated successfully');
        fetchAllData();
        setEditingFooter(null);
      } else {
        setError('Failed to update footer');
      }
    } catch (err) {
      setError('Error updating footer');
      console.error(err);
    }
  };

  const createTrackMessage = async (message: Omit<TrackMessage, 'id' | 'Track'>) => {
    try {
      const res = await fetch('/api/crud/track-messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(message)
      });
      if (res.ok) {
        showSuccess('Track message created successfully');
        fetchAllData();
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to create track message');
      }
    } catch (err) {
      setError('Error creating track message');
      console.error(err);
    }
  };

  const updateTrackMessage = async (message: TrackMessage) => {
    try {
      const res = await fetch(`/api/crud/track-messages/${message.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: message.message })
      });
      if (res.ok) {
        showSuccess('Track message updated successfully');
        fetchAllData();
        setEditingMessage(null);
      } else {
        setError('Failed to update track message');
      }
    } catch (err) {
      setError('Error updating track message');
      console.error(err);
    }
  };

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess('');
        setError('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800 p-8 rounded-lg shadow-2xl max-w-md w-full">
          <h1 className="text-3xl font-bold text-yellow-400 mb-6 text-center">Admin Access</h1>
          <p className="text-gray-300 mb-4 text-center">Enter password to access CRUD panel</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleUnlock()}
            className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            placeholder="Password"
          />
          {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
          <button
            onClick={handleUnlock}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 rounded-lg transition"
          >
            Unlock
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-yellow-400 mb-8">CRUD Management Panel</h1>

        {/* Alert Messages */}
        {success && (
          <div className="bg-green-500/20 border border-green-500 text-green-400 px-4 py-3 rounded-lg mb-4">
            {success}
          </div>
        )}
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: 'artists', label: 'Artists' },
            { id: 'origins', label: 'About Origins' },
            { id: 'achievements', label: 'Achievements' },
            { id: 'footer', label: 'Footer' },
            { id: 'messages', label: 'Track Messages' },
            { id: 'audios', label: `Track Audios (${tracksWithoutAudio.length} missing)` }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`px-6 py-3 rounded-lg font-semibold transition whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-yellow-400 text-black'
                  : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-gray-800 rounded-lg p-6">
          {activeTab === 'artists' && (
            <div>
              <h2 className="text-2xl font-bold text-yellow-400 mb-4">Edit Artists</h2>
              <p className="text-gray-400 mb-2">Update artist information (Edit only - Cannot add or delete)</p>
              <p className="text-yellow-300 text-sm mb-6">ℹ️ The 5 members are fixed. You can only edit their details.</p>
              
              <div className="space-y-4">
                {artists.filter(a => a.name !== 'SB19').map((artist) => (
                  <div key={artist.id} className="bg-gray-700 p-4 rounded-lg">
                    {editingArtist?.id === artist.id ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={editingArtist.real_name || ''}
                          onChange={(e) => setEditingArtist({ ...editingArtist, real_name: e.target.value })}
                          placeholder="Real Name"
                          className="w-full bg-gray-600 text-white px-3 py-2 rounded"
                        />
                        <input
                          type="text"
                          value={editingArtist.specialty || ''}
                          onChange={(e) => setEditingArtist({ ...editingArtist, specialty: e.target.value })}
                          placeholder="Specialty"
                          className="w-full bg-gray-600 text-white px-3 py-2 rounded"
                        />
                        <input
                          type="text"
                          value={editingArtist.role || ''}
                          onChange={(e) => setEditingArtist({ ...editingArtist, role: e.target.value })}
                          placeholder="Role"
                          className="w-full bg-gray-600 text-white px-3 py-2 rounded"
                        />
                        <textarea
                          value={editingArtist.description || ''}
                          onChange={(e) => setEditingArtist({ ...editingArtist, description: e.target.value })}
                          placeholder="Description/Bio"
                          rows={4}
                          className="w-full bg-gray-600 text-white px-3 py-2 rounded"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => updateArtist(editingArtist)}
                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingArtist(null)}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h3 className="text-xl font-bold text-yellow-400">{artist.name}</h3>
                        <p className="text-gray-300"><strong>Real Name:</strong> {artist.real_name || 'N/A'}</p>
                        <p className="text-gray-300"><strong>Role:</strong> {artist.role || 'N/A'}</p>
                        <p className="text-gray-300"><strong>Specialty:</strong> {artist.specialty || 'N/A'}</p>
                        <p className="text-gray-400 text-sm mt-2">{artist.description || 'No description'}</p>
                        <button
                          onClick={() => setEditingArtist(artist)}
                          className="mt-3 bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded font-semibold"
                        >
                          Edit
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'origins' && (
            <div>
              <h2 className="text-2xl font-bold text-yellow-400 mb-4">Manage About Origins</h2>
              <p className="text-gray-400 mb-6">Create, edit, or delete origin slider sections</p>
              
              <button
                onClick={() => {
                  setNewOrigin({
                    title: '',
                    content: '',
                    quote: '',
                    image_url: '',
                    order: origins.length + 1
                  });
                  setShowOriginModal(true);
                }}
                className="mb-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded font-semibold"
              >
                + Add New Origin Section
              </button>
              
              <div className="space-y-4">
                {origins.map((origin) => (
                  <div key={origin.id} className="bg-gray-700 p-4 rounded-lg">
                    {editingOrigin?.id === origin.id ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={editingOrigin.title}
                          onChange={(e) => setEditingOrigin({ ...editingOrigin, title: e.target.value })}
                          placeholder="Title"
                          className="w-full bg-gray-600 text-white px-3 py-2 rounded"
                        />
                        <textarea
                          value={editingOrigin.content}
                          onChange={(e) => setEditingOrigin({ ...editingOrigin, content: e.target.value })}
                          placeholder="Content"
                          rows={8}
                          className="w-full bg-gray-600 text-white px-3 py-2 rounded"
                        />
                        <input
                          type="text"
                          value={editingOrigin.quote || ''}
                          onChange={(e) => setEditingOrigin({ ...editingOrigin, quote: e.target.value })}
                          placeholder="Quote (optional)"
                          className="w-full bg-gray-600 text-white px-3 py-2 rounded"
                        />
                        <div>
                          <label className="block text-gray-300 mb-2 text-sm">Image</label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleImageUpload(file, (imageUrl) => {
                                setEditingOrigin({ ...editingOrigin, image_url: imageUrl });
                              });
                            }}
                            className="w-full bg-gray-600 text-white px-3 py-2 rounded mb-2 file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:bg-yellow-400 file:text-black file:text-sm file:font-semibold hover:file:bg-yellow-500"
                            disabled={!!uploadingImage}
                          />
                          <input
                            type="text"
                            value={editingOrigin.image_url}
                            onChange={(e) => setEditingOrigin({ ...editingOrigin, image_url: e.target.value })}
                            placeholder="Or enter image URL"
                            className="w-full bg-gray-600 text-white px-3 py-2 rounded text-sm"
                          />
                          {editingOrigin.image_url && (
                            <img src={editingOrigin.image_url} alt="Preview" className="mt-2 w-24 h-24 object-cover rounded" />
                          )}
                        </div>
                        <input
                          type="number"
                          value={editingOrigin.order}
                          onChange={(e) => setEditingOrigin({ ...editingOrigin, order: parseInt(e.target.value) })}
                          placeholder="Order"
                          className="w-full bg-gray-600 text-white px-3 py-2 rounded"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => updateOrigin(editingOrigin)}
                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingOrigin(null)}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h3 className="text-xl font-bold text-yellow-400">{origin.title}</h3>
                        <p className="text-gray-400 text-sm mt-2">{origin.content.substring(0, 150)}...</p>
                        {origin.quote && <p className="text-yellow-300 italic mt-2">"{origin.quote}"</p>}
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => setEditingOrigin(origin)}
                            className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded font-semibold"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => confirmDelete(
                              'Are you sure you want to delete this origin section?',
                              () => deleteOrigin(origin.id)
                            )}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded font-semibold"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'achievements' && (
            <div>
              <h2 className="text-2xl font-bold text-yellow-400 mb-4">Manage Achievements</h2>
              <p className="text-gray-400 mb-6">Create, edit, or delete achievement cards</p>
              
              <button
                onClick={() => {
                  setNewAchievement({
                    title: '',
                    description: '',
                    image_url: '',
                    order: achievements.length + 1
                  });
                  setShowAchievementModal(true);
                }}
                className="mb-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded font-semibold"
              >
                + Add New Achievement
              </button>

              <div className="space-y-4">
                {achievements.map((achievement) => (
                  <div key={achievement.id} className="bg-gray-700 p-4 rounded-lg">
                    {editingAchievement?.id === achievement.id ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={editingAchievement.title}
                          onChange={(e) => setEditingAchievement({ ...editingAchievement, title: e.target.value })}
                          placeholder="Title"
                          className="w-full bg-gray-600 text-white px-3 py-2 rounded"
                        />
                        <textarea
                          value={editingAchievement.description}
                          onChange={(e) => setEditingAchievement({ ...editingAchievement, description: e.target.value })}
                          placeholder="Description"
                          rows={3}
                          className="w-full bg-gray-600 text-white px-3 py-2 rounded"
                        />
                        <div>
                          <label className="block text-gray-300 mb-2 text-sm">Image</label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleImageUpload(file, (imageUrl) => {
                                setEditingAchievement({ ...editingAchievement, image_url: imageUrl });
                              });
                            }}
                            className="w-full bg-gray-600 text-white px-3 py-2 rounded mb-2 file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:bg-yellow-400 file:text-black file:text-sm file:font-semibold hover:file:bg-yellow-500"
                            disabled={!!uploadingImage}
                          />
                          <input
                            type="text"
                            value={editingAchievement.image_url}
                            onChange={(e) => setEditingAchievement({ ...editingAchievement, image_url: e.target.value })}
                            placeholder="Or enter image URL"
                            className="w-full bg-gray-600 text-white px-3 py-2 rounded text-sm"
                          />
                          {editingAchievement.image_url && (
                            <img src={editingAchievement.image_url} alt="Preview" className="mt-2 w-24 h-24 object-cover rounded" />
                          )}
                        </div>
                        <input
                          type="number"
                          value={editingAchievement.order}
                          onChange={(e) => setEditingAchievement({ ...editingAchievement, order: parseInt(e.target.value) })}
                          placeholder="Order"
                          className="w-full bg-gray-600 text-white px-3 py-2 rounded"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => updateAchievement(editingAchievement)}
                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingAchievement(null)}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h3 className="text-xl font-bold text-yellow-400">{achievement.title}</h3>
                        <p className="text-gray-400 text-sm mt-2">{achievement.description}</p>
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => setEditingAchievement(achievement)}
                            className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded font-semibold"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => confirmDelete(
                              'Are you sure you want to delete this achievement?',
                              () => deleteAchievement(achievement.id)
                            )}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded font-semibold"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'footer' && (
            <div>
              <h2 className="text-2xl font-bold text-yellow-400 mb-4">Edit Footer</h2>
              <p className="text-gray-400 mb-2">Update footer profiles (Edit only - Cannot add or delete)</p>
              <p className="text-yellow-300 text-sm mb-6">ℹ️ These 2 footer profiles are fixed. You can only edit their content.</p>
              
              <div className="space-y-4">
                {footerItems.map((footer) => (
                  <div key={footer.id} className="bg-gray-700 p-4 rounded-lg">
                    {editingFooter?.id === footer.id ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={editingFooter.profile_name}
                          onChange={(e) => setEditingFooter({ ...editingFooter, profile_name: e.target.value })}
                          placeholder="Profile Name"
                          className="w-full bg-gray-600 text-white px-3 py-2 rounded"
                        />
                        <div>
                          <label className="block text-gray-300 mb-2 text-sm">Profile Image</label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleImageUpload(file, (imageUrl) => {
                                setEditingFooter({ ...editingFooter, profile_image_url: imageUrl });
                              });
                            }}
                            className="w-full bg-gray-600 text-white px-3 py-2 rounded mb-2 file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:bg-yellow-400 file:text-black file:text-sm file:font-semibold hover:file:bg-yellow-500"
                            disabled={!!uploadingImage}
                          />
                          <input
                            type="text"
                            value={editingFooter.profile_image_url}
                            onChange={(e) => setEditingFooter({ ...editingFooter, profile_image_url: e.target.value })}
                            placeholder="Or enter image URL"
                            className="w-full bg-gray-600 text-white px-3 py-2 rounded text-sm"
                          />
                          {editingFooter.profile_image_url && (
                            <img src={editingFooter.profile_image_url} alt="Preview" className="mt-2 w-24 h-24 object-cover rounded" />
                          )}
                        </div>
                        <textarea
                          value={editingFooter.main_description}
                          onChange={(e) => setEditingFooter({ ...editingFooter, main_description: e.target.value })}
                          placeholder="Description"
                          rows={3}
                          className="w-full bg-gray-600 text-white px-3 py-2 rounded"
                        />
                        <input
                          type="text"
                          value={editingFooter.quote}
                          onChange={(e) => setEditingFooter({ ...editingFooter, quote: e.target.value })}
                          placeholder="Quote"
                          className="w-full bg-gray-600 text-white px-3 py-2 rounded"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => updateFooter(editingFooter)}
                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingFooter(null)}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h3 className="text-xl font-bold text-yellow-400">{footer.profile_name}</h3>
                        <p className="text-gray-400 text-sm mt-2">{footer.main_description}</p>
                        <p className="text-yellow-300 italic mt-2">"{footer.quote}"</p>
                        <button
                          onClick={() => setEditingFooter(footer)}
                          className="mt-3 bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded font-semibold"
                        >
                          Edit
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'messages' && (
            <div className="space-y-6">
              {/* Header with counts */}
              <div className="flex items-center justify-between bg-gradient-to-r from-yellow-900/20 to-yellow-800/20 p-4 rounded-lg border border-yellow-500/30">
                <div>
                  <h2 className="text-3xl font-bold text-yellow-400">Track Messages Manager</h2>
                  <p className="text-gray-400 mt-1">Create and edit inspirational messages for your tracks</p>
                </div>
                <div className="flex gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-400">{tracksWithoutMessages.length}</div>
                    <div className="text-xs text-gray-400 uppercase">Need Messages</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400">{trackMessages.length}</div>
                    <div className="text-xs text-gray-400 uppercase">Have Messages</div>
                  </div>
                </div>
              </div>

              {/* Create Message Section */}
              {tracksWithoutMessages.length > 0 && (
                <div className="bg-gray-800 rounded-lg border border-gray-700">
                  <div className="bg-red-900/30 px-6 py-4 border-b border-red-700/50">
                    <h3 className="text-xl font-bold text-red-300">➕ Create New Message</h3>
                    <p className="text-gray-400 text-sm mt-1">{tracksWithoutMessages.length} tracks are waiting for your inspirational message</p>
                  </div>
                  <div className="p-6">
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      const formData = new FormData(e.currentTarget);
                      if (!selectedTrackForMessage) {
                        setError('Please select a track');
                        return;
                      }
                      createTrackMessage({
                        track_id: selectedTrackForMessage,
                        message: formData.get('message') as string
                      });
                      e.currentTarget.reset();
                      setSelectedTrackForMessage(null);
                    }}>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Left: Track selection */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-300 mb-2">1. Select Track</label>
                          <select
                            value={selectedTrackForMessage || ''}
                            onChange={(e) => setSelectedTrackForMessage(e.target.value ? parseInt(e.target.value) : null)}
                            className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-yellow-500 focus:outline-none"
                            required
                          >
                            <option value="">-- Choose a track ({tracksWithoutMessages.length} available) --</option>
                            {tracksWithoutMessages.map((track) => (
                              <option key={track.id} value={track.id}>
                                {track.title} {track.artist?.name && `• ${track.artist.name}`}
                              </option>
                            ))}
                          </select>
                          
                          {selectedTrackForMessage && (
                            <div className="mt-3 bg-yellow-900/20 border border-yellow-600/50 p-4 rounded-lg">
                              <div className="text-sm font-semibold text-yellow-400">✓ Selected:</div>
                              <div className="text-white mt-1">{tracksWithoutMessages.find(t => t.id === selectedTrackForMessage)?.title}</div>
                              <div className="text-gray-400 text-sm">{tracksWithoutMessages.find(t => t.id === selectedTrackForMessage)?.artist?.name || 'Unknown Artist'}</div>
                            </div>
                          )}
                        </div>

                        {/* Right: Message input */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-300 mb-2">2. Write Message</label>
                          <textarea
                            name="message"
                            placeholder="Your inspirational message for this track..."
                            required
                            rows={6}
                            className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-yellow-500 focus:outline-none resize-none"
                            disabled={!selectedTrackForMessage}
                          />
                          <button
                            type="submit"
                            disabled={!selectedTrackForMessage}
                            className="mt-3 w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-lg transition"
                          >
                            {selectedTrackForMessage ? '✓ Create Message' : 'Select a track first'}
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Edit Messages Section */}
              <div className="bg-gray-800 rounded-lg border border-gray-700">
                <div className="bg-green-900/30 px-6 py-4 border-b border-green-700/50 flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-green-300">✏️ Edit Existing Messages</h3>
                    <p className="text-gray-400 text-sm mt-1">{trackMessages.length} tracks already have messages</p>
                  </div>
                  <div className="text-sm text-gray-400">
                    Click a message to edit it
                  </div>
                </div>
                <div className="p-6">
                  {trackMessages.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <div className="text-5xl mb-4">📝</div>
                      <div>No messages yet. Create your first one above!</div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {trackMessages.map((msg) => (
                        <div
                          key={msg.id}
                          className="bg-gray-700/50 rounded-lg border border-gray-600 hover:border-yellow-500/50 transition"
                        >
                          {editingMessage?.id === msg.id ? (
                            <div className="p-5">
                              <div className="bg-gray-800 p-3 rounded mb-3 border-l-4 border-yellow-500">
                                <div className="text-sm text-yellow-400 font-semibold">Editing Message For:</div>
                                <div className="text-white font-bold">{msg.Track?.title || `Track #${msg.track_id}`}</div>
                              </div>
                              <textarea
                                value={editingMessage.message}
                                onChange={(e) => setEditingMessage({ ...editingMessage, message: e.target.value })}
                                rows={4}
                                className="w-full bg-gray-600 text-white px-4 py-3 rounded-lg border border-gray-500 focus:border-yellow-500 focus:outline-none"
                              />
                              <div className="flex gap-3 mt-3">
                                <button
                                  onClick={() => updateTrackMessage(editingMessage)}
                                  className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-lg"
                                >
                                  ✓ Save Changes
                                </button>
                                <button
                                  onClick={() => setEditingMessage(null)}
                                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
                                >
                                  ✕ Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="p-5 cursor-pointer" onClick={() => setEditingMessage(msg)}>
                              <div className="flex items-start justify-between mb-2">
                                <div className="font-bold text-lg text-yellow-400">{msg.Track?.title || `Track #${msg.track_id}`}</div>
                                <button className="text-gray-400 hover:text-yellow-400 text-sm">
                                  ✏️ Edit
                                </button>
                              </div>
                              <div className="text-gray-300 leading-relaxed">{msg.message}</div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'audios' && (
            <div>
              <h2 className="text-2xl font-bold text-yellow-400 mb-4">Upload Track Audios</h2>
              <p className="text-gray-400 mb-2">Upload audio files for tracks that don't have local audio yet</p>
              <p className="text-yellow-300 text-sm mb-6">
                ⚠️ Important: The audio filename (without extension) must exactly match the track's Spotify ID
              </p>

              {tracksWithoutAudio.length === 0 ? (
                <div className="bg-gray-700 p-6 rounded-lg text-center">
                  <p className="text-green-400 text-lg">✅ All tracks have audio files!</p>
                </div>
              ) : (
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="font-bold text-yellow-400 mb-3">Upload Audio File</h3>
                  
                  <div className="mb-3">
                    <label className="block text-gray-300 mb-2">Select Track *</label>
                    <select
                      value={selectedTrackForAudio || ''}
                      onChange={(e) => setSelectedTrackForAudio(e.target.value ? parseInt(e.target.value) : null)}
                      className="w-full bg-gray-600 text-white px-3 py-2 rounded"
                    >
                      <option value="">-- Select a track without audio --</option>
                      {tracksWithoutAudio.map((track) => (
                        <option key={track.id} value={track.id}>
                          {track.title} {track.artist?.name ? `(by ${track.artist.name})` : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {selectedTrackForAudio && (() => {
                    const selectedTrack = tracksWithoutAudio.find(t => t.id === selectedTrackForAudio);
                    if (!selectedTrack) return null;
                    
                    return (
                      <div className="bg-gray-600 p-4 rounded-lg">
                        <h4 className="text-lg font-bold text-yellow-400 mb-2">{selectedTrack.title}</h4>
                        <p className="text-gray-300 text-sm mb-1">
                          <strong>Artist:</strong> {selectedTrack.artist?.name || 'Unknown'}
                        </p>
                        <p className="text-gray-300 text-sm mb-2">
                          <strong>Spotify ID:</strong> <span className="font-mono bg-gray-700 px-2 py-1 rounded">{selectedTrack.spotify_track_id}</span>
                        </p>
                        <p className="text-blue-300 text-sm mb-3">
                          📁 <strong>Required filename:</strong> <span className="font-mono bg-gray-700 px-2 py-1 rounded">{selectedTrack.spotify_track_id}.mp3</span> (or .wav, .ogg, .m4a)
                        </p>
                        
                        <input
                          type="file"
                          accept="audio/*"
                          id="audio-upload-input"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              // Validate filename before upload
                              const fileNameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
                              if (fileNameWithoutExt !== selectedTrack.spotify_track_id) {
                                setError(
                                  `Filename mismatch! Expected "${selectedTrack.spotify_track_id}" but got "${fileNameWithoutExt}". ` +
                                  `Please rename your file to match the Spotify ID.`
                                );
                                e.target.value = ''; // Reset input
                                return;
                              }
                              handleAudioUpload(file, selectedTrack);
                              setSelectedTrackForAudio(null); // Reset after upload
                            }
                          }}
                          disabled={uploadingAudio === selectedTrack.id}
                          className="hidden"
                        />
                        <label
                          htmlFor="audio-upload-input"
                          className={`cursor-pointer inline-block px-6 py-3 rounded font-semibold transition ${
                            uploadingAudio === selectedTrack.id
                              ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                              : 'bg-green-500 hover:bg-green-600 text-white'
                          }`}
                        >
                          {uploadingAudio === selectedTrack.id ? (
                            <span className="flex items-center gap-2">
                              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                              </svg>
                              Uploading...
                            </span>
                          ) : (
                            '📤 Upload Audio File'
                          )}
                        </label>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Origin Modal */}
      {showOriginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-yellow-400 mb-4">Add New Origin Section</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2">Title *</label>
                <input
                  type="text"
                  value={newOrigin.title}
                  onChange={(e) => setNewOrigin({ ...newOrigin, title: e.target.value })}
                  placeholder="Enter title"
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Content *</label>
                <textarea
                  value={newOrigin.content}
                  onChange={(e) => setNewOrigin({ ...newOrigin, content: e.target.value })}
                  placeholder="Enter content"
                  rows={10}
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Quote (Optional)</label>
                <input
                  type="text"
                  value={newOrigin.quote}
                  onChange={(e) => setNewOrigin({ ...newOrigin, quote: e.target.value })}
                  placeholder="Enter inspirational quote"
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Image *</label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file, (imageUrl) => {
                          setNewOrigin({ ...newOrigin, image_url: imageUrl });
                        });
                      }}
                      className="flex-1 bg-gray-700 text-white px-4 py-2 rounded file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-yellow-400 file:text-black file:font-semibold hover:file:bg-yellow-500"
                      disabled={!!uploadingImage}
                    />
                  </div>
                  <div className="text-sm text-gray-400">Or enter image URL manually:</div>
                  <input
                    type="text"
                    value={newOrigin.image_url}
                    onChange={(e) => setNewOrigin({ ...newOrigin, image_url: e.target.value })}
                    placeholder="/images/your-image.jpg"
                    className="w-full bg-gray-700 text-white px-4 py-2 rounded"
                  />
                  {uploadingImage && <div className="text-yellow-400 text-sm">Uploading image...</div>}
                  {newOrigin.image_url && (
                    <div className="mt-2">
                      <img src={newOrigin.image_url} alt="Preview" className="w-32 h-32 object-cover rounded" />
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Order</label>
                <input
                  type="number"
                  value={newOrigin.order}
                  onChange={(e) => setNewOrigin({ ...newOrigin, order: parseInt(e.target.value) })}
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded"
                  min="1"
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    if (!newOrigin.title || !newOrigin.content || !newOrigin.image_url) {
                      setError('Please fill in all required fields');
                      return;
                    }
                    createOrigin(newOrigin);
                    setShowOriginModal(false);
                  }}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded font-semibold"
                >
                  Create Origin Section
                </button>
                <button
                  onClick={() => setShowOriginModal(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Achievement Modal */}
      {showAchievementModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-yellow-400 mb-4">Add New Achievement</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2">Title *</label>
                <input
                  type="text"
                  value={newAchievement.title}
                  onChange={(e) => setNewAchievement({ ...newAchievement, title: e.target.value })}
                  placeholder="Enter achievement title"
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Description *</label>
                <textarea
                  value={newAchievement.description}
                  onChange={(e) => setNewAchievement({ ...newAchievement, description: e.target.value })}
                  placeholder="Enter achievement description"
                  rows={5}
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Image *</label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file, (imageUrl) => {
                          setNewAchievement({ ...newAchievement, image_url: imageUrl });
                        });
                      }}
                      className="flex-1 bg-gray-700 text-white px-4 py-2 rounded file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-yellow-400 file:text-black file:font-semibold hover:file:bg-yellow-500"
                      disabled={!!uploadingImage}
                    />
                  </div>
                  <div className="text-sm text-gray-400">Or enter image URL manually:</div>
                  <input
                    type="text"
                    value={newAchievement.image_url}
                    onChange={(e) => setNewAchievement({ ...newAchievement, image_url: e.target.value })}
                    placeholder="/images/your-image.jpg"
                    className="w-full bg-gray-700 text-white px-4 py-2 rounded"
                  />
                  {uploadingImage && <div className="text-yellow-400 text-sm">Uploading image...</div>}
                  {newAchievement.image_url && (
                    <div className="mt-2">
                      <img src={newAchievement.image_url} alt="Preview" className="w-32 h-32 object-cover rounded" />
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Order</label>
                <input
                  type="number"
                  value={newAchievement.order}
                  onChange={(e) => setNewAchievement({ ...newAchievement, order: parseInt(e.target.value) })}
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded"
                  min="1"
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    if (!newAchievement.title || !newAchievement.description || !newAchievement.image_url) {
                      setError('Please fill in all required fields');
                      return;
                    }
                    createAchievement(newAchievement);
                    setShowAchievementModal(false);
                  }}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded font-semibold"
                >
                  Create Achievement
                </button>
                <button
                  onClick={() => setShowAchievementModal(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full border-2 border-green-500">
            <div className="text-center">
              <div className="mb-4">
                <svg className="w-16 h-16 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-green-400 mb-3">Success!</h3>
              <p className="text-gray-300 mb-6">{successMessage}</p>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-semibold w-full"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full border-2 border-red-500">
            <div className="text-center">
              <div className="mb-4">
                <svg className="w-16 h-16 text-red-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-red-400 mb-3">Confirm Delete</h3>
              <p className="text-gray-300 mb-6">{deleteMessage}</p>
              <div className="flex gap-3">
                <button
                  onClick={handleDelete}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
