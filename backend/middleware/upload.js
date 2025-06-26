import multer from "multer";

// Use memory storage to access req.file.buffer
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 1 * 1024 * 1024 * 1024, // optional: 1GB limit
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

export const uploadVideo = upload.single("file"); // input name should be `video`
