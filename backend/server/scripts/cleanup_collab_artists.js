import sequelize from '../config/database.js';
import Artist from '../models/Artist.js';
import Track from '../models/Track.js';
import '../models/index.js';

async function cleanupCollabArtists() {
  try {
    console.log('🧹 Cleaning up collaborator artists...\n');

    await sequelize.authenticate();
    console.log('✅ Database connected.\n');

    // Delete tracks from Ben&Ben and Sarah Geronimo
    const collabArtists = await Artist.findAll({
      where: {
        name: ['Ben&Ben', 'Sarah Geronimo']
      }
    });

    console.log(`Found ${collabArtists.length} collaborator artists to remove:\n`);
    
    for (const artist of collabArtists) {
      const trackCount = await Track.count({ where: { artist_id: artist.id } });
      console.log(`  - ${artist.name}: ${trackCount} tracks`);
      
      // Delete tracks
      await Track.destroy({ where: { artist_id: artist.id } });
      console.log(`    ✅ Deleted ${trackCount} tracks`);
      
      // Delete artist
      await artist.destroy();
      console.log(`    ✅ Deleted artist ${artist.name}\n`);
    }

    // Show remaining artists
    const remainingArtists = await Artist.findAll();
    console.log(`\n✅ Remaining artists (should be 6):`);
    for (const artist of remainingArtists) {
      const count = await Track.count({ where: { artist_id: artist.id } });
      console.log(`  - ${artist.name}: ${count} tracks`);
    }

    const totalTracks = await Track.count();
    console.log(`\n📦 Total tracks remaining: ${totalTracks}\n`);

    console.log('✅ Cleanup completed!\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Cleanup failed:', error);
    process.exit(1);
  }
}

cleanupCollabArtists();
