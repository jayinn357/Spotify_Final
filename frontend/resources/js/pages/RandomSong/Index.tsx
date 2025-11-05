import { useEffect, useState, useRef, useCallback } from "react";
import { useMusic } from "@/contexts/MusicContext";

interface Track {
    id: string;
    name: string;
    duration_ms: number;
    preview_url?: string | null;
    album: {
        name: string;
        images: Array<{ url: string; height: number; width: number }>;
    };
    artists: Array<{ name: string }>;
    external_urls: {
        spotify: string;
    };
    localAudioUrl?: string | null;
}

const songQuotes: Record<string, string> = {};

function getAvailableSongs(tracks: Track[], chosen: string[]) {
    return tracks.filter((song) => !chosen.includes(song.id));
}

function getRandomItem<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

// Daily tracking utilities
function getTodayDateString(): string {
    return new Date().toDateString(); // e.g., "Mon Oct 07 2025"
}

function hasChosenTodayFromStorage(): boolean {
    const lastChosenDate = localStorage.getItem("sb19_last_chosen_date");
    return lastChosenDate === getTodayDateString();
}

function markChosenToday(): void {
    localStorage.setItem("sb19_last_chosen_date", getTodayDateString());
}

export default function RandomSong() {
    const { playTrack, playMemberPlaylist, playAlbumPlaylist } = useMusic();
    const localAudioRef = useRef<HTMLAudioElement | null>(null);
    const [isLocalPlaying, setIsLocalPlaying] = useState(false);
    
    // State for track messages from database
    const [trackMessages, setTrackMessages] = useState<Record<string, string>>({});
    const [allTracks, setAllTracks] = useState<Track[]>([]);
    const [randomSong, setRandomSong] = useState<Track | null>(null);
    const [spinning, setSpinning] = useState(false);
    const [chosenSongs, setChosenSongs] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [showGoodbyeModal, setShowGoodbyeModal] = useState(false);
    const [showDailyLimitModal, setShowDailyLimitModal] = useState(false);
    const [hasChosenToday, setHasChosenToday] = useState(false);
    // debug panel removed in production
    // const [debugOpen, ] = useState<boolean>(false);
    // Remove unused debugTracks state since it's only used for logging
    console.log('Debug tracks feature available for development');

    // Fetch tracks from your API like Home and Members pages do
    useEffect(() => {
        const fetchAllTracks = async () => {
            setLoading(true);
            try {
                // Fetch track messages from database
                try {
                    const messagesResponse = await fetch('/api/crud/track-messages');
                    if (messagesResponse.ok) {
                        const messagesData = await messagesResponse.json();
                        const messagesMap: Record<string, string> = {};
                        messagesData.messages?.forEach((msg: { Track: { title: string }, message: string }) => {
                            if (msg.Track?.title) {
                                messagesMap[msg.Track.title] = msg.message;
                            }
                        });
                        setTrackMessages(messagesMap);
                    }
                } catch (error) {
                    console.error('Error fetching track messages:', error);
                }

                const allTracksData: Track[] = [];

                // 1. Fetch SB19 popular tracks from your database (like Home page)
                try {
                    const popularResponse = await fetch(`/api/tracks/sb19/popular`);
                    if (popularResponse.ok) {
                        const popularData = await popularResponse.json();
                        if (popularData.tracks && popularData.tracks.length > 0) {
                            allTracksData.push(...popularData.tracks.map((track: unknown) => {
                                const t = track as { local_audio_url?: string; preview_url?: string };
                                return {
                                    ...t,
                                    // Keep a localAudioUrl for UI and also set preview_url so MusicPlayer will use it
                                    localAudioUrl: t.local_audio_url ?? t.preview_url ?? null,
                                    preview_url: t.local_audio_url ?? t.preview_url ?? null
                                };
                            }));
                        }
                    }
                } catch (error) {
                    console.error('Error fetching popular tracks:', error);
                }

                // 2. Fetch SB19 top tracks from Spotify API (like Members page)
                const SB19_ARTIST_ID = "3g7vYcdDXnqnDKYFwqXBJP";
                try {
                    const sb19Response = await fetch(`/api/spotify/artists/${SB19_ARTIST_ID}/top-tracks?market=PH`);
                    if (sb19Response.ok) {
                        const sb19Data = await sb19Response.json();
                        if (sb19Data.tracks && sb19Data.tracks.length > 0) {
                            allTracksData.push(...sb19Data.tracks.map((track: unknown) => {
                                const t = track as { id?: string; local_audio_url?: string; preview_url?: string };
                                const local = t.local_audio_url ?? t.preview_url ?? null;
                                if (local) console.debug('RandomSong: mapping track', t.id, 'preview_url =>', local);
                                return {
                                    ...t,
                                    localAudioUrl: local,
                                    preview_url: local
                                };
                            }));
                        }
                    }
                } catch (error) {
                    console.error('Error fetching SB19 tracks:', error);
                }

                // 3. Fetch member tracks (like Members page)
                const memberArtistIds = [
                    "7wY8cwtF13xDJIHO7htMNk", // PABLO
                    "3xn2W0ziGURPYJj372a6jQ", // JOSH CULLEN
                    "4bpUKZGsImgabgDABbThr0", // STELL
                    "2tEFDBihLXytoPl4xdResl", // FELIP
                    "20XuMlpFudMP9rDHMTkyar" // JUSTIN
                ];

                // Fetch member tracks from DB endpoint so we get stored local_audio_url (same as Members page)
                for (const memberId of memberArtistIds) {
                    try {
                        const response = await fetch(`/api/tracks/member/${memberId}`);
                        if (response.ok) {
                            const memberData = await response.json();
                            if (memberData.tracks && memberData.tracks.length > 0) {
                                allTracksData.push(...memberData.tracks.map((track: unknown) => {
                                    const t = track as { local_audio_url?: string; preview_url?: string };
                                    return {
                                        ...t,
                                        // DB endpoint maps preview_url => local_audio_url, keep both fields
                                        localAudioUrl: t.preview_url ?? t.local_audio_url ?? null,
                                        preview_url: t.preview_url ?? t.local_audio_url ?? null
                                    };
                                }));
                            }
                        }
                    } catch {
                        console.error(`Error fetching DB member tracks for ${memberId}`);
                    }
                }

                // Remove duplicates based on track ID
                const uniqueTracks = Array.from(
                    new Map(allTracksData.map(track => [track.id, track])).values()
                );

                // Production: don't expose debug info
                console.log('Debug: Setting tracks data');

                setAllTracks(uniqueTracks);

                // Background probes removed — server now reports has_local_audio reliably
            } catch (error) {
                console.error('Error fetching tracks:', error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchAllTracks();
    }, []);

    // Load chosen songs from localStorage and check daily limit
    useEffect(() => {
        // Check if user has already chosen today
        setHasChosenToday(hasChosenTodayFromStorage());
        
        const data = localStorage.getItem("sb19_random_songs");
        if (data) {
            try {
                const parsed = JSON.parse(data);
                const now = Date.now();
                const filtered = parsed.filter(
                    (entry: { id: string; time: number }) => now - entry.time < 7 * 24 * 60 * 60 * 1000
                );
                setChosenSongs(filtered.map((entry: { id: string }) => entry.id));
            } catch (error) {
                console.error('Error parsing chosen songs:', error);
                localStorage.removeItem("sb19_random_songs");
            }
        }
    }, []);

    // Save chosen song to localStorage
    const saveChosenSong = useCallback((songId: string) => {
        const now = Date.now();
        const data = localStorage.getItem("sb19_random_songs");
        let arr = [];
        
        if (data) {
            try {
                arr = JSON.parse(data);
            } catch {
                arr = [];
            }
        }
        
        arr.push({ id: songId, time: now });
        localStorage.setItem("sb19_random_songs", JSON.stringify(arr));
        setChosenSongs(prev => [...prev, songId]);
        
        // Mark today as chosen
        markChosenToday();
        setHasChosenToday(true);
    }, []);

    // Spin and select random song — prioritize tracks with local audio that match spotify ID
    const handleSpin = () => {
        if (spinning || allTracks.length === 0) return;

        // Check if user has already chosen today
        if (hasChosenToday) {
            setShowDailyLimitModal(true);
            return;
        }

        // Start quick spin visually but pick and play immediately
        setSpinning(true);

        const available = getAvailableSongs(allTracks, chosenSongs);

        const hasLocal = (t: any) => Boolean(t.localAudioUrl || t.local_audio_url || t.local_audio || t.preview_url || t.previewUrl);

        const localUrlString = (t: any) => String(t.localAudioUrl || t.local_audio_url || t.local_audio || t.preview_url || t.previewUrl || '');

        // Use spotify_track_id specifically to match local audio filenames/URLs
        const spotifyTrackIdOf = (t: any) => String(t.spotify_track_id || t.spotifyTrackId || '');

        // Exact local matches: local file exists AND local_audio_url or localAudioUrl contains the spotify_track_id
        const exactLocalMatches = available.filter((t: any) => {
            if (!hasLocal(t)) return false;
            const localStr = localUrlString(t).toLowerCase();
            const spotifyTrackId = spotifyTrackIdOf(t).toLowerCase();
            if (!spotifyTrackId) return false;
            return localStr.includes(spotifyTrackId);
        });

        // Any local audio available
        const availableWithAudio = available.filter((t: any) => hasLocal(t));

        // Tracks with preview_url (fallback)
        const availableWithPreview = available.filter((t: any) => Boolean(t.preview_url));

        const pickAndSave = (song: any) => {
            setRandomSong(song);
            try { saveChosenSong(song.id); } catch {}
            // Stop spinning so playback effect can run immediately
            setSpinning(false);
        };

        // Selection priority: exact local matches -> any local audio -> preview -> fallback
        if (exactLocalMatches.length > 0) {
            pickAndSave(getRandomItem(exactLocalMatches));
            return;
        }

        if (availableWithAudio.length > 0) {
            pickAndSave(getRandomItem(availableWithAudio));
            return;
        }

        if (availableWithPreview.length > 0) {
            pickAndSave(getRandomItem(availableWithPreview));
            return;
        }

        if (available.length > 0) {
            pickAndSave(getRandomItem(available));
            return;
        }

        // Nothing available (all chosen) - reset chosen list and try global pool
        setChosenSongs([]);
        const allExact = allTracks.filter((t: any) => {
            if (!hasLocal(t)) return false;
            return localUrlString(t).includes(spotifyTrackIdOf(t));
        });
        if (allExact.length > 0) {
            pickAndSave(getRandomItem(allExact));
            return;
        }

        const anyWithAudio = allTracks.filter((t: any) => hasLocal(t));
        if (anyWithAudio.length > 0) {
            pickAndSave(getRandomItem(anyWithAudio));
            return;
        }

        // Final fallback
        pickAndSave(getRandomItem(allTracks));
    };

    // When randomSong is set (and not spinning), auto-play using a local Audio element
    useEffect(() => {
        // stop any existing local playback
        const stopLocal = () => {
            if (localAudioRef.current) {
                try { localAudioRef.current.pause(); } catch {
                    // Ignore pause errors
                }
                localAudioRef.current.src = '';
                localAudioRef.current = null;
            }
            setIsLocalPlaying(false);
        };

        if (!randomSong) {
            stopLocal();
            return;
        }

        // Don't auto-play while spinning
        if (spinning) return;

        // Use preview_url (which we map to local path when available)
        const src = randomSong.preview_url ?? randomSong.localAudioUrl ?? null;
        if (!src) {
            // nothing to play
            stopLocal();
            return;
        }

        // Create audio element and play without opening global MusicPlayer
        stopLocal();
        const audio = new Audio();
        localAudioRef.current = audio;
        audio.src = src;
        audio.preload = 'auto';

        const onCanPlay = () => {
            audio.play().then(() => {
                setIsLocalPlaying(true);
            }).catch(() => {
                setIsLocalPlaying(false);
            });
        };

        const onEnded = () => {
            // Loop the song - restart from beginning
            if (localAudioRef.current) {
                localAudioRef.current.currentTime = 0;
                localAudioRef.current.play().then(() => {
                    setIsLocalPlaying(true);
                }).catch(() => {
                    setIsLocalPlaying(false);
                });
            }
        };

        audio.addEventListener('canplaythrough', onCanPlay, { once: true });
        audio.addEventListener('ended', onEnded);
        audio.load();

        return () => {
            try { 
                audio.pause(); 
            } catch {
                // Ignore pause errors
            }
            audio.removeEventListener('canplaythrough', onCanPlay);
            audio.removeEventListener('ended', onEnded);
            if (localAudioRef.current === audio) {
                localAudioRef.current = null;
            }
            setIsLocalPlaying(false);
        };
    }, [randomSong, spinning]);

// Get song quote - from database only
const getSongQuote = (song: Track) => {
    return trackMessages[song.name] || "Music is the language of the soul";
};    // Get song image (return null when not available to avoid empty src)
    const getSongImage = (song: Track): string | null => {
        if (song.album?.images && song.album.images.length > 0 && song.album.images[0].url) {
            return song.album.images[0].url;
        }
        return null;
    };

    // Stop music and reset to wheel (goodbye)
    const handleStopMusic = () => {
        if (localAudioRef.current) {
            localAudioRef.current.pause();
            localAudioRef.current.currentTime = 0;
        }
        setIsLocalPlaying(false);
        setShowGoodbyeModal(false);
        setRandomSong(null); // Reset to wheel view
    };

    return (
        <>
            <div className="min-h-screen bg-linear-to-b from-black via-gray-900 to-purple-900 flex flex-col items-center justify-center py-12 px-4">
                <h1 className="text-4xl font-extrabold text-yellow-400 mb-2 text-center">🎡 A'tInspired</h1>
                <p className="text-lg text-purple-200 mb-8 text-center">Your Inspiration of the Day!</p>
                
                {loading ? (
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400 mb-4"></div>
                        <p className="text-yellow-400">Loading songs...</p>
                    </div>
                ) : (
                    <>
                        <div className="flex flex-col items-center mb-8">
                            <button
                                className={`rounded-full border-8 border-yellow-400 shadow-lg transition-transform duration-700 ${
                                    spinning ? "animate-spin-slow" : "hover:scale-105"
                                }`}
                                style={{ width: 180, height: 180, background: "#222" }}
                                onClick={handleSpin}
                                disabled={spinning}
                                title="Spin the wheel!"
                            >
                                <img
                                    src="/images/logo.jpg"
                                    alt="SB19 Logo Wheel"
                                    className="w-full h-full object-cover rounded-full"
                                    style={{ opacity: spinning ? 0.7 : 1 }}
                                />
                            </button>
                            <span className="mt-4 text-yellow-400 font-semibold text-center">
                                {spinning ? "Spinning..." : "Click the SB19 logo to get inspired!"}
                            </span>
                            <p className="text-sm text-purple-300 mt-2">
                                Available songs: {getAvailableSongs(allTracks, chosenSongs).length} of {allTracks.length}
                            </p>
                        </div>

                        {randomSong && (
                            <div className="mt-10 flex flex-col items-center max-w-2xl">
                                <div className="relative w-56 h-56 mb-6 flex items-center justify-center">
                                    {getSongImage(randomSong) ? (
                                        <img
                                            src={getSongImage(randomSong) as string}
                                            alt={randomSong.name}
                                            className={`w-full h-full object-cover rounded-2xl shadow-2xl ${isLocalPlaying ? 'animate-heartbeat' : ''}`}
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-800 rounded-2xl flex items-center justify-center text-gray-400">
                                            <span>No image</span>
                                        </div>
                                    )}
                                    
                                    {isLocalPlaying && (
                                        <div className="absolute inset-0 rounded-2xl pointer-events-none heartbeat-border-anim z-20"></div>
                                    )}
                                </div>
                                
                                <h2 className="text-3xl font-bold text-yellow-400 mb-2 text-center">{randomSong.name}</h2>
                                <p className="text-lg text-gray-300 mb-4 text-center">by {randomSong.artists[0]?.name}</p>
                                
                                <blockquote className="text-lg text-purple-200 mb-6 italic max-w-xl text-center border-l-4 border-yellow-400 pl-4">
                                    "{getSongQuote(randomSong)}"
                                </blockquote>
                                
                                {randomSong && randomSong.localAudioUrl && isLocalPlaying ? (
                                    <button
                                        className="px-8 py-3 rounded-full bg-red-600 text-white font-bold text-xl shadow-xl hover:scale-105 transition"
                                        onClick={() => setShowGoodbyeModal(true)}
                                    >
                                        ⏹ Stop Music
                                    </button>
                                ) : randomSong && randomSong.localAudioUrl ? (
                                    <p className="text-yellow-400 italic">Auto-playing...</p>
                                ) : (
                                    <p className="text-gray-400 italic">No audio available</p>
                                )}
                            </div>
                        )}
                    </>
                )}

                {/* Goodbye Modal */}
                {showGoodbyeModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                        <div className="bg-linear-to-br from-purple-900 via-gray-900 to-black p-8 rounded-2xl max-w-md w-full mx-4 text-center border-2 border-yellow-400">
                            <div className="mb-6">
                                <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden border-4 border-yellow-400">
                                    <img
                                        src="/images/sb19-goodbye-gif.gif"
                                        alt="SB19"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <h2 className="text-2xl font-bold text-yellow-400 mb-4">💛 Thank You!</h2>
                                <p className="text-lg text-purple-200 leading-relaxed">
                                    SB19 hopes that you are inspired today. See you tomorrow...
                                </p>
                            </div>
                            
                            <div className="flex space-x-4 justify-center">
                                <button
                                    onClick={handleStopMusic}
                                    className="px-6 py-3 rounded-full bg-yellow-400 text-black font-bold hover:bg-yellow-300 transition-all transform hover:scale-105"
                                >
                                    ✨ Goodbye
                                </button>
                                <button
                                    onClick={() => setShowGoodbyeModal(false)}
                                    className="px-6 py-3 rounded-full bg-gray-600 text-white font-bold hover:bg-gray-500 transition-all transform hover:scale-105"
                                >
                                    Keep Listening
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Daily Limit Modal */}
                {showDailyLimitModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                        <div className="bg-linear-to-br from-red-900 via-gray-900 to-black p-8 rounded-2xl max-w-md w-full mx-4 text-center border-2 border-red-400">
                            <div className="mb-6">
                                <div className="w-24 h-24 mx-auto mb-4">
                                    <img
                                        src="/images/sb19-no.gif"
                                        alt="SB19 No"
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                                <h2 className="text-2xl font-bold text-red-400 mb-4">🚫 Already Inspired Today!</h2>
                                <p className="text-lg text-red-200 leading-relaxed">
                                    Inspiration Day will reset tomorrow. Thank you!
                                </p>
                            </div>
                            
                            <button
                                onClick={() => setShowDailyLimitModal(false)}
                                className="px-8 py-3 rounded-full bg-red-400 text-black font-bold hover:bg-red-300 transition-all transform hover:scale-105"
                            >
                                ⏰ See You Tomorrow
                            </button>
                        </div>
                    </div>
                )}

                <style>{`
                    @keyframes spin-slow {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                    .animate-spin-slow {
                        animation: spin-slow 1.5s linear;
                    }
                    @keyframes heartbeat {
                        0%, 100% { transform: scale(1); }
                        50% { transform: scale(1.05); }
                    }
                    .heartbeat-border {
                        animation: heartbeat 1s ease-in-out infinite;
                    }
                    .heartbeat-border-anim {
                        border: 3px solid rgba(255, 215, 0, 0.8);
                        border-radius: 1rem;
                        animation: heartbeat 1s ease-in-out infinite;
                    }
                    .animate-heartbeat {
                        animation: heartbeat 1s ease-in-out infinite;
                    }
                `}</style>
            </div>
        </>
    );
}