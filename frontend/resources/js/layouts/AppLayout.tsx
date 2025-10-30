// resources/js/layouts/AppLayout.tsx
import { Outlet } from 'react-router-dom';
import Navbar from "@/components/Navbar";
import MusicPlayer from "@/components/MusicPlayer";
import { useMusic } from "@/contexts/MusicContext";
import { useAuth } from "@/contexts/AuthContext";

export default function AppLayout() {
    const { user } = useAuth();
    const { 
        isPlayerOpen, 
        currentTrack, 
        currentPlaylist, 
        currentIndex, 
        playlistTitle,
        closePlayer, 
        setCurrentIndex 
    } = useMusic();

    return (
        <div className="bg-black min-h-screen text-white">
            <Navbar />
            <main>
                <Outlet />
            </main>
            <MusicPlayer
                isOpen={isPlayerOpen}
                currentTrack={currentTrack}
                playlist={currentPlaylist}
                currentIndex={currentIndex}
                onClose={closePlayer}
                onTrackChange={setCurrentIndex}
                playlistTitle={playlistTitle}
                authUser={user}
            />
        </div>
    );
}



