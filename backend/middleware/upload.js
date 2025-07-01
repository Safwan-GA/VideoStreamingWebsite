import multer from 'multer';

// Use memory storage for GridFS + thumbnail generation
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 1 * 1024 * 1024 * 1024, // Max 1GB
  },
  fileFilter: (req, file, cb) => {
    const allowed = ['video/mp4', 'video/mkv', 'video/avi', 'video/mov'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only video files are allowed'), false);
    }
  },
});

export const uploadVideo = upload.single('file'); // input name should be 'file'
