import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useMusic } from "@/contexts/MusicContext";
import { useAuth } from "@/contexts/AuthContext";

// Spotify API interface
interface SpotifyTrack {
  id: string;
  name: string;
  duration_ms: number;
  preview_url?: string | null;
  popularity: number;
  album: {
    name: string;
    images: Array<{ url: string; height: number; width: number }>;
  };
  artists: Array<{ name: string }>;
  external_urls: {
    spotify: string;
  };
}

// SB19 Artist ID on Spotify
const SB19_ARTIST_ID = "3g7vYcdDXnqnDKYFwqXBJP";

// Spotify Album IDs for SB19
const albumIds = {
  "Get In The Zone": "4JlsfnNH8MCDXR0ypy1zcm",
  "Pagsibol": "4bieHSYaRSMRAoDF47qfSf", 
  "PAGTATAG!": "7svCelXfTenSbzFXKj3zGF",
  "Simula at Wakas": "04tWizEPzUimMQaZKdZwzJ"
};


export default function Home() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { playTrack, playAlbumPlaylist, playAllSongsPlaylist } = useMusic();
    const images = [
        "/images/banner-1.jpg",
        "/images/banner-2.jpg", 
        "/images/banner-3.jpg",
        "/images/banner-4.jpg",
    ];

    // For confetti/emoji burst
    const funSectionRef = useRef<HTMLDivElement | null>(null);

    const handleFunClick = () => {
        // Confetti/emoji burst
        if (funSectionRef.current) {
            // Set of positive Lucide icons as SVG strings
            const iconSvgs = [
                `<svg width='32' height='32' fill='currentColor' class='text-purple-500' viewBox='0 0 24 24'><path d='M9 18V5l12-2v13'/><circle cx='6' cy='18' r='3'/><circle cx='18' cy='16' r='3'/></svg>`,   
                `<svg width='32' height='32' fill='currentColor' class='text-yellow-400' viewBox='0 0 24 24'><path d='M12 3v2m6.364 1.636-1.414 1.414M21 12h-2M19.364 18.364l-1.414-1.414M12 19v2M6.343 17.657l-1.414-1.414M3 12h2M6.343 6.343l-1.414 1.414M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z'/></svg>`, // Sparkles yellow
                `<svg width='32' height='32' fill='currentColor' class='text-pink-400' viewBox='0 0 24 24'><path d='M5.8 11.3 2 22l10.7-3.8M5.8 11.3l7.1 7.1m-7.1-7.1 9.9-9.9c.4-.4 1-.4 1.4 0l2.5 2.5c.4.4.4 1 0 1.4l-9.9 9.9m0 0L2 22m10.7-3.8 9.2-3.2c.5-.2.7-.8.3-1.2l-2.2-2.2m-7.3 6.6 6.6-6.6'/></svg>`, // PartyPopper pink
                `<svg width='32' height='32' fill='currentColor' class='text-green-400' viewBox='0 0 24 24'><path d='M12 21C7.029 21 3 16.971 3 12S7.029 3 12 3s9 4.029 9 9-4.029 9-9 9Zm0-4a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z'/></svg>`, // Heart green
                `<svg width='32' height='32' fill='currentColor' class='text-blue-400' viewBox='0 0 24 24'><circle cx='12' cy='12' r='10'/><path d='M8 15s1.5 2 4 2 4-2 4-2'/><path d='M9 9h.01M15 9h.01'/></svg>`, // Smile blue
                `<svg width='32' height='32' fill='currentColor' class='text-red-500' viewBox='0 0 24 24'><path d='M12 21C7.029 21 3 16.971 3 12S7.029 3 12 3s9 4.029 9 9-4.029 9-9 9Zm0-4a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z'/></svg>`, // Heart red
                `<svg width='32' height='32' fill='currentColor' class='text-yellow-300' viewBox='0 0 24 24'><circle cx='12' cy='12' r='10'/><path d='M8 15s1.5 2 4 2 4-2 4-2'/><path d='M9 9h.01M15 9h.01'/></svg>` // Smile yellow
            ];
            for (let i = 0; i < 30; i++) {
                const iconSpan = document.createElement("span");
                iconSpan.style.position = "absolute";
                iconSpan.style.left = Math.random() * 100 + "%";
                iconSpan.style.top = "60%";
                iconSpan.style.fontSize = "2rem";
                iconSpan.style.pointerEvents = "none";
                iconSpan.style.transition = "transform 1.5s, opacity 1.5s";
                iconSpan.innerHTML = iconSvgs[Math.floor(Math.random() * iconSvgs.length)];
                funSectionRef.current.appendChild(iconSpan);
                setTimeout(() => {
                    iconSpan.style.transform = `translateY(-${100 + Math.random() * 100}px) rotate(${Math.random() * 360}deg)`;
                    iconSpan.style.opacity = "0";
                }, 10);
                setTimeout(() => {
                    iconSpan.remove();
                }, 1600);
            }
        }

        // Redirect to Random Song Page after animation (1 second)
        setTimeout(() => {
            // router defines this page at "/random-song"
            navigate("/random-song");
        }, 1000);
    };


    // Expand/collapse state for popular tracks (must be inside component)
    const [showAllPopular, setShowAllPopular] = useState(false);

    const [currentImage, setCurrentImage] = useState(0);
    // Real Spotify data states  
    const [popularTracks, setPopularTracks] = useState<SpotifyTrack[]>([]);
    const [loadingTracks, setLoadingTracks] = useState(true);
    const [tracksError, setTracksError] = useState<string | null>(null);
    const [scrollOpacity, setScrollOpacity] = useState(0);
    // Album modal states
    const [showAlbumModal, setShowAlbumModal] = useState(false);
    const [selectedAlbum, setSelectedAlbum] = useState<string | null>(null);
    const [albumTracks, setAlbumTracks] = useState<SpotifyTrack[]>([]);
    const [loadingAlbumTracks, setLoadingAlbumTracks] = useState(false);
    // All songs modal states  
    const [showAllSongsModal, setShowAllSongsModal] = useState(false);
    const [allGroupSongs, setAllGroupSongs] = useState<SpotifyTrack[]>([]);
    const [loadingAllSongs, setLoadingAllSongs] = useState(false);

    // Fetch popular tracks from database
    useEffect(() => {
        if (!isAuthenticated) {
            setLoadingTracks(false);
            setPopularTracks([]);
            return;
        }

        const fetchPopularTracks = async () => {
            setLoadingTracks(true);
            setTracksError(null);
            try {
                const response = await fetch(`/api/tracks/sb19/popular`);
                if (response.ok) {
                    const data = await response.json();
                    if (data.tracks && data.tracks.length > 0) {
                        setPopularTracks(data.tracks);
                    } else {
                        setTracksError('No tracks found in database');
                    }
                } else {
                    await response.text(); // consume body
                    setTracksError(`Failed to load popular tracks: ${response.status}`);
                }
            } catch {
                setTracksError('Network error occurred');
            } finally {
                setLoadingTracks(false);
            }
        };

        fetchPopularTracks();
    }, [isAuthenticated]);

    // Slideshow
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImage((prev) => (prev + 1) % images.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [images.length]);

    // Scroll fade effect 
    useEffect(() => {
        const handleScroll = () => {
            const opacity = Math.min(window.scrollY / 300, 1);
            setScrollOpacity(opacity);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const formatDuration = (ms: number) => {
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const openAlbumModal = async (albumName: string) => {
        setSelectedAlbum(albumName);
        setShowAlbumModal(true);
        setLoadingAlbumTracks(true);
        setAlbumTracks([]);

        try {
            const albumId = albumIds[albumName as keyof typeof albumIds];

            if (!albumId) {
                console.error(`No album ID found for ${albumName}`);
                setAlbumTracks([]);
                return;
            }

            // Fetch tracks from DATABASE (includes local_audio_url) instead of Spotify API
            const albumResponse = await fetch(`/api/tracks?album_id=${albumId}`);        

            if (albumResponse.ok) {
                const albumData = await albumResponse.json();
                setAlbumTracks(albumData.tracks || []);
            } else {
                console.error('Failed to fetch album tracks:', albumResponse.status);
                setAlbumTracks([]);
            }
        } catch (error) {
            console.error('Error fetching album tracks:', error);
            setAlbumTracks([]);
        } finally {
            setLoadingAlbumTracks(false);
        }
    };

    const fetchAllGroupSongs = async () => {
        setLoadingAllSongs(true);
        setAllGroupSongs([]);

        try {
            // Fetch all tracks from database instead of Spotify API
            const allTracksResponse = await fetch('/api/tracks');
            
            if (allTracksResponse.ok) {
                const allTracksData = await allTracksResponse.json();
                console.log('=== DEBUG: All Songs from Database ===');
                console.log('Total tracks fetched:', allTracksData.tracks?.length);
                console.log('=== END DEBUG ===');
                
                if (allTracksData.tracks && allTracksData.tracks.length > 0) {
                    // Sort by popularity if available, otherwise by name
                    const sortedTracks = allTracksData.tracks.sort((a: SpotifyTrack, b: SpotifyTrack) => {
                        // If tracks have popularity field, use it
                        if (a.popularity && b.popularity) {
                            return b.popularity - a.popularity;
                        }
                        // Otherwise sort alphabetically by name
                        return a.name.localeCompare(b.name);
                    });
                    
                    setAllGroupSongs(sortedTracks);
                } else {
                    console.warn('No tracks found in database');
                    setAllGroupSongs([]);
                }
            } else {
                console.error('Failed to fetch tracks from database');
                setAllGroupSongs([]);
            }
        } catch (error) {
            console.error('Error fetching all group songs:', error);
            setAllGroupSongs([]);
        } finally {
            setLoadingAllSongs(false);
        }
    };

    return (
        <>
            {/* Hero Section */}
            <section
                className="
                    relative w-full overflow-hidden
                    bg-center bg-no-repeat transition-all duration-1000 ease-in-out
                    sm:bg-cover bg-contain
                "
                style={{
                    backgroundImage: `url(${images[currentImage]})`,
                    backgroundAttachment: window.innerWidth >= 640 ? 'fixed' : 'scroll', // desktop only fixed
                    backgroundPosition: 'top center',
                     backgroundPositionY: "50px",
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: window.innerWidth >= 640 ? 'cover' : 'contain', // 👈 fix: show full image on mobile
                }}
                >
                {/* Create aspect ratio for consistent banner height */}
                <div className="aspect-[16/9] sm:aspect-[21/9] w-full"></div>

                {/* Fading overlay on scroll */}
                <div
                    className="absolute inset-0 bg-black"
                    style={{ opacity: scrollOpacity }}
                ></div>

                {/* Overlay Logo */}
                <div className="absolute bottom-2 left-4 sm:bottom-12 sm:left-16 flex items-center">
                    <div className="w-20 h-20 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-yellow-400 shadow-lg">
                    <img
                        src="/images/logo.jpg"
                        alt="SB19 Logo"
                        className="w-full h-full object-cover"
                    />
                    </div>
                </div>

                {/* Slideshow dots */}
                <div className="absolute bottom-12 left-0 w-full flex justify-center space-x-4">
                    {images.map((_, index) => (
                        <div
                            key={index}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                index === currentImage ? "bg-yellow-400" : "bg-gray-500"
                            }`}
                        ></div>
                    ))}
                </div>
            </section>

            {/* Popular Songs Section */}
            <section className="py-12 px-6 bg-black text-white">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-yellow-400">🔥 Popular Songs</h2>
                    <button 
                        onClick={() => {
                            setShowAllSongsModal(true);
                            fetchAllGroupSongs();
                        }}
                        className="text-yellow-400 hover:text-yellow-300 font-semibold text-sm border border-yellow-400 hover:border-yellow-300 px-4 py-2 rounded-full transition-all"
                    >
                        View All SB19 Songs
                    </button>
                </div>
                
                {/* Play All Button */}
                {popularTracks.length > 0 && !tracksError && !loadingTracks && (
                    <div className="mb-4">
                        <button
                            onClick={() => {
                                playAllSongsPlaylist(popularTracks, 0);
                            }}
                            className="bg-yellow-400 text-black px-6 py-2 rounded-lg hover:bg-yellow-300 transition-colors font-semibold flex items-center space-x-2"
                        >
                            <span>▶️</span>
                            <span>Play All</span>
                        </button>
                    </div>
                )}
                
                <div className="divide-y divide-gray-700">
                    {tracksError ? (
                        <div className="text-center py-8">
                            <p className="text-red-400 mb-4">{tracksError}</p>
                            <button 
                                onClick={() => window.location.reload()}
                                className="px-4 py-2 bg-yellow-400 text-black rounded hover:bg-yellow-300"
                            >
                                Retry
                            </button>
                        </div>
                    ) : loadingTracks ? (
                        <div className="text-center py-8">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
                            <p className="text-gray-400 mt-2">Loading popular tracks from Spotify...</p>
                        </div>
                    ) : popularTracks.length === 0 ? (
                        <div className="text-center py-8">
                            {isAuthenticated ? (
                                <p className="text-gray-400">No popular tracks found.</p>
                            ) : (
                                <div className="text-gray-400">
                                    <p className="mb-4">Please <a href="/login" className="text-yellow-400">login</a> to view SB19 songs.</p>
                                    <a href="/login" className="inline-block px-4 py-2 bg-yellow-400 text-black rounded">Login</a>
                                </div>
                            )}
                        </div>
                    ) : (
                        (showAllPopular ? popularTracks : popularTracks.slice(0, 5)).map((track, index) => (
                            <div
                                key={track.id}
                                className="flex items-center justify-between py-3 px-2 hover:bg-gray-800/70 rounded-lg transition" 
                            >
                                {/* Left part: # + Cover + Title */}
                                <div className="flex items-center space-x-4">
                                    <span className="text-gray-400 w-6 text-sm">{index + 1}</span>
                                    <img
                                        src={track.album.images[0]?.url}
                                        alt={track.album.name}
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
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            playTrack(track, popularTracks, "Popular SB19 Songs");
                                        }}
                                        className="text-yellow-400 hover:text-yellow-300 text-lg"
                                        title={track.preview_url ? "Play 30s preview" : "Open in Spotify"}
                                    >
                                        ▶
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                {/* Expand/collapse button - moved outside divide-y container */}
                {popularTracks.length > 5 && !tracksError && !loadingTracks && (
                    <div className="flex justify-center mt-4">
                        <button
                            onClick={() => setShowAllPopular((prev) => !prev)}
                            className="flex items-center text-yellow-400 hover:text-yellow-300 font-semibold px-4 py-2 rounded-full border border-yellow-400 hover:border-yellow-300 transition-all bg-black"
                        >
                            {showAllPopular ? (
                                <>
                                    <span className="mr-2">Show Less</span>
                                    <span className="text-xl">▲</span>
                                </>
                            ) : (
                                <>
                                    <span className="mr-2">Show More</span>
                                    <span className="text-xl">▼</span>
                                </>
                            )}
                        </button>
                    </div>
                )}
            </section>

            {/* Albums Section */}
            <section className="p-8 bg-linear-to-b from-gray-900 to-black min-h-[500px]">
                <h2 className="text-3xl font-bold text-yellow-400 mb-8 text-center">🎶 Albums</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div 
                        className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-all duration-300 cursor-pointer transform hover:scale-105"
                        onClick={() => {
                            if (!isAuthenticated) return navigate('/login');
                            openAlbumModal("Get In The Zone");
                        }}
                    >
                        <img src="/images/album1.jpg" alt="Get In The Zone" className="w-full h-40 object-cover rounded-md mb-4" />
                        <h3 className="text-yellow-400 font-bold text-lg">Get In The Zone</h3>
                        <p className="text-gray-400 text-sm">2020 • 9 tracks</p>
                    </div>

                    <div 
                        className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-all duration-300 cursor-pointer transform hover:scale-105"
                        onClick={() => {
                            if (!isAuthenticated) return navigate('/login');
                            openAlbumModal("Pagsibol");
                        }}
                    >
                        <img src="/images/album2.jpg" alt="Pagsibol" className="w-full h-40 object-cover rounded-md mb-4" />
                        <h3 className="text-yellow-400 font-bold text-lg">Pagsibol</h3>
                        <p className="text-gray-400 text-sm">2021 • 6 tracks</p>
                    </div>

                    <div 
                        className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-all duration-300 cursor-pointer transform hover:scale-105"
                        onClick={() => {
                            if (!isAuthenticated) return navigate('/login');
                            openAlbumModal("PAGTATAG!");
                        }}
                    >
                        <img src="/images/album3.jpg" alt="PAGTATAG!" className="w-full h-40 object-cover rounded-md mb-4" />
                        <h3 className="text-yellow-400 font-bold text-lg">PAGTATAG!</h3>
                        <p className="text-gray-400 text-sm">2023 • 6 tracks</p>
                    </div>

                    <div 
                        className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-all duration-300 cursor-pointer transform hover:scale-105"
                        onClick={() => {
                            if (!isAuthenticated) return navigate('/login');
                            openAlbumModal("Simula at Wakas");
                        }}
                    >
                        <img src="/images/album4.jpg" alt="Simula at Wakas" className="w-full h-40 object-cover rounded-md mb-4" />
                        <h3 className="text-yellow-400 font-bold text-lg">Simula at Wakas</h3>
                        <p className="text-gray-400 text-sm">2025 • 7 tracks</p>
                    </div>
                </div>
            </section>

            {/* Fun Section */}
            <section
                ref={funSectionRef}
                className="relative py-16 px-6 bg-linear-to-br from-black via-yellow-600 to-black text-center text-white overflow-hidden"
            >
                <h2 className="text-4xl font-extrabold mb-6 drop-shadow-lg fun-title">
                    Want Some Inspiration???
                </h2>
                <button
                    className="px-8 py-4 rounded-full bg-yellow-400 text-black font-extrabold text-xl shadow-xl hover:bg-yellow-300 transition-all duration-200 animate-bounce hover:scale-110 active:scale-95 fun-btn"
                    onClick={handleFunClick}
                >
                    Click Me! 🎶
                </button>
            </section>

            {/* Album Modal */}
            {showAlbumModal && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-gray-900 p-8 rounded-lg max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-yellow-400">{selectedAlbum}</h2>
                            <button 
                                onClick={() => setShowAlbumModal(false)}
                                className="text-gray-400 hover:text-white text-2xl"
                            >
                                ×
                            </button>
                        </div>
                        
                        {/* Album content (tracks) - show login CTA for guests */}
                        {!isAuthenticated ? (
                            <div className="text-center py-8">
                                <p className="text-gray-400 mb-4">Please <a href="/login" className="text-yellow-400">login</a> to view this album's songs.</p>
                                <a href="/login" className="inline-block px-4 py-2 bg-yellow-400 text-black rounded">Login</a>
                            </div>
                        ) : (
                            <>
                                {/* Play All and Shuffle Buttons for Album */}
                                {albumTracks.length > 0 && !loadingAlbumTracks && (
                                    <div className="flex space-x-4 mb-6">
                                        <button
                                            onClick={() => {
                                                playAlbumPlaylist(albumTracks, selectedAlbum || "", 0);
                                            }}
                                            className="bg-yellow-400 text-black px-6 py-2 rounded-lg hover:bg-yellow-300 transition-colors font-semibold flex items-center space-x-2"
                                        >
                                            <span>▶️</span>
                                            <span>Play All</span>
                                        </button>
                                        
                                        <button
                                            onClick={() => {
                                                const shuffledTracks = [...albumTracks];
                                                // Shuffle the array
                                                for (let i = shuffledTracks.length - 1; i > 0; i--) {
                                                    const j = Math.floor(Math.random() * (i + 1));
                                                    [shuffledTracks[i], shuffledTracks[j]] = [shuffledTracks[j], shuffledTracks[i]];
                                                }
                                                playAlbumPlaylist(shuffledTracks, selectedAlbum || "", 0);
                                            }}
                                            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-500 transition-colors font-semibold flex items-center space-x-2"
                                        >
                                            <span>🔀</span>
                                            <span>Shuffle</span>
                                        </button>
                                    </div>
                                )}
                                
                                {loadingAlbumTracks ? (
                                    <div className="text-center py-8">
                                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
                                        <p className="text-gray-400 mt-2">Loading tracks...</p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-gray-700">
                                        {albumTracks.length > 0 ? (
                                            albumTracks.map((track, index) => (
                                                <div
                                                    key={track.id}
                                                    className="flex items-center justify-between py-3 px-2 hover:bg-gray-800/70 rounded-lg transition" 
                                                >
                                                    {/* Left part: # + Cover + Title */}
                                                    <div className="flex items-center space-x-4">
                                                        <span className="text-gray-400 w-6 text-sm">{index + 1}</span>
                                                        <img
                                                            src={track.album?.images?.[0]?.url}
                                                            alt={track.album?.name || track.name}
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
                                                            onClick={() => playAlbumPlaylist(albumTracks, selectedAlbum || "", albumTracks.findIndex(t => t.id === track.id))}
                                                            className="text-yellow-400 hover:text-yellow-300 text-lg"
                                                            title={track.preview_url ? "Play 30s preview" : "Open in Spotify"}
                                                        >
                                                            ▶
                                                        </button>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-gray-400 text-center py-8">No tracks found for this album.</p>
                                        )}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* All Songs Modal */}
            {showAllSongsModal && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-gray-900 p-8 rounded-lg max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-yellow-400">All SB19 Songs</h2>
                            <button 
                                onClick={() => setShowAllSongsModal(false)}
                                className="text-gray-400 hover:text-white text-2xl"
                            >
                                ×
                            </button>
                        </div>
                        
                        {/* Play All and Shuffle Buttons for All Songs */}
                        {allGroupSongs.length > 0 && !loadingAllSongs && (
                            <div className="flex space-x-4 mb-6">
                                <button
                                    onClick={() => {
                                        playAllSongsPlaylist(allGroupSongs, 0);
                                    }}
                                    className="bg-yellow-400 text-black px-6 py-2 rounded-lg hover:bg-yellow-300 transition-colors font-semibold flex items-center space-x-2"
                                >
                                    <span>▶️</span>
                                    <span>Play All</span>
                                </button>
                                
                                <button
                                    onClick={() => {
                                        const shuffledSongs = [...allGroupSongs];
                                        // Shuffle the array
                                        for (let i = shuffledSongs.length - 1; i > 0; i--) {
                                            const j = Math.floor(Math.random() * (i + 1));
                                            [shuffledSongs[i], shuffledSongs[j]] = [shuffledSongs[j], shuffledSongs[i]];
                                        }
                                        playAllSongsPlaylist(shuffledSongs, 0);
                                    }}
                                    className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-500 transition-colors font-semibold flex items-center space-x-2"
                                >
                                    <span>🔀</span>
                                    <span>Shuffle</span>
                                </button>
                            </div>
                        )}
                        
                        {loadingAllSongs ? (
                            <div className="text-center py-8">
                                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
                                <p className="text-gray-400 mt-2">Loading all songs...</p>
                            </div>
                        ) : (
                            <div className="overflow-y-auto max-h-[60vh] divide-y divide-gray-700">
                                {allGroupSongs.map((track, index) => (
                                    <div
                                        key={track.id}
                                        className="flex items-center justify-between py-3 px-2 hover:bg-gray-800/70 rounded-lg transition" 
                                    >
                                        {/* Left part: # + Cover + Title */}
                                        <div className="flex items-center space-x-4">
                                            <span className="text-gray-400 w-6 text-sm">{index + 1}</span>
                                            <img
                                                src={track.album.images[0]?.url}
                                                alt={track.album.name}
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
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    playAllSongsPlaylist(allGroupSongs, allGroupSongs.findIndex(t => t.id === track.id));
                                                }}
                                                className="text-yellow-400 hover:text-yellow-300 text-lg"
                                                title={track.preview_url ? "Play 30s preview" : "Open in Spotify"}
                                            >
                                                ▶
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                {allGroupSongs.length === 0 && !loadingAllSongs && (
                                    <div className="text-center py-8">
                                        <p className="text-gray-400">No songs found.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}