import { Op } from 'sequelize';
import { Track, TrackMessage, Artist } from './models/index.js';

(async () => {
  try {
    const msgs = await TrackMessage.findAll({ attributes: ['track_id'] });
    const ids = msgs.map(m => m.track_id);
    console.log('Track IDs with messages:', ids.length);
    
    const tracks = await Track.findAll({
      where: {
        id: {
          [Op.notIn]: ids.length > 0 ? ids : [0]
        }
      },
      include: [{ model: Artist, as: 'artist', attributes: ['name'] }],
      limit: 10
    });
    
    console.log('\nFirst 10 tracks WITHOUT messages:', tracks.length);
    tracks.forEach((t, i) => {
      console.log(`${i+1}. [ID ${t.id}] ${t.title} - ${t.artist?.name || 'Unknown'}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
})();
