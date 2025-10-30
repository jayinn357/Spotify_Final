import { useState, useEffect } from "react";
import { useMusic } from "@/contexts/MusicContext";
import { useAuth } from "@/contexts/AuthContext";

// Spotify artist IDs for each member
const memberSpotifyIds: { [key: string]: string } = {
  Pablo: "7wY8cwtF13xDJIHO7htMNk", 
  Josh: "3xn2W0ziGURPYJj372a6jQ", 
  Stell: "4bpUKZGsImgabgDABbThr0", 
  Felip: "2tEFDBihLXytoPl4xdResl",
  Ken: "2tEFDBihLXytoPl4xdResl",
  Justin: "3xn2W0ziGURPYJj372a6jQ" 
};

// Image mappings
const memberImages: { [key: string]: string } = {
  "Pablo": "/images/PabloProf.jpg",
  "Josh": "/images/JoshProf.jpg",
  "Stell": "/images/StellProf.jpg",
  "Felip": "/images/FelipProf.jpg",
  "Ken": "/images/FelipProf.jpg",
  "Justin": "/images/JustinProf.jpg"
};

interface Track {
  id: string;
  name: string;
  duration_ms: number;
  preview_url?: string | null;
  popularity?: number;
  album: {
    name: string;
    images: Array<{ url: string }>;
  };
  artists: Array<{ name: string }>;
}

interface Artist {
  id: number;
  name: string;
  real_name: string | null;
  specialty: string | null;
  role: string | null;
  description: string | null;
  image_url: string | null;
  spotify_id: string;
}

