// Centralize model imports and define associations
import Track from './Track.js';
import Album from './Album.js';
import Artist from './Artist.js';
import AboutOrigin from './AboutOrigin.js';
import AboutAchievement from './AboutAchievement.js';
import AboutFooter from './AboutFooter.js';
import TrackMessage from './TrackMessage.js';

// Associations
Artist.hasMany(Track, { foreignKey: 'artist_id', as: 'tracks' });
Track.belongsTo(Artist, { foreignKey: 'artist_id', as: 'artist' });

Album.hasMany(Track, { foreignKey: 'album_id', as: 'tracks' });
Track.belongsTo(Album, { foreignKey: 'album_id', as: 'album' });

// TrackMessage associations are defined in TrackMessage.js

export { Artist, Album, Track, AboutOrigin, AboutAchievement, AboutFooter, TrackMessage };
