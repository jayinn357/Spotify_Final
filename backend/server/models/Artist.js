import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Artist = sequelize.define('Artist', {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  spotify_id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  role: {
    type: DataTypes.STRING,
    allowNull: true
  },
  image_path: {
    type: DataTypes.STRING,
    allowNull: true
  },
  real_name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  specialty: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'artists',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default Artist;
