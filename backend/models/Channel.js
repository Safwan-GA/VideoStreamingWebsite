import mongoose from "mongoose";

const { Schema, model, Types } = mongoose;

const channelSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  owner: {
    type: Types.ObjectId,
    ref: "User",
    required: true,
  },
  videos: [
    {
      type: Types.ObjectId,
      ref: "Video", // Assuming you're using a separate collection for video metadata
    },
  ],
}, { timestamps: true });

const Channel = model("Channel", channelSchema);

export default Channel;
