import mongoose from 'mongoose';

const { Schema, model, Types } = mongoose;

// Schema for video comments
const commentSchema = new Schema(
  {
    author: { type: Types.ObjectId, ref: 'User', required: true }, // User who made the comment4
    authorName: { type: String }, 
    text: { type: String, required: true }, // Comment text
    
  },
  { timestamps: true } // Adds createdAt and updatedAt timestamps to comments
);

// Main video schema
const videoSchema = new Schema(
  {
    title: { type: String, required: true, unique: true, trim: true }, // Video title (must be unique)
    description: { type: String, required: true, trim: true }, // Description of the video
    fileId: { type: Types.ObjectId, required: true }, // Reference to the GridFS file
    thumbnailUrl: { type: String, default: '' }, // URL of the video thumbnail
    channel: { type: Types.ObjectId, ref: 'Channel', required: true }, // Channel that owns the video
    owner: { type: Types.ObjectId, ref: 'User', required: true }, // User who uploaded the video
    category: [{ type: String, trim: true }], // Array of category tags (e.g., Music, Travel)
    likes: { type: Number, default: 0 }, // Total number of likes
    dislikes: { type: Number, default: 0 }, // Total number of dislikes
    comments: [commentSchema], // Array of comment objects
    views: { type: Number, default: 0 }, // Number of times the video was viewed
  },
  { timestamps: true, collection: 'videos' } // Adds createdAt and updatedAt timestamps to videos
);

export default model('Video', videoSchema);
