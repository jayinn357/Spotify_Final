// resources/js/Components/ConnectSpotifyButton.jsx
import { useState } from "react";

interface ConnectSpotifyButtonProps {
  className?: string;
  onConnect?: () => void;
}

export default function ConnectSpotifyButton({ 
  className = "", 
  onConnect 
}: ConnectSpotifyButtonProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = () => {
    if (isConnected) {
      // Simulate disconnect
      setIsConnected(false);
      alert("Disconnected from Spotify! (This is a frontend-only demo)");
      return;
    }

    setIsConnecting(true);
    
    // Simulate connection process
    setTimeout(() => {
      setIsConnected(true);
      setIsConnecting(false);
      onConnect?.();
      alert("Connected to Spotify! (This is a frontend-only demo - no real authentication)");
    }, 2000);
  };

  if (isConnecting) {
    return (
      <button
        disabled
        className={`bg-gray-600 text-white px-6 py-3 rounded-full font-semibold flex items-center space-x-2 ${className}`}
      >
        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
        <span>Connecting...</span>
      </button>
    );
  }

  if (isConnected) {
    return (
      <button
        onClick={handleConnect}
        className={`bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full font-semibold transition-colors flex items-center space-x-2 ${className}`}
      >
        <span>🎵</span>
        <span>Disconnect Spotify</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleConnect}
      className={`bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full font-semibold transition-colors flex items-center space-x-2 ${className}`}
    >
      <span>🎧</span>
      <span>Connect to Spotify</span>
    </button>
  );
}
