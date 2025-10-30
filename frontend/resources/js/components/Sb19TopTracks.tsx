import React, { useEffect, useState } from 'react';
import ImportTracksButton from './ImportTracksButton';

export default function Sb19TopTracks() {
  const [tracks, setTracks] = useState<unknown[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const artistId = '2Z4d5FwBxmMZnAmiYJ0N6r';
        const res = await fetch(`/api/spotify/artists/${artistId}/top-tracks?market=PH`, {
          credentials: 'include', // keep session cookies
        });

        if (!res.ok) {
          console.error('Failed to fetch:', await res.text());
          return;
        }

        const data = await res.json();
        setTracks(data.tracks || []);
      } catch (err) {
        console.error('Error fetching tracks:', err);
      }
    }

    load();
  }, []);

  return (
    <div>
      <h3>SB19 Top Tracks</h3>
      <ImportTracksButton tracks={tracks} artistId={'2Z4d5FwBxmMZnAmiYJ0N6r'} />
      <ul>
        {tracks.map((t, i) => {
          const track = t as { id?: string; name?: string; album?: { name?: string }; popularity?: number };
          return (
            <li key={track?.id ?? i}>
              {track?.name} — {track?.album?.name} ({track?.popularity})
            </li>
          );
        })}
      </ul>
    </div>
  );
}
