import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const AboutFooter = sequelize.define('AboutFooter', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  profile_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  profile_image_url: {
    type: DataTypes.STRING,
    allowNull: true
  },
  main_description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  quote: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'about_footer',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default AboutFooter;
