// components/VideoCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import './styles/VideoCard.css'; // Optional: import your CSS

export default function VideoCard({ video }) {
  const navigate = useNavigate();
  const { url } = useSelector((state) => state.user);

  if (!video) return <p>No video data provided.</p>;

  return (
    <div className="video-card" onClick={() => navigate(`stream/${video._id}`)}>
      <div className="thumbnail">
        <img
          src={`${url}${video.thumbnailUrl}`}
          alt={`Thumbnail for ${video.title}`}
        />
      </div>
      <div className="video-info">
        <h3 className="video-title">{video.title}</h3>
        <p className="video-description">{video.description}</p>
      </div>
    </div>
  );
}
