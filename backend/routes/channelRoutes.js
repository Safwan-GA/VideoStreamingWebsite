// src/routes/channelRoutes.js
import { Router } from "express";
import { createChannel, getChannelVideos } from "../controllers/channelController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.post("/createChannel", protect, createChannel);
router.get("/getChannelVideo", getChannelVideos);

export default router;
