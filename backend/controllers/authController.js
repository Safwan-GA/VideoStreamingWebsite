// src/controllers/authController.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Channel from "../models/Channel.js";

const makeToken = (id) => jwt.sign({ id }, process.env.APP_SECRET, { expiresIn: "7d" });

export const register = async (req, res) => {
  const { Name: name, Email: email, Password: password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ message: "All fields required" });

  const exists = await User.findOne({ UserEmail: email });
  if (exists)
    return res.status(409).json({ message: "User already exists" });

  try {
    const user = await User.create({
      UserName: name,
      UserEmail: email,
      UserPassword: password,
    });

    res.status(201).json({ message: "Registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error during registration", error: err.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ UserEmail: email }).populate("UserChannel");;
  if (!user)
    return res.status(401).json({ message: "Invalid credentials (email)" });

  const isMatch = await user.matchPassword(password);
  if (!isMatch)
    return res.status(401).json({ message: "Invalid credentials (password)" });

  res.json({
    user: user.UserName,
    email: user.UserEmail,
    channel: user.UserChannel?.name || "",
    token: makeToken(user._id),
  });
};
