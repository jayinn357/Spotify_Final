import React, { useState } from 'react';

type TrackShape = any;

export default function ImportTracksButton({ tracks, artistId }: { tracks?: TrackShape[]; artistId?: string }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImport = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const body: any = {};
      if (tracks && tracks.length > 0) body.tracks = tracks;
      else if (artistId) body.artistId = artistId;
      else {
        setError('No tracks or artistId provided');
        setLoading(false);
        return;
      }

      const res = await fetch('/api/tracks/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const txt = await res.text();
        setError(`Import failed: ${res.status} - ${txt}`);
        setLoading(false);
        return;
      }

      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: 8 }}>
      <button onClick={handleImport} disabled={loading} className="btn btn-primary">
        {loading ? 'Importing...' : 'Save to DB'}
      </button>

      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}

      {result && (
        <div style={{ marginTop: 8 }}>
          <strong>Import result:</strong>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
