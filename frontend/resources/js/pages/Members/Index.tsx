import { useState, useEffect } from "react";
import { useMusic } from "@/contexts/MusicContext";
import { useAuth } from "@/contexts/AuthContext";

// Spotify artist IDs for each member
const memberSpotifyIds = {
  Pablo: "7wY8cwtF13xDJIHO7htMNk", 
  Josh: "3xn2W0ziGURPYJj372a6jQ", 
  Stell: "4bpUKZGsImgabgDABbThr0", 
  Felip: "2tEFDBihLXytoPl4xdResl", 
  Justin: "3xn2W0ziGURPYJj372a6jQ" 
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

interface Member {
  name: string;
  role: string;
  bio: string;
  image: string;
}

const members: Member[] = [
  {
    name: "Pablo",
    role: "Leader, Main Rapper, Songwriter, Producer",
    bio: "Pablo is the group's creative backbone and visionary. As SB19's leader and primary songwriter, he crafts lyrics and melodies that reflect authenticity, depth, and purpose. Known for his introspective mind and strong work ethic, he pushes the group to reach artistic excellence while keeping their message grounded in truth and resilience.",
    image: "/images/PabloProf.jpg",
  },
  {
    name: "Josh",
    role: "Lead Rapper, Sub-Vocalist, Performer",
    bio: "Josh brings sharp charisma, confidence, and intensity to the stage. A natural performer, he balances swagger with sincerity, often channeling real emotions and experiences into his music. His artistry, both in SB19 and solo, reflects raw honesty and individuality—showing how strength and vulnerability can coexist.",
    image: "/images/JoshProf.jpg",
  },
  {
    name: "Stell",
    role: "Main Vocalist, Lead Dancer, Choreographer",
    bio: "Stell is the group's powerhouse vocalist and performance perfectionist. His voice blends emotion and control, often delivering the most unforgettable high notes. As a choreographer, he ensures SB19's performances remain sharp, expressive, and world-class. His warmth, humor, and passion make him both the group's sunshine and heart.",
    image: "/images/StellProf.jpg",
  },
  {
  name: "Felip",
    role: "Main Dancer, Lead Vocalist, Choreographer",
  bio: "Ken, also known as FELIP, brings depth, mystery, and artistry to SB19. His low, distinctive voice and experimental style redefine musical boundaries. As a performer, he radiates individuality and intensity, while his solo work under “FELIP” showcases bold self-expression, blending culture, confidence, and creative freedom.",
    image: "/images/FelipProf.jpg",
  },
  {
    name: "Justin",
    role: "Sub-Vocalist, Visual, Creative Director",
    bio: "Justin is the group's visual storyteller and youngest member. Behind his calm and charming presence lies a keen creative eye—he often directs SB19's music videos and contributes to visual concepts. His blend of artistry, intelligence, and optimism helps shape the group's aesthetic identity and emotional storytelling.",
    image: "/images/JustinProf.jpg",
  },
];

export default function Members() {
  const { playMemberPlaylist, isPlayerOpen } = useMusic();
  const { isAuthenticated } = useAuth();
  const [selectedMember, setSelectedMember] = useState<string>("Pablo");
  const [memberTracks, setMemberTracks] = useState<{ [key: string]: Track[] }>({});
  const [loadingMember, setLoadingMember] = useState<string | null>(null);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

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
      const artistId = memberSpotifyIds[memberName as keyof typeof memberSpotifyIds];
      if (!artistId) {
        setMemberTracks(prev => ({ ...prev, [memberName]: [] }));
        setLoadingMember(null);
        return;
      }
      const response = await fetch(`/api/spotify/artists/${artistId}/top-tracks?market=PH`);
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

  const currentMemberData = members.find(member => member.name === selectedMember);
  const currentTracks = memberTracks[selectedMember] || [];
  const isLoading = loadingMember === selectedMember;

  // Load Pablo's tracks by default
  if (isAuthenticated && !memberTracks[selectedMember] && !isLoading) {
    fetchMemberTracks(selectedMember);
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">

        <div className="flex flex-col lg:flex-row" style={{ paddingTop: '50px' }}>
          {/* Member Selection Sidebar (desktop only when no music playing) */}
          {!shouldShowDropdown && (
            <div className="lg:w-1/4 bg-gray-800 p-6" style={{ position: 'sticky', top: '80px', alignSelf: 'flex-start', height: 'fit-content' }}>
              <h2 className="text-xl font-bold text-yellow-400 mb-4">Members</h2>
              <p className="text-gray-400 text-center mb-4">
              Meet the talented members of SB19 and explore their solo works
              </p>
              <div className="space-y-3">
                {members.map((member) => (
                  <button
                    key={member.name}
                    onClick={() => handleMemberChange(member.name)}
                    className={`w-full text-left p-3 rounded-lg transition-all duration-300 ${
                      selectedMember === member.name
                        ? "bg-yellow-400 text-black"
                        : "bg-gray-700 hover:bg-gray-600 text-white"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="font-medium">{member.name}</h3>
                        <p className={`text-sm ${selectedMember === member.name ? 'text-gray-700' : 'text-gray-400'}`}>
                          {member.role}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Dropdown for mobile OR when music player is open */}
          {shouldShowDropdown && (
            <div className="p-6 fixed top-[70px] left-0 w-full z-10 border-b border-gray-800 bg-[#333]">
              <div className="relative">
                <button
                  aria-haspopup="true"
                  aria-expanded={mobileDropdownOpen}
                  onClick={() => setMobileDropdownOpen((s) => !s)}
                  className="w-full flex items-center justify-between px-4 py-2 bg-white/5 rounded"
                >
                  <span className="text-xl font-bold text-yellow-400">Members</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className={`w-4 h-4 text-white transform transition-transform ${mobileDropdownOpen ? 'rotate-180' : 'rotate-0'}`}
                  >
                    <path d="M5.23 7.21a.75.75 0 011.06.02L10 11.293l3.71-4.06a.75.75 0 111.1 1.02l-4.25 4.66a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" />
                  </svg>
                </button>

                {mobileDropdownOpen && (
                  <div className="absolute left-4 right-4 mt-2 bg-gray-800 rounded shadow-lg z-50">
                    <div className="py-2 space-y-1">
                      {members.map((m) => (
                        <button
                          key={m.name}
                          onClick={() => {
                            handleMemberChange(m.name);
                            setMobileDropdownOpen(false);
                          }}
                          className={`w-full text-left p-3 rounded-lg transition-all duration-300 flex items-center space-x-3 ${
                            selectedMember === m.name ? 'bg-yellow-400 text-black' : 'bg-[#333] hover:bg-gray-700 text-white'
                          }`}
                        >
                          <img src={m.image} alt={m.name} className="w-10 h-10 rounded-full object-cover" />
                          <div>
                            <h3 className="font-medium">{m.name}</h3>
                            <p className={`text-sm ${selectedMember === m.name ? 'text-gray-700' : 'text-gray-400'}`}>{m.role}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Member Details and Tracks */}
          <div className={`p-6 ${!shouldShowDropdown ? 'lg:w-3/4' : 'w-full'} ${shouldShowDropdown ? 'mt-[120px]' : ''}`}>
            {currentMemberData && (
              <>
                {/* Member Info */}
                <div className="bg-gray-800 rounded-lg p-6 mb-6">
                  <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
                    <img
                      src={currentMemberData.image}
                      alt={currentMemberData.name}
                      className="w-32 h-32 rounded-full object-cover border-4 border-yellow-400"
                    />
                    <div className="text-center md:text-left">
                      <h2 className="text-3xl font-bold text-yellow-400 mb-2">
                        {currentMemberData.name}
                      </h2>
                      <p className="text-gray-300 text-lg mb-3">
                        {currentMemberData.role}
                      </p>
                      <p className="text-gray-400 leading-relaxed">
                        {currentMemberData.bio}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Solo Tracks */}
                <div className="bg-gray-800 rounded-lg p-6">
                  <div className="mb-4">
                    <h3 className="text-2xl font-bold text-yellow-400 mb-4">
                      🎵 Solo Tracks
                    </h3>
                    
                    {/* Play All and Shuffle Buttons */}
                    {currentTracks.length > 0 && (
                      <div className="flex space-x-4 mb-4">
                        <button
                          onClick={() => {
                            const memberTracksArray = memberTracks[selectedMember] || [];
                            playMemberPlaylist(memberTracksArray, selectedMember, 0);
                          }}
                          className="bg-yellow-400 text-black px-6 py-2 rounded-lg hover:bg-yellow-300 transition-colors font-semibold flex items-center space-x-2"
                        >
                          <span>▶️</span>
                          <span>Play All</span>
                        </button>
                        
                        <button
                          onClick={() => {
                            const memberTracksArray = [...(memberTracks[selectedMember] || [])];
                            // Shuffle the array
                            for (let i = memberTracksArray.length - 1; i > 0; i--) {
                              const j = Math.floor(Math.random() * (i + 1));
                              [memberTracksArray[i], memberTracksArray[j]] = [memberTracksArray[j], memberTracksArray[i]];
                            }
                            playMemberPlaylist(memberTracksArray, selectedMember, 0);
                          }}
                          className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-500 transition-colors font-semibold flex items-center space-x-2"
                        >
                          <span>🔀</span>
                          <span>Shuffle</span>
                        </button>
                      </div>
                    )}
                  </div>
                  
                  { !isAuthenticated ? (
                    <div className="text-center py-8">
                      <p className="text-gray-400 mb-4">Please <a href="/login" className="text-yellow-400">login</a> to view SB19 songs.</p>
                      <a href="/login" className="inline-block px-4 py-2 bg-yellow-400 text-black rounded">Login</a>
                    </div>
                  ) : isLoading ? (
                    <div className="text-center py-8">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
                      <p className="text-gray-400 mt-2">Loading {selectedMember}'s tracks...</p>
                    </div>
                  ) : currentTracks.length > 0 ? (
                    <div className="divide-y divide-gray-700">
                      {currentTracks.map((track, index) => (
                        <div
                          key={track.id}
                          className="flex items-center justify-between py-3 px-2 hover:bg-gray-800/70 rounded-lg transition" 
                        >
                          {/* Left part: # + Cover + Title */}
                          <div className="flex items-center space-x-4">
                            <span className="text-gray-400 w-6 text-sm">{index + 1}</span>
                            {/* Use the exact album image for each track when available */}
                            <img
                              src={track.album?.images?.[0]?.url}
                              alt={track.album?.name || track.name || 'Track'}
                              className="w-10 h-10 rounded object-cover"
                            />
                            <div>
                              <span className="font-medium block">{track.name}</span>
                              <span className="text-gray-400 text-sm">{track.artists.map(a => a.name).join(', ')}</span>
                            </div>
                          </div>

                          {/* Right part: Duration + Play button */}
                          <div className="flex items-center space-x-4 text-gray-400">
                            <span className="text-sm">{formatDuration(track.duration_ms)}</span>
                            <button
                              onClick={() => {
                                const memberTracksArray = memberTracks[selectedMember] || [];
                                const trackIndex = memberTracksArray.findIndex(t => t.id === track.id);
                                playMemberPlaylist(memberTracksArray, selectedMember, trackIndex);
                              }}
                              className="text-yellow-400 hover:text-yellow-300 text-lg"
                              title={track.preview_url ? "Play 30s preview" : "Open in Spotify"}
                            >
                              ▶
                            </button>
                            {track.preview_url && (
                              <audio controls src={track.preview_url} style={{ width: 120 }}>
                                Your browser does not support the audio element.
                              </audio>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-400">No solo tracks found for {selectedMember}.</p>
                      <p className="text-gray-500 text-sm mt-2">
                        Check back later for updates on their solo releases!
                      </p>
                    </div>
                  )}
                </div>

                {/* Fun Facts Section */}
                <div className="bg-gray-800 rounded-lg p-6 mt-6">
                  <h3 className="text-xl font-bold text-yellow-400 mb-4">
                    ⭐ Fun Facts
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {selectedMember === "Pablo" && (
                      <>
                        <div className="bg-gray-700 p-4 rounded-lg">
                          <h4 className="text-yellow-300 font-medium mb-2">Real Name</h4>
                          <p className="text-gray-300">John Paulo Nase</p>
                        </div>
                        <div className="bg-gray-700 p-4 rounded-lg">
                          <h4 className="text-yellow-300 font-medium mb-2">House/Fan</h4>
                          <p className="text-gray-300">Freezer/Hotdogs</p>
                        </div>
                      </>
                    )}
                    {selectedMember === "Josh" && (
                      <>
                        <div className="bg-gray-700 p-4 rounded-lg">
                          <h4 className="text-yellow-300 font-medium mb-2">Real Name</h4>
                          <p className="text-gray-300">Josh Cullen Santos</p>
                        </div>
                        <div className="bg-gray-700 p-4 rounded-lg">
                          <h4 className="text-yellow-300 font-medium mb-2">House/Fan</h4>
                          <p className="text-gray-300">Grill/BBQs</p>
                        </div>
                      </>
                    )}
                    {selectedMember === "Stell" && (
                      <>
                        <div className="bg-gray-700 p-4 rounded-lg">
                          <h4 className="text-yellow-300 font-medium mb-2">Real Name</h4>
                          <p className="text-gray-300">Stellvester Ajero</p>
                        </div>
                        <div className="bg-gray-700 p-4 rounded-lg">
                          <h4 className="text-yellow-300 font-medium mb-2">House/Fan</h4>
                          <p className="text-gray-300">Strawberry Farm/Berries</p>
                        </div>
                      </>
                    )}
                    {selectedMember === "Felip" && (
                      <>
                        <div className="bg-gray-700 p-4 rounded-lg">
                          <h4 className="text-yellow-300 font-medium mb-2">Real Name</h4>
                          <p className="text-gray-300">Felip Jhon Suson</p>
                        </div>
                        <div className="bg-gray-700 p-4 rounded-lg">
                          <h4 className="text-yellow-300 font-medium mb-2">House/Fan</h4>
                          <p className="text-gray-300">Poultry/Sisiws</p>
                        </div>
                      </>
                    )}
                    {selectedMember === "Justin" && (
                      <>
                        <div className="bg-gray-700 p-4 rounded-lg">
                          <h4 className="text-yellow-300 font-medium mb-2">Real Name</h4>
                          <p className="text-gray-300">Justin De Dios</p>
                        </div>
                        <div className="bg-gray-700 p-4 rounded-lg">
                          <h4 className="text-yellow-300 font-medium mb-2">House/Fan</h4>
                          <p className="text-gray-300">Corn Field/Mais</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}