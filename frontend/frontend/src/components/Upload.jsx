import React, { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import Loading from "./Loading";

export default function Upload({ onSuccess }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [category, setCategory] = useState(''); // NEW
  const [error, setError] = useState(null);

  const [uploading,setUploading]=useState(false)

  const user = useSelector((state) => state.user);
  const url = user.url;

  const handleUpload = async (e) => {
    e.preventDefault();
    setError(null);


    if (!selectedFile) {
      setError("Please select a video file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile); 
    formData.append("videoTitle", title); 
    formData.append("videoDescription", description); //  match backend field
    formData.append("categoryString", category); //  comma-separated
    formData.append("channelName", user.channel); //  match backend field

    try {
      setUploading(true);
      const res = await axios.post(`${url}upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${user.token}` //  send token in header
        }
      });
      onSuccess(res.data.video);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Upload failed.");
    }
    finally{
      setUploading(false)
    }
  };

  return (
    <>
    {uploading  && (
        <Loading uploading={true} />
      )}
    <form onSubmit={handleUpload} className="PopUpBox">
      {error && <p style={{ color: "red" }} className="spanTwoColum">{error}</p>}

      <label>Title:</label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <label>Description:</label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />

      <label>Category:</label> {/* NEW */}
      <input
        type="text"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        placeholder="e.g. Music, Tutorial, Comedy"
        required
      />

      <label>Video File:</label>
      <input
        type="file"
        accept="video/*"
        onChange={(e) => setSelectedFile(e.target.files[0])}
        required
      />

      <button type="submit">Upload Video</button>
    </form>
    </>
  );
}
