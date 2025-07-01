import Channel from "../models/Channel.js";
import User from "../models/User.js";
import video from '../models/Video.js'

export const createChannel = async (req, res) => {
  const { channelName } = req.body;
  const userId = req.user._id;

  if (!channelName) {
    return res.status(400).json({ message: "Channel name required" });
  }

  //  Get user and check if they already have a channel
  const user = await User.findById(userId).populate('UserChannel');
  if (user.UserChannel) {
    return res.status(400).json({ message: "User already has a channel" });
  }

  //  Check if channel name is already taken
  const existingChannel = await Channel.findOne({ name: channelName });
  if (existingChannel) {
    return res.status(409).json({ message: "Channel name already exists" });
  }

  //  Create and assign new channel
  const newChannel = await Channel.create({ name: channelName, owner: userId });
  user.UserChannel = newChannel._id;
  await user.save();

  res.status(201).json({ channelName: newChannel.name });
};


export const getChannelVideos = async (req, res) => {
  const { channel } = req.query;

  const ch = await Channel.findOne({ name: channel });
  if (!ch) {
    return res.status(404).json({ message: "Channel not found" });
  }

  const populated = await ch.populate("videos");
  res.json(populated.videos);
};


export const updateChannelName = async (req, res) => {
  try {
    const { newName } = req.body;
    const userId = req.user._id;

    if (!newName) {
      return res.status(400).json({ message: "New channel name required" });
    }

    const user = await User.findById(userId).populate("UserChannel");
    if (!user || !user.UserChannel) {
      return res.status(404).json({ message: "User has no channel to rename" });
    }

    const existingChannel = await Channel.findOne({ name: newName });
    if (existingChannel) {
      return res.status(409).json({ message: "Channel name already taken" });
    }

    user.UserChannel.name = newName;
    await user.UserChannel.save();

    res.status(200).json({ message: "Channel renamed", newName });

  } catch (err) {
    console.error("Error in updateChannelName:", err.message);
    res.status(500).json({ message: "Server error while updating channel name" });
  }
};


export const deleteChannel = async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId);

  if (!user || !user.UserChannel) {
    return res.status(404).json({ message: "No channel to delete" });
  }

  await Channel.findByIdAndDelete(user.UserChannel);
  user.UserChannel = null;
  await user.save();

  res.status(200).json({ message: "Channel deleted successfully" });
};


