import User from '../../models/User.js';
import sequelize from '../../config/database.js';

const seedUsers = async () => {
  try {
    // Option A: Use existing data - only sync without dropping tables
    await sequelize.sync({ alter: false }); // Don't force drop, just create if not exists
    
    console.log('Seeding database...');

    // Create test users only if they don't exist
    const users = [
      { name: 'User', email: 'user@mahalima.com', password: 'password' },
      { name: 'Test User', email: 'test@mahalima.com', password: 'password' },
      { name: 'SB19 Fan', email: 'fan@mahalima.com', password: 'password' }
    ];

    for (const userData of users) {
      const [user, created] = await User.findOrCreate({
        where: { email: userData.email },
        defaults: {
          ...userData,
          email_verified_at: new Date()
        }
      });
      
      if (created) {
        console.log(`Created user: ${userData.email}`);
      } else {
        console.log(`User already exists: ${userData.email}`);
      }
    }

    console.log('Database seeding completed!');
    console.log('Test users (if created):');
    console.log('   - user@mahalima.com / password');
    console.log('   - test@mahalima.com / password');
    console.log('   - fan@mahalima.com / password');
    
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedUsers();
