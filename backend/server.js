import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';
import channelRoutes from './routes/channelRoutes.js';
import videoRoutes from './routes/videoRoutes.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

// ESModules workaround for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const startServer = async () => {
  await connectDB();

  const app = express();
  app.use(cors());
  app.use(express.json());

  app.use('/thumbnails', express.static(path.join(__dirname, 'thumbnails')));

  app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

  app.use("/", authRoutes);
  app.use("/", channelRoutes);
  app.use("/", videoRoutes);

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server up on ${PORT}`));
};

startServer();
