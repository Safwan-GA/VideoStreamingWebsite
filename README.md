# 🎥 Video Streaming Website

A full-stack video streaming web application with features like video upload, playback, channel creation, and user authentication.

> Built with **React.js**, **Node.js**, **Express**, and **MongoDB (with GridFS)**.

Here's a clear explanation of all the features that have been implemented in your **Video Streaming Website** full-stack project:

---

## **Implemented Features Overview**

###  User Authentication

* **Register/Login** functionality
* JWT-based **authentication and authorization**
* User session management using Redux on the frontend

---

###  Video Upload and Playback

* Upload videos via the **Upload form**

  * Uses `Multer` and `GridFS` to store videos directly in **MongoDB**
  * Automatically generates and stores a **thumbnail** using `ffmpeg`
* View videos with:

  * HTML5 `<video>` player
  * Auto playback, fullscreen, volume controls
* Each video has:

  * Title
  * Description
  * Thumbnail preview

---

### Channel System

* Users can **create a personal channel**
* Each user/channel can:

  * Upload multiple videos
  * View all their uploaded videos on the **Channel page**
  * User can delete the Video.

---

###  Engagement: Likes and Dislikes

* Each video supports:

  *  **Like** button
  *  **Dislike** button
* Like/dislike counts are displayed and updated in real-time

---

###  Commenting System

* Users can:

  * Add comments on a video
  * Edit or delete **their own comments**
* Comments display:

  * Author name or email
  * Comment text

---

### 🗑 Video Deletion

* Logged-in users can **delete their own uploaded videos**
* Upon deletion:

  * Video is removed from MongoDB GridFS
  * Associated metadata (title, description, comments) is also cleaned up

---

###  Channel View

* Channel dashboard displays all uploaded videos by the user
* Shows:

  * Thumbnail
  * Title
  * Description
* Clicking on a video navigates to the **Video Player page**

---

###  Protected Routes

* Routes like `/upload`, `/channel`, `/createChannel` are **protected** and only accessible if:

  * The user is logged in
  * A valid JWT token exists
* Users are redirected to the login page if unauthorized

---

###  Theme Support *(Optional enhancement mentioned in code)*

* CSS root variables set up for:

  * Light/Dark theme toggle

---

##  Backend Tech Stack

* **Node.js**, **Express.js**
* **MongoDB Atlas** with GridFS
* JWT authentication
* Multer + `fluent-ffmpeg` for video uploads + thumbnails

##  Frontend Tech Stack

* **React.js** (with hooks)
* **Redux Toolkit** for state management
* **React Router v6**
* **Axios** for HTTP requests
* Tailwind CSS for styling
* Icons from `react-icons`

---

Let me know if you want a table version of this, or a section to be added to your README file directly.

---

##  Live Demo

> _Coming Soon_ (update your homepage URL or deployment link here)

---

##  Project Structure

capstoneProject/
├── backend/ # Node.js + Express + MongoDB (GridFS)
├── frontend/frontend/ # ReactJS Frontend
├── package.json # Root script runner & dependency manager
└── README.md # This file


---

## 🚀 Installation Guide

### Prerequisites

Ensure you have the following installed globally:

- [Node.js](https://nodejs.org/) >= v18
- [MongoDB](https://www.mongodb.com/) (Atlas or Local)
- Git

---

### 📥 Clone the Repository

```bash
git clone https://github.com/Safwan-GA/VideoStreamingWensite.git
cd VideoStreamingWensite
npm run install-all
npm run dev
