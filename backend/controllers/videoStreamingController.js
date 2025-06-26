// controllers/videoStreamController.js
import mongoose from "mongoose";
import { GridFSBucket } from "mongodb";



export const streamVideo = async (req, res) => {
  const { id } = req.params;
  const db = mongoose.connection.db;
  const bucket = new GridFSBucket(db, { bucketName: "videos" });

  try {
    const _id = new mongoose.Types.ObjectId(id);

    const file = await db.collection("videos.files").findOne({ _id });
    if (!file) return res.status(404).json({ message: "File not found" });

    const range = req.headers.range;
    if (!range) {
      return res.status(416).send("Range header required");
    }

    const videoSize = file.length;
    const CHUNK_SIZE = 1 * 1024 * 1024; // 1MB
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
    const contentLength = end - start + 1;

    const headers = {
      "Content-Range": `bytes ${start}-${end}/${videoSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": contentLength,
      "Content-Type": "video/mp4",
    };

    res.writeHead(206, headers);

    const downloadStream = bucket.openDownloadStream(_id, {
      start,
      end: end + 1, // end is exclusive
    });

    downloadStream.pipe(res);
  } catch (err) {
    console.error("Stream error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
