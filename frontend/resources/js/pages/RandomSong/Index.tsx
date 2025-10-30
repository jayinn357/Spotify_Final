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

const songQuotes: Record<string, string> = {
    "GENTO": "Be solid. Be gold. Stay rare. - GENTO",
    "MAPA": "Tell your parents 'thank you' while you still can - MAPA",
    "What?": "Question everything and break boundaries - What?",
    "Go Up": "Keep climbing, never look down - Go Up",
    "Bazinga": "Let your success be the loudest clapback - Bazinga",
    "SLMT": "Gratitude turns ordinary days into blessings - SLMT",
    "Mana": "Honor your roots, they are your power - Mana",
    "Moonlight": "Be gentle; even the moon shines by reflection - Moonlight",
    "WYAT": "Your dreams are worth fighting for - WYAT",
    "CRIMZONE": "Don't just play safe, make your own rules - CRIMZONE",
    "FREEDOM": "You owe no one an apology for being yourself - FREEDOM",
    "LIHAM": "Every word has power - LIHAM",
    "DUNGKA!": "Stand tall and be proud - DUNGKA!",
    "I WANT YOU": "Love transcends all boundaries - I WANT YOU",
    "Tilaluha": "Let your tears remind you that you are still capable of love - Tilaluha",
    "Hanggang sa Huli": "Some goodbyes make us stronger, not smaller - Hanggang sa Huli",
    "Alab (Burning)": "Keep your fire burning, even when the world tries to extinguish it - Alab (Burning)",
    "Wag Mong Ikunot Ang Iyong Noo": "Smile a little more, you deserve lightness too - Wag Mong Ikunot Ang Iyong Noo",
    "Love Goes": "Real love doesn't end; it just changes its form - Love Goes",
    "Ikako": "We heal together, you are not alone - Ikako",
    "ILAW": "Even the smallest light can guide someone home - ILAW",
    "DAM": "Let your emotions flow; strength comes from release - DAM",
    "Shooting for the Stars": "Dream bigger than your doubts - Shooting for the Stars",
    "Time": "Cherish the moments, it never comes back - Time",
    "Dungka": "Let your weirdness be your wonder - Dungka",
    "8TonBall": "Take risks; even failure teaches rhythm - 8TonBall",
    "Quit": "Rest if you must, but don't quit your purpose - Quit",
    "Ready": "The best time is now - Ready",
    "Win Your Heart": "Win hearts by being kind, not perfect - Win Your Heart",
    "The One": "Love will find you when you learn to love yourself - The One",
    "Sino Ka Ba - From “The Iron Heart Season 2”": "Know yourself before seeking to be known - Sino Ka Ba - From “The Iron Heart Season 2”",
    "Umaaligid": "Love quietly but sincerely - Umaaligid",
    "MAPA (Indonesian Ver.)": "Keep your loved ones close, no matter the distance - MAPA (Indonesian Ver.)",
    "Kalakal": "Never trade integrity for convenience - Kalakal",
    "MAPA - From THE FIRST TAKE": "Simplicity can move hearts - MAPA - From THE FIRST TAKE",
    "GENTO - From THE FIRST TAKE": "Authenticity outshines perfection - GENTO - From THE FIRST TAKE",
    "No Stopping You": "Keep moving forward—the world moves with those who dare - No Stopping You",
    "Kabataang Pinoy": "Take pride in your roots and Be the voice of change; you are the heartbeat of tomorrow - Kabataang Pinoy",
    "foes": "Turn enemies into lessons, not burdens - foes",
    "envy": "Your path is yours alone; envy has no place - envy",
    "greed": "Abundance comes from contentment, not more - greed",
    "pride": "Stand tall, but stay humble - pride",
    "gluttony (feat. PLAYERTWO)": "Indulge in life's joys, but know you're enough - gluttony (feat. PLAYERTWO)",
    "lust (feat. Cyra Gwynth)": "Desire can create or destroy—choose wisely - lust (feat. Cyra Gwynth)",
    "sloth": "Rest, but don't forget to move forward - sloth",
    "ache": "Pain shapes strength; let it mold you - ache",
    "ROCKSTA": "Own your stage—confidence is your spotlight - ROCKSTA",
    "SUPERIORITY": "True power is quiet, not boastful - SUPERIORITY",
    "MICTEST": "Speak truth even when it shakes the room - MICTEST",
    "DRINKSMOKE": "Don't lose yourself in the haze—stay clear - DRINKSMOKE",
    "CRIMINAL": "Be rebellious for the right cause - CRIMINAL",
    "STRAYDOGS": "Belong to no one but your purpose - STRAYDOGS",
    "Kanako": "Cherish what's real, even if it fades - Kanako",
    "Moving Closer": "Step closer to love without fear - Moving Closer",
    "Fake Faces": "Be genuine in a world of masks - Fake Faces",
    "Palayo": "Distance can bring peace and clarity - Palayo",
    "Bulan": "Shine in your own phase and timing - Bulan",
    "Pagdali": "Don't rush what's meant to unfold naturally - Pagdali",
    "FLYYY": "Soar beyond what limits you - FLYYY",
    "KAWASAKI (with Felip & thủy)": "Ride life with courage and thrill - KAWASAKI (with Felip & thủy)",
    "1999": "Nostalgia reminds us of who we once were - 1999",
    "1999 (Clean Ver.)": "Look back, but don't stay there; you've grown since then - 1999 (Clean Ver.)",
    "See Me": "Be visible by being authentic - See Me",
    "Silent Cries": "Even silence speaks when it's honest - Silent Cries",
    "Honest": "Truth heals faster than lies ever could - Honest",
    "No Control (feat. (e)motion engine)": "Let go and trust your instincts - No Control (feat. (e)motion engine)",
    "Lights Out (feat. Mo Mitchell)": "Even in darkness, you can shine within - Lights Out (feat. Mo Mitchell)",
    "Sumaya": "Sometimes happiness begins where holding on ends - Sumaya",
    "Yoko Na": "Walking away can also mean growing stronger - Yoko Na",
    "Re: Thinkin' About You": "Memories keep love alive in quiet ways - Re: Thinkin' About You",
    "GET RIGHT": "Don't rush the process—get it right - GET RIGHT",
    "Pakiusap Lang": "Speak softly; even pleas carry power - Pakiusap Lang",
    "WILD TONIGHT": "Live boldly; nights like this don't last - WILD TONIGHT",
    "Sofa (Remix)": "Comfort can be love in its simplest form - Sofa (Remix)",
    "Neumun": "Start fresh; new moons mean new beginnings - Neumun",
    "Don't Care": "Live freely; not everyone's opinion matters - Don't Care",
    "Butata": "Fight for what's right, even when it's tough - Butata",
    "Puyat": "Hard work pays off—dreams need dedication - Puyat",
    "Blessed": "Gratitude turns ordinary days into miracles - Blessed",
    "Tambol (Ibang Planeta)": "March to your own rhythm - Tambol (Ibang Planeta)",
    "Micha!": "Hold close those who understand your silence - Micha!",
    "La Luna": "Embrace your phases; even the moon changes - La Luna",
    "Presyon": "Stay calm under pressure; strength is quiet - Presyon",
    "Wala": "Let go of emptiness to make room for peace - Wala",
    "The Boy Who Cried Wolf": "Honesty keeps your voice heard - The Boy Who Cried Wolf",
    "Kumunoy": "Even when sinking, look for light above - Kumunoy",
    "Kelan": "Patience brings timing into perfection - Kelan",
    "Drowning in the Water": "Don't drown in thoughts—breathe through the chaos - Drowning in the Water",
    "Breathe (Outro)": "Take a breath; healing starts there - Breathe (Outro)",
    "Liwanag sa Dilim - from “Incognito”": "Be someone's light in their darkest hour - Liwanag sa Dilim - from “Incognito”",
    "edsa": "Stand for change; it begins with courage - edsa",
    "AKALA": "Not everything you lose is a loss - AKALA",
    "DETERMINADO": "Stay determined; persistence builds destiny - DETERMINADO",
    "sunday morning": "Find peace in slow beginnings - sunday morning",
    "surreal": "Dreams become real when you believe - surreal",
    "kaibigan": "True friends are treasures that time polishes - kaibigan",
    "Sampung mga Daliri": "Harmony grows when we work hand in hand - Sampung mga Daliri",
    "Room": "Make space for growth inside your own room - Room",
    "Anino": "Even shadows prove the presence of light - Anino",
    "'Di Ko Masabi": "Say what your heart hides before it's too late - 'Di Ko Masabi",
    "Classic": "Timelessness is built from sincerity - Classic",
    "Kapangyarihan - feat. SB19": "Use your power to uplift, not to dominate - Kapangyarihan - feat. SB19",
    "default": "Music is the language of the soul"
};

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

    // Spin and select random song (prefer tracks with local audio)
    const handleSpin = () => {
        if (spinning || allTracks.length === 0) return;
        
        // Check if user has already chosen today
        if (hasChosenToday) {
            setShowDailyLimitModal(true);
            return;
        }

        setSpinning(true);

        setTimeout(() => {
            const available = getAvailableSongs(allTracks, chosenSongs);

            // Prefer tracks that actually have a local audio file available
            const availableWithAudio = available.filter(t => !!t.localAudioUrl);

            // If there are available tracks with local audio, pick from them.
            // Otherwise, fall back to previous behavior (pick from available or allTracks).
            if (availableWithAudio.length > 0) {
                const song = getRandomItem(availableWithAudio);
                setRandomSong(song);
                saveChosenSong(song.id);
            } else if (available.length > 0) {
                // No local-audio tracks among available; select from available (may be preview-only)
                const song = getRandomItem(available);
                setRandomSong(song);
                saveChosenSong(song.id);
            } else {
                // Nothing available (all have been chosen) - reset chosen list and try to pick a local-audio track first
                setChosenSongs([]);

                const allWithAudio = allTracks.filter(t => !!t.localAudioUrl);
                if (allWithAudio.length > 0) {
                    const song = getRandomItem(allWithAudio);
                    setRandomSong(song);
                    saveChosenSong(song.id);
                } else {
                    // No local-audio tracks at all in the pool; pick any track
                    const song = getRandomItem(allTracks);
                    setRandomSong(song);
                    saveChosenSong(song.id);
                }
            }

            setSpinning(false);
        }, 1500);
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

    // Simple play handler using useMusic context like Home and Members pages
    const handlePlay = () => {
        if (!randomSong) {
            console.log('No song selected');
            return;
        }

        // Determine if this is a member track by checking primary artist name
        const primaryArtist = randomSong.artists && randomSong.artists.length > 0 ? randomSong.artists[0].name.toLowerCase() : '';
        const isMember = ['pablo', 'josh', 'stell', 'felip', 'justin'].some(m => primaryArtist.includes(m));

        // If a local audio is playing via this component, show goodbye modal
        if (localAudioRef.current && isLocalPlaying) {
            setShowGoodbyeModal(true);
            return;
        }
        
        // If paused, resume playing
        if (localAudioRef.current && !isLocalPlaying) {
            localAudioRef.current.play().then(() => setIsLocalPlaying(true)).catch(() => setIsLocalPlaying(false));
            return;
        }

        // Otherwise, fall back to opening the global player (legacy behavior)
        if (isMember) {
            if (typeof playMemberPlaylist === 'function') {
                playMemberPlaylist([randomSong], randomSong.artists[0]?.name || 'Member', 0);
            } else {
                playTrack(randomSong, [randomSong], `${randomSong.artists[0]?.name}'s Song`);
            }
        } else {
            if (typeof playAlbumPlaylist === 'function') {
                playAlbumPlaylist([randomSong], 'Random SB19 Song', 0);
            } else {
                playTrack(randomSong, [randomSong], 'Random SB19 Song');
            }
        }
    };

    // Get song quote - first check database, then fallback to hardcoded
    const getSongQuote = (song: Track) => {
        // Try database first
        if (trackMessages[song.name]) {
            return trackMessages[song.name];
        }
        // Fallback to hardcoded quotes
        return songQuotes[song.name] || songQuotes["default"];
    };

    // Get song image (return null when not available to avoid empty src)
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
            <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-purple-900 flex flex-col items-center justify-center py-12 px-4">
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
                                
                                {randomSong.localAudioUrl ? (
                                    <button
                                        className="px-8 py-3 rounded-full bg-gradient-to-r from-purple-600 via-yellow-400 to-purple-600 text-black font-bold text-xl shadow-xl hover:scale-105 transition"
                                        onClick={handlePlay}
                                    >
                                            {isLocalPlaying ? 'Playing...' : '▶ Play Song'}
                                    </button>
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
                        <div className="bg-gradient-to-br from-purple-900 via-gray-900 to-black p-8 rounded-2xl max-w-md w-full mx-4 text-center border-2 border-yellow-400">
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
                        <div className="bg-gradient-to-br from-red-900 via-gray-900 to-black p-8 rounded-2xl max-w-md w-full mx-4 text-center border-2 border-red-400">
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