import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Album = sequelize.define('Album', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  spotify_id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  images: {
    type: DataTypes.JSON,
    allowNull: true
  },

}, {
  tableName: 'albums',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default Album;
