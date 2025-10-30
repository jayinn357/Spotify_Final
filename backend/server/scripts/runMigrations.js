import sequelize from '../config/database.js';
import { Sequelize } from 'sequelize';

// Import migrations
import * as addDescriptionToArtists from '../migrations/20251031000001-add-description-to-artists.js';
import * as createAboutOrigins from '../migrations/20251031000002-create-about-origins.js';
import * as createAboutAchievements from '../migrations/20251031000003-create-about-achievements.js';
import * as createAboutFooter from '../migrations/20251031000004-create-about-footer.js';
import * as createTrackMessages from '../migrations/20251031000005-create-track-messages.js';

async function runMigrations() {
  try {
    console.log('🔄 Running migrations...');
    
    // Get queryInterface
    const queryInterface = sequelize.getQueryInterface();
    
    // Run each migration
    console.log('  ✓ Adding description column to artists table...');
    await addDescriptionToArtists.up(queryInterface, Sequelize);
    
    console.log('  ✓ Creating about_origins table...');
    await createAboutOrigins.up(queryInterface, Sequelize);
    
    console.log('  ✓ Creating about_achievements table...');
    await createAboutAchievements.up(queryInterface, Sequelize);
    
    console.log('  ✓ Creating about_footer table...');
    await createAboutFooter.up(queryInterface, Sequelize);
    
    console.log('  ✓ Creating track_messages table...');
    await createTrackMessages.up(queryInterface, Sequelize);
    
    console.log('✅ All migrations completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigrations();
