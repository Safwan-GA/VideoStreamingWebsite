// src/routes/channelRoutes.js
import { Router } from "express";
import { createChannel, getChannelVideos, updateChannelName, deleteChannel } from "../controllers/channelController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.post("/createChannel", protect, createChannel);
router.get("/getChannelVideo", protect, getChannelVideos);
router.put("/updateChannelName", protect, updateChannelName);
router.delete("/deleteChannel", protect, deleteChannel);

export default router;
