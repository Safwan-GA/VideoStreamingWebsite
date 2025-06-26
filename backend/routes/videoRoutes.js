import { Router } from "express";
// import { uploadVideo, listVideos } from "../controllers/videoController.js";
import { protect } from "../middleware/auth.js";
import { uploadVideo as upload } from "../middleware/upload.js";
import { streamVideo } from '../controllers/videoStreamingController.js';
import {
  uploadVideo, listVideos, getFullVideoDetails, likeVideo, dislikeVideo, addComment, deleteComment, updateComment, deleteVideo
} from "../controllers/videoController.js";






import mongoose from 'mongoose';
import Grid from 'gridfs-stream';

let gfs;
const conn = mongoose.connection;
conn.once("open", () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("videos");
});

const router = Router();

// corrected route
router.get('/play/:id', streamVideo); 

router.post("/upload", protect, upload, uploadVideo);
router.get("/videos", listVideos);
router.delete('/video/:id', protect, deleteVideo);

router.get("/video/full/:id", getFullVideoDetails);
router.post("/video/like/:id", likeVideo);
router.post("/video/dislike/:id", dislikeVideo);
router.post('/video/comment/:id', protect, addComment);


router.delete('/video/comment/:id/:commentId', protect, deleteComment);
router.put('/video/comment/:id/:commentId', protect, updateComment);



// for thumbnail images
router.get("/video/play/:filename", async (req, res) => {
  try {
    const file = await gfs.files.findOne({ filename: req.params.filename });

    if (!file || file.length === 0)
      return res.status(404).json({ message: "No file exists" });

    const readStream = gfs.createReadStream(file.filename);
    res.set("Content-Type", file.contentType);
    readStream.pipe(res);
  } catch (err) {
    res.status(500).json({ message: "Stream error", error: err.message });
  }
});

export default router;
