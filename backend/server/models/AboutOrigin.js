import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const AboutOrigin = sequelize.define('AboutOrigin', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  quote: {
    type: DataTypes.STRING,
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
  tableName: 'about_origins',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default AboutOrigin;
