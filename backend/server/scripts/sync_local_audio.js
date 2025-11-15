(async () => {
  try {
    const { default: sequelize } = await import('../config/database.js');
    const fs = await import('fs');
    const path = await import('path');

    const audioRoot = path.resolve(process.cwd(), '..', '..', 'frontend', 'public', 'audio');
    console.log('Scanning audio folder:', audioRoot);

    if (!fs.existsSync(audioRoot)) {
      console.error('Audio root does not exist:', audioRoot);
      process.exit(1);
    }

    const folders = fs.readdirSync(audioRoot, { withFileTypes: true }).filter(d => d.isDirectory()).map(d => d.name);
    folders.push('');

    let updated = 0;

    for (const folder of folders) {
      const dir = folder ? path.join(audioRoot, folder) : audioRoot;
      const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter(f => f.toLowerCase().endsWith('.mp3')) : [];
      for (const file of files) {
        const name = path.basename(file, '.mp3');
        const relPath = folder ? path.posix.join('/audio', folder, `${name}.mp3`) : path.posix.join('/audio', `${name}.mp3`);

        // Update tracks that match spotify_track_id
        const [res] = await sequelize.query("UPDATE tracks SET local_audio_url = ? WHERE spotify_track_id = ?", { replacements: [relPath, name]});
        const [rows] = await sequelize.query("SELECT id, title FROM tracks WHERE spotify_track_id = ?", { replacements: [name]});
        if (rows && rows.length > 0) {
          for (const row of rows) {
            console.log(`Updated track id=${row.id} title=\"${row.title}\" -> local_audio_url=${relPath}`);
            updated++;
          }
        }
      }
    }

    console.log(`Done. Updated ${updated} track(s).`);
    process.exit(0);
  } catch (err) {
    console.error('Error during sync:', err);
    process.exit(1);
  }
})();
