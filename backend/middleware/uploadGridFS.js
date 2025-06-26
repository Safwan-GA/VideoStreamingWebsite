const storage = new GridFsStorage({
  url: process.env.MONGO_URI,
  file: (req, file) => {
    const isVideo = ['video/mp4', 'video/mkv', 'video/avi', 'video/mov'].includes(file.mimetype);
    const isImage = ['image/jpeg', 'image/png', 'image/jpg'].includes(file.mimetype);

    if (isVideo) {
      return {
        filename: `${Date.now()}-${file.originalname}`,
        bucketName: 'videos',
      };
    }

    if (isImage) {
      return {
        filename: `${Date.now()}-${file.originalname}`,
        bucketName: 'thumbnails',
      };
    }

    return Promise.reject(new Error('Invalid file type. Only video or image files are allowed.'));
  },
});

export const uploadVideo = multer({ storage });
