import { Artist, AboutOrigin, AboutAchievement, AboutFooter, TrackMessage, Track } from '../models/index.js';

// ===== ARTISTS CRUD =====
export const getAllArtists = async (req, res) => {
  try {
    const artists = await Artist.findAll({
      order: [['id', 'ASC']]
    });
    res.json({ artists });
  } catch (error) {
    console.error('Error fetching artists:', error);
    res.status(500).json({ error: 'Failed to fetch artists' });
  }
};

export const updateArtist = async (req, res) => {
  try {
    const { id } = req.params;
    const { real_name, specialty, role, description } = req.body;
    
    const artist = await Artist.findByPk(id);
    if (!artist) {
      return res.status(404).json({ error: 'Artist not found' });
    }

    await artist.update({ real_name, specialty, role, description });
    res.json({ artist, message: 'Artist updated successfully' });
  } catch (error) {
    console.error('Error updating artist:', error);
    res.status(500).json({ error: 'Failed to update artist' });
  }
};

// ===== ABOUT ORIGINS CRUD =====
export const getAllAboutOrigins = async (req, res) => {
  try {
    const origins = await AboutOrigin.findAll({
      order: [['order', 'ASC']]
    });
    res.json({ origins });
  } catch (error) {
    console.error('Error fetching about origins:', error);
    res.status(500).json({ error: 'Failed to fetch about origins' });
  }
};

export const updateAboutOrigin = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content_paragraph_1, content_paragraph_2, content_paragraph_3, quote, image_url } = req.body;
    
    const origin = await AboutOrigin.findByPk(id);
    if (!origin) {
      return res.status(404).json({ error: 'About origin not found' });
    }

    await origin.update({ title, content_paragraph_1, content_paragraph_2, content_paragraph_3, quote, image_url });
    res.json({ origin, message: 'About origin updated successfully' });
  } catch (error) {
    console.error('Error updating about origin:', error);
    res.status(500).json({ error: 'Failed to update about origin' });
  }
};

export const createAboutOrigin = async (req, res) => {
  try {
    const { title, content_paragraph_1, content_paragraph_2, content_paragraph_3, quote, image_url, order } = req.body;
    
    const origin = await AboutOrigin.create({
      title,
      content_paragraph_1,
      content_paragraph_2,
      content_paragraph_3,
      quote,
      image_url,
      order: order || 1
    });
    
    res.status(201).json({ origin, message: 'About origin created successfully' });
  } catch (error) {
    console.error('Error creating about origin:', error);
    res.status(500).json({ error: 'Failed to create about origin' });
  }
};

export const deleteAboutOrigin = async (req, res) => {
  try {
    const { id } = req.params;
    
    const origin = await AboutOrigin.findByPk(id);
    if (!origin) {
      return res.status(404).json({ error: 'About origin not found' });
    }

    await origin.destroy();
    res.json({ message: 'About origin deleted successfully' });
  } catch (error) {
    console.error('Error deleting about origin:', error);
    res.status(500).json({ error: 'Failed to delete about origin' });
  }
};

// ===== ABOUT ACHIEVEMENTS CRUD =====
export const getAllAboutAchievements = async (req, res) => {
  try {
    const achievements = await AboutAchievement.findAll({
      order: [['order', 'ASC']]
    });
    res.json({ achievements });
  } catch (error) {
    console.error('Error fetching about achievements:', error);
    res.status(500).json({ error: 'Failed to fetch about achievements' });
  }
};

export const createAboutAchievement = async (req, res) => {
  try {
    const { title, description, image_url, order } = req.body;
    const achievement = await AboutAchievement.create({ title, description, image_url, order });
    res.status(201).json({ achievement, message: 'Achievement created successfully' });
  } catch (error) {
    console.error('Error creating achievement:', error);
    res.status(500).json({ error: 'Failed to create achievement' });
  }
};

export const updateAboutAchievement = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, image_url, order } = req.body;
    
    const achievement = await AboutAchievement.findByPk(id);
    if (!achievement) {
      return res.status(404).json({ error: 'Achievement not found' });
    }

    await achievement.update({ title, description, image_url, order });
    res.json({ achievement, message: 'Achievement updated successfully' });
  } catch (error) {
    console.error('Error updating achievement:', error);
    res.status(500).json({ error: 'Failed to update achievement' });
  }
};

