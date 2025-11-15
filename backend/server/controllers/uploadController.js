// imports
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { Track } from '../models/index.js';

// get full file path of the current path and conver to regular path
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Save to uploaded files to frontend/public/images directory
    const uploadPath = path.join(__dirname, '../../../frontend/public/images');
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Filename: timestamp-originalname
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const nameWithoutExt = path.basename(file.originalname, ext);
    cb(null, nameWithoutExt + '-' + uniqueSuffix + ext);
  }
});

// filtering uploaded files - only allow images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
  }
};

// Configure multer for image uploads; limit file size to 5MB
export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 
  },
  fileFilter: fileFilter
});

// Handles upload requests
export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const imageUrl = `/images/${req.file.filename}`;
    
    res.json({
      success: true,
      imageUrl: imageUrl,
      filename: req.file.filename,
      message: 'Image uploaded successfully'
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
};


// Saving audio files to separate storage from images
const audioStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Get artist name to determine folder 
    const artistName = req.body.artistName || 'unknown';
    const uploadPath = path.join(__dirname, `../../../frontend/public/audio/${artistName.toLowerCase()}`);
    
    // Create folder if needed
    import('fs').then(fs => {
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath);
    });
  },
  filename: function (req, file, cb) {
    // Keep original filename - it must match spotify_track_id
    cb(null, file.originalname);
  }
});

// File filter - only allow audio files
const audioFilter = (req, file, cb) => {
  const allowedTypes = /mp3|wav|ogg|m4a/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = file.mimetype.startsWith('audio/');

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only audio files are allowed (mp3, wav, ogg, m4a)'));
  }
};

// Configure multer for audio; limit file size to 10MB
export const uploadAudio = multer({
  storage: audioStorage,
  limits: {
    fileSize: 10 * 1024 * 1024 
  },
  fileFilter: audioFilter
});

// validates filename matches spotify_track_id 
export const uploadTrackAudio = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file uploaded' });
    }

    const { trackId } = req.params;
    
    // Find the track
    const track = await Track.findByPk(trackId);
    if (!track) {
      return res.status(404).json({ error: 'Track not found' });
    }

    // Get filename without extension
    const uploadedFileName = path.basename(req.file.originalname, path.extname(req.file.originalname));
    
    // Check if filename matches spotify_track_id
    if (uploadedFileName !== track.spotify_track_id) {
      // Delete the uploaded file since it doesn't match
      import('fs').then(fs => {
        fs.unlinkSync(req.file.path);
      });
      
      return res.status(400).json({ 
        error: `Filename mismatch! The audio filename must be "${track.spotify_track_id}.mp3" (or other audio format)`,
        expected: track.spotify_track_id,
        received: uploadedFileName
      });
    }

    // Get artist name for building audio URL/path
    const artistName = req.body.artistName || 'unknown';
    const audioUrl = `/audio/${artistName.toLowerCase()}/${req.file.filename}`;
    
    // Update track with audio URL
    await track.update({ local_audio_url: audioUrl });
    
    res.json({
      success: true,
      audioUrl: audioUrl,
      filename: req.file.filename,
      message: 'Audio uploaded successfully and track updated'
    });
  } catch (error) {
    console.error('Error uploading audio:', error);
    res.status(500).json({ error: 'Failed to upload audio' });
  }
};
