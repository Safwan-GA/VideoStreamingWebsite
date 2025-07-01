// controllers/uploadVideo.js
import mongoose from "mongoose";
import path from "path";
import fs from "fs";
import os from "os";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { exec } from "child_process";
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";

import Video from "../models/Video.js";
import Channel from "../models/Channel.js";
import User from "../models/User.js";

// __dirname workaround for ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const uploadVideo = async (req, res) => {
  try {
    const { videoTitle, videoDescription, channelName, categoryString } = req.body;
    const category = categoryString?.split(",") || [];

    if (!req.file) return res.status(400).json({ message: "No video file provided" });

    const { originalname, buffer, mimetype } = req.file;

    const channel = await Channel.findOne({ name: channelName });
    if (!channel) return res.status(404).json({ message: "Channel not found" });

    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: "videos",
    });

    const uploadStream = bucket.openUploadStream(originalname, { contentType: mimetype });
    const fileId = uploadStream.id;
    uploadStream.end(buffer);

    uploadStream.on("finish", async () => {
      console.log("Video uploaded to GridFS:", fileId);

      const tempVideoPath = path.join(os.tmpdir(), `${fileId}.mp4`);
      const tempWriteStream = fs.createWriteStream(tempVideoPath);
      const downloadStream = bucket.openDownloadStream(fileId);
      downloadStream.pipe(tempWriteStream);

      tempWriteStream.on("finish", async () => {
        const thumbnailFolder = path.join(__dirname, "..", "thumbnails");
        const thumbnailFilename = `${fileId}.png`;
        const thumbnailPath = path.join(thumbnailFolder, thumbnailFilename);

        if (!fs.existsSync(thumbnailFolder)) {
          fs.mkdirSync(thumbnailFolder);
        }

        const ffmpegPath = ffmpegInstaller.path;
        const cmd = `"${ffmpegPath}" -i "${tempVideoPath}" -ss 00:00:01 -vframes 1 -s 320x240 "${thumbnailPath}"`;

        exec(cmd, async (error) => {
          if (error) {
            console.error("FFmpeg error:", error.message);
            return res.status(500).json({ message: "Thumbnail generation failed" });
          }

          const video = new Video({
            title: videoTitle,
            description: videoDescription,
            fileId,
            thumbnailUrl: `thumbnails/${thumbnailFilename}`,
            channel: channel._id,
            owner: req.user._id,
            category: Array.isArray(category) ? category : [category],
          });

          await video.save();
          channel.videos.push(video._id);
          await channel.save();

          const user = await User.findById(req.user._id);
          if (user) {
            user.videos = user.videos || [];
            user.videos.push(video._id);
            await user.save();
          }

          fs.unlinkSync(tempVideoPath);

          res.status(201).json({ message: "Video uploaded successfully", video });
        });
      });
    });

    uploadStream.on("error", (err) => {
      console.error("GridFS upload error:", err.message);
      res.status(500).json({ message: "Video upload failed" });
    });
  } catch (err) {
    console.error("Upload error:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};





// Get full video details
export const getFullVideoDetails = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id).populate("channel", "name").populate("comments.author", "name email");

    if (!video) return res.status(404).json({ message: "Video not found" });
    res.json(video);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch video", error: err.message });
  }
};

// Like video
export const likeVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });
    video.likes += 1;
    await video.save();
    res.json({ message: "Liked", likes: video.likes });
  } catch (err) {
    res.status(500).json({ message: "Failed to like", error: err.message });
  }
};

// Dislike video
export const dislikeVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });
    video.dislikes += 1;
    await video.save();
    res.json({ message: "Disliked", dislikes: video.dislikes });
  } catch (err) {
    res.status(500).json({ message: "Failed to dislike", error: err.message });
  }
};

// Add comment
export const addComment = async (req, res) => {
  try {


    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });

    const user = await User.findById(req.user._id).select("name email");
    const { text, email } = req.body;
    const comment=`${email} : ${text}`


    video.comments.push({
      text:comment,
      author: user._id,
      authorName: user.name || user.email,
    });

    await video.save();

    res.json({ message: "Comment added", comments: video.comments });
  } catch (err) {
    console.error("Error adding comment:", err.message);
    res.status(500).json({ message: "Failed to comment", error: err.message });
  }
};


// DELETE /video/:id
export const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });

    // Optional: Only the owner/uploader can delete
    if (video.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized to delete this video" });
    }

    // Try deleting the file from GridFS
    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: "videos",
    });

    try {
      await bucket.delete(video.fileId);
    } catch (err) {
      console.warn(`GridFS file not found (might already be deleted): ${video.fileId}`);
    }

    // Delete the video document
    await video.deleteOne();

    // Remove video ID from Channel
    await Channel.updateOne(
      { _id: video.channel },
      { $pull: { videos: video._id } }
    );

    // Remove video ID from User (optional)
    await User.updateOne(
      { _id: video.owner },
      { $pull: { videos: video._id } }
    );

    res.json({ message: "Video deleted successfully" });
  } catch (err) {
    console.error("Delete video error:", err.message);
    res.status(500).json({ message: "Failed to delete video", error: err.message });
  }
};



export const listVideos = async (req, res) => {
  try {
    const searchQuery = req.query.search;

    const filter = searchQuery
      ? { title: { $regex: searchQuery, $options: "i" } }
      : {}; // If no search, return all videos

    const videos = await Video.find(filter).populate("channel", "name");

    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch videos", error: error.message });
  }
};


export const updateComment = async (req, res) => {
  try {
    const { id: videoId, commentId } = req.params;
    const { text } = req.body;

    const video = await Video.findById(videoId);
    if (!video) return res.status(404).json({ message: "Video not found" });

    const comment = video.comments.id(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    // Only author can edit
    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to edit this comment" });
    }

    comment.text = text;
    await video.save();

    res.json({ message: "Comment updated", comment });
  } catch (err) {
    console.error("Error updating comment:", err.message);
    res.status(500).json({ message: "Failed to update comment", error: err.message });
  }
};


export const deleteComment = async (req, res) => {
  try {
    const { id: videoId, commentId } = req.params;

    const video = await Video.findById(videoId);
    if (!video) return res.status(404).json({ message: "Video not found" });

    const commentIndex = video.comments.findIndex(
      (cmt) => cmt._id.toString() === commentId
    );

    if (commentIndex === -1)
      return res.status(404).json({ message: "Comment not found" });

    const comment = video.comments[commentIndex];

    // Ensure only author can delete
    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this comment" });
    }

    video.comments.splice(commentIndex, 1); // Remove the comment
    await video.save();

    res.json({ message: "Comment deleted" });
  } catch (err) {
    console.error("Error deleting comment:", err.message);
    res.status(500).json({ message: "Failed to delete comment", error: err.message });
  }
};