export const deleteAboutAchievement = async (req, res) => {
  try {
    const { id } = req.params;
    const achievement = await AboutAchievement.findByPk(id);
    
    if (!achievement) {
      return res.status(404).json({ error: 'Achievement not found' });
    }

    await achievement.destroy();
    res.json({ message: 'Achievement deleted successfully' });
  } catch (error) {
    console.error('Error deleting achievement:', error);
    res.status(500).json({ error: 'Failed to delete achievement' });
  }
};

// ===== ABOUT FOOTER CRUD =====
export const getAllAboutFooter = async (req, res) => {
  try {
    const footerItems = await AboutFooter.findAll({
      order: [['id', 'ASC']]
    });
    res.json({ footerItems });
  } catch (error) {
    console.error('Error fetching about footer:', error);
    res.status(500).json({ error: 'Failed to fetch about footer' });
  }
};

export const updateAboutFooter = async (req, res) => {
  try {
    const { id } = req.params;
    const { profile_name, profile_image_url, main_description, quote } = req.body;
    
    const footerItem = await AboutFooter.findByPk(id);
    if (!footerItem) {
      return res.status(404).json({ error: 'Footer item not found' });
    }

    await footerItem.update({ profile_name, profile_image_url, main_description, quote });
    res.json({ footerItem, message: 'Footer item updated successfully' });
  } catch (error) {
    console.error('Error updating footer item:', error);
    res.status(500).json({ error: 'Failed to update footer item' });
  }
};

// ===== TRACK MESSAGES CRUD =====
export const getAllTrackMessages = async (req, res) => {
  try {
    const messages = await TrackMessage.findAll({
      include: [{ model: Track, attributes: ['id', 'title', 'spotify_track_id'] }],
      order: [['created_at', 'DESC']]
    });
    res.json({ messages });
  } catch (error) {
    console.error('Error fetching track messages:', error);
    res.status(500).json({ error: 'Failed to fetch track messages' });
  }
};

export const getTrackMessageByTrackId = async (req, res) => {
  try {
    const { trackId } = req.params;
    const message = await TrackMessage.findOne({
      where: { track_id: trackId }
    });
    
    if (!message) {
      return res.status(404).json({ error: 'Message not found for this track' });
    }
    
    res.json({ message });
  } catch (error) {
    console.error('Error fetching track message:', error);
    res.status(500).json({ error: 'Failed to fetch track message' });
  }
};

export const createTrackMessage = async (req, res) => {
  try {
    const { track_id, message } = req.body;
    
    // Check if track exists
    const track = await Track.findByPk(track_id);
    if (!track) {
      return res.status(404).json({ error: 'Track not found' });
    }
    
    // Check if message already exists for this track
    const existing = await TrackMessage.findOne({ where: { track_id } });
    if (existing) {
      return res.status(400).json({ error: 'Message already exists for this track' });
    }
    
    const trackMessage = await TrackMessage.create({ track_id, message });
    res.status(201).json({ trackMessage, message: 'Track message created successfully' });
  } catch (error) {
    console.error('Error creating track message:', error);
    res.status(500).json({ error: 'Failed to create track message' });
  }
};

export const updateTrackMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;
    
    const trackMessage = await TrackMessage.findByPk(id);
    if (!trackMessage) {
      return res.status(404).json({ error: 'Track message not found' });
    }

    await trackMessage.update({ message });
    res.json({ trackMessage, message: 'Track message updated successfully' });
  } catch (error) {
    console.error('Error updating track message:', error);
    res.status(500).json({ error: 'Failed to update track message' });
  }
};

export const deleteTrackMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const trackMessage = await TrackMessage.findByPk(id);
    
    if (!trackMessage) {
      return res.status(404).json({ error: 'Track message not found' });
    }

    await trackMessage.destroy();
    res.json({ message: 'Track message deleted successfully' });
  } catch (error) {
    console.error('Error deleting track message:', error);
    res.status(500).json({ error: 'Failed to delete track message' });
  }
};
