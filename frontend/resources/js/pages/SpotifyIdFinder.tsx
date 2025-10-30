import React, { useState, useEffect } from "react";

const memberNames = [
  "Pablo",
  "Josh Cullen",
  "Stell",
  "Felip",
  "Justin de Dios SB19"
];

export default function SpotifyIdFinder() {
  const [results, setResults] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = 'Spotify ID Finder';
  }, []);

  const searchIds = async () => {
    setLoading(true);
    const found: unknown[] = [];
    for (const name of memberNames) {
      try {
        const res = await fetch(`/api/spotify/search?q=${encodeURIComponent(name)}&type=artist&limit=1&market=PH`);
        const data = await res.json();
        const artist = data.artists?.items?.[0];
        found.push({
          name,
          id: artist?.id || "Not found",
          spotifyUrl: artist ? artist.external_urls.spotify : null,
          image: artist?.images?.[0]?.url || null
        });
      } catch {
        found.push({ name, id: null, image: null, spotifyUrl: null });
      }
    }
    setResults(found);
    setLoading(false);
  };

  return (
    <main>
      <div className="max-w-xl mx-auto py-12">
        <h1 className="text-2xl font-bold mb-6 text-yellow-400">Find SB19 Members' Spotify Artist IDs</h1>
        <button
          onClick={searchIds}
          className="px-4 py-2 bg-yellow-400 text-black rounded hover:bg-yellow-300 font-semibold mb-8"
          disabled={loading}
        >
          {loading ? "Searching..." : "Find Spotify IDs"}
        </button>
        <div className="space-y-4">
          {results.map((r) => {
            const result = r as { name: string; id?: string; image?: string; spotifyUrl?: string };
            return (
              <div key={result.name} className="bg-gray-800 p-4 rounded flex items-center space-x-4">
                {result.image && <img src={result.image} alt={result.name} className="w-12 h-12 rounded-full object-cover" />}
                <div>
                  <div className="font-bold text-yellow-300">{result.name}</div>
                  <div className="text-gray-300">ID: <span className="font-mono">{result.id}</span></div>
                  {result.spotifyUrl && (
                    <a href={result.spotifyUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline text-sm">View on Spotify</a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
