import sequelize from '../config/database.js';
import '../models/index.js'; // register models and associations
import Artist from '../models/Artist.js';

const seedArtists = async () => {
  const artists = [
    { name: 'SB19', spotify_id: null, image_path: null, real_name: null, specialty: null },
    { name: 'Pablo', spotify_id: null, image_path: null, real_name: null, specialty: null },
    { name: 'Stell', spotify_id: null, image_path: null, real_name: null, specialty: null },
    { name: 'Josh', spotify_id: null, image_path: null, real_name: null, specialty: null },
    { name: 'Justin', spotify_id: null, image_path: null, real_name: null, specialty: null },
    { name: 'Ken', spotify_id: null, image_path: null, real_name: null, specialty: null }
  ];

  for (const a of artists) {
    const [artist, created] = await Artist.findOrCreate({
      where: { name: a.name },
      defaults: a
    });
    if (created) console.log(`Created artist: ${a.name}`);
    else console.log(`Artist already exists: ${a.name}`);
  }
};

const run = async () => {
  try {
    console.log('Syncing database (alter = true) to match models...');
    await sequelize.sync({ alter: true });
    console.log('Database synced. Now seeding artists...');
    await seedArtists();
    console.log('Done.');
    process.exit(0);
  } catch (err) {
    console.error('Error creating tables / seeding:', err);
    process.exit(1);
  }
};

run();