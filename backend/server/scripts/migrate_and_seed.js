import sequelize from '../config/database.js';
import User from '../models/User.js';
import Artist from '../models/Artist.js';
import Album from '../models/Album.js';
import Track from '../models/Track.js';
import '../models/index.js'; // Import associations
import bcrypt from 'bcryptjs';

// SB19 Members and Group Data
const ARTISTS_DATA = [
  {
    name: 'SB19',
    spotify_id: '3g7vYcdDXnqnDKYFwqXBJP',
    real_name: null,
    specialty: 'P-Pop Group',
    role: 'Group'
  },
  {
    name: 'Pablo',
    spotify_id: '7wY8cwtF13xDJIHO7htMNk',
    real_name: 'John Paulo Nase',
    specialty: null,
    role: 'Leader, Main Rapper'
  },
  {
    name: 'Josh',
    spotify_id: '3xn2W0ziGURPYJj372a6jQ',
    real_name: 'Josh Cullen Santos',
    specialty: null,
    role: 'Main Rapper, Lead Dancer'
  },
  {
    name: 'Stell',
    spotify_id: '4bpUKZGsImgabgDABbThr0',
    real_name: 'Stellvester Ajero',
    specialty: null,
    role: 'Main Vocalist, Lead Dancer'
  },
  {
    name: 'Ken',
    spotify_id: '2tEFDBihLXytoPl4xdResl',
    real_name: 'Felip Jhon Suson',
    specialty: null,
    role: 'Main Dancer, Lead Rapper'
  },
  {
    name: 'Justin',
    spotify_id: '20XuMlpFudMP9rDHMTkyar',
    real_name: 'Justin de Dios',
    specialty: null,
    role: 'Main Vocalist, Visual'
  }
];

// SB19 Albums
const ALBUMS_DATA = [
  {
    name: 'GET IN THE ZONE',
    spotify_id: '7zEfRTSPVfpZGUlhOlKDCO'
  },
  {
    name: 'PAGSIBOL',
    spotify_id: '0RZKH87J9E9uHhJqmEVjl6'
  },
  {
    name: 'PAGTATAG!',
    spotify_id: '6hqJzHXH5WXvXMVcHJaV7s'
  },
  {
    name: 'Simula at Wakas',
    spotify_id: '5qKpYN0LCPPbOL9FqIJqfK'
  }
];

async function migrateAndSeed() {
  try {
    console.log('🔄 Starting migration and seeding process...\n');

    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connection established.\n');

    // Sync all models (alter: true will add missing columns without dropping tables)
    console.log('🔄 Syncing database schema...');
    await sequelize.sync({ alter: true });
    console.log('✅ Database schema synchronized.\n');

    // Seed Artists
    console.log('🔄 Seeding artists...');
    for (const artistData of ARTISTS_DATA) {
      const [artist, created] = await Artist.findOrCreate({
        where: { spotify_id: artistData.spotify_id },
        defaults: artistData
      });

      if (created) {
        console.log(`  ✅ Created artist: ${artistData.name}`);
      } else {
        // Update existing artist
        await artist.update(artistData);
        console.log(`  ℹ️  Updated artist: ${artistData.name}`);
      }
    }
    console.log('✅ Artists seeded.\n');

    // Seed Albums
    console.log('🔄 Seeding albums...');
    for (const albumData of ALBUMS_DATA) {
      const [album, created] = await Album.findOrCreate({
        where: { spotify_id: albumData.spotify_id },
        defaults: {
          ...albumData,
          images: null // Will be fetched from API when needed
        }
      });

      if (created) {
        console.log(`  ✅ Created album: ${albumData.name}`);
      } else {
        console.log(`  ℹ️  Album already exists: ${albumData.name}`);
      }
    }
    console.log('✅ Albums seeded.\n');

    // Create a test user if none exists
    console.log('🔄 Checking for test user...');
    const userCount = await User.count();
    if (userCount === 0) {
      // Let the model's beforeCreate hook hash the password
      await User.create({
        name: 'Test User',
        email: 'test@sb19.com',
        password: 'password123', // Will be hashed by the model
        email_verified_at: new Date()
      });
      console.log('✅ Created test user (email: test@sb19.com, password: password123)\n');
    } else {
      console.log(`ℹ️  Users already exist (${userCount} users found)\n`);
    }

    // Display summary
    console.log('📊 Database Summary:');
    const artistCount = await Artist.count();
    const albumCount = await Album.count();
    const trackCount = await Track.count();
    const finalUserCount = await User.count();

    console.log(`  - Users: ${finalUserCount}`);
    console.log(`  - Artists: ${artistCount}`);
    console.log(`  - Albums: ${albumCount}`);
    console.log(`  - Tracks: ${trackCount}`);
    
    console.log('\n✅ Migration and seeding completed successfully!');
    console.log('\n📝 Next Steps:');
    console.log('  1. Start the server: npm run start');
    console.log('  2. Login with: test@sb19.com / password123');
    console.log('  3. First page load will fetch tracks from Spotify API');
    console.log('  4. Subsequent loads will use cached database data\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Migration/Seeding failed:', error);
    process.exit(1);
  }
}

migrateAndSeed();
