(async () => {
  try {
    const { default: sequelize } = await import('../config/database.js');
    const fs = await import('fs');
    const path = await import('path');

    const basePublic = path.resolve(process.cwd(), '..', '..', 'frontend', 'public');
    console.log('basePublic:', basePublic);

    const [rows] = await sequelize.query("SELECT id, title, spotify_track_id, local_audio_url, spotify_external_url, album_id FROM tracks WHERE LOWER(title) LIKE '%la luna%'");

    if (!rows || rows.length === 0) {
      console.log('No tracks found matching "la luna"');
      process.exit(0);
    }

    for (const r of rows) {
      console.log('\n---');
      console.log('DB id:', r.id);
      console.log('title:', r.title);
      console.log('spotify_track_id:', r.spotify_track_id);
      console.log('local_audio_url:', r.local_audio_url);
      console.log('spotify_external_url:', r.spotify_external_url);

      if (r.local_audio_url) {
        const localPath = r.local_audio_url.startsWith('/') ? path.join(basePublic, r.local_audio_url) : path.join(basePublic, r.local_audio_url);
        const exists = fs.existsSync(localPath);
        console.log('local_audio_url file path:', localPath);
        console.log('file exists:', exists);
      } else {
        console.log('No local_audio_url set');
      }

      if (r.spotify_track_id) {
        const possible = [];
        const folders = ['sb19','pablo','josh','justin','stell','felip'];
        for (const f of folders) {
          possible.push(path.join(basePublic, 'audio', f, `${r.spotify_track_id}.mp3`));
        }
        possible.push(path.join(basePublic, 'audio', `${r.spotify_track_id}.mp3`));
        for (const p of possible) {
          console.log('check:', p, 'exists=', fs.existsSync(p));
        }
      }
    }

    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
})();
