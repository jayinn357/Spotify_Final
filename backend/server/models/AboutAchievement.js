import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const AboutAchievement = sequelize.define('AboutAchievement', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  image_url: {
    type: DataTypes.STRING,
    allowNull: true
  },
  order: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  }
}, {
  tableName: 'about_achievements',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default AboutAchievement;
