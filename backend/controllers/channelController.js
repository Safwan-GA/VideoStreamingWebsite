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
