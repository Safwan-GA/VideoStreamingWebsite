import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Upload from "./Upload";
import { initializeChannel } from "./redux/userDetailSlice";

export default function Channel() {
  const [videos, setVideos] = useState([]);
  const [uploadView, setUploadView] = useState(false);
  const [error, setError] = useState(null);
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const url = user.url;

  useEffect(() => {
    if (user.channel && user.token) {
      axios
        .get(`${url}getChannelVideo`, {
          params: { channel: user.channel },
          headers: { Authorization: `Bearer ${user.token}` },
        })
        .then((res) => setVideos(res.data))
        .catch((err) =>
          setError(err.response?.data?.message || "Error loading videos")
        );
    }
  }, [url, user.channel, user.token]);

  const handleUploadSuccess = (newVideo) => {
    setVideos((prev) => [newVideo, ...prev]);
    setUploadView(false);
  };

  const handleDelete = async (videoId) => {
    const confirmed = window.confirm("Are you sure you want to delete this video?");
    if (!confirmed) return;

    try {
      await axios.delete(`${url}video/${videoId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setVideos((prev) => prev.filter((vid) => vid._id !== videoId));
    } catch (err) {
      alert("Error deleting video");
      console.error(err.response?.data || err.message);
    }
  };

  if (!user.email) {
    return (
      <div className="PopUpContainer">
        <p>User not yet logged in. Please login to continue</p>
        <div className="PopUpBox">
          <button
            onClick={() =>
              navigate("/login", {
                state: { from: "/channel" },
                replace: true,
              })
            }
            className="spanTwoColum"
          >
            Navigate to Login
          </button>
        </div>
      </div>
    );
  }

  if (!user.channel) {
    return (
      <div className="PopUpContainer">
        <p>User doesn't have a channel. Please create your channel to proceed.</p>
        <div className="PopUpBox">
          <button
            onClick={() => navigate("/createChannel", { replace: true })}
            className="spanTwoColum"
          >
            Create Channel
          </button>
        </div>
      </div>
    );
  }
  {console.log(user)}

  return (
    <div style={{ padding: "1rem" }}>
      <div style={{ marginBottom: "1rem" }}>
        <label>
          Channel Name: <strong>{user.channel}</strong>
        </label>
        <button
          onClick={() => setUploadView(true)}
          style={{
            marginLeft: "1rem",
            backgroundColor: "#007bff",
            color: "white",
            padding: "0.5rem 1rem",
            borderRadius: "4px",
            border: "none",
          }}
        >
          Upload Video
        </button>
      </div>

      {uploadView && (
        <div style={{ marginBottom: "1rem" }}>
          <Upload onSuccess={handleUploadSuccess} />
          <button
            type="button"
            onClick={() => setUploadView(false)}
            style={{
              marginTop: "0.5rem",
              backgroundColor: "#dc3545",
              color: "white",
              padding: "0.5rem 1rem",
              borderRadius: "4px",
              border: "none",
            }}
          >
            Cancel
          </button>
        </div>
      )}

      {error && <p style={{ color: "red", marginBottom: "1rem" }}>{error}</p>}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "1rem",
        }}
      >
        {videos.map((eachVideo, idx) => (
          <div
            key={idx}
            style={{
              background: "white",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <div onClick={() => navigate(`/stream/${eachVideo._id}`)} style={{ cursor: "pointer" }}>
              <img
                src={`${url}${eachVideo.thumbnailUrl}`}
                alt={`Thumbnail for ${eachVideo.title}`}
                style={{ width: "100%", height: "180px", objectFit: "cover" }}
              />
              <div style={{ padding: "0.75rem" }}>
                <h3
                  style={{
                    fontSize: "1rem",
                    fontWeight: "600",
                    marginBottom: "0.25rem",
                  }}
                >
                  {eachVideo.title}
                </h3>
                <p style={{ fontSize: "0.875rem", color: "#666" }}>
                  {eachVideo.description}
                </p>
              </div>
            </div>

            <button
              onClick={() => handleDelete(eachVideo._id)}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                backgroundColor: "red",
                color: "white",
                border: "none",
                borderRadius: "4px",
                padding: "4px 8px",
                cursor: "pointer",
              }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}


export function CreateChannel() {
  const [channelName, setChannelName] = useState("");
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { email, token, channel, url } = useSelector((state) => state.user);

  useEffect(() => {
    if (channel) {
      navigate("/channel");
    }
  }, [channel, navigate]);

  const handleSubmitCreateChannel = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await axios.post(
        `${url}createChannel`,
        { email, channelName },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.status === 201 && res.data?.channelName) {
        dispatch(initializeChannel(res.data.channelName));
      } else {
        
        throw new Error("Unexpected API response");
      }
    } catch (err) {
      console.error("CreateChannel error:", err);
      setError(err?.response?.data?.message || err.message || "Error creating channel");
    }
  };

  if (!email) {
    return (
      <div className="PopUpContainer">
        <p>User not yet logged in. Please login to continue</p>
        <div className="PopUpBox">
          <button
            onClick={() =>
              navigate("/login", { state: { from: "/createchannel" }, replace: true })
            }
            className="spanTwoColum"
          >
            Navigate to Login
          </button>
        </div>
      </div>
    );
  }

  if (channel && channel !== "") {
    return (
      <div className="PopUpContainer">
        <p>User already has a channel. Please open your channel.</p>
        <div className="PopUpBox">
          <button
            onClick={() => navigate("/channel", { replace: true })}
            className="spanTwoColum"
          >
            Open the Channel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="PopUpContainer">
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div className="PopUpBox">
        <label>Name of the channel:</label>
        <input
          style={{ maxWidth: "200px" }}
          value={channelName}
          onChange={(e) => setChannelName(e.target.value)}
        />
        <button onClick={handleSubmitCreateChannel} className="spanTwoColum">
          Create Channel
        </button>
      </div>
    </div>
  );
}
