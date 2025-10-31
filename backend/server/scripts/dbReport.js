import sequelize from '../config/database.js';
import { Track, TrackMessage, AboutOrigin } from '../models/index.js';

async function run() {
  try {
    await sequelize.authenticate();
    console.log('DB connection OK');

    const tracksCount = await Track.count();
    const messagesCount = await TrackMessage.count();
    const origins = await AboutOrigin.findAll();

    console.log(`tracks count: ${tracksCount}`);
    console.log(`track_messages count: ${messagesCount}`);
    console.log(`about_origins rows: ${origins.length}`);

    if (origins.length > 0) {
      console.log('about_origins rows (id, quote, image_url, content_paragraph_1 length):');
      origins.forEach(o => {
        console.log(`- id=${o.id} quote=${o.quote || ''} image_url=${o.image_url || ''} p1_len=${(o.content_paragraph_1||'').length}`);
      });
    }

    // Also list first 10 track_messages joined to track titles
    const [results] = await sequelize.query(`SELECT tm.id, t.title, tm.message FROM track_messages tm LEFT JOIN tracks t ON tm.track_id = t.id LIMIT 10`);
    console.log('\nSample track_messages (up to 10):');
    results.forEach(r => console.log(`- id=${r.id} title=${r.title} message=${r.message ? r.message.substring(0,80) : ''}`));

    process.exit(0);
  } catch (err) {
    console.error('DB report failed:', err);
    process.exit(1);
  }
}

run();
