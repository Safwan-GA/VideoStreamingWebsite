// components/VideoPlayer.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { PiThumbsUpDuotone, PiThumbsDownDuotone, PiTrashLight, PiPencilSimpleLight } from "react-icons/pi";


export default function VideoPlayer() {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const { url, user , token, email } = useSelector((state) => state.user);

  const [videoData, setVideoData] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [error, setError] = useState(null);

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
      await axios.post(`${url}video/comment/${videoId}`, 
        { text: commentText, email:email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCommentText('');
      fetchVideoData();
    } catch (err) {
      console.error("Failed to post comment:", err.response?.data || err.message);
    }
  };

  const handleDelete = async (commentId) => {
    await axios.delete(`${url}video/comment/${videoId}/${commentId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchVideoData();
  };

  const handleEdit = async (commentId, oldText) => {
    const newText = prompt("Edit your comment:", oldText);
    if (!newText || newText === oldText) return;

    await axios.put(`${url}video/comment/${videoId}/${commentId}`, {
      text: newText
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    fetchVideoData();
  };


  if (!videoData) return <p>Loading video...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={{ padding: 16 }}>
      <button onClick={() => navigate(-1)}>← Back</button>

      <h2>{videoData.title}</h2>
      <p>{videoData.description}</p>

      <video
        src={`${url}play/${videoData.fileId}`}
        controls
        autoPlay
        style={{ width: "100%", maxHeight: "80vh", marginBottom: "1rem" }}
      />

      <div>
        <button onClick={handleLike}><PiThumbsUpDuotone size={20}/> {videoData.likes || 0}</button>
        <button onClick={handleDislike} style={{ marginLeft: "1rem" }}><PiThumbsDownDuotone size={20}/> {videoData.dislikes || 0}</button>
      </div>

      <div style={{ marginTop: "1rem" }}>
        <h4>Comments</h4>
        <ul>
          {videoData.comments?.map((cmt, i) => (
            <li key={i}>
              {cmt.text}

              { cmt.text.split(":")[0].trim() == email &&(
                <>
                  <button onClick={() => handleEdit(cmt._id, cmt.text)}>
                    <PiPencilSimpleLight size={20}/>
                  </button>
                  <button onClick={() => handleDelete(cmt._id)}>
                    <PiTrashLight size={20}/>
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
