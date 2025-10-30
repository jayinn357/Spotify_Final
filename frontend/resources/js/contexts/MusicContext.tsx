import { createContext, useContext, useState, ReactNode } from "react";

interface Track {
  id: string;
  name: string;
  duration_ms: number;
  preview_url?: string | null;
  popularity?: number;
  album: {
    name: string;
    images: Array<{ url: string; height?: number; width?: number }>;
  };
  artists: Array<{ name: string }>;
  external_urls?: {
    spotify: string;
  };
}

interface PlaylistContext {
  // Current playlist state
  currentTrack: Track | null;
  currentPlaylist: Track[];
  currentIndex: number;
  playlistTitle: string;
  
  // Player state
  isPlayerOpen: boolean;
  
  // Actions
  playTrack: (track: Track, playlist: Track[], playlistTitle?: string) => void;
  playTrackAtIndex: (index: number) => void;
  setCurrentIndex: (index: number) => void;
  openPlayer: () => void;
  closePlayer: () => void;
  
  // Playlist types for context-aware behavior
  playAlbumPlaylist: (tracks: Track[], albumName: string, startIndex?: number) => void;
  playMemberPlaylist: (tracks: Track[], memberName: string, startIndex?: number) => void;
  playAllSongsPlaylist: (tracks: Track[], startIndex?: number) => void;
}

const MusicContext = createContext<PlaylistContext | undefined>(undefined);

interface MusicProviderProps {
  children: ReactNode;
}

export function MusicProvider({ children }: MusicProviderProps) {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [currentPlaylist, setCurrentPlaylist] = useState<Track[]>([]);
  const [currentIndex, setCurrentIndexState] = useState(0);
  const [playlistTitle, setPlaylistTitle] = useState("");
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);

  const playTrack = (track: Track, playlist: Track[], title: string = "Playlist") => {
    // Build a playback playlist that prioritizes local audio files
  const hasLocal = (t: any) => !!(t.local_audio_url || t.localAudioUrl);
  const tracksWithLocal = playlist.filter(t => hasLocal(t));
  const playbackList = tracksWithLocal.length > 0 ? tracksWithLocal : playlist;

    // Find the requested track in the playback list; if missing, default to first
    const trackIndex = playbackList.findIndex(t => t.id === track.id);
    const indexToUse = trackIndex !== -1 ? trackIndex : 0;

    setCurrentTrack(playbackList[indexToUse] || null);
    setCurrentPlaylist(playbackList);
    setCurrentIndexState(indexToUse);
    setPlaylistTitle(title);
    setIsPlayerOpen(true);
  };

  const playTrackAtIndex = (index: number) => {
    if (index >= 0 && index < currentPlaylist.length) {
      setCurrentTrack(currentPlaylist[index]);
      setCurrentIndexState(index);
    }
  };

  const setCurrentIndex = (index: number) => {
    if (index >= 0 && index < currentPlaylist.length) {
      setCurrentIndexState(index);
      setCurrentTrack(currentPlaylist[index]);
    }
  };

  const openPlayer = () => setIsPlayerOpen(true);
  const closePlayer = () => setIsPlayerOpen(false);

  // Context-aware playlist methods
  const playAlbumPlaylist = (tracks: Track[], albumName: string, startIndex: number = 0) => {
    // Prefer tracks that have local audio files; fall back to full list if none
  const hasLocal = (t: any) => !!(t.local_audio_url || t.localAudioUrl);
  const localFirst = tracks.filter(t => hasLocal(t));
    const playback = localFirst.length > 0 ? localFirst : tracks;

    // Try to start from the same track id if possible (helps when original index maps differently after filtering)
    const intendedTrackId = tracks[startIndex]?.id;
    let indexToUse = 0;
    if (intendedTrackId) {
      const found = playback.findIndex(t => t.id === intendedTrackId);
      if (found !== -1) indexToUse = found;
      else indexToUse = Math.min(Math.max(startIndex, 0), playback.length - 1);
    } else {
      indexToUse = Math.min(Math.max(startIndex, 0), playback.length - 1);
    }

    setCurrentPlaylist(playback);
    setCurrentTrack(playback[indexToUse] || null);
    setCurrentIndexState(indexToUse);
    setPlaylistTitle(`${albumName} Album`);
    setIsPlayerOpen(true);
  };

  const playMemberPlaylist = (tracks: Track[], memberName: string, startIndex: number = 0) => {
  const hasLocal = (t: any) => !!(t.local_audio_url || t.localAudioUrl);
  const localFirst = tracks.filter(t => hasLocal(t));
    const playback = localFirst.length > 0 ? localFirst : tracks;

    const intendedTrackId = tracks[startIndex]?.id;
    let indexToUse = 0;
    if (intendedTrackId) {
      const found = playback.findIndex(t => t.id === intendedTrackId);
      if (found !== -1) indexToUse = found;
      else indexToUse = Math.min(Math.max(startIndex, 0), playback.length - 1);
    } else {
      indexToUse = Math.min(Math.max(startIndex, 0), playback.length - 1);
    }

    setCurrentPlaylist(playback);
    setCurrentTrack(playback[indexToUse] || null);
    setCurrentIndexState(indexToUse);
    setPlaylistTitle(`${memberName}'s Songs`);
    setIsPlayerOpen(true);
  };

  const playAllSongsPlaylist = (tracks: Track[], startIndex: number = 0) => {
  const hasLocal = (t: any) => !!(t.local_audio_url || t.localAudioUrl);
  const localFirst = tracks.filter(t => hasLocal(t));
    const playback = localFirst.length > 0 ? localFirst : tracks;

    const intendedTrackId = tracks[startIndex]?.id;
    let indexToUse = 0;
    if (intendedTrackId) {
      const found = playback.findIndex(t => t.id === intendedTrackId);
      if (found !== -1) indexToUse = found;
      else indexToUse = Math.min(Math.max(startIndex, 0), playback.length - 1);
    } else {
      indexToUse = Math.min(Math.max(startIndex, 0), playback.length - 1);
    }

    setCurrentPlaylist(playback);
    setCurrentTrack(playback[indexToUse] || null);
    setCurrentIndexState(indexToUse);
    setPlaylistTitle("All SB19 Songs");
    setIsPlayerOpen(true);
  };

  const value: PlaylistContext = {
    currentTrack,
    currentPlaylist,
    currentIndex,
    playlistTitle,
    isPlayerOpen,
    playTrack,
    playTrackAtIndex,
    setCurrentIndex,
    openPlayer,
    closePlayer,
    playAlbumPlaylist,
    playMemberPlaylist,
    playAllSongsPlaylist,
  };

  return (
    <MusicContext.Provider value={value}>
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const context = useContext(MusicContext);
  if (context === undefined) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
}