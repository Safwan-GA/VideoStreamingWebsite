import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import {
  PiThumbsUpDuotone,
  PiThumbsDownDuotone,
  PiTrashLight,
  PiPencilSimpleLight,
} from "react-icons/pi";
import "./styles/VideoCard.css";

export default function VideoPlayer() {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const { url, user, token, email } = useSelector((state) => state.user);

  const [videoData, setVideoData] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [error, setError] = useState(null);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showFullTitle, setShowFullTitle] = useState(false);

  const fetchVideoData = async () => {
    try {
      const res = await axios.get(`${url}video/full/${videoId}`);
      setVideoData(res.data);
    } catch (err) {
      setError("Error loading video data");
    }
  };

  useEffect(() => {
    if (videoId) fetchVideoData();
  }, [videoId]);

  const handleLike = async () => {
    await axios.post(`${url}video/like/${videoId}`);
    fetchVideoData();
  };

  const handleDislike = async () => {
    await axios.post(`${url}video/dislike/${videoId}`);
    fetchVideoData();
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;

    try {
      await axios.post(
        `${url}video/comment/${videoId}`,
        { text: commentText, email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCommentText("");
      fetchVideoData();
    } catch (err) {
      console.error("Failed to post comment:", err.response?.data || err.message);
    }
  };

  const handleDelete = async (commentId) => {
    await axios.delete(`${url}video/comment/${videoId}/${commentId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchVideoData();
  };

  const handleEdit = async (commentId, oldText) => {
    const newText = prompt("Edit your comment:", oldText);
    if (!newText || newText === oldText) return;

    await axios.put(
      `${url}video/comment/${videoId}/${commentId}`,
      { text: newText },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchVideoData();
  };

  if (!videoData) return <p>Loading video...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: 16 }}>
      <button onClick={() => navigate(-1)}>← Back</button>

      {/* Video Player */}
      <video
        src={`${url}play/${videoData.fileId}`}
        controls
        autoPlay
        style={{ width: "100%", maxHeight: "80vh", marginBottom: "1rem" }}
      />

      {/* Title */}
      <div style={{ marginBottom: "0.5rem" }}>
        <h2
          className={`truncate-multiline ${showFullTitle ? "expanded" : "clamp-2"}`}
          style={{ fontSize: "1.5rem", fontWeight: "bold" }}
        >
          {videoData.title}
        </h2>
        {videoData.title.length > 100 && (
          <button
            onClick={() => setShowFullTitle(!showFullTitle)}
            className="see-more-btn"
          >
            {showFullTitle ? "Show less" : "Show more"}
          </button>
        )}
      </div>

      {/* Description */}
      <div style={{ marginBottom: "1rem" }}>
        <p
          className={`truncate-multiline ${showFullDescription ? "expanded" : "clamp-3"}`}
        >
          {videoData.description}
        </p>
        {videoData.description.length > 200 && (
          <button
            onClick={() => setShowFullDescription(!showFullDescription)}
            className="see-more-btn"
          >
            {showFullDescription ? "Show less" : "Show more"}
          </button>
        )}
      </div>

      {/* Like/Dislike */}
      <div>
        <button onClick={handleLike}>
          <PiThumbsUpDuotone size={20} /> {videoData.likes || 0}
        </button>
        <button onClick={handleDislike} style={{ marginLeft: "1rem" }}>
          <PiThumbsDownDuotone size={20} /> {videoData.dislikes || 0}
        </button>
      </div>

      {/* Comments */}
      <div style={{ marginTop: "1rem" }}>
        <h4>Comments</h4>
        <ul>
          {videoData.comments?.map((cmt, i) => (
            <li key={i} style={{ marginBottom: "0.5rem" }}>
              {cmt.text}
              {cmt.text.split(":")[0].trim() === email && (
                <>
                  <button
                    onClick={() => handleEdit(cmt._id, cmt.text)}
                    style={{ marginLeft: "1rem" }}
                  >
                    <PiPencilSimpleLight size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(cmt._id)}
                    style={{ marginLeft: "0.5rem" }}
                  >
                    <PiTrashLight size={18} />
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>

        <textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Add a comment"
          rows={3}
          style={{ width: "100%", maxWidth: 600, marginTop: "1rem" }}
        />
        <br />
        <button onClick={handleAddComment} disabled={!commentText.trim()}>
          Submit Comment
        </button>
      </div>
    </div>
  );
}
