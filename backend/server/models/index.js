// Centralize model imports and define associations
import Track from './Track.js';
import Album from './Album.js';
import Artist from './Artist.js';

// Associations
Artist.hasMany(Track, { foreignKey: 'artist_id', as: 'tracks' });
Track.belongsTo(Artist, { foreignKey: 'artist_id', as: 'artist' });

Album.hasMany(Track, { foreignKey: 'album_id', as: 'tracks' });
Track.belongsTo(Album, { foreignKey: 'album_id', as: 'album' });

export { Artist, Album, Track };
