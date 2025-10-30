import React, { useState, useEffect } from "react";

const memberSpotifyIds = {
  Pablo: "7wY8cwtF13xDJIHO7htMNk",
  Josh: "3xn2W0ziGURPYJj372a6jQ",
  Stell: "4bpUKZGsImgabgDABbThr0",
  Felip: "2tEFDBihLXytoPl4xdResl",
  Justin: "3xn2W0ziGURPYJj372a6jQ"
};

const sb19Id = "3g7vYcdDXnqnDKYFwqXBJP";

const allArtists = { SB19: sb19Id, ...memberSpotifyIds };

export default function PreviewTest() {
  const [results, setResults] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = 'Preview URL Test';
  }, []);

  const testPreviews = async () => {
    setLoading(true);
    const found: unknown[] = [];
    for (const [name, id] of Object.entries(allArtists)) {
      try {
        const res = await fetch(`/api/spotify/artists/${id}/top-tracks?market=PH`);
        const data = await res.json();
        const tracks = data.tracks || [];
        found.push({
          name,
          tracks: tracks.map((t: unknown) => {
            const track = t as { name?: string; preview_url?: string; id?: string; external_urls?: { spotify?: string } };
            return {
              name: track.name,
              preview_url: track.preview_url,
              spotify_url: track.external_urls?.spotify || null
            };
          })
        });
      } catch {
        found.push({ name, tracks: [] });
      }
    }
    setResults(found);
    setLoading(false);
  };

  return (
    <main>
      <div className="max-w-2xl mx-auto py-12">
        <h1 className="text-2xl font-bold mb-6 text-yellow-400">Check 30s Preview Availability</h1>
        <button
          onClick={testPreviews}
          className="px-4 py-2 bg-yellow-400 text-black rounded hover:bg-yellow-300 font-semibold mb-8"
          disabled={loading}
        >
          {loading ? "Checking..." : "Check All Artists"}
        </button>
        <div className="space-y-8">
          {results.map((artist) => {
            const artistData = artist as { name: string; tracks: Array<{ name?: string; preview_url?: string; spotify_url?: string }> };
            return (
              <div key={artistData.name} className="bg-gray-800 p-4 rounded">
                <div className="font-bold text-yellow-300 mb-2">{artistData.name}</div>
                <ul className="space-y-1">
                  {artistData.tracks.map((track, i: number) => (
                    <li key={i} className="flex items-center space-x-2">
                      <span className="text-gray-200">{track.name}</span>
                      {track.preview_url ? (
                        <span className="text-green-400 text-xs">[Preview Available]</span>
                      ) : (
                        <span className="text-red-400 text-xs">[No Preview]</span>
                      )}
                      {track.spotify_url && (
                        <a href={track.spotify_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline text-xs">Spotify</a>
                      )}
                    </li>
                  ))}
                  {artistData.tracks.length === 0 && (
                    <li className="text-gray-400">No tracks found.</li>
                  )}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
