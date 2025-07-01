# 🎥 Video Streaming Website

A full-stack video streaming web application with features like video upload, playback, channel creation, and user authentication.

> Built with **React.js**, **Node.js**, **Express**, and **MongoDB (with GridFS)**.

GitHub Repo: [VideoStreamingWensite](https://github.com/Safwan-GA/VideoStreamingWebsite)  
Demo Video: [Watch on Google Drive](https://drive.google.com/file/d/122vUom8AxftoB45iUDUqOYnJ8p99JPku/view?usp=sharing)

---

## ✅ Implemented Features Overview

### 🔐 User Authentication

- Register/Login functionality
- JWT-based **authentication and authorization**
- User session management using Redux on the frontend

---

### 📤 Video Upload and Playback

- Upload videos via the **Upload form**
  - Uses `Multer` and `GridFS` to store videos in **MongoDB**
  - Auto-generates **thumbnails** using `ffmpeg`
- HTML5 `<video>` player with:
  - Playback, fullscreen, volume controls
- Each video includes:
  - Title, Description, and Thumbnail

---

### 📺 Channel System

- Users can **create a personal channel**
- Each user/channel can:
  - Upload, view, and delete their videos
  - View all uploaded videos on the **Channel page**
- **Edit and Delete Channel Name**
  - Users can **rename their channel**
  - Users can **delete their channel**, which also deletes all their videos

---

### 👍 Engagement: Likes and Dislikes

- Like and Dislike buttons for each video
- Real-time counter updates

---

### 💬 Commenting System

- Add/edit/delete comments on videos
- Shows commenter name/email and timestamp

---

### 🗑 Video Deletion

- Logged-in users can delete their videos
- Deletes:
  - Video file from GridFS
  - Metadata: title, description, comments, and thumbnail

---

### 👤 Channel View

- Channel dashboard shows:
  - All uploaded videos with thumbnails, title & description
- Clicking a video navigates to the **Video Player page**

---

### 🔐 Protected Routes

- `/upload`, `/channel`, `/createChannel` require:
  - Logged-in user
  - Valid JWT token
- Unauthorized users are redirected to login

---

### 🎨 Theme Support *(Planned)*

- CSS root variables defined for:
  - Light/Dark theme toggle

---

## 🧠 Future Scope

- 🔐 **Forgot Password functionality**
  - Add password reset flow via email token
- 🌐 Deploy on platforms like Vercel / Netlify (Frontend) and Render / Railway (Backend)
- 🎨 Add Dark/Light theme switcher
- 📊 Video view count tracking
- 📝 Pagination and search filters on Home page

---

## 🛠 Backend Tech Stack

- **Node.js**, **Express.js**
- **MongoDB Atlas** with GridFS
- JWT for secure auth
- Multer + fluent-ffmpeg for video & thumbnail processing

---

## 💻 Frontend Tech Stack

- **React.js** (with hooks)
- **Redux Toolkit**
- **React Router v6**
- **Axios** for API calls
- **React Icons**

---

## 📁 Project Structure