export default function Members() {
  const { playMemberPlaylist, isPlayerOpen } = useMusic();
  const { isAuthenticated } = useAuth();
  const [selectedMember, setSelectedMember] = useState<string>("Pablo");
  const [memberTracks, setMemberTracks] = useState<{ [key: string]: Track[] }>({});
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loadingMember, setLoadingMember] = useState<string | null>(null);
  const [loadingArtists, setLoadingArtists] = useState(true);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  // Fetch artists from database
  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const response = await fetch('/api/crud/artists');
        if (response.ok) {
          const data = await response.json();
          setArtists(data.artists || []);
        }
      } catch (error) {
        console.error('Error fetching artists:', error);
      } finally {
        setLoadingArtists(false);
      }
    };

    fetchArtists();
  }, []);

  // Check if screen is desktop size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 1024); // lg breakpoint
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Determine if sidebar should be dropdown: mobile OR music player is open
  const shouldShowDropdown = !isDesktop || isPlayerOpen;

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const fetchMemberTracks = async (memberName: string) => {
    // If already loaded, don't fetch again
    if (memberTracks[memberName]) {
      return;
    }

    setLoadingMember(memberName);
    try {
      const artistId = memberSpotifyIds[memberName];
      if (!artistId) {
        setMemberTracks(prev => ({ ...prev, [memberName]: [] }));
        setLoadingMember(null);
        return;
      }
      // Fetch from DATABASE endpoint
      const response = await fetch(`/api/tracks/member/${artistId}`);
      if (response.ok) {
        const data = await response.json();
        setMemberTracks(prev => ({ ...prev, [memberName]: data.tracks || [] }));
      } else {
        setMemberTracks(prev => ({ ...prev, [memberName]: [] }));
      }
    } catch (error) {
      console.error('Error fetching member tracks:', error);
      setMemberTracks(prev => ({ ...prev, [memberName]: [] }));
    } finally {
      setLoadingMember(null);
    }
  };

  const handleMemberChange = (memberName: string) => {
    setSelectedMember(memberName);
    fetchMemberTracks(memberName);
  };

  // Get current member data from database
  const currentArtist = artists.find(artist => artist.name === selectedMember);
  const currentTracks = memberTracks[selectedMember] || [];
  const isLoading = loadingMember === selectedMember;

  // Load tracks when member selected
  useEffect(() => {
    if (isAuthenticated && selectedMember && !memberTracks[selectedMember] && !isLoading) {
      fetchMemberTracks(selectedMember);
    }
  }, [selectedMember, isAuthenticated]);

  if (loadingArtists) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <div className="text-yellow-400 text-xl">Loading members...</div>
      </div>
    );
  }

  const membersList = artists.filter(artist => artist.name !== 'SB19');

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
        <div className="flex flex-col lg:flex-row" style={{ paddingTop: '50px' }}>
          {/* SIDEBAR / DROPDOWN */}
          {shouldShowDropdown ? (
            /* DROPDOWN MODE */
            <div className="w-full lg:w-1/4 px-4 py-6">
              <button
                onClick={() => setMobileDropdownOpen(!mobileDropdownOpen)}
                className="w-full bg-gray-800 hover:bg-gray-700 text-white py-3 px-4 rounded-lg flex justify-between items-center transition"
              >
                <span className="font-semibold">{selectedMember}</span>
                <svg 
                  className={`w-5 h-5 transition-transform ${mobileDropdownOpen ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {mobileDropdownOpen && (
                <div className="mt-2 bg-gray-800 rounded-lg overflow-hidden">
                  {membersList.map(member => (
                    <button
                      key={member.id}
                      onClick={() => {
                        handleMemberChange(member.name);
                        setMobileDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 hover:bg-gray-700 transition ${
                        selectedMember === member.name ? 'bg-yellow-400/20 text-yellow-400' : 'text-gray-300'
                      }`}
                    >
                      <div className="font-bold">{member.name}</div>
                      {member.real_name && (
                        <div className={`text-sm mt-1 ${selectedMember === member.name ? 'text-yellow-300' : 'text-gray-400'}`}>
                          {member.real_name}
                        </div>
                      )}
                      {member.specialty && (
                        <div className={`text-xs mt-1 italic ${selectedMember === member.name ? 'text-yellow-200' : 'text-gray-500'}`}>
                          {member.specialty}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* SIDEBAR MODE */
            <aside className="w-1/4 bg-gray-800 p-6 border-r border-gray-700">
              <h2 className="text-2xl font-bold text-yellow-400 mb-6">Members</h2>
              <ul className="space-y-3">
                {membersList.map(member => (
                  <li key={member.id}>
                    <button
                      onClick={() => handleMemberChange(member.name)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition ${
                        selectedMember === member.name
                          ? 'bg-yellow-400 text-black font-semibold'
                          : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                      }`}
                    >
                      <div className="font-bold text-lg">{member.name}</div>
                      {member.real_name && (
                        <div className={`text-sm mt-1 ${selectedMember === member.name ? 'text-gray-800' : 'text-gray-400'}`}>
                          {member.real_name}
                        </div>
                      )}
                      {member.specialty && (
                        <div className={`text-xs mt-1 italic ${selectedMember === member.name ? 'text-gray-700' : 'text-gray-500'}`}>
                          {member.specialty}
                        </div>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </aside>
          )}

          {/* MAIN CONTENT */}
          <main className="flex-1 p-8">
            {currentArtist ? (
              <div>
                {/* MEMBER INFO */}
                <div className="flex flex-col lg:flex-row gap-8 mb-8">
                  <img
                    src={memberImages[currentArtist.name] || currentArtist.image_url || '/images/placeholder.jpg'}
                    alt={currentArtist.name}
                    className="w-full lg:w-64 h-64 object-cover rounded-lg shadow-lg"
                  />
                  <div className="flex-1">
                    <h1 className="text-4xl font-bold text-yellow-400 mb-2">{currentArtist.name}</h1>
                    <p className="text-lg text-gray-400 mb-4">{currentArtist.role || 'Member'}</p>
                    <p className="text-gray-300 leading-relaxed">
                      {currentArtist.description || 'No description available yet.'}
                    </p>
                  </div>
                </div>

                {/* TRACKS SECTION */}
                <div className="mt-12">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-yellow-400">Top Tracks</h2>
                    <div className="space-x-2">
                      <button
                        onClick={() => playMemberPlaylist(currentTracks, currentArtist.name, 0)}
                        className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-lg font-semibold transition"
                      >
                        Play All
                      </button>
                      <button
                        onClick={() => {
                          const shuffledTracks = [...currentTracks].sort(() => Math.random() - 0.5);
                          playMemberPlaylist(shuffledTracks, currentArtist.name, 0);
                        }}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition"
                      >
                        🔀 Shuffle
                      </button>
                    </div>
                  </div>

                  {isLoading ? (
                    <div className="text-center py-12 text-gray-400">
                      Loading tracks...
                    </div>
                  ) : currentTracks.length > 0 ? (
                    <div className="space-y-2">
                      {currentTracks.map((track, index) => (
                        <div
                          key={track.id}
                          className="flex items-center gap-4 p-4 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg transition cursor-pointer group"
                          onClick={() => playMemberPlaylist(currentTracks, currentArtist.name, index)}
                        >
                          <div className="text-gray-400 w-8">{index + 1}</div>
                          <img
                            src={track.album.images[0]?.url}
                            alt={track.album.name}
                            className="w-12 h-12 rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold truncate group-hover:text-yellow-400 transition">
                              {track.name}
                            </div>
                            <div className="text-sm text-gray-400 truncate">
                              {track.album.name}
                            </div>
                          </div>
                          <div className="text-gray-400 text-sm">
                            {formatDuration(track.duration_ms)}
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              playMemberPlaylist(currentTracks, currentArtist.name, index);
                            }}
                            className="opacity-0 group-hover:opacity-100 bg-yellow-400 hover:bg-yellow-500 text-black p-2 rounded-full transition"
                          >
                            ▶
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-400">
                      No tracks available for this member.
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                Select a member to view their profile and tracks.
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}
