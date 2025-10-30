import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Track = sequelize.define('Track', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  spotify_id: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
  spotify_track_id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  artist_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  album_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  duration_ms: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  local_audio_url: {
    type: DataTypes.STRING,
    allowNull: true
  },
  spotify_external_url: {
    type: DataTypes.STRING,
    allowNull: true
  },
  is_featured: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  order_index: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  images: {
    type: DataTypes.JSON,
    allowNull: true
  }
}, {
  tableName: 'tracks',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default Track;
