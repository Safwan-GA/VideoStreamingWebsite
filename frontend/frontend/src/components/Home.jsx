// components/Home.jsx
import React, { useState } from "react";
import './styles/Home.css';
import VideoCard from "./VideoCard";
import { useVideo } from "./context/VideoContext";
import './styles/VideoCard.css'

function Home() {
  const { videos } = useVideo();
  const [selectedCategory, setSelectedCategory] = useState("");

  const filtered = selectedCategory
    ? videos.filter(video => video.category?.includes(selectedCategory))
    : videos;

  if (!videos || videos.length === 0) return (<>
    <div style={{ margin: "10px" }}>
        <label htmlFor="categorySelect">Filter by Category: </label>
        <select
          id="categorySelect"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All</option>
          <option value="Education">Education</option>
          <option value="Music">Music</option>
          <option value="Sports">Sports</option>
          <option value="Comedy">Comedy</option>
        </select>
      </div><div>No videos found.</div></>);
  if (filtered.length === 0) return (<>
    <div style={{ margin: "10px" }}>
        <label htmlFor="categorySelect">Filter by Category: </label>
        <select
          id="categorySelect"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All</option>
          <option value="Education">Education</option>
          <option value="Music">Music</option>
          <option value="Sports">Sports</option>
          <option value="Comedy">Comedy</option>
        </select>
      </div><div>No videos found for this category.</div></>);

  return (

    <>
    <div style={{ margin: "10px" }}>
        <label htmlFor="categorySelect">Filter by Category: </label>
        <select
          id="categorySelect"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All</option>
          <option value="Education">Education</option>
          <option value="Music">Music</option>
          <option value="Sports">Sports</option>
          <option value="Comedy">Comedy</option>
        </select>
      </div>
    <div className="video_Container">
      
      {filtered.map((video, idx) => (
        <VideoCard key={idx} video={video} />
      ))}
    </div>
  </>
  );
}

export default Home;
