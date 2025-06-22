// src/components/VideoPlayer.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function VideoPlayer() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const videoObj   = state?.video;
  const videoUrl   = state?.videoUrl   || videoObj?.videoUrl || videoObj?.url;
  const videoTitle = state?.title      || videoObj?.title;

  if (!state?.videoUrl) {
    return <p>No video selected</p>;
  }

  return (
    <div style={{ padding: 16 }}>
      <button onClick={() => navigate(-1)}>← Back</button>
      <h2>{state.title}</h2>
      <video
        src={state.videoUrl}
        controls
        autoPlay
        style={{ width: "100%", maxHeight: "90vh" }}
      />
    </div>
  );
}
