import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Track from './Track.js';

const TrackMessage = sequelize.define('TrackMessage', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  track_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'tracks',
      key: 'id'
    }
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  tableName: 'track_messages',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Define association
TrackMessage.belongsTo(Track, { foreignKey: 'track_id', onDelete: 'CASCADE' });
Track.hasOne(TrackMessage, { foreignKey: 'track_id' });

export default TrackMessage;
