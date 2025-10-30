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
  content_paragraph_1: string;
  content_paragraph_2: string;
  content_paragraph_3: string | null;
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

type TabType = 'artists' | 'origins' | 'achievements' | 'footer' | 'messages';

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
    content_paragraph_1: '',
    content_paragraph_2: '',
    content_paragraph_3: '',
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

  const ADMIN_PASSWORD = 'sb19admin2025'; // Simple passphrase

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
      const [artistsRes, originsRes, achievementsRes, footerRes, messagesRes] = await Promise.all([
        fetch('/api/crud/artists'),
        fetch('/api/crud/about-origins'),
        fetch('/api/crud/about-achievements'),
        fetch('/api/crud/about-footer'),
        fetch('/api/crud/track-messages')
      ]);

      const [artistsData, originsData, achievementsData, footerData, messagesData] = await Promise.all([
        artistsRes.json(),
        originsRes.json(),
        achievementsRes.json(),
        footerRes.json(),
        messagesRes.json()
      ]);

      setArtists(artistsData.artists || []);
      setOrigins(originsData.origins || []);
      setAchievements(achievementsData.achievements || []);
      setFooterItems(footerData.footerItems || []);
      setTrackMessages(messagesData.messages || []);
    } catch (err) {
      setError('Failed to fetch data');
      console.error(err);
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
        setSuccess(`Image uploaded: ${data.filename}`);
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
        setSuccess('Artist updated successfully');
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
        setSuccess('Origin section updated successfully');
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
        setSuccess('Origin section created successfully');
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
      if (!confirm('Are you sure you want to delete this origin section?')) {
        return;
      }
      
      const res = await fetch(`/api/crud/about-origins/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setSuccess('Origin section deleted successfully');
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
        setSuccess('Achievement created successfully');
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
        setSuccess('Achievement updated successfully');
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
    if (!confirm('Are you sure you want to delete this achievement?')) return;
    
    try {
      const res = await fetch(`/api/crud/about-achievements/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setSuccess('Achievement deleted successfully');
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
        setSuccess('Footer updated successfully');
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
        setSuccess('Track message created successfully');
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
        setSuccess('Track message updated successfully');
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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-6">
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
            { id: 'messages', label: 'Track Messages' }
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
                    content_paragraph_1: '',
                    content_paragraph_2: '',
                    content_paragraph_3: '',
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
                          value={editingOrigin.content_paragraph_1}
                          onChange={(e) => setEditingOrigin({ ...editingOrigin, content_paragraph_1: e.target.value })}
                          placeholder="Paragraph 1"
                          rows={3}
                          className="w-full bg-gray-600 text-white px-3 py-2 rounded"
                        />
                        <textarea
                          value={editingOrigin.content_paragraph_2}
                          onChange={(e) => setEditingOrigin({ ...editingOrigin, content_paragraph_2: e.target.value })}
                          placeholder="Paragraph 2"
                          rows={3}
                          className="w-full bg-gray-600 text-white px-3 py-2 rounded"
                        />
                        <textarea
                          value={editingOrigin.content_paragraph_3 || ''}
                          onChange={(e) => setEditingOrigin({ ...editingOrigin, content_paragraph_3: e.target.value })}
                          placeholder="Paragraph 3 (optional)"
                          rows={3}
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
                        <p className="text-gray-400 text-sm mt-2">{origin.content_paragraph_1.substring(0, 150)}...</p>
                        {origin.quote && <p className="text-yellow-300 italic mt-2">"{origin.quote}"</p>}
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => setEditingOrigin(origin)}
                            className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded font-semibold"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteOrigin(origin.id)}
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
                            onClick={() => deleteAchievement(achievement.id)}
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
            <div>
              <h2 className="text-2xl font-bold text-yellow-400 mb-4">Track Inspirational Messages</h2>
              <p className="text-gray-400 mb-6">Create or edit track messages (Create & Edit only)</p>
              
              <div className="mb-4 bg-gray-700 p-4 rounded-lg">
                <h3 className="font-bold text-yellow-400 mb-3">Add New Message</h3>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  createTrackMessage({
                    track_id: parseInt(formData.get('track_id') as string),
                    message: formData.get('message') as string
                  });
                  e.currentTarget.reset();
                }}>
                  <input
                    name="track_id"
                    type="number"
                    placeholder="Track ID"
                    required
                    className="w-full bg-gray-600 text-white px-3 py-2 rounded mb-2"
                  />
                  <textarea
                    name="message"
                    placeholder="Inspirational Message"
                    required
                    rows={2}
                    className="w-full bg-gray-600 text-white px-3 py-2 rounded mb-2"
                  />
                  <button
                    type="submit"
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded font-semibold"
                  >
                    Create Message
                  </button>
                </form>
              </div>

              <div className="space-y-4">
                {trackMessages.map((msg) => (
                  <div key={msg.id} className="bg-gray-700 p-4 rounded-lg">
                    {editingMessage?.id === msg.id ? (
                      <div className="space-y-3">
                        <textarea
                          value={editingMessage.message}
                          onChange={(e) => setEditingMessage({ ...editingMessage, message: e.target.value })}
                          placeholder="Message"
                          rows={3}
                          className="w-full bg-gray-600 text-white px-3 py-2 rounded"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => updateTrackMessage(editingMessage)}
                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingMessage(null)}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h3 className="text-lg font-bold text-yellow-400">
                          Track: {msg.Track?.title || `ID ${msg.track_id}`}
                        </h3>
                        <p className="text-gray-300 mt-2">{msg.message}</p>
                        <button
                          onClick={() => setEditingMessage(msg)}
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
                <label className="block text-gray-300 mb-2">Paragraph 1 *</label>
                <textarea
                  value={newOrigin.content_paragraph_1}
                  onChange={(e) => setNewOrigin({ ...newOrigin, content_paragraph_1: e.target.value })}
                  placeholder="Enter first paragraph"
                  rows={4}
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Paragraph 2 (Optional)*</label>
                <textarea
                  value={newOrigin.content_paragraph_2}
                  onChange={(e) => setNewOrigin({ ...newOrigin, content_paragraph_2: e.target.value })}
                  placeholder="Enter second paragraph (optional)"
                  rows={4}
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Paragraph 3 (Optional)</label>
                <textarea
                  value={newOrigin.content_paragraph_3}
                  onChange={(e) => setNewOrigin({ ...newOrigin, content_paragraph_3: e.target.value })}
                  placeholder="Enter third paragraph (optional)"
                  rows={4}
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded"
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
                    if (!newOrigin.title || !newOrigin.content_paragraph_1 || !newOrigin.content_paragraph_2 || !newOrigin.image_url) {
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
    </div>
  );
}
